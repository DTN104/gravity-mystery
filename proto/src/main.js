import { PARAMS, DIRECTIONS, clockText } from './params.js';
import { createPanel } from './view/panel.js';
import { Cycle } from './rules/cycle.js';
import { Bolt } from './rules/bolt.js';
import { Liquid } from './rules/liquid.js';
import { Coat } from './rules/coat.js';
import { createRoom, toScreen, toWorld } from './world/room.js';
import { Objects } from './world/objects.js';
import { Hallway } from './view/hallway.js';
import { DecalsView } from './view/decals.js';

export class ProtoScene extends Phaser.Scene {
  create() {
    this.params ??= PARAMS; this.M = Phaser.Physics.Matter.Matter; this.engine = this.matter.world.engine;
    document.documentElement.style.setProperty('--canvas-width', `${PARAMS.canvas.width}px`);
    document.documentElement.style.setProperty('--panel-width', `${PARAMS.ui.width}px`);
    this.paused = false; this.tool = 'drag'; this.messages = []; this.frameSamples = [];
    this.lastFrame = performance.now(); this.guiTime = 0; this.reset();
    window.proto = this;
    createPanel(this).catch(error => this.message(`Không tải được panel CDN: ${error.message}`));
    this.input.on('pointerdown', pointer => this.pointerDown(pointer));
    document.querySelector('#leave').onclick = () => { this.hallway.leave(this.cycle); this.refresh(); };
    document.querySelector('#enter').onclick = () => { this.hallway.enter(this.cycle); this.refresh(); };
  }
  canInteract() { return this.hallway.inside; }
  pointerDown(pointer) {
      if (this.tool === 'drag' || !this.canInteract()) return;
      const world = pointer.positionToCamera(this.cameras.main);
      const point = toWorld(world, this.params), p = this.params;
      if (point.x < 0 || point.x > p.room.width || point.y < 0 || point.y > p.room.height) return;
      if (this.tool === 'wipe') this.liquid.wipe(point, this.cycle.now);
      else {
        const targets = [
          ['FLOOR', { x: point.x, y: 0 }], ['CEIL', { x: point.x, y: p.room.height }],
          ['WEST', { x: 0, y: point.y }], ['EAST', { x: p.room.width, y: point.y }],
          ['TABLE', { x: Math.max(p.table.left, Math.min(p.table.right, point.x)), y: p.table.y }],
          ['SHELF', { x: Math.max(p.shelf.left, Math.min(p.shelf.right, point.x)), y: p.shelf.y }],
          ...(p.sandboxMode ? [['SHELF', { x: Math.max(p.sandbox.supplyShelf.left, Math.min(p.sandbox.supplyShelf.right, point.x)), y: p.sandbox.supplyShelf.y }]] : []),
          ...[p.tray.bottom, p.tray.top].map(y => ['TRAY', { x: Math.max(p.tray.left, Math.min(p.tray.right, point.x)), y }]),
        ];
        targets.sort((a, b) => Math.hypot(a[1].x - point.x, a[1].y - point.y) - Math.hypot(b[1].x - point.x, b[1].y - point.y));
        this.pour(targets[0][0], targets[0][1]);
      }
  }
  reset() {
    const p = this.params;
    if (this.room) {
      this.mouse.destroy();
      for (const layer of [this.room.graphics, this.objectGraphics, this.decals.graphics, this.hallway.cover]) layer.destroy();
      this.cameras.remove(this.hallway.windowCamera);
      this.hallway.mask.destroy();
      this.M.World.clear(this.engine.world, false); this.M.Engine.clear(this.engine);
      this.matter.world.off('collisionstart', this.collisionHandler);
    }
    this.cameras.main.setScroll(0, 0);
    this.cycle = new Cycle(p); this.bolt = new Bolt(p); this.liquid = new Liquid(p); this.coat = new Coat(p);
    this.room = createRoom(this, p); this.objects = new Objects(this, p, this.cycle.now);
    this.decals = new DecalsView(this, p); this.objectGraphics = this.add.graphics();
    this.hallway = new Hallway(this, p);
    this.mouse = this.matter.add.mouseSpring({ length: 0, stiffness: p.anchorStiffness });
    this.engine.enableSleeping = true; this.engine.positionIterations = p.positionIterations;
    this.engine.velocityIterations = p.velocityIterations; this.engine.constraintIterations = p.constraintIterations;
    this.gravityDirection = 'DOWN'; this.applyGravity('DOWN');
    this.noiseState = p.noiseSeed; this.coatNext = this.cycle.now; this.accumulator = 0;
    this.messages = []; this.frameSamples = []; this.metrics = { collisions: [], transitions: [], substeps: 0 };
    this.collisionHandler = event => this.collisions(event);
    this.matter.world.on('collisionstart', this.collisionHandler);
    if (p.mannequinAnchored) this.objects.anchor(true);
    this.refresh(); this.draw();
  }
  message(text) { this.messages.push(text); this.refresh(); return false; }
  start(dir, duration, options) { const ok = this.cycle.start(dir, duration, options); this.refresh(); return ok; }
  schedule(t, dir, duration) { const ok = this.cycle.schedule(t, dir, duration); this.refresh(); return ok; }
  stop() { this.cycle.stop(); this.applyGravity(this.cycle.direction); this.refresh(); }
  setDoorOpen(value) { const ok = this.cycle.setDoorOpen(value); this.params.doorIsOpen = this.cycle.door.isOpen; this.refresh(); return ok; }
  setBolt(s) { if (this.cycle.state !== 'IDLE') return this.message('Từ chối: chỉ kéo chốt bằng tay khi IDLE'); return this.bolt.set(s); }
  addObject(kind, position) { return this.objects.add(kind, this.cycle.now, position); }
  anchor(enabled) { this.objects.anchor(enabled); }
  setMannequinMass() { this.objects.mannequin.setMass(this.params.mannequinMass); }
  pour(surface, point, volume = this.params.waterVolume) {
    return this.liquid.spill(surface, point, volume, this.params.colors.water, this.cycle.now, this.gravityDirection);
  }
  applyGravity(dir) {
    const p = this.params, unit = DIRECTIONS[dir] || { x: 0, y: 0 };
    const origin = toScreen({ x: 0, y: 0 }, p), screen = toScreen(unit, p);
    this.engine.gravity.x = (screen.x - origin.x) / p.pixelsPerMetre;
    this.engine.gravity.y = (screen.y - origin.y) / p.pixelsPerMetre;
    this.engine.gravity.scale = p.g * p.pixelsPerMetre / p.millisecondsPerSecond ** 2;
    this.gravityDirection = dir;
  }
  wake() { for (const body of this.objects.bodies) this.M.Sleeping.set(body, false); }
  zeroGNoise() {
    const p = this.params, M = this.M;
    // Seeded perturbation keeps equal input runs reproducible at the rules boundary.
    const random = () => { this.noiseState = (this.noiseState * 1664525 + 1013904223) >>> 0; return this.noiseState / 2 ** 32; };
    for (const body of this.objects.bodies) {
      const velocity = M.Body.getVelocity(body);
      const speed = p.zeroGNoise * p.pixelsPerMetre * M.Body._baseDelta / p.millisecondsPerSecond;
      M.Body.setVelocity(body, { x: velocity.x + (random() * 2 - 1) * speed, y: velocity.y + (random() * 2 - 1) * speed });
    }
  }
  step(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0 || this.params.physicsStep <= 0) throw new RangeError('Thời gian / physicsStep không hợp lệ');
    const p = this.params;
    this.accumulator += seconds;
    while (this.accumulator >= p.physicsStep - p.epsilon) {
      const dt = p.physicsStep;
      const commands = this.cycle.step(dt);
      for (const command of commands) {
        this.wake();
        if (command.type === 'ZERO_G') { this.applyGravity(null); this.zeroGNoise(); }
        else { this.applyGravity(command.dir); this.liquid.changeDirection(command.dir, this.cycle.now); }
        this.metrics.transitions.push({ t: this.cycle.now, state: this.cycle.state, dir: this.gravityDirection });
      }
      this.applyGravity(this.gravityDirection);
      this.engine.enableSleeping = this.cycle.state !== 'ZERO_G';
      const boltMessage = this.bolt.step(dt, this.cycle.gravity());
      if (boltMessage) this.messages.push(boltMessage);
      this.mouse.constraint.stiffness = this.tool === 'drag' && this.canInteract() ? p.anchorStiffness : 0;
      if (!this.canInteract()) this.mouse.constraint.bodyB = null;
      this.M.Engine.update(this.engine, dt * p.millisecondsPerSecond);
      this.liquid.step(dt);
      if (this.cycle.now >= this.coatNext) {
        this.coat.step(this.cycle.now, this.objects.snapshot());
        this.coatNext = this.cycle.now + p.coatInterval;
      }
      for (const body of this.objects.bodies) {
        if (['cup', 'bottle'].includes(body.plugin.kind) && body.plugin.volume > 0 && this.gravityDirection && Math.abs(body.angle) > p.spillAngle) {
          const point = toWorld(body.position, p);
          const surface = { DOWN: 'FLOOR', UP: 'CEIL', WEST: 'WEST', EAST: 'EAST' }[this.gravityDirection];
          if (surface === 'FLOOR') point.y = 0;
          if (surface === 'CEIL') point.y = p.room.height;
          if (surface === 'WEST') point.x = 0;
          if (surface === 'EAST') point.x = p.room.width;
          this.pour(surface, point, body.plugin.volume); body.plugin.volume = 0;
        }
      }
      this.metrics.substeps++; this.accumulator -= dt;
    }
  }
  collisions(event) {
    const p = this.params;
    for (const pair of event.pairs) {
      for (const [part, other] of [[pair.bodyA, pair.bodyB], [pair.bodyB, pair.bodyA]]) {
        const body = part.parent;
        if (!body.plugin.kind || !other.isStatic) continue;
        const point = toWorld(pair.collision.supports.find(Boolean) || body.position, p);
        const hit = { t: this.cycle.now, id: body.plugin.id, kind: body.plugin.kind,
          surface: other.plugin.surface, point, dir: this.gravityDirection };
        this.metrics.collisions.push(hit);
        if (body.plugin.kind === 'cup' && body.plugin.volume > 0 && this.gravityDirection) {
          const collision = pair.collision;
          const a = this.M.Body.getVelocity(collision.bodyA.parent), b = this.M.Body.getVelocity(collision.bodyB.parent);
          // Matter's normal points from bodyB to bodyA; only closing velocity counts.
          const speed = Math.max(0, (b.x - a.x) * collision.normal.x + (b.y - a.y) * collision.normal.y)
            * p.millisecondsPerSecond / this.M.Body._baseDelta / p.pixelsPerMetre;
          hit.normalSpeedMps = speed;
          if (speed > p.spillSpeed + p.epsilon) {
            this.pour(other.plugin.surface, point, body.plugin.volume); body.plugin.volume = 0;
          }
        }
      }
    }
  }
  draw() {
    const p = this.params, g = this.objectGraphics; g.clear();
    this.decals.draw(this.liquid);
    for (const body of this.objects.bodies) {
      g.fillStyle(p.colors[body.plugin.kind]);
      for (const part of body.parts.length > 1 ? body.parts.slice(1) : body.parts) g.fillPoints(part.vertices, true);
      if (p.showCoated && this.coat.coated.has(body.plugin.id)) {
        g.lineStyle(p.view.coatWidth, p.colors.coated).strokeRect(body.bounds.min.x, body.bounds.min.y,
          body.bounds.max.x - body.bounds.min.x, body.bounds.max.y - body.bounds.min.y);
      }
    }
    const bolt = toScreen({ x: p.bolt.x + this.bolt.s, y: p.bolt.y }, p);
    g.fillStyle(p.colors.bolt).fillRect(bolt.x - p.bolt.width * p.pixelsPerMetre / 2,
      bolt.y - p.bolt.height * p.pixelsPerMetre / 2, p.bolt.width * p.pixelsPerMetre, p.bolt.height * p.pixelsPerMetre);
    if (this.cycle.state.includes('WARN') && Math.floor(this.cycle.now / p.view.blinkPeriod) % 2 === 0)
      g.lineStyle(p.view.coatWidth, p.colors.warning).strokeRect(p.canvas.origin.x, p.canvas.origin.y - p.room.height * p.pixelsPerMetre,
        p.room.width * p.pixelsPerMetre, p.room.height * p.pixelsPerMetre);
    if (p.showGravity) {
      const from = toScreen({ x: p.room.width / 2, y: p.room.height / 2 }, p), unit = this.cycle.gravity();
      const to = toScreen({ x: p.room.width / 2 + unit.x * p.view.vectorLength, y: p.room.height / 2 + unit.y * p.view.vectorLength }, p);
      g.lineStyle(p.view.coatWidth, p.colors.warning).lineBetween(from.x, from.y, to.x, to.y);
    }
  }
  refresh() {
    const c = this.cycle, p = this.params, s = c.scheduleEntry;
    document.querySelector('#status').textContent = `${clockText(c.now)} · ${c.state} · ${c.direction || 'ZERO G'} · ×${p.timeScale}\n`
      + `Cửa: ${c.door.isOpen ? 'mở' : 'đóng'} / ${c.door.locked ? 'khóa hệ thống' : 'hết khóa hệ thống'} · Chốt: ${this.bolt.s.toFixed(3)} m\n`
      + `Lịch hiện tại: ${s ? `${clockText(s.atSeconds)} — ${s.dir} — ${s.duration / p.secondsPerMinute}'` : 'chưa đặt'}\n`
      + `Gel: ${this.objects.bodies.filter(b => b.plugin.kind === 'gel').length} · coated: ${this.coat.coated.size}`;
    document.querySelector('#journal').textContent = c.log.map(entry => `${clockText(entry.t)} ${entry.event} (${entry.origin})`).join('\n');
    document.querySelector('#messages').textContent = [...c.messages, ...this.messages].slice(-p.ui.messageLimit).join('\n');
    document.querySelector('#enter').disabled = c.door.locked;
    document.querySelector('#leave').disabled = c.door.locked;
  }
  update() {
    // Giới hạn bước thời gian: tab/iframe ẩn rồi hiện lại không được dồn hàng phút vào một frame
    const now = performance.now(), delta = Math.min((now - this.lastFrame) / this.params.millisecondsPerSecond, this.params.view.maxFrameDelta);
    this.lastFrame = now;
    if (!this.paused) {
      this.frameSamples.push({ real: now, delta, stepsBefore: this.metrics.substeps });
      this.step(delta * Number(this.params.timeScale));
    }
    this.draw();
    if (now - this.guiTime >= this.params.ui.refreshInterval * this.params.millisecondsPerSecond) { this.refresh(); this.guiTime = now; }
  }
  snapshot() {
    return { now: this.cycle.now, state: this.cycle.state, dir: this.cycle.direction, door: { ...this.cycle.door }, bolt: this.bolt.s,
      objects: this.objects.snapshot().map(o => ({ ...o, coatedAt: this.coat.coated.get(o.id) ?? null })),
      decals: structuredClone(this.liquid.decals), log: structuredClone(this.cycle.log), messages: [...this.cycle.messages, ...this.messages],
      hallway: { inside: this.hallway.inside, visible: this.hallway.windowCamera.visible, zoom: this.hallway.windowCamera.zoom },
      transitions: [...this.metrics.transitions] };
  }
}

export function boot(Scene = ProtoScene, extra = {}) { return new Phaser.Game({
  type: Phaser.CANVAS, parent: 'canvas', width: PARAMS.canvas.width, height: PARAMS.canvas.height,
  backgroundColor: PARAMS.colors.background, banner: false, audio: { noAudio: true },
  physics: { default: 'matter', matter: { autoUpdate: false, enableSleeping: true } }, scene: Scene,
  ...extra,
}); }
if (!document.documentElement.hasAttribute('data-sandbox')) boot();
