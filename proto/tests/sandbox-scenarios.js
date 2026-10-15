import { toWorld, toScreen } from '../src/world/room.js';
while (!window.sandbox) await new Promise(resolve => setTimeout(resolve, 20));
const a = window.sandbox, results = []; a.paused = true; a.params.ruleAutoOpen = false; a.params.thuDialogue = false;
for (const dialog of document.querySelectorAll('dialog')) if (dialog.open) dialog.close();
const assert = (condition, text) => { if (!condition) throw new Error(text); };
const until = condition => { const end = a.cycle.now + a.params.durationMax; while (!condition() && a.cycle.now < end) a.step(a.params.physicsStep); assert(condition(), 'Timeout'); };
const test = (id, run) => { const measured = {}; try { run(measured); results.push({ id, status: 'PASS', measured }); } catch (e) { results.push({ id, status: 'FAIL', measured, reason: e.message }); } };
test('MANNEQUIN-MODES', m => {
  const defaults = structuredClone(a.params); m.modes = [];
  try { for (const hinge of [false, true]) for (const pose of ['lying', 'standing']) {
    a.params.mannequin.hinge = hinge; a.params.mannequinPose = pose; a.reset();
    const man = a.objects.mannequin, bodies = man.bodies;
    const entry = { hinge, pose, bodies: bodies.length, mass: bodies.reduce((total, b) => total + b.mass, 0),
      constraint: !!man.hinge, centre: toWorld(man.torso.position, a.params),
      tableExcluded: bodies.every(b => b.parts.every(part => !(part.collisionFilter.mask & a.params.collisionCategories.table))) };
    m.modes.push(entry);
    assert(bodies.length === (hinge ? 2 : 1) && entry.constraint === hinge && entry.mass === a.params.mannequinMass
      && entry.tableExcluded, 'Cờ hinge đổi sai cấu trúc / khối lượng / collision filter');
    if (!hinge) {
      const expected = pose === 'standing' ? { x: a.params.mannequin.standingX, y: a.params.mannequin.standingY } : a.params.mannequin;
      assert(Math.hypot(entry.centre.x - expected.x, entry.centre.y - expected.y) <= a.params.epsilon, 'Khối cứng không đúng tâm v0.4');
      a.anchor(true); a.anchor(false); assert(a.objects.anchorConstraint === null, 'Neo khối cứng không tháo được');
    }
    a.step(a.params.physicsStep);
  }
  } finally { Object.assign(a.params, defaults); a.reset(); }
});
test('T17-UI', m => {
  a.reset();
  const first = 21 * a.params.secondsPerHour + 59 * a.params.secondsPerMinute;
  assert(a.schedule(first, 'EAST', a.params.durationMin), 'Lịch 21:59 bị từ chối'); a.hud.panel.refresh();
  const text = () => document.querySelector('#schedule-earliest').textContent;
  m.afterFirst = text(); assert(m.afterFirst.endsWith('22:01:10'), 'Sai mốc sớm nhất sau lịch đầu');
  assert(a.schedule(22 * a.params.secondsPerHour + 2 * a.params.secondsPerMinute, 'WEST', a.params.durationMin), 'Lịch 22:02 bị từ chối');
  a.hud.panel.refresh(); m.afterSecond = text(); assert(m.afterSecond.endsWith('22:04:10'), 'Sai mốc sau lịch thứ hai');
  a.cycle.removeSchedule(1); a.hud.panel.refresh(); m.afterDelete = text();
  assert(m.afterDelete === m.afterFirst, 'Xóa lịch không cập nhật mốc sớm nhất');
});
test('T18', m => {
  a.reset(); assert(a.hud.hallway.leave(), 'Không ra được hành lang'); a.start('EAST', 60);
  until(() => a.cycle.state === 'IDLE'); const returnAt = a.cycle.now; a.step(a.params.doorUnlockDelay);
  m.boltBefore = a.bolt.s; m.entryBefore = a.hud.hallway.enter(); m.message = a.cycle.messages.at(-1);
  const requestedAt = a.cycle.now; m.intercomAccepted = a.hud.hallway.intercom();
  for (const dialog of document.querySelectorAll('dialog')) if (dialog.open) dialog.close();
  until(() => a.cycle.log.some(e => e.event === 'MANUAL_START' && e.origin === 'master'));
  const command = a.cycle.log.find(e => e.event === 'MANUAL_START' && e.origin === 'master');
  m.masterLog = command; m.masterWarnWaitSeconds = command.t - a.params.warnTime - requestedAt;
  until(() => a.cycle.state === 'IDLE'); a.step(a.params.doorUnlockDelay);
  m.boltAfter = a.bolt.s; m.entryAfter = a.hud.hallway.enter(); m.log = a.cycle.log;
  m.firstReturnAt = returnAt;
  assert(!m.entryBefore && m.boltBefore === a.params.boltTravel && m.message.includes('Chốt bên trong'), 'Không chặn cửa bằng chốt');
  assert(m.intercomAccepted && command.user === 'LAM' && m.boltAfter === 0 && m.entryAfter, 'Intercom không mở chốt / thiếu master LAM');
  assert(m.log.every(e => !Object.hasOwn(e, 'dir')), 'Nhật ký có hướng');
});
test('T20', m => {
  m.states = [];
  for (const state of ['WARN', 'ACTIVE']) {
    const positions = [];
    for (const attempt of [false, true]) {
      a.reset(); a.start('EAST', 60); if (state === 'ACTIVE') until(() => a.cycle.state === 'ACTIVE');
      const cup = a.objects.bodies.find(b => b.plugin.kind === 'cup');
      if (attempt) {
        a.mouse.constraint.bodyB = cup; a.mouse.constraint.pointB = { x: 0, y: 0 };
        a.mouse.constraint.pointA = toScreen({ x: 2.9, y: 2.5 }, a.params);
      }
      a.step(0.5); positions.push(toWorld(cup.position, a.params));
      if (attempt) assert(a.mouse.constraint.stiffness === 0 && a.mouse.constraint.bodyB === null, 'Chuột vẫn nối body khi xoay');
    }
    const deltaM = Math.hypot(positions[0].x - positions[1].x, positions[0].y - positions[1].y);
    m.states.push({ state, baseline: positions[0], dragAttempt: positions[1], deltaM });
    assert(deltaM < 1e-6, 'Kéo chuột làm khác quỹ đạo trong chu kỳ');
  }
  a.reset(); m.idleCanInteract = a.canInteract(); assert(m.idleCanInteract, 'IDLE bị khóa chuột');
});
test('T19-engine', m => {
  a.reset(); a.pour('FLOOR', { x: 1.5, y: 0 }, a.params.pourVolume);
  a.hud.hallway.leave(); a.start('EAST', 60); until(() => a.cycle.state === 'ACTIVE'); a.step(4);
  m.afterActive = structuredClone(a.detector.events);
  until(() => a.cycle.state === 'IDLE'); a.step(8);
  m.afterReturn = structuredClone(a.detector.events);
  const objects = a.snapshot().objects, gels = objects.filter(o => o.kind === 'gel');
  const dense = gels.sort((x, y) => gels.filter(g => Math.hypot(g.x - y.x, g.y - y.y) <= a.params.coatRadius).length
    - gels.filter(g => Math.hypot(g.x - x.x, g.y - x.y) <= a.params.coatRadius).length)[0];
  const fresh = a.addObject('pen', { x: dense.x, y: dense.y + a.params.pen.height });
  a.drops.push({ id: fresh.plugin.id, t: a.cycle.now }); a.step(5);
  m.afterDrop = structuredClone(a.detector.events);
  m.coatedObjects = a.snapshot().objects.filter(o => o.kind !== 'gel' && o.coatedAt !== null).map(o => ({ id: o.id, kind: o.kind, coatedAt: o.coatedAt }));
  m.freshCoatedAt = a.coat.coated.get(fresh.plugin.id) ?? null;
  for (const id of ['R1', 'R2', 'R3', 'R5']) assert(m.afterDrop.filter(e => e.rule === id).length === 1, `${id} không phát hiện đúng một lần từ engine thật`);
});
test('TOOLS', m => {
  a.reset(); const bottle = a.bottle, volume = a.params.bottleVolume;
  a.M.Body.setAngle(bottle, a.params.spillAngle - 0.01); a.step(a.params.physicsStep);
  m.belowThresholdL = bottle.plugin.volume;
  a.M.Body.setAngle(bottle, a.params.spillAngle + 0.01); a.step(a.params.physicsStep);
  m.afterTiltL = bottle.plugin.volume; m.bottleStillExists = a.objects.bodies.includes(bottle);
  assert(m.belowThresholdL === volume && m.afterTiltL === 0 && m.bottleStillExists, 'Bình đổ sai ngưỡng hoặc bị xóa');
  a.reset(); a.selectTool('pour'); const shelf = a.params.sandbox.supplyShelf;
  const point = toScreen({ x: (shelf.left + shelf.right) / 2, y: shelf.y }, a.params);
  a.pointerDown({ positionToCamera: () => point });
  m.manualSurface = a.liquid.decals.at(-1).surface; m.afterManualL = a.bottle.plugin.volume;
  assert(m.manualSurface === 'SHELF' && Math.abs(m.afterManualL - (volume - a.params.pourVolume)) < a.params.epsilon, 'Không chọn đúng kệ / trừ sai lượng');
  const refill = toScreen(a.params.sandbox.refill, a.params);
  a.pointerDown({ positionToCamera: () => refill }); m.refilledL = a.bottle.plugin.volume;
  a.start('EAST', 60); m.refillDuringWarn = a.refill();
  assert(m.refilledL === volume && !m.refillDuringWarn, 'Nạp bình sai lượng / vẫn nạp trong WARN');
});
test('REFILL-AFTER-CYCLE', m => {
  m.inputs = [];
  for (const source of ['button', 'shelf']) {
    a.reset(); a.start('EAST', a.params.durationMin);
    until(() => a.cycle.state === 'IDLE'); a.step(8); a.refresh();
    const bottle = a.bottle, id = bottle.plugin.id, journal = JSON.stringify(a.cycle.log);
    const entry = { source, beforeL: bottle.plugin.volume, beforeAngleDeg: bottle.angle * 180 / Math.PI };
    m.inputs.push(entry);
    assert(Math.abs(bottle.angle) > a.params.spillAngle, 'Chưa tái hiện bình nghiêng sau chu kỳ');
    const decalsBefore = a.liquid.serial;
    if (source === 'button') document.querySelector('#refill').click();
    else a.pointerDown({ positionToCamera: () => toScreen(a.params.sandbox.refill, a.params) });
    entry.immediateL = bottle.plugin.volume;
    a.step(5);
    entry.afterFiveSecondsL = bottle.plugin.volume;
    entry.afterAngleDeg = bottle.angle * 180 / Math.PI;
    entry.extraSpills = a.liquid.serial - decalsBefore;
    entry.sameBody = a.bottle === bottle && bottle.plugin.id === id;
    entry.sameJournal = JSON.stringify(a.cycle.log) === journal;
    assert(entry.afterFiveSecondsL === a.params.bottleVolume && entry.extraSpills === 0
      && entry.sameBody && entry.sameJournal, 'Nạp lại sau xoay không giữ được nước / làm mất trạng thái');
    a.selectTool('pour');
    a.pointerDown({ positionToCamera: () => toScreen({ x: a.params.room.width / 2, y: 0 }, a.params) });
    entry.afterManualL = bottle.plugin.volume;
    entry.manualSurface = a.liquid.decals.at(-1).surface;
    assert(Math.abs(entry.afterManualL - (a.params.bottleVolume - a.params.pourVolume)) < a.params.epsilon
      && entry.manualSurface === 'FLOOR', 'Không đổ được lên sàn sau nạp lại');
  }
});
const r4 = { id: 'T19-R4-view', status: 'PASS', measured: {} };
try {
  a.reset(); a.hud.hallway.leave(); a.start('EAST', 300); until(() => a.cycle.state === 'ACTIVE'); a.step(3);
  const since = performance.now();
  while (!a.detector.discovered.has('R4') && performance.now() - since < 4000) {
    await new Promise(resolve => setTimeout(resolve, 100)); a.step(0.1);
  }
  r4.measured = { pose: a.params.mannequinPose, hinge: a.params.mannequin.hinge, realViewSeconds: (performance.now() - since) / a.params.millisecondsPerSecond,
    events: a.detector.events, segments: a.snapshot().objects.filter(o => o.kind === 'mannequin').map(o => ({ segment: o.segment, angle: o.angle, bounds: o.bounds })) };
  assert(a.params.mannequinPose === 'standing' && !a.params.mannequin.hinge && a.detector.discovered.has('R4'), 'Cứng standing không phát hiện R4 theo trục thân sau 4 giây thực');
} catch (e) { r4.status = 'FAIL'; r4.reason = e.message; }
results.push(r4);
document.querySelector('#test-results').textContent = JSON.stringify(results, null, 2);
