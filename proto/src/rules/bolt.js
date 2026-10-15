export class Bolt {
  constructor(params) { this.p = params; this.s = 0; this.velocity = 0; }
  set(s) {
    if (!Number.isFinite(s)) return false;
    this.s = Math.max(0, Math.min(this.p.boltTravel, s)); this.velocity = 0; return true;
  }
  step(dt, gravityUnit) {
    const force = this.p.boltMass * this.p.g * gravityUnit.x;
    if (Math.abs(force) <= this.p.boltDetent) { this.velocity = 0; return null; }
    const acceleration = (force - Math.sign(force) * this.p.boltDetent) / this.p.boltMass;
    const before = this.s;
    this.s += this.velocity * dt + acceleration * dt * dt / 2;
    this.velocity += acceleration * dt;
    this.s = Math.max(0, Math.min(this.p.boltTravel, this.s));
    if (this.s === 0 || this.s === this.p.boltTravel) this.velocity = 0;
    if (before !== this.s && this.s === 0) return 'Chốt: chạm vị trí mở';
    if (before !== this.s && this.s === this.p.boltTravel) return 'Chốt: chạm vị trí đóng';
    return null;
  }
}
