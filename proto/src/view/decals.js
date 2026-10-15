import { toScreen } from '../world/room.js';

export class DecalsView {
  constructor(scene, params) { this.p = params; this.graphics = scene.add.graphics(); this.version = -1; }
  draw(liquid) {
    this.graphics.setVisible(this.p.showDecals);
    const wet = this.p.sandboxMode ? liquid.decals.map(d => Math.max(this.p.view.dryStreakAlpha, d.wetness).toFixed(2)).join(',') : '';
    if (this.version === liquid.version && this.wet === wet) return;
    this.version = liquid.version; this.wet = wet;
    const p = this.p, g = this.graphics; g.clear();
    for (const decal of liquid.decals) {
      const point = toScreen(decal.point, p);
      if (decal.type === 'STREAK') {
        const end = toScreen(decal.end, p);
        g.lineStyle(p.sandboxMode ? p.streakWidth : p.view.streakWidth, decal.color,
          p.sandboxMode ? Math.max(p.view.dryStreakAlpha, decal.wetness * p.poolAlpha) : p.view.poolAlpha)
          .lineBetween(point.x, point.y, end.x, end.y);
      } else if (decal.type === 'WIPE') {
        g.lineStyle(p.view.wipeWidth, decal.color, p.sandboxMode ? p.view.sandboxWipeAlpha : p.view.wipeAlpha).beginPath();
        g.arc(point.x, point.y, decal.radius * p.pixelsPerMetre, p.view.wipeArcStart, p.view.wipeArcEnd, false, p.view.arcSegments);
        g.strokePath();
      } else g.fillStyle(decal.color, p.sandboxMode ? p.poolAlpha : p.view.poolAlpha).fillCircle(point.x, point.y, decal.radius * p.pixelsPerMetre);
    }
  }
}
