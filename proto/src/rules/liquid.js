const floorFor = { DOWN: 'FLOOR', UP: 'CEIL', WEST: 'WEST', EAST: 'EAST' };
const isFloor = (surface, dir) => surface === floorFor[dir] || surface === 'TABLE' && dir === 'DOWN'
  || surface === 'SHELF' && ['DOWN', 'EAST'].includes(dir);

export class Liquid {
  constructor(params) { this.p = params; this.decals = []; this.version = 0; this.serial = 0; }
  add(decal) { decal.id = ++this.serial; this.decals.push(decal); this.version++; return decal; }
  spill(surface, point, volume, color, t, dir) {
    if (!Number.isFinite(volume) || volume <= 0 || !['FLOOR', 'TABLE', 'SHELF', 'TRAY', 'CEIL', 'WEST', 'EAST'].includes(surface)
      || !Number.isFinite(point.x) || !Number.isFinite(point.y)) return null;
    const base = { surface, point: { ...point }, volume, color, t0: t, wetness: 1 };
    const radius = this.p.poolRadiusPerLitre * Math.sqrt(volume);
    if (isFloor(surface, dir)) return this.add({ ...base, type: 'POOL', floor: floorFor[dir], radius });
    this.add({ ...base, type: 'SPLASH', radius: radius * this.p.view.splashScale });
    return this.add({ ...base, type: 'STREAK', end: this.flowEnd(point, dir, this.p.streakLength) });
  }
  flowEnd(point, dir, length) {
    if (dir === 'DOWN') return { x: point.x, y: Math.max(0, point.y - length) };
    if (dir === 'UP') return { x: point.x, y: Math.min(this.p.room.height, point.y + length) };
    if (dir === 'WEST') return { x: Math.max(0, point.x - length), y: point.y };
    return { x: Math.min(this.p.room.width, point.x + length), y: point.y };
  }
  changeDirection(dir, t) {
    for (const pool of [...this.decals]) {
      if (pool.type !== 'POOL' || pool.wetness <= 0 || pool.floor === floorFor[dir]) continue;
      const length = dir === 'DOWN' && ['WEST', 'EAST'].includes(pool.floor) ? pool.point.y : this.p.streakLength * pool.wetness;
      this.add({ type: 'STREAK', sourceId: pool.id, surface: pool.surface, floor: pool.floor, point: { ...pool.point }, end: this.flowEnd(pool.point, dir, length),
        wetness: pool.wetness, volume: pool.volume, color: pool.color, t0: t });
      pool.radius *= Math.sqrt(this.p.poolShrink); pool.volume *= this.p.poolShrink;
      this.version++;
    }
  }
  step(dt) { for (const decal of this.decals) decal.wetness = Math.max(0, decal.wetness - dt / this.p.dryTime); }
  wipe(point, t) {
    this.decals = this.decals.filter(d => Math.hypot(d.point.x - point.x, d.point.y - point.y) > this.p.wipeRadius);
    return this.add({ type: 'WIPE', point: { ...point }, radius: this.p.wipeRadius, color: this.p.colors.water, t0: t, wetness: 0 });
  }
}
