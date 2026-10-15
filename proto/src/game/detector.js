export const RULES = [
  { id: 'R1', answers: ['Vũng tròn trên tường = tường đó từng là sàn.', 'Ca bị ném mạnh mới loang tròn.', 'Vết chảy xuống nghĩa là đổ từ trần.'] },
  { id: 'R2', answers: ['Vệt kéo ngang trên sàn = chất lỏng đã nằm trên sàn trước khi xoay.', 'Vệt kéo ngang = có người lôi vật nặng qua.', 'Nước luôn chảy về phía cửa.'] },
  { id: 'R3', answers: ['Trọng lực ngang trùng trục chốt thì chốt tự trượt. Phòng khóa kín không cần ai ở trong.', 'Chốt chỉ trượt khi có người đẩy.', 'Cửa khóa là do chốt.'] },
  { id: 'R4', answers: ["Trong lúc xoay, không ai 'ở trên sàn' — họ ở trên bức tường đang là sàn.", 'Người bám tay vịn thì vẫn đứng trên sàn.', 'Qua ô kính không thấy được tường bên.'] },
  { id: 'R5', answers: ['Vật rơi sau khi gel văng thì nằm trên, sạch.', 'Gel luôn phủ mọi thứ trong phòng.', 'Bút nặng nên chìm xuống dưới gel.'] },
];

export class Detector {
  constructor(params) {
    this.p = params; this.discovered = new Set(); this.unlocked = new Set(); this.events = []; this.unlockLog = [];
    this.wrong = {}; this.streaks = new Set(); this.previousBolt = null; this.viewSince = null;
  }
  observe(s) {
    const p = this.p, found = [];
    const fire = id => {
      if (this.discovered.has(id)) return;
      this.discovered.add(id); this.events.push({ rule: id, t: s.now }); found.push(id);
    };
    for (const d of s.decals.filter(d => d.type === 'STREAK' && !this.streaks.has(d.id))) {
      this.streaks.add(d.id);
      const pool = s.decals.find(pool => pool.id === d.sourceId && pool.type === 'POOL');
      if (!pool || d.wetness <= 0) continue;
      if (['WEST', 'EAST', 'CEIL'].includes(pool.floor) && s.dir === 'DOWN'
        && s.log.some(e => e.event === 'RETURN' && d.t0 >= e.t - p.epsilon && d.t0 - e.t <= p.physicsStep + p.epsilon)
        && d.end.y < d.point.y) fire('R1');
      if (pool.surface === 'FLOOR' && pool.floor === 'FLOOR' && ['EAST', 'WEST'].includes(s.dir)
        && Math.abs(d.end.y - d.point.y) <= p.epsilon && Math.abs(d.end.x - d.point.x) > p.epsilon) fire('R2');
    }
    if (this.previousBolt !== null && (!s.hallway.inside || s.insetVisible)) {
      if (s.dir === 'EAST' && s.bolt === p.boltTravel && this.previousBolt < p.boltTravel
        || s.dir === 'WEST' && s.bolt === 0 && this.previousBolt > 0) fire('R3');
    }
    this.previousBolt = s.bolt;
    const aligned = s.objects.some(o => {
      if (o.kind !== 'mannequin' || o.segment !== 'torso') return false;
      const vertical = Math.acos(Math.min(1, Math.abs(Math.cos(o.angle))));
      if (s.dir === 'UP') return Math.PI / 2 - vertical < p.sandbox.axisTolerance
        && Math.abs(p.room.height - o.bounds.max.y) <= p.sandbox.wallTolerance;
      return vertical < p.sandbox.axisTolerance && (s.dir === 'EAST'
        ? Math.abs(p.room.width - o.bounds.max.x) : Math.abs(o.bounds.min.x)) <= p.sandbox.wallTolerance;
    });
    const viewing = !s.hallway.inside && s.hallway.visible && !s.overlayOpen && s.state === 'ACTIVE' && s.dir !== 'DOWN' && aligned;
    const viewNow = s.viewNow ?? s.now;
    if (viewing) { this.viewSince ??= viewNow; if (viewNow - this.viewSince >= p.sandbox.ruleViewSeconds - p.epsilon) fire('R4'); }
    else this.viewSince = null;
    const coated = s.objects.some(o => o.kind !== 'gel' && o.coatedAt !== null && o.coatedAt !== undefined);
    if (coated) for (const drop of s.drops || []) {
      const object = s.objects.find(o => o.id === drop.id);
      if (!object || object.kind === 'gel' || object.kind === 'mannequin' || object.coatedAt != null) continue;
      const near = s.objects.filter(g => g.kind === 'gel' && Math.hypot(g.x - object.x, g.y - object.y) <= p.coatRadius);
      const eligible = near.filter(g => (s.settledGels || []).some(state => state.id === g.id
        && state.settledAt !== null && state.firstSettledAt < drop.t));
      if (eligible.length >= p.gelCoatMin) fire('R5');
    }
    return found;
  }
  answer(id, choice, now) {
    if (!this.discovered.has(id) || !RULES.some(r => r.id === id)) return false;
    if (choice !== 0) { this.wrong[id] = (this.wrong[id] || 0) + 1; return false; }
    if (!this.unlocked.has(id)) {
      this.unlocked.add(id); this.unlockLog.push({ rule: id, t: now, wrongAttempts: this.wrong[id] || 0 });
    }
    return true;
  }
}
