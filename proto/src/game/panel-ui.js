import { clockText } from '../params.js';

export const DIRECTION_LABELS = { DOWN: '▼ Xuống', UP: '▲ Lên', WEST: '◀ Tây', EAST: '▶ Đông' };

export class PanelUI {
  constructor(scene, hud) {
    this.scene = scene; this.hud = hud; this.dialog = document.querySelector('#panel-dock');
    this.dialog.innerHTML = `<h2>Bảng cục bộ</h2><p>Đổi hướng trọng lực trong buồng. Hết chu kỳ, buồng tự trở về Xuống.</p><p id="panel-now"></p>
      <fieldset><legend>Hướng trọng lực</legend><div id="directions"></div></fieldset>
      <fieldset><legend>Chu kỳ tới khi về Xuống</legend><div id="durations"></div></fieldset>
      <button id="rotate-now">XOAY NGAY</button><p id="panel-refusal" class="refusal" aria-live="polite"></p>
      <p>Hoặc hẹn lúc <label>Giờ <input id="schedule-hour" type="number" min="0"></label> :
      <label>Phút <input id="schedule-minute" type="number" min="0"></label> <button id="add-schedule">+ Thêm lịch</button></p>
      <div id="schedule-list" aria-live="polite"></div>
      <p id="schedule-earliest" aria-live="polite"></p>
      <fieldset><legend>Đồng hồ mô phỏng · Tua nhanh</legend><div id="time-scales"></div></fieldset>
      <details><summary>Nhật ký</summary><pre id="game-journal"></pre></details>`;
    const p = scene.params;
    for (const [dir, label] of Object.entries(DIRECTION_LABELS)) {
      const button = document.createElement('button'); button.textContent = label; button.dataset.dir = dir;
      button.onclick = () => { p.direction = dir; this.refresh(); }; document.querySelector('#directions').append(button);
    }
    for (const duration of p.sandbox.durations) {
      const button = document.createElement('button'); button.textContent = `${duration / p.secondsPerMinute} phút`; button.dataset.duration = duration;
      button.onclick = () => { p.duration = duration; this.refresh(); }; document.querySelector('#durations').append(button);
    }
    for (const speed of p.debug.timeScales) {
      const button = document.createElement('button'); button.textContent = `×${speed}`; button.dataset.speed = speed;
      button.onclick = () => { p.timeScale = speed; this.refresh(); }; document.querySelector('#time-scales').append(button);
    }
    document.querySelector('#schedule-hour').max = p.secondsPerDay / p.secondsPerHour - 1;
    document.querySelector('#schedule-minute').max = p.secondsPerMinute - 1;
    document.querySelector('#rotate-now').onclick = () => {
      if (scene.start(p.direction, p.duration)) { this.hud.onRotate?.(p.direction); this.hud.refresh(); }
      else this.refuse(scene.cycle.messages.at(-1));
    };
    document.querySelector('#add-schedule').onclick = () => {
      const hour = document.querySelector('#schedule-hour'), minute = document.querySelector('#schedule-minute');
      if (!hour.value || !minute.value || !hour.checkValidity() || !minute.checkValidity()) return this.refuse('Giờ hẹn không hợp lệ.');
      const t = Number(hour.value) * p.secondsPerHour + Number(minute.value) * p.secondsPerMinute;
      if (!scene.schedule(t, p.direction, p.duration)) this.refuse(scene.cycle.messages.at(-1));
      this.refresh();
    };
  }
  open() {
    const p = this.scene.params, t = Math.ceil((this.scene.cycle.now + p.warnTime) / p.secondsPerMinute) * p.secondsPerMinute;
    document.querySelector('#schedule-hour').value = Math.floor(t / p.secondsPerHour) % (p.secondsPerDay / p.secondsPerHour);
    document.querySelector('#schedule-minute').value = Math.floor(t / p.secondsPerMinute) % p.secondsPerMinute;
    this.refresh(); this.dialog.classList.add('flash'); this.dialog.scrollIntoView({ block: 'nearest' });
    clearTimeout(this.flashTimer); this.flashTimer = setTimeout(() => this.dialog.classList.remove('flash'), p.readable.flashMs);
  }
  refuse(text) {
    const target = document.querySelector('#panel-refusal'); target.textContent = text;
    clearTimeout(this.timer); this.timer = setTimeout(() => { target.textContent = ''; }, this.scene.params.sandbox.refusalSeconds * this.scene.params.millisecondsPerSecond);
  }
  refresh() {
    const s = this.scene, p = s.params, c = s.cycle;
    document.querySelector('#panel-now').textContent = `Hiện tại: ${clockText(c.now)} · ${DIRECTION_LABELS[c.direction] || 'Không trọng lực'} · cửa: ${c.door.isOpen ? 'mở' : 'đóng'}`;
    for (const b of this.dialog.querySelectorAll('[data-dir]')) b.setAttribute('aria-pressed', b.dataset.dir === p.direction);
    for (const b of this.dialog.querySelectorAll('[data-duration]')) b.setAttribute('aria-pressed', Number(b.dataset.duration) === p.duration);
    for (const b of this.dialog.querySelectorAll('[data-speed]')) b.setAttribute('aria-pressed', Number(b.dataset.speed) === Number(p.timeScale));
    const list = document.querySelector('#schedule-list');
    const key = JSON.stringify(c.scheduleEntries);
    if (key !== this.scheduleKey) {
      this.scheduleKey = key; list.replaceChildren();
      if (!c.scheduleEntries.length) list.textContent = 'Lịch: chưa có mục nào.';
      c.scheduleEntries.forEach((entry, index) => {
        const row = document.createElement('p'); row.textContent = `${clockText(entry.atSeconds)} · ${DIRECTION_LABELS[entry.dir]} · ${entry.duration / p.secondsPerMinute}'${entry.fired ? ' · đã chạy' : ''} `;
        const remove = document.createElement('button'); remove.textContent = 'x'; remove.setAttribute('aria-label', `Xóa lịch ${clockText(entry.atSeconds)}`);
        remove.onclick = () => { c.removeSchedule(index); this.refresh(); }; row.append(remove); list.append(row);
      });
    }
    const last = c.scheduleEntries.at(-1), wait = Math.max(p.doorUnlockDelay, p.cooldownEnabled ? p.cooldown : 0);
    const available = c.state === 'IDLE' ? Math.max(c.unlockAt, p.cooldownEnabled ? c.readyAt : -Infinity) : c.returnAt + wait;
    const earliest = Math.max(c.now, available, last ? last.atSeconds + last.duration + wait : -Infinity) + p.warnTime;
    document.querySelector('#schedule-earliest').textContent = `Sớm nhất có thể hẹn tiếp: ${clockText(earliest, p)}`;
    document.querySelector('#game-journal').textContent = c.log.map(e => `${clockText(e.t)} ${e.event} (${e.origin}${e.user ? ` / ${e.user}` : ''})`).join('\n');
  }
}
