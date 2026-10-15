// B1 — kể lại sự kiện vật lý bằng lời. Chỉ đọc trạng thái của lớp luật/scene, không sửa gì.
const SURFACE = { FLOOR: 'sàn', CEIL: 'trần', WEST: 'tường Tây', EAST: 'tường Đông', TABLE: 'mặt bàn', SHELF: 'thanh giá', TRAY: 'khay' };
const DIR = { DOWN: 'XUỐNG', UP: 'LÊN', WEST: 'TÂY', EAST: 'ĐÔNG' };
const WALL_OF = { DOWN: 'Sàn', UP: 'Trần', WEST: 'Tường Tây', EAST: 'Tường Đông' };
const KIND = { cup: 'Ca', pen: 'Bút', book: 'Sổ', bottle: 'Bình nước', mannequin: 'Hình nộm', gel: 'Gel' };

export class Narrator {
  constructor(scene) { this.scene = scene; this.lines = []; this.reset(); }
  reset() {
    const a = this.scene;
    this.last = { bolt: a.bolt.s, collisions: a.metrics.collisions.length, messages: a.cycle.messages.length, transitions: a.metrics.transitions.length };
    this.landed = new Set(); this.gelLanded = false; this.seen = new WeakSet(); for (const d of a.liquid.decals) this.seen.add(d);
  }
  say(text, target = null) {
    if (this.lines.at(-1)?.text === text) return;
    this.lines.push({ text, t: this.scene.cycle.now }); if (this.lines.length > 5) this.lines.shift();
    this.scene.hud?.renderEvents(this.lines); this.scene.hud?.onNarrate?.(text);
    if (target) this.scene.marks?.ring(target); // B2: khoanh vật/vết liên quan
  }
  observe() {
    const a = this.scene, c = a.cycle, p = a.params, L = this.last;
    // trạng thái chu kỳ — đọc từ messages/transitions để không bỏ sót khi tua nhanh
    const msgs = c.messages;
    if (msgs.length > L.messages) {
      for (const m of msgs.slice(L.messages)) {
        if (m.startsWith('Còi: cảnh báo xoay')) this.say('Còi — cửa đã khóa. Bám tay vịn.');
        else if (m.startsWith('Còi: cảnh báo trả về')) this.say('Còi — sắp trả về Xuống.');
      }
      L.messages = msgs.length;
    }
    const trans = a.metrics.transitions;
    if (trans.length > L.transitions) {
      for (const tr of trans.slice(L.transitions)) {
        if (tr.state === 'ZERO_G') this.say('Không trọng lực. Mọi thứ lơ lửng.');
        else if (tr.state === 'ACTIVE' && tr.dir) { this.say(`Trọng lực: ${DIR[tr.dir]}. ${WALL_OF[tr.dir]} giờ là sàn.`); this.landed.clear(); this.gelLanded = false; }
        else if (tr.state === 'IDLE') { this.say('Về XUỐNG. Sàn lại là sàn.'); this.landed.clear(); this.scene.hud?.onReturn?.(); }
      }
      L.transitions = trans.length;
    }
    // chốt
    if (a.bolt.s !== L.bolt) {
      if (a.bolt.s >= p.boltTravel - p.epsilon && L.bolt < p.boltTravel - p.epsilon) this.say('Chốt cửa tự trượt sang ĐÓNG — cạch.', { kind: 'bolt' });
      else if (a.bolt.s <= p.epsilon && L.bolt > p.epsilon) this.say('Chốt cửa tự trượt sang MỞ.', { kind: 'bolt' });
      L.bolt = a.bolt.s;
    }
    // va chạm vật lên bề mặt mới (chỉ trong ACTIVE, mỗi vật một lần)
    const cols = a.metrics.collisions;
    if (cols.length > L.collisions) {
      for (const hit of cols.slice(L.collisions)) {
        if (c.state !== 'ACTIVE' || !hit.dir || hit.dir === 'DOWN') continue;
        const wall = { EAST: 'EAST', WEST: 'WEST', UP: 'CEIL' }[hit.dir];
        if (hit.surface !== wall) continue;
        const body = a.objects.bodies.find(b => b.plugin.id === hit.id), target = body ? { kind: 'body', body } : null;
        if (hit.kind === 'gel') { if (!this.gelLanded) { this.gelLanded = true; this.say(`Gel đổ khỏi khay, văng lên ${SURFACE[wall]}.`, target); } continue; }
        if (this.landed.has(hit.id)) continue; this.landed.add(hit.id);
        this.say(`${KIND[hit.kind] || hit.kind} rơi lên ${SURFACE[wall]}.`, target);
      }
      L.collisions = cols.length;
    }
    // dấu vết mới (theo identity — wipe() xóa decal cũ rồi thêm WIPE)
    for (const d of a.liquid.decals) {
      if (this.seen.has(d)) continue; this.seen.add(d);
      const s = SURFACE[d.surface] || d.surface, flat = d.surface === 'FLOOR' || d.surface === 'TABLE', target = { kind: 'decal', decal: d };
      let label = null;
      if (d.type === 'POOL') { label = 'vũng'; this.say(flat ? `Nước loang thành vũng trên ${s}.` : `Nước loang thành VŨNG TRÒN trên ${s} — vì ${s} đang là sàn.`, target); }
      else if (d.type === 'STREAK') {
        if (flat) { label = 'vệt kéo'; this.say(`Vũng trên ${s} còn ướt, bị kéo thành vệt về phía ${DIR[c.direction] || 'mới'}.`, target); }
        else if (c.direction === 'DOWN') { label = 'vệt chảy'; this.say(`Vũng trên ${s} chảy xuống thành vệt.`, target); }
        else { label = 'vệt chảy'; this.say(`Nước bắn lên ${s} rồi chảy theo trọng lực.`, target); }
      } else if (d.type === 'WIPE') { label = 'vết lau'; this.say('Đã lau — còn lại vết lau hình cung.', target); }
      else if (d.type === 'SPLASH') label = 'nước bắn';
      if (label) a.marks?.markDecal(d, label); // A6
    }
  }
}
