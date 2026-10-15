export class Coat {
  constructor(params) { this.p = params; this.gels = new Map(); this.coated = new Map(); }
  step(t, objects) {
    const gel = objects.filter(o => o.kind === 'gel');
    for (const particle of gel) {
      const state = this.gels.get(particle.id) || { stillSince: null, settledAt: null, firstSettledAt: null };
      if (particle.speed >= this.p.gelStopSpeed) { state.stillSince = null; state.settledAt = null; }
      else {
        state.stillSince ??= t;
        if (state.settledAt === null && t - state.stillSince >= this.p.gelStopTime - this.p.epsilon) {
          state.settledAt = t; state.firstSettledAt ??= t;
        }
      }
      this.gels.set(particle.id, state);
    }
    for (const object of objects.filter(o => o.kind !== 'gel')) {
      if (this.coated.has(object.id)) continue;
      const count = gel.filter(particle => {
        const state = this.gels.get(particle.id);
        return state.settledAt !== null && state.firstSettledAt > object.bornAt
          && Math.hypot(particle.x - object.x, particle.y - object.y) <= this.p.coatRadius;
      }).length;
      if (count >= this.p.gelCoatMin) this.coated.set(object.id, t);
    }
  }
}
