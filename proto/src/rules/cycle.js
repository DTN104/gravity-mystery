import { DIRECTIONS } from '../params.js';

export class Cycle {
  constructor(params) {
    this.p = params; this.now = params.clockStart; this.state = 'IDLE'; this.direction = 'DOWN';
    this.target = 'DOWN'; this.deadline = Infinity; this.unlockAt = -Infinity; this.readyAt = -Infinity;
    this.door = { isOpen: params.doorIsOpen, locked: false }; this.scheduleEntries = [];
    this.log = []; this.messages = []; this.commands = [];
  }
  get scheduleEntry() { return this.scheduleEntries[0] || null; }
  record(event) {
    const origin = event === 'SCHEDULE_EDIT' ? 'local' : this.origin || 'local';
    this.log.push({ t: this.now, event, origin, ...(origin === 'master' ? { user: this.user } : {}) });
  }
  valid(dir, duration) {
    return Object.hasOwn(DIRECTIONS, dir) && Number.isFinite(duration) && duration >= this.p.durationMin && duration <= this.p.durationMax
      && duration > this.p.warnTime + 2 * this.p.zeroGTime;
  }
  reject(text) { this.messages.push(text); return false; }
  start(dir, duration, options = {}) {
    if (!this.valid(dir, duration)) return this.reject('Từ chối: hướng / thời lượng không hợp lệ');
    if (!['local', 'master'].includes(options.origin || 'local') || options.origin === 'master' && options.user !== this.p.masterUser)
      return this.reject('Từ chối: nguồn lệnh không hợp lệ');
    if (this.door.isOpen) return this.reject('Từ chối: cửa đang mở');
    if (this.state !== 'IDLE' || this.door.locked) return this.reject('Từ chối: chu kỳ chưa kết thúc');
    if (this.p.cooldownEnabled && this.now < this.readyAt - this.p.epsilon) return this.reject('Từ chối: đang cooldown');
    this.target = dir; this.duration = duration; this.scheduled = !!options.scheduled;
    this.origin = options.origin || 'local'; this.user = options.user;
    this.state = 'WARN'; this.door.locked = true; this.deadline = this.now + this.p.warnTime;
    this.returnAt = this.deadline + duration;
    this.messages.push('Còi: cảnh báo xoay — cửa đã khóa');
    return true;
  }
  schedule(atSeconds, dir, duration) {
    const entries = Array.isArray(atSeconds) ? atSeconds : [...this.scheduleEntries.filter(e => !e.fired), { atSeconds, dir, duration }];
    if (entries.length > this.p.scheduleMax) return this.reject(`Từ chối: lịch tối đa ${this.p.scheduleMax} mục`);
    if (entries.some(e => !e || typeof e !== 'object')) return this.reject('Từ chối: lịch không hợp lệ');
    const sorted = entries.map(e => ({ atSeconds: e.atSeconds, dir: e.dir, duration: e.duration, fired: false }))
      .sort((a, b) => a.atSeconds - b.atSeconds);
    for (const [i, e] of sorted.entries()) {
      if (!this.valid(e.dir, e.duration) || !Number.isFinite(e.atSeconds) || e.atSeconds - this.p.warnTime < this.now - this.p.epsilon)
        return this.reject('Từ chối: lịch không hợp lệ / không đủ thời gian cảnh báo');
      const availableAt = this.state !== 'IDLE' ? this.returnAt
        + Math.max(this.p.doorUnlockDelay, this.p.cooldownEnabled ? this.p.cooldown : 0)
        : Math.max(this.unlockAt, this.p.cooldownEnabled ? this.readyAt : -Infinity);
      if (e.atSeconds - this.p.warnTime < availableAt - this.p.epsilon)
        return this.reject('Từ chối: lịch chồng chu kỳ đang chạy hoặc cooldown');
      const previous = sorted[i - 1];
      if (previous && e.atSeconds - this.p.warnTime < previous.atSeconds + previous.duration - this.p.epsilon)
        return this.reject('Từ chối: lịch chồng chu kỳ hoặc thời gian còi');
      if (previous && e.atSeconds - this.p.warnTime < previous.atSeconds + previous.duration
        + Math.max(this.p.doorUnlockDelay, this.p.cooldownEnabled ? this.p.cooldown : 0) - this.p.epsilon)
        return this.reject('Từ chối: lịch quá gần, chưa hết cooldown');
    }
    if (this.door.isOpen) return this.reject('Từ chối: cửa đang mở');
    this.scheduleEntries = sorted; this.record('SCHEDULE_EDIT');
    return true;
  }
  removeSchedule(index) {
    if (!Number.isInteger(index) || index < 0 || index >= this.scheduleEntries.length) return false;
    this.scheduleEntries.splice(index, 1); this.record('SCHEDULE_EDIT'); return true;
  }
  setDoorOpen(value) {
    if (value && this.door.locked) return this.reject('Từ chối: cửa đang khóa');
    this.door.isOpen = value; this.p.doorIsOpen = value; return true;
  }
  canEnter() {
    if (this.door.locked) return this.reject('Từ chối: cửa đang khóa');
    return true;
  }
  stop() {
    if (this.state === 'IDLE') { this.scheduleEntries = []; return true; }
    if (this.state === 'WARN' || (this.state === 'ZERO_G' && !this.returning)) {
      this.direction = 'DOWN'; this.finish();
    } else if (this.state === 'ACTIVE') this.warnReturn();
    return true;
  }
  warnReturn() {
    this.state = 'WARN_RETURN'; this.deadline = this.now + this.p.warnTime;
    this.messages.push('Còi: cảnh báo trả về — cửa vẫn khóa');
  }
  finish() {
    this.state = 'IDLE'; this.deadline = Infinity; this.direction = 'DOWN'; this.returning = false;
    this.unlockAt = this.now + this.p.doorUnlockDelay; this.readyAt = this.now + this.p.cooldown;
    this.record('RETURN'); this.commands.push({ type: 'GRAVITY', dir: 'DOWN' });
  }
  transition() {
    if (this.state === 'WARN' || this.state === 'WARN_RETURN') {
      this.returning = this.state === 'WARN_RETURN';
      if (!this.returning) this.record(this.scheduled ? 'SCHEDULED_START' : 'MANUAL_START');
      this.state = 'ZERO_G'; this.direction = null; this.deadline = this.now + this.p.zeroGTime;
      this.commands.push({ type: 'ZERO_G' });
    } else if (this.state === 'ZERO_G') {
      if (this.returning) this.finish();
      else {
        this.state = 'ACTIVE'; this.direction = this.target; this.deadline = this.returnAt - this.p.warnTime - this.p.zeroGTime;
        this.commands.push({ type: 'GRAVITY', dir: this.direction });
      }
    } else if (this.state === 'ACTIVE') this.warnReturn();
  }
  step(dt) {
    if (!Number.isFinite(dt) || dt < 0) throw new RangeError('dt phải hữu hạn và không âm');
    const end = this.now + dt;
    while (true) {
      const entry = this.scheduleEntries.find(e => !e.fired);
      const scheduledAt = entry ? entry.atSeconds - this.p.warnTime : Infinity;
      const unlock = this.door.locked && this.state === 'IDLE' ? this.unlockAt : Infinity;
      const next = Math.min(this.deadline, scheduledAt, unlock);
      if (next > end + this.p.epsilon) break;
      this.now = next;
      if (next === scheduledAt) {
        entry.fired = true; this.start(entry.dir, entry.duration, { scheduled: true });
      } else if (next === unlock) this.door.locked = false;
      else this.transition();
    }
    this.now = end;
    return this.commands.splice(0);
  }
  gravity() { return this.direction ? DIRECTIONS[this.direction] : { x: 0, y: 0 }; }
}
