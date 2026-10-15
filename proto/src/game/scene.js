import { PARAMS } from '../params.js';
import { ProtoScene, boot } from '../main.js';
import { toScreen, toWorld } from '../world/room.js';
import { Detector } from './detector.js';
import { Hud } from './hud.js';
import { Narrator } from './narrator.js';
import { Marks } from './marks.js';

export class SandboxScene extends ProtoScene {
  create() {
    this.params = structuredClone(PARAMS); this.params.sandboxMode = true;
    this.params.mannequinPose = this.params.mannequin.pose;
    // A1: canvas gọn quanh phòng (560×400, phòng 400×300 = 71 % chiều rộng), scale theo cột trái
    const rl = this.params.readable;
    this.params.canvas = { width: rl.canvasWidth, height: rl.canvasHeight, origin: { x: rl.originX, y: rl.originY } };
    this.params.view.hallwayShift = 0;
    this.params.showGravity = false; // A5: thay đường vàng giữa phòng bằng tường SÀN
    const side = this.params.window.width * this.params.pixelsPerMetre * this.params.windowZoom;
    this.params.view.viewport = { x: Math.round((rl.canvasWidth - side) / 2), y: Math.round((rl.canvasHeight - side) / 2) };
    super.create(); window.sandbox = this;
    this.hud = new Hud(this); this.narrator = new Narrator(this);
    if (new URLSearchParams(location.search).get('ui') === 'game') import('./sandbox-bridge.js')
      .then(({ attach }) => attach(this)).catch(error => this.hud.notice(`Không ghép được UI: ${error.message}`));
    // A1: Phaser tính kích thước trước khi grid CSS xếp xong → làm tươi sau layout và khi cột đổi cỡ
    // Giới hạn chiều cao để trạng thái + phòng + dòng sự kiện cùng nằm trong một màn hình (không cuộn)
    const fit = () => {
      const box = document.querySelector('#canvas'), left = document.querySelector('#left'), rl2 = this.params.readable;
      if (!box || !left) return this.scale.refresh();
      const avail = window.innerHeight - rl2.reservedHeight, byHeight = avail * rl2.canvasWidth / rl2.canvasHeight;
      box.style.maxWidth = `${Math.max(rl2.minCanvasCss, Math.min(left.clientWidth, byHeight))}px`;
      this.scale.refresh();
    };
    requestAnimationFrame(fit); setTimeout(fit, 250); window.addEventListener('resize', fit); window.addEventListener('scroll', () => this.scale.refresh(), { passive: true });
    if (document.querySelector('#left')) new ResizeObserver(fit).observe(document.querySelector('#left'));
    this.input.on('pointerup', pointer => this.pointerUp(pointer));
    this.input.keyboard.on('keydown', event => {
      if (event.key !== this.params.sandbox.debugKey || !this.gui) return;
      this.debugVisible = !this.debugVisible; this.gui[this.debugVisible ? 'show' : 'hide']();
      if (this.debugVisible) { this.params.timeScale = 1; this.refresh(); }
    });
  }
  reset() {
    if (this.gameGraphics) this.gameGraphics.destroy();
    if (this.marks) this.marks.destroy();
    super.reset(); this.marks = new Marks(this); this.detector = new Detector(this.params); this.drops = []; this.detectNext = this.cycle.now;
    this.picked = null;
    this.bottle = this.objects.add('bottle', this.cycle.now); this.bottle.plugin.volume = this.params.bottleVolume;
    this.M.Body.setAngle(this.bottle, this.params.bottle.angle);
    this.gameGraphics = this.add.graphics();
    const p = this.params, shelf = p.sandbox.supplyShelf, center = toScreen({ x: (shelf.left + shelf.right) / 2, y: shelf.y - shelf.thickness / 2 }, p);
    const c = p.collisionCategories;
    const body = this.M.Bodies.rectangle(center.x, center.y, (shelf.right - shelf.left) * p.pixelsPerMetre, shelf.thickness * p.pixelsPerMetre,
      { isStatic: true, friction: p.room.friction, collisionFilter: { category: c.world, mask: c.world | c.loose | c.mannequin } });
    body.plugin = { surface: 'SHELF', name: 'Kệ dụng cụ' }; this.room.bodies.push(body); this.M.World.add(this.engine.world, body);
    if (this.hud) { this.hud.hallway.pendingMaster = false; this.hud.hallway.blockedByBolt = false; this.hud.queue = []; this.hud.guide.start(); this.hud.refresh(); }
    if (this.narrator) { this.narrator.lines = []; this.narrator.reset(); this.hud?.renderEvents([]); }
    this.skipTarget = null;
  }
  // D1: tua nhanh tới 3 s trước mốc kế tiếp rồi tự về ×1
  nextMilestone() {
    const c = this.cycle, p = this.params;
    if (c.state === 'ZERO_G') return null;
    if (c.state === 'ACTIVE') return c.returnAt - p.zeroGTime;   // tới đầu zero-g trả về: thấy 3 s còi, zero-g, rồi về Xuống
    if (c.state !== 'IDLE') return c.deadline;
    const pending = c.scheduleEntries?.find(e => !e.fired);
    if (pending) return pending.atSeconds - p.warnTime;
    return null;
  }
  skipWait() {
    const target = this.nextMilestone(); if (target === null) return false;
    const stop = target - this.params.readable.skipToMarginSec;
    if (stop <= this.cycle.now) return false;
    this.skipTarget = stop; this.params.timeScale = this.params.readable.skipSpeed; this.refresh(); return true;
  }
  canInteract() { return this.hallway.inside && this.cycle.state === 'IDLE'; } // B5: thẻ không chặn thao tác
  selectTool(tool) {
    if (!this.canInteract()) return this.hud.notice('Chỉ dùng dụng cụ khi đang chờ trong buồng.');
    this.tool = tool; this.picked = null; this.mouse.constraint.bodyB = null; this.refresh(); return true;
  }
  refill() {
    if (!this.canInteract()) return false;
    const { Body, Sleeping } = this.M, bottle = this.bottle, p = this.params;
    Body.setPosition(bottle, toScreen(p.bottle, p));
    Body.setAngle(bottle, p.bottle.angle);
    Body.setVelocity(bottle, { x: 0, y: 0 }); Body.setAngularVelocity(bottle, 0);
    Sleeping.set(bottle, false);
    this.bottle.plugin.volume = this.params.bottleVolume; this.refresh(); return true;
  }
  pointerDown(pointer) {
    const p = this.params, point = toWorld(pointer.positionToCamera(this.cameras.main), p), board = p.sandbox.board;
    if (this.hallway.inside && Math.abs(point.x - board.x) <= board.width / 2 && Math.abs(point.y - board.y) <= board.height / 2)
      return this.hud.panel.open();
    if (!this.canInteract()) return;
    if (point.x < 0 || point.x > p.room.width || point.y < 0 || point.y > p.room.height) return;
    for (const rail of p.handrails) if (Math.hypot(point.x - rail.x, point.y - rail.y) <= p.bolt.height) { this.anchor(false); return; }
    const rag = p.sandbox.rag;
    if (Math.abs(point.x - rag.x) <= rag.width / 2 && Math.abs(point.y - rag.y) <= rag.height / 2) return this.selectTool('wipe');
    const refill = p.sandbox.refill;
    if (Math.abs(point.x - refill.x) <= refill.width / 2 && Math.abs(point.y - refill.y) <= refill.height / 2) return this.refill();
    if (this.tool === 'pen') {
      const body = this.addObject('pen', point); this.drops.push({ id: body.plugin.id, t: this.cycle.now }); this.selectTool('drag'); return;
    }
    const world = pointer.positionToCamera(this.cameras.main);
    this.picked = this.M.Query.point(this.objects.bodies, world)[0] || null;
    if (this.tool === 'drag' && !this.picked) { // D2: vùng bắt chuột = thân vật + pickPaddingPx (mọi chế độ)
      const pad = p.fullGame.pickPaddingPx * this.scale.displayScale.x;
      this.picked = this.objects.bodies.filter(b => world.x >= b.bounds.min.x - pad && world.x <= b.bounds.max.x + pad
        && world.y >= b.bounds.min.y - pad && world.y <= b.bounds.max.y + pad)
        .sort((a, b) => Math.hypot(a.position.x - world.x, a.position.y - world.y) - Math.hypot(b.position.x - world.x, b.position.y - world.y))[0] || null;
      if (this.picked) {
        this.mouse.constraint.bodyB = this.picked; this.mouse.constraint.pointB = { x: world.x - this.picked.position.x, y: world.y - this.picked.position.y };
        this.mouse.constraint.angleB = this.picked.angle;
      }
    }
    if (this.tool === 'pour') {
      if (this.bottle.plugin.volume + p.epsilon < p.pourVolume) return this.hud.notice('Bình đã hết nước. Đổ đầy lại trên kệ.');
      const before = this.liquid.serial; super.pointerDown(pointer);
      if (this.liquid.serial > before) this.bottle.plugin.volume = Math.max(0, this.bottle.plugin.volume - p.pourVolume);
      this.refresh(); return;
    }
    super.pointerDown(pointer);
  }
  pour(surface, point, volume) {
    return super.pour(surface, point, volume ?? (this.tool === 'pour' ? this.params.pourVolume : this.params.waterVolume));
  }
  pointerUp(pointer) {
    const body = this.picked; this.picked = null;
    if (!this.canInteract() || !body) return;
    if (body === this.bottle && pointer.getDistance() < this.params.sandbox.clickDistance) return this.selectTool('pour');
    if (this.tool !== 'drag') return;
    this.drops.push({ id: body.plugin.id, t: this.cycle.now }); this.hud?.guide.onDrop(body);
    if (body.plugin.kind === 'mannequin') {
      const p = this.params, pos = toWorld(body.position, p);
      const rail = p.handrails.find(r => Math.hypot(r.x - pos.x, r.y - pos.y) <= p.sandbox.anchorRadius);
      if (rail) this.objects.anchor(true, body, rail);
    }
  }
  step(seconds) {
    // Theo vật thực sự đang được mouse spring giữ; sprite có vùng bấm rộng hơn thân.
    if (this.canInteract() && this.tool === 'drag' && this.input.activePointer.isDown && this.mouse.constraint.bodyB)
      this.picked = this.mouse.constraint.bodyB;
    this.hud?.hallway.step(); super.step(seconds); this.hud?.hallway.step();
    this.narrator?.observe();
    if (this.skipTarget !== null && this.skipTarget !== undefined && this.cycle.now >= this.skipTarget) { this.skipTarget = null; this.params.timeScale = 1; this.refresh(); }
    if (this.hud && this.cycle.now >= this.detectNext) {
      this.detectNext = this.cycle.now + this.params.coatInterval;
      const s = this.snapshot(); s.insetVisible = !this.hallway.inside; s.overlayOpen = this.hud.overlayOpen;
      if (this.uiVisible === false) s.hallway.visible = false;
      s.viewNow = performance.now() / this.params.millisecondsPerSecond; s.drops = this.drops;
      s.settledGels = [...this.coat.gels].map(([id, state]) => ({ id, ...state }));
      this.hud.detected(this.detector.observe(s));
    }
  }
  draw() {
    super.draw(); this.marks?.draw(); if (!this.gameGraphics) return;
    const p = this.params, g = this.gameGraphics; g.clear();
    const shelf = p.sandbox.supplyShelf, at = toScreen({ x: shelf.left, y: shelf.y }, p);
    g.fillStyle(p.colors.static).fillRect(at.x, at.y, (shelf.right - shelf.left) * p.pixelsPerMetre, shelf.thickness * p.pixelsPerMetre);
    const board = p.sandbox.board, b = toScreen({ x: board.x - board.width / 2, y: board.y + board.height / 2 }, p);
    g.fillStyle(p.colors.door).fillRect(b.x, b.y, board.width * p.pixelsPerMetre, board.height * p.pixelsPerMetre);
    g.lineStyle(p.view.coatWidth, this.cycle.state.includes('WARN') && Math.floor(this.cycle.now / p.view.blinkPeriod) % 2 === 0 ? p.colors.warning : p.colors.static)
      .strokeRect(b.x, b.y, board.width * p.pixelsPerMetre, board.height * p.pixelsPerMetre);
    const rag = p.sandbox.rag, r = toScreen({ x: rag.x - rag.width / 2, y: rag.y + rag.height / 2 }, p);
    g.fillStyle(p.colors.static).fillRect(r.x, r.y, rag.width * p.pixelsPerMetre, rag.height * p.pixelsPerMetre);
    const refill = p.sandbox.refill, f = toScreen({ x: refill.x - refill.width / 2, y: refill.y + refill.height / 2 }, p);
    g.lineStyle(p.sandbox.hoverWidth, p.colors.hover).strokeRect(f.x, f.y, refill.width * p.pixelsPerMetre, refill.height * p.pixelsPerMetre);
    for (const body of this.objects.bodies) {
      g.fillStyle(p.colors.shadow, p.sandbox.shadowAlpha).fillEllipse(body.position.x, body.bounds.max.y + p.sandbox.shadowHeight * p.pixelsPerMetre,
        body.bounds.max.x - body.bounds.min.x, p.sandbox.shadowHeight * p.pixelsPerMetre);
    }
    const name = document.querySelector('#hover-name'); if (name) name.textContent = '';
    if (this.canInteract()) {
      const pointer = this.input.activePointer, world = pointer.positionToCamera(this.cameras.main);
      const hover = this.M.Query.point(this.objects.bodies, world)[0];
      if (name) name.textContent = hover ? { cup: 'Ca nước', pen: 'Bút', book: 'Sổ', bottle: 'Bình nước', gel: 'Hạt gel', mannequin: 'Hình nộm' }[hover.plugin.kind] : '';
      const point = toWorld(world, p);
      if (name && Math.abs(point.x - refill.x) <= refill.width / 2 && Math.abs(point.y - refill.y) <= refill.height / 2) name.textContent = 'Đổ đầy lại';
      if (hover) for (const part of hover.parts.length > 1 ? hover.parts.slice(1) : hover.parts)
        g.lineStyle(p.sandbox.hoverWidth, p.colors.hover).strokePoints(part.vertices, true);
    }
  }
  refresh() { super.refresh(); this.hud?.refresh(); }
}

// A1: canvas 560×400 vẽ ở kích thước gốc, CSS phóng theo cột; Scale.NONE + refresh() để chuột được quy đổi đúng.
boot(SandboxScene, { width: PARAMS.readable.canvasWidth, height: PARAMS.readable.canvasHeight });
