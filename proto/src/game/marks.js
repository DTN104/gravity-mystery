// A5 + B2 + A6 — lớp vẽ chú thích lên phòng: tường đang là sàn, vòng khoanh vật/vết khi có sự kiện, vết mới nhấp nháy + nhãn.
// Chỉ đọc trạng thái; không chạm engine/luật. Thời gian dùng đồng hồ thật của scene (ms) để tua nhanh không làm mất hiệu ứng.
import { toScreen } from '../world/room.js';

const FLOOR_WALL = { DOWN: 'FLOOR', UP: 'CEIL', WEST: 'WEST', EAST: 'EAST' };

export class Marks {
  constructor(scene) {
    this.scene = scene; this.p = scene.params; this.rings = []; this.decalMarks = []; this.texts = [];
    this.g = scene.add.graphics().setDepth(this.p.readable.marksDepth);
  }
  destroy() { this.g.destroy(); for (const t of this.texts) t.destroy(); this.texts = []; }
  now() { return this.scene.time.now; }
  // B2: vòng khoanh. target = {kind:'body',body} | {kind:'decal',decal} | {kind:'point',x,y,r} | {kind:'rect',x,y,w,h} | {kind:'bolt'} | {kind:'board'}
  ring(target, seconds = this.p.readable.highlightMs / this.p.millisecondsPerSecond, id = null) {
    if (!target) return; if (id) this.clearRing(id);
    this.rings.push({ target, id, born: this.now(), until: seconds === Infinity ? Infinity : this.now() + seconds * this.p.millisecondsPerSecond });
  }
  clearRing(id) { this.rings = this.rings.filter(r => r.id !== id); }
  // A6: vết mới
  markDecal(decal, label) { this.decalMarks.push({ decal, label, born: this.now() }); }
  text(i, x, y, str, style) {
    while (this.texts.length <= i) this.texts.push(this.scene.add.text(0, 0, '', { fontFamily: 'monospace', fontSize: `${this.p.readable.markFont}px`, resolution: 2 }).setOrigin(0.5).setDepth(this.p.readable.marksDepth + 0.1));
    const t = this.texts[i]; t.setText(str).setPosition(x, y).setStyle(style).setAngle(0).setVisible(true); return t;
  }
  circleOf(target) {
    const p = this.p, s = this.scene;
    if (target.kind === 'body') { const b = target.body; return { x: b.position.x, y: b.position.y, r: Math.max(b.bounds.max.x - b.bounds.min.x, b.bounds.max.y - b.bounds.min.y) / 2 }; }
    if (target.kind === 'decal') { const d = target.decal, a = toScreen(d.point, p); if (d.type === 'STREAK') { const e = toScreen(d.end, p); return { x: (a.x + e.x) / 2, y: (a.y + e.y) / 2, r: Math.hypot(e.x - a.x, e.y - a.y) / 2 }; } return { x: a.x, y: a.y, r: (d.radius || 0.1) * p.pixelsPerMetre }; }
    if (target.kind === 'point') { const a = toScreen(target, p); return { x: a.x, y: a.y, r: (target.r || 0.15) * p.pixelsPerMetre }; }
    if (target.kind === 'rect') { const a = toScreen(target, p); return { x: a.x, y: a.y, r: Math.max(target.w, target.h) / 2 * p.pixelsPerMetre }; }
    if (target.kind === 'bolt') { const a = toScreen({ x: p.bolt.x + s.bolt.s + p.bolt.width / 2, y: p.bolt.y }, p); return { x: a.x, y: a.y, r: p.bolt.width * p.pixelsPerMetre }; }
    if (target.kind === 'board') { const b = p.sandbox.board, a = toScreen(b, p); return { x: a.x, y: a.y, r: b.width / 2 * p.pixelsPerMetre }; }
    return null;
  }
  draw() {
    const p = this.p, g = this.g, s = this.scene, c = s.cycle, now = this.now(), rl = p.readable; g.clear();
    for (const t of this.texts) t.setVisible(false);
    let ti = 0;
    const room = { x: p.canvas.origin.x, y: p.canvas.origin.y - p.room.height * p.pixelsPerMetre, w: p.room.width * p.pixelsPerMetre, h: p.room.height * p.pixelsPerMetre };
    const band = rl.floorBand * p.pixelsPerMetre, blink = Math.floor(now / (p.view.blinkPeriod * p.millisecondsPerSecond)) % 2 === 0;
    const wallRect = wall => ({ FLOOR: { x: room.x, y: room.y + room.h - band, w: room.w, h: band }, CEIL: { x: room.x, y: room.y, w: room.w, h: band },
      WEST: { x: room.x, y: room.y, w: band, h: room.h }, EAST: { x: room.x + room.w - band, y: room.y, w: band, h: room.h } })[wall];
    const arrows = (wall, color, alpha) => {
      const r = wallRect(wall), n = rl.arrowCount, size = rl.arrowSize * p.pixelsPerMetre; g.fillStyle(color, alpha);
      for (let i = 1; i <= n; i++) {
        const t = i / (n + 1);
        if (wall === 'FLOOR') { const x = room.x + room.w * t, y = r.y - size; g.fillTriangle(x - size / 2, y - size, x + size / 2, y - size, x, y); }
        else if (wall === 'CEIL') { const x = room.x + room.w * t, y = r.y + band + size; g.fillTriangle(x - size / 2, y + size, x + size / 2, y + size, x, y); }
        else if (wall === 'WEST') { const y = room.y + room.h * t, x = r.x + band + size; g.fillTriangle(x + size, y - size / 2, x + size, y + size / 2, x, y); }
        else { const y = room.y + room.h * t, x = r.x - size; g.fillTriangle(x - size, y - size / 2, x - size, y + size / 2, x, y); }
      }
    };
    const inset = rl.markFont * 0.8; // nhãn tường nằm hẳn trong phòng (ô kính/khung game cắt đúng mép tường)
    const label = (wall, str, color) => {
      const r = wallRect(wall), x = wall === 'WEST' ? r.x + r.w + inset : wall === 'EAST' ? r.x - inset : r.x + r.w / 2;
      const y = wall === 'FLOOR' ? r.y - inset : wall === 'CEIL' ? r.y + r.h + inset : r.y + r.h / 2;
      const t = this.text(ti++, x, y, str, { color, fontStyle: 'bold' });
      if (wall === 'WEST') t.setAngle(-90); else if (wall === 'EAST') t.setAngle(90); else t.setAngle(0);
    };
    const warn = `#${p.colors.warning.toString(16).padStart(6, '0')}`, hover = `#${p.colors.hover.toString(16).padStart(6, '0')}`;
    // A5: tường đang là sàn
    if (c.state === 'ZERO_G') {
      for (const wall of Object.values(FLOOR_WALL)) { const r = wallRect(wall); g.lineStyle(p.view.coatWidth, p.colors.static, rl.dimAlpha).strokeRect(r.x, r.y, r.w, r.h); }
      this.text(ti++, room.x + room.w / 2, room.y + room.h / 2, 'KHÔNG TRỌNG LỰC', { color: hover, fontStyle: 'bold', backgroundColor: `#${p.colors.background.toString(16).padStart(6, '0')}`, padding: { x: 6, y: 3 } });
    } else if (c.direction) {
      const wall = FLOOR_WALL[c.direction], r = wallRect(wall), strong = c.direction !== 'DOWN';
      g.fillStyle(p.colors.warning, strong ? rl.floorAlpha : rl.floorAlphaDown).fillRect(r.x, r.y, r.w, r.h);
      arrows(wall, p.colors.warning, strong ? 1 : rl.dimAlpha); label(wall, 'SÀN', strong ? warn : hover);
    }
    // A5: trong lúc còi — tường sắp là sàn nhấp nháy
    if (c.state === 'WARN' || c.state === 'WARN_RETURN') {
      const next = c.state === 'WARN' ? c.target : 'DOWN', wall = FLOOR_WALL[next], r = wallRect(wall);
      if (blink) { g.lineStyle(p.view.coatWidth * 2, p.colors.warning).strokeRect(r.x, r.y, r.w, r.h); arrows(wall, p.colors.warning, rl.dimAlpha); }
      if (wall !== FLOOR_WALL[c.direction]) label(wall, next === 'DOWN' ? 'SẮP VỀ XUỐNG' : 'SẮP LÀ SÀN', warn);
    }
    // B2: vòng khoanh
    this.rings = this.rings.filter(r => r.until > now);
    for (const ring of this.rings) {
      const k = this.circleOf(ring.target); if (!k) continue;
      const pulse = 0.55 + 0.45 * Math.sin((now - ring.born) / rl.pulseMs * Math.PI * 2);
      g.lineStyle(rl.ringWidth, p.colors.warning, pulse).strokeCircle(k.x, k.y, k.r + rl.ringPad);
    }
    // A6: vết mới nhấp nháy viền + nhãn tạm
    this.decalMarks = this.decalMarks.filter(m => now - m.born < rl.decalLabelMs && s.liquid.decals.includes(m.decal));
    for (const m of this.decalMarks) {
      const age = now - m.born, k = this.circleOf({ kind: 'decal', decal: m.decal });
      if (age < rl.decalBlinkMs && blink) g.lineStyle(rl.ringWidth, p.colors.hover).strokeCircle(k.x, k.y, k.r + rl.ringPad / 2);
      const lx = Math.min(Math.max(k.x, room.x + rl.markFont * 2), room.x + room.w - rl.markFont * 2), ly = Math.max(room.y + rl.markFont, k.y - k.r - rl.ringPad - rl.markFont);
      this.text(ti++, lx, ly, m.label, { color: hover, backgroundColor: `#${p.colors.background.toString(16).padStart(6, '0')}`, padding: { x: 4, y: 2 } });
    }
  }
}
