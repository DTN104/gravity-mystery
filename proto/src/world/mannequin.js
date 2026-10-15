import { toScreen } from './room.js';

export class Mannequin {
  constructor(scene, params, now, nextId) {
    this.p = params; this.M = Phaser.Physics.Matter.Matter; this.world = scene.matter.world.localWorld;
    const p = params, m = p.mannequin, M = this.M, scale = p.pixelsPerMetre, c = p.collisionCategories;
    const options = { friction: m.friction, restitution: m.bounce, frictionAir: p.airFriction,
      sleepThreshold: p.sleepThreshold, label: 'mannequin',
      collisionFilter: { group: M.Body.nextGroup(true), category: c.mannequin, mask: c.world | c.loose | c.mannequin } };
    if (!m.hinge) {
      const point = toScreen(p.mannequinPose === 'standing' ? { x: m.standingX, y: m.standingY } : m, p);
      const trunk = M.Bodies.rectangle(point.x, point.y, m.width * scale, m.height * scale, options);
      this.head = M.Bodies.circle(point.x, point.y - (m.height / 2 + m.headRadius) * scale, m.headRadius * scale, options);
      this.torso = M.Body.create({ ...options, parts: [trunk, this.head] });
      if (p.mannequinPose === 'lying') M.Body.setAngle(this.torso, m.lyingAngle);
      M.Body.setPosition(this.torso, point);
      this.torso.plugin = { kind: 'mannequin', segment: 'torso', id: nextId(), bornAt: now, volume: 0 };
      for (const part of this.torso.parts) part.plugin = this.torso.plugin;
      this.bodies = [this.torso]; this.hinge = null;
      this.setMass(p.mannequinMass); M.World.add(this.world, this.bodies); return;
    }
    const hip = toScreen(p.mannequinPose === 'standing'
      ? { x: m.standingX, y: m.segments.legs.h } : { x: m.x, y: m.y }, p);
    const t = m.segments.torso, l = m.segments.legs;
    const trunk = M.Bodies.rectangle(hip.x, hip.y - t.h * scale / 2, t.w * scale, t.h * scale, options);
    this.head = M.Bodies.circle(hip.x, hip.y - (t.h + m.headRadius) * scale, m.headRadius * scale, options);
    this.torso = M.Body.create({ ...options, parts: [trunk, this.head] });
    this.legs = M.Bodies.rectangle(hip.x, hip.y + l.h * scale / 2, l.w * scale, l.h * scale, options);
    this.bodies = [this.torso, this.legs];
    for (const [index, body] of this.bodies.entries()) {
      const segment = index === 0 ? 'torso' : 'legs';
      body.plugin = { kind: 'mannequin', segment, id: nextId(), bornAt: now, volume: 0 };
      for (const part of body.parts) part.plugin = body.plugin;
      if (p.mannequinPose === 'lying') M.Body.rotate(body, m.lyingAngle, hip);
    }
    this.setMass(p.mannequinMass);
    this.hinge = M.Constraint.create({ bodyA: this.torso, bodyB: this.legs,
      pointA: { x: hip.x - this.torso.position.x, y: hip.y - this.torso.position.y },
      pointB: { x: hip.x - this.legs.position.x, y: hip.y - this.legs.position.y },
      length: m.hipLength * scale, stiffness: m.hipStiffness, damping: m.hipDamping });
    M.World.add(this.world, [...this.bodies, this.hinge]);
  }
  setMass(total) {
    if (!this.legs) { this.M.Body.setMass(this.torso, total); return; }
    const s = this.p.mannequin.segments, sum = s.torso.mass + s.legs.mass;
    this.M.Body.setMass(this.torso, total * s.torso.mass / sum);
    this.M.Body.setMass(this.legs, total * s.legs.mass / sum);
  }
}
