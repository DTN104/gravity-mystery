import { toWorld } from '../src/world/room.js';

while (!window.sandbox) await new Promise(resolve => setTimeout(resolve, 20));
const a = window.sandbox; a.paused = true; a.params.ruleAutoOpen = false; a.params.thuDialogue = false;
for (const dialog of document.querySelectorAll('dialog')) if (dialog.open) dialog.close();
a.reset();
const until = predicate => {
  const end = a.cycle.now + a.params.durationMax;
  while (!predicate() && a.cycle.now < end) a.step(a.params.physicsStep);
  if (!predicate()) throw new Error('Timeout');
};
const measure = () => {
  const objects = a.snapshot().objects, gels = objects.filter(o => o.kind === 'gel');
  const chunks = objects.filter(o => o.kind === 'mannequin').map(o => ({
    segment: o.segment, mass: o.mass, x: o.x, y: o.y, bounds: o.bounds,
    verticalDegrees: Math.acos(Math.min(1, Math.abs(Math.cos(o.angle)))) * 180 / Math.PI,
    eastEdgeDistanceM: Math.abs(a.params.room.width - o.bounds.max.x),
  }));
  const m = a.objects.mannequin;
  return { chunks, head: toWorld(m.head.position, a.params), gelCount: gels.length,
    gelOutsideStrip: gels.filter(g => a.params.room.width - g.x > 1).length,
    farthestGelFromEastM: a.params.room.width - Math.min(...gels.map(g => g.x)),
    mannequinTableContacts: a.metrics.collisions.filter(h => h.kind === 'mannequin' && h.surface === 'TABLE').length };
};
const initial = measure();
a.start('EAST', a.params.durationMin); until(() => a.cycle.state === 'ACTIVE');
const activeAt = a.cycle.now; a.step(3);
const result = { id: 'T16', hinge: a.params.mannequin.hinge, pose: a.params.mannequinPose, initial,
  activeSeconds: a.cycle.now - activeAt, active: measure() };
result.activePass = !result.hinge && result.pose === 'standing' && result.active.chunks.length === 1
  && result.active.chunks.some(c => c.segment === 'torso' && c.verticalDegrees < 30 && c.eastEdgeDistanceM <= 0.1)
  && result.active.mannequinTableContacts === 0;
const render = () => {
  a.draw(); a.refresh(); document.querySelector('#test-result').textContent = JSON.stringify(result, null, 2);
};
render();
document.querySelector('#return-test').onclick = () => {
  until(() => a.cycle.state === 'IDLE'); a.step(8); result.return = measure();
  result.returnPass = result.return.gelCount === a.params.gelCount && result.return.gelOutsideStrip <= 6;
  result.pass = result.activePass && result.returnPass; render();
};
