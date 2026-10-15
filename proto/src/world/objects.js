import { toScreen, toWorld } from './room.js';
import { Mannequin } from './mannequin.js';

export class Objects {
  constructor(scene, params, now) {
    this.scene = scene; this.p = params; this.M = Phaser.Physics.Matter.Matter;
    this.bodies = []; this.serial = 0; this.anchorConstraint = null;
    for (const kind of ['cup', 'pen', 'book', 'mannequin']) this.add(kind, now);
    const tray = params.tray, gel = params.gel;
    for (let i = 0; i < params.gelCount; i++) {
      const x = tray.left + gel.radius * (2 * (i % tray.columns) + 1);
      const y = tray.bottom + tray.thickness / 2 + gel.radius * (2 * Math.floor(i / tray.columns) + 1);
      this.add('gel', now, { x, y });
    }
  }
  add(kind, now, position = this.p[kind]) {
    if (kind === 'mannequin') {
      this.mannequin = new Mannequin(this.scene, this.p, now, () => `mannequin-${++this.serial}`);
      this.bodies.push(...this.mannequin.bodies); return this.mannequin.torso;
    }
    const p = this.p, M = this.M, config = p[kind], point = toScreen(position, p);
    const c = p.collisionCategories;
    const options = { friction: config.friction, restitution: config.bounce, frictionAir: p.airFriction,
      sleepThreshold: p.sleepThreshold, label: kind,
      collisionFilter: { category: kind === 'mannequin' ? c.mannequin : c.loose,
        mask: c.world | c.loose | c.mannequin | (kind === 'mannequin' ? 0 : c.table) } };
    let body;
    if (kind === 'gel') body = M.Bodies.circle(point.x, point.y, config.radius * p.pixelsPerMetre, options);
    else body = M.Bodies.rectangle(point.x, point.y, config.width * p.pixelsPerMetre, config.height * p.pixelsPerMetre, options);
    M.Body.setMass(body, config.mass);
    body.plugin = { kind, id: `${kind}-${++this.serial}`, bornAt: now, volume: kind === 'cup' ? p.waterVolume : 0 };
    for (const part of body.parts) part.plugin = body.plugin;
    M.World.add(this.scene.matter.world.localWorld, body); this.bodies.push(body);
    return body;
  }
  anchor(enabled, body = this.mannequin.torso, selectedRail) {
    const p = this.p, M = this.M;
    if (this.anchorConstraint) M.World.remove(this.scene.matter.world.localWorld, this.anchorConstraint);
    this.anchorConstraint = null;
    if (enabled) {
      const position = toWorld(body.position, p);
      const rail = selectedRail || p.handrails.reduce((a, b) => Math.hypot(a.x - position.x, a.y - position.y) < Math.hypot(b.x - position.x, b.y - position.y) ? a : b);
      this.anchorConstraint = M.Constraint.create({ pointA: toScreen(rail, p), bodyB: body, stiffness: p.anchorStiffness });
      M.World.add(this.scene.matter.world.localWorld, this.anchorConstraint);
    }
    p.mannequinAnchored = enabled;
  }
  snapshot() {
    const p = this.p, M = this.M;
    return this.bodies.map(body => {
      const position = toWorld(body.position, p);
      const a = toWorld(body.bounds.min, p), b = toWorld(body.bounds.max, p);
      const velocity = M.Body.getVelocity(body);
      const baseSeconds = M.Body._baseDelta / p.millisecondsPerSecond;
      const unit = toScreen({ x: 1, y: 1 }, p), origin = toScreen({ x: 0, y: 0 }, p);
      const vx = velocity.x / (unit.x - origin.x) / baseSeconds, vy = velocity.y / (unit.y - origin.y) / baseSeconds;
      return { ...body.plugin, ...position, vx, vy, speed: body.isSleeping ? 0 : Math.hypot(vx, vy),
        angle: body.angle, sleeping: body.isSleeping, mass: body.mass,
        bounds: { min: { x: Math.min(a.x, b.x), y: Math.min(a.y, b.y) }, max: { x: Math.max(a.x, b.x), y: Math.max(a.y, b.y) } } };
    });
  }
}
