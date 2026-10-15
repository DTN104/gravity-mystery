import assert from 'node:assert/strict';
import { PARAMS, DIRECTIONS } from '../src/params.js';
import { Cycle } from '../src/rules/cycle.js';
import { Bolt } from '../src/rules/bolt.js';
import { Liquid } from '../src/rules/liquid.js';
import { Coat } from '../src/rules/coat.js';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { Detector, RULES } from '../src/game/detector.js';

const p = structuredClone(PARAMS);
assert.deepEqual([p.g, p.boltMass, p.mannequinMass, p.boltDetent], [9.81, 1.2, 70, 6]);
assert.deepEqual(['cup', 'pen', 'book', 'gel'].map(k => p[k].mass), [0.3, 0.02, 0.3, 0.005]);
assert.deepEqual(['room', 'cup', 'pen', 'book', 'gel', 'mannequin'].map(k => p[k].friction), [0.6, 0.4, 0.4, 0.7, 0.3, 0.8]);
assert.deepEqual([p.tray.right, p.zeroGNoise, p.windowZoom, p.mannequinPose, p.mannequin.pose, p.mannequin.hinge, p.gelCoatMin, p.coatRadius], [0.6, 0.01, 9, 'lying', 'standing', false, 1, 0.25]);
assert.deepEqual([p.mannequin.standingX, p.mannequin.standingY, p.mannequin.width, p.mannequin.height, p.mannequin.headRadius], [2.5, 0.85, 0.4, 1.7, 0.1]);
assert.deepEqual(['cup', 'pen', 'book', 'mannequin'].map(k => [p[k].x, p[k].y]), [[1.3, 0.95], [1.7, 0.92], [1.5, 0.92], [1.9, 0.2]]);
const c = new Cycle(p);
for (const [dir, duration] of [['EAST', 59], ['EAST', 1801], ['SECRET', 60], ['EAST', NaN]]) assert.equal(c.start(dir, duration), false);
assert.equal(c.schedule(p.clockStart, 'EAST', 60), false);
assert.throws(() => c.step(-1), RangeError);
c.setDoorOpen(true); assert.equal(c.start('EAST', 60), false);
c.setDoorOpen(false); assert.equal(c.start('EAST', 60), true);
assert.equal(c.door.locked, true); assert.equal(c.log.length, 0, 'MANUAL_START must wait until T0');
c.step(10); assert.equal(c.state, 'ZERO_G');
assert.deepEqual(c.log[0], { t: p.clockStart + 10, event: 'MANUAL_START', origin: 'local' });
c.step(3); assert.equal(c.state, 'ACTIVE');
c.step(44); assert.equal(c.state, 'WARN_RETURN');
c.step(10); assert.equal(c.state, 'ZERO_G'); c.step(3); assert.equal(c.state, 'IDLE');
assert.equal(c.log.at(-1).t, p.clockStart + p.warnTime + 60);
assert.equal(c.canEnter(), false); c.step(3); assert.equal(c.canEnter(), true);
assert.equal(c.start('EAST', 60), false); c.step(57); assert.equal(c.start('WEST', 60), true);
for (const record of c.log) assert.deepEqual(Object.keys(record), ['t', 'event', 'origin']);
const short = new Cycle({ ...p, warnTime: 60 }); assert.equal(short.start('EAST', 60), false);

const scheduled = new Cycle(structuredClone(p));
assert.equal(scheduled.schedule(22 * p.secondsPerHour, 'EAST', 900), true);
scheduled.step(290); assert.equal(scheduled.state, 'WARN'); assert.equal(scheduled.door.locked, true);
scheduled.step(10); assert.equal(scheduled.state, 'ZERO_G'); assert.equal(scheduled.log.at(-1).t, 79200);
scheduled.step(3); assert.equal(scheduled.state, 'ACTIVE');
scheduled.step(884); assert.equal(scheduled.now, 80087); assert.equal(scheduled.state, 'WARN_RETURN');
scheduled.step(10); assert.equal(scheduled.now, 80097); assert.equal(scheduled.state, 'ZERO_G');
scheduled.step(3); assert.equal(scheduled.state, 'IDLE');
assert.deepEqual(scheduled.log.at(-1), { t: 80100, event: 'RETURN', origin: 'local' });
scheduled.step(2.99); assert.equal(scheduled.door.locked, true);
scheduled.step(0.01); assert.equal(scheduled.now, 80103); assert.equal(scheduled.door.locked, false);
const coarse = new Cycle(structuredClone(p)); coarse.schedule(79200, 'EAST', 900); coarse.step(1203);
assert.deepEqual(coarse.log, scheduled.log, 'Schedule/log must be independent of timestep partition');
assert.deepEqual(coarse.door, scheduled.door);

const bolt = new Bolt(p); for (let i = 0; i < 120; i++) bolt.step(p.physicsStep, DIRECTIONS.EAST);
assert.equal(bolt.s, p.boltTravel);
for (const dir of [DIRECTIONS.DOWN, DIRECTIONS.UP]) { bolt.step(1, dir); assert.equal(bolt.s, p.boltTravel); }
for (let i = 0; i < 120; i++) bolt.step(p.physicsStep, DIRECTIONS.WEST); assert.equal(bolt.s, 0);
const goodBolt = new Bolt({ ...p, boltDetent: 12 });
for (const dir of Object.values(DIRECTIONS)) goodBolt.step(1, dir); assert.equal(goodBolt.s, 0);

const liquid = new Liquid(p); liquid.spill('FLOOR', { x: 1.5, y: 0 }, 0.2, p.colors.water, 0, 'DOWN');
liquid.wipe({ x: 1.5, y: 0 }, 0); liquid.spill('FLOOR', { x: 1.5, y: 0 }, 0.2, p.colors.water, 0, 'DOWN');
liquid.changeDirection('EAST', 0); assert.deepEqual(liquid.decals.map(d => d.type), ['WIPE', 'POOL', 'STREAK']);
const dry = new Liquid({ ...p, dryTime: 30 }); dry.spill('FLOOR', { x: 1.5, y: 0 }, 0.2, p.colors.water, 0, 'DOWN');
dry.step(60); dry.changeDirection('EAST', 60); assert.equal(dry.decals.length, 1);
for (const [dir, floor] of [['DOWN', 'FLOOR'], ['EAST', 'EAST']]) {
  const shelf = new Liquid(p);
  shelf.spill('SHELF', { x: 3.8, y: 0.4 }, 0.2, p.colors.water, 0, dir);
  assert.equal(shelf.decals[0].type, 'POOL'); assert.equal(shelf.decals[0].surface, 'SHELF');
  assert.equal(shelf.decals[0].floor, floor);
  if (dir === 'EAST') { shelf.changeDirection('DOWN', 3); assert.equal(shelf.decals[1].end.y, 0); }
}
for (const surface of ['TABLE', 'TRAY', 'EAST']) {
  const wall = new Liquid(p); wall.spill(surface, { x: 3.8, y: 0.9 }, 0.2, p.colors.water, 0, 'DOWN');
  assert.equal(wall.decals[0].type, surface === 'TABLE' ? 'POOL' : 'SPLASH');
}
assert.equal(liquid.spill('UNKNOWN', { x: 0, y: 0 }, 0.2, 0, 0, 'DOWN'), null);

const particles = Array.from({ length: p.gelCoatMin }, (_, id) => ({ id, kind: 'gel', x: p.coatRadius, y: 0, speed: 0 }));
const pen = { id: 'old', kind: 'pen', x: 0, y: 0, bornAt: 0 };
const coat = new Coat(p); coat.step(0, [...particles, pen]); coat.step(1.99, [...particles, pen]);
assert.equal(coat.coated.has('old'), false);
coat.step(2, [...particles, pen]); assert.equal(coat.coated.get('old'), 2, 'Radius boundary is inclusive, one settled particle coats');
const late = { ...pen, id: 'new', bornAt: 3 }, sameTime = { ...pen, id: 'same-time', bornAt: 2 };
coat.step(3, [...particles, late, sameTime]); assert.equal(coat.coated.size, 1, 'firstSettledAt must be strictly after bornAt');
coat.step(4, [...particles.map(g => ({ ...g, speed: p.gelStopSpeed })), late]);
assert.equal([...coat.gels.values()].filter(g => g.settledAt !== null).length, 0, 'Speed boundary is not stopped');
coat.step(5, [...particles, late]); coat.step(6.99, [...particles, late]);
assert.equal([...coat.gels.values()].filter(g => g.settledAt !== null).length, 0, 'Continuous stop time starts at first stopped sample');
coat.step(7, [...particles, late]); assert.equal(coat.coated.has('new'), false);
coat.step(10, [...particles, late]); assert.equal(coat.coated.has('new'), false, 'Never forget first settle when gel moves or direction changes');
for (const nearby of [particles.slice(0, p.gelCoatMin - 1), particles.map(g => ({ ...g, x: p.coatRadius + p.epsilon }))]) {
  const boundary = new Coat(p); boundary.step(0, [...nearby, pen]); boundary.step(2, [...nearby, pen]);
  assert.equal(boundary.coated.has('old'), false, 'No settled gel or distance >radius must not coat');
}

const paramsSource = await readFile(new URL('../src/params.js', import.meta.url), 'utf8');
assert.doesNotMatch(paramsSource, /\bimport\b|\bdocument\b|\bwindow\b\.|createPanel|https:/);
for (const name of ['cycle', 'bolt', 'liquid', 'coat']) {
  const source = await readFile(new URL(`../src/rules/${name}.js`, import.meta.url), 'utf8');
  assert.doesNotMatch(source, /Phaser|Matter|\bimport\s*\(/);
  for (const match of source.matchAll(/\bfrom\s*['"]([^'"]+)['"]/g)) assert.equal(match[1], '../params.js');
}
console.log('PASS: sandbox v0.3 defaults/positions/materials, pure imports, validation, cycle milestones, journal, bolt, SHELF/TRAY, radius/stop/birth coat boundaries');

assert.deepEqual([p.mannequin.segments.torso.mass, p.mannequin.segments.legs.mass, p.mannequin.hipDamping], [45, 25, 0]);
const multi = new Cycle(structuredClone(p));
const firstAt = p.clockStart + 5 * p.secondsPerMinute, secondAt = firstAt + 3 * p.secondsPerMinute;
const thirdAt = secondAt + 3 * p.secondsPerMinute;
assert.equal(multi.schedule([{ atSeconds: secondAt, dir: 'WEST', duration: 60 }, { atSeconds: firstAt, dir: 'EAST', duration: 60 }]), true);
assert.equal(multi.log.filter(e => e.event === 'SCHEDULE_EDIT').length, 1);
assert.deepEqual(multi.scheduleEntries.map(e => e.atSeconds), [firstAt, secondAt]);
assert.equal(multi.schedule(thirdAt, 'UP', 60), true);
assert.equal(multi.schedule(thirdAt + 3 * p.secondsPerMinute, 'DOWN', 60), false);
const retained = structuredClone(multi.scheduleEntries);
assert.equal(multi.schedule([null]), false);
assert.equal(multi.schedule([{ atSeconds: firstAt, dir: 'EAST', duration: 60 }, { atSeconds: firstAt + 65, dir: 'WEST', duration: 60 }]), false);
assert.deepEqual(multi.scheduleEntries, retained, 'Rejected edit must keep old schedule');
const commands = multi.step(thirdAt + 60 + p.doorUnlockDelay - multi.now);
assert.deepEqual(commands.filter(c => c.type === 'GRAVITY').map(c => c.dir), ['EAST', 'DOWN', 'WEST', 'DOWN', 'UP', 'DOWN']);
assert.deepEqual(multi.log.filter(e => e.event === 'SCHEDULED_START').map(e => e.t), [firstAt, secondAt, thirdAt]);
const editsBeforeDelete = multi.log.length; assert.equal(multi.removeSchedule(0), true);
assert.equal(multi.log.length, editsBeforeDelete + 1); assert.equal(multi.log.at(-1).event, 'SCHEDULE_EDIT');
assert.equal(multi.removeSchedule(-1), false);
const master = new Cycle(structuredClone(p));
assert.equal(master.start('WEST', 60, { origin: 'master', user: 'LAM' }), true); master.step(70);
assert.deepEqual(master.log.map(e => [e.event, e.origin, e.user]), [['MANUAL_START', 'master', 'LAM'], ['RETURN', 'master', 'LAM']]);
assert(master.log.every(e => !Object.hasOwn(e, 'dir')));

const base = { now: 0, state: 'IDLE', dir: 'DOWN', bolt: 0, objects: [], decals: [], log: [], hallway: { inside: true, visible: false }, overlayOpen: false };
const detectorCounts = {};
const checkOnce = (id, snapshots) => {
  const detector = new Detector(p); const fired = snapshots.flatMap(s => detector.observe(s));
  assert.deepEqual(fired, [id]); assert.deepEqual(detector.observe(snapshots.at(-1)), []);
  detectorCounts[id] = detector.events.filter(e => e.rule === id).length;
  assert.equal(detector.answer(id, 1, 10), false); assert.equal(detector.unlocked.size, 0);
  assert.equal(detector.answer(id, 0, 11), true); assert.equal(detector.answer(id, 0, 12), true);
  assert.deepEqual(detector.unlockLog, [{ rule: id, t: 11, wrongAttempts: 1 }]);
};
const wallPool = new Liquid(p); wallPool.spill('EAST', { x: 4, y: 0.9 }, 0.2, p.colors.water, 0, 'EAST'); wallPool.changeDirection('DOWN', 70);
checkOnce('R1', [{ ...base, now: 70, decals: wallPool.decals, log: [{ t: 70, event: 'RETURN', origin: 'local' }] }]);
checkOnce('R1', [{ ...base, now: 70 + p.physicsStep, decals: wallPool.decals.map(d => d.type === 'STREAK' ? { ...d, t0: 70 + p.physicsStep } : d),
  log: [{ t: 70, event: 'RETURN', origin: 'local' }] }]);
const floorPool = new Liquid(p); floorPool.spill('FLOOR', { x: 1.5, y: 0 }, 0.2, p.colors.water, 0, 'DOWN'); floorPool.changeDirection('EAST', 13);
checkOnce('R2', [{ ...base, now: 13, state: 'ACTIVE', dir: 'EAST', decals: floorPool.decals }]);
checkOnce('R3', [{ ...base, hallway: { inside: false, visible: true } },
  { ...base, now: 1, state: 'ACTIVE', dir: 'EAST', bolt: p.boltTravel, hallway: { inside: false, visible: true } }]);
const vertical = { kind: 'mannequin', segment: 'torso', angle: 0, bounds: { min: { x: 3.6, y: 0 }, max: { x: 4, y: 1.8 } } };
const looking = { ...base, state: 'ACTIVE', dir: 'EAST', objects: [vertical], hallway: { inside: false, visible: true } };
checkOnce('R4', [{ ...looking, now: 0 }, { ...looking, now: 1.99 }, { ...looking, now: 2 }]);
const legOnly = new Detector(p), legView = { ...looking, objects: [{ ...vertical, segment: 'legs' }, { ...vertical, angle: Math.PI / 2 }] };
assert.deepEqual(legOnly.observe({ ...legView, now: 0 }), []);
assert.deepEqual(legOnly.observe({ ...legView, now: 4 }), [], 'R4 must use the torso axis, not the legs');
const gelSnapshots = particles.map(g => ({ ...g, x: 4, y: 0 }));
const clean = { id: 'fresh', kind: 'pen', x: 3.9, y: 0, bornAt: 3, coatedAt: null };
const gelStates = gelSnapshots.map(g => ({ id: g.id, settledAt: 2, firstSettledAt: 2 }));
const lateDrop = { ...base, now: 4, objects: [...gelSnapshots, { ...pen, coatedAt: 2 }, clean], settledGels: gelStates, drops: [{ id: clean.id, t: 3 }] };
checkOnce('R5', [lateDrop]);
const falseCases = [
  { ...base, now: 70, decals: wallPool.decals, log: [] },
  { ...base, now: 13, state: 'ACTIVE', dir: 'EAST', decals: floorPool.decals.map(d => ({ ...d, wetness: 0 })) },
  { ...base, state: 'ACTIVE', dir: 'EAST', bolt: p.boltTravel },
  { ...looking, now: 3, overlayOpen: true },
  { ...looking, now: 3, objects: [{ ...vertical, angle: Math.PI / 2 }] },
  { ...lateDrop, objects: lateDrop.objects.map(o => o.id === 'fresh' ? { ...o, x: 1 } : o) },
  { ...lateDrop, objects: lateDrop.objects.filter(o => o.id !== 'old') },
  { ...lateDrop, settledGels: gelStates.slice(0, p.gelCoatMin - 1) },
  { ...lateDrop, drops: [{ id: clean.id, t: 1 }] },
];
for (const wrongCase of falseCases) {
  const detector = new Detector(p); detector.observe(base);
  assert.deepEqual(detector.observe(wrongCase), [], 'Detector fired for a negative control');
}
assert.equal(RULES.length, 5);
const output = [
  { id: 'T17', status: 'PASS', measured: { maximum: p.scheduleMax, order: multi.log.filter(e => e.event === 'SCHEDULED_START').map(e => e.t),
    gravityOrder: commands.filter(c => c.type === 'GRAVITY').map(c => c.dir), scheduleEdits: multi.log.filter(e => e.event === 'SCHEDULE_EDIT').length,
    fourthRejected: true, overlapWarnRejected: true, rejectedEditPreserved: true } },
  { id: 'T19', status: 'PASS', measured: { detectorCounts, negativeControls: falseCases.length + 1, torsoOnlyR4: true, wrongAttemptsPerRule: 1, unlockRecordsPerRule: 1 } },
];
const outputDir = new URL('./sandbox-v0.3/', import.meta.url); await mkdir(outputDir, { recursive: true });
await writeFile(new URL('results-pure.json', outputDir), JSON.stringify(output, null, 2) + '\n');
console.log('PASS: T17 multi-schedule + master schema; T19 R1–R5 once, negative controls and quiz retry');
