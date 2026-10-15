import { toScreen } from '../world/room.js';

export class Hallway {
  constructor(scene, params) {
    this.p = params; this.inside = true; this.main = scene.cameras.main;
    const p = params;
    const side = p.window.width * p.pixelsPerMetre * p.windowZoom;
    const height = p.window.height * p.pixelsPerMetre * p.windowZoom;
    this.cover = scene.add.graphics().setDepth(1).setVisible(false);
    this.cover.fillStyle(p.colors.door).fillRect(0, 0, p.canvas.width, p.canvas.height);
    this.cover.lineStyle(p.view.lineWidth, p.colors.static).strokeRect(p.view.viewport.x + p.view.hallwayShift, p.view.viewport.y, side, height);
    this.windowCamera = scene.cameras.add(p.view.viewport.x, p.view.viewport.y, side, height).setVisible(false);
    this.windowCamera.setZoom(Math.min(side / (p.room.width * p.pixelsPerMetre), height / (p.room.height * p.pixelsPerMetre)));
    this.windowCamera.centerOn(toScreen({ x: p.room.width / 2, y: p.room.height / 2 }, p).x, toScreen({ x: p.room.width / 2, y: p.room.height / 2 }, p).y);
    const maskShape = scene.make.graphics({ x: 0, y: 0 }, false);
    maskShape.fillRect(p.view.viewport.x, p.view.viewport.y, side, height);
    this.mask = maskShape.createGeometryMask();
    this.windowCamera.setMask(this.mask);
    this.windowCamera.ignore(this.cover);
  }
  leave(cycle) {
    if (!cycle.canEnter()) return false;
    this.inside = false; this.cover.setVisible(true); this.main.setScroll(this.p.view.hallwayShift, 0);
    this.windowCamera.setVisible(true); return true;
  }
  enter(cycle, bolt) {
    if (!cycle.canEnter()) return false;
    if (bolt && bolt.s !== 0) return cycle.reject('Chốt bên trong đã cài. Không mở được từ hành lang.');
    this.inside = true; this.cover.setVisible(false); this.main.setScroll(0, 0);
    this.windowCamera.setVisible(false); return true;
  }
}
