// Runs the real scene/engine; assertions below never substitute authored outcomes.
export async function runFunctionalTests(a) {
  const defaults = structuredClone(a.params), results = [];
  a.paused = true;
  const reset = (override = {}) => { Object.assign(a.params, structuredClone(defaults), override); a.reset(); };
  const assert = (condition, message) => { if (!condition) throw new Error(message); };
  const test = async (id, action, status = 'PASS') => {
    let measured = {};
    try { await action(measured); results.push({ id, status, measured }); }
    catch (error) { results.push({ id, status: 'FAIL', measured, reason: error.message }); }
  };
  const until = (condition, limit = 2000) => {
    const start = a.cycle.now;
    while (!condition() && a.cycle.now - start < limit) a.step(a.params.physicsStep);
    assert(condition(), 'Timeout khi chờ trạng thái / va chạm');
  };
  const active = (dir = 'EAST', duration = 60) => { assert(a.start(dir, duration), 'start bị từ chối'); until(() => a.cycle.state === 'ACTIVE'); return a.cycle.now; };
  const finish = () => { until(() => a.cycle.state === 'IDLE'); a.step(a.params.doorUnlockDelay + 5); };
  const objects = () => a.snapshot().objects;
  const nearestMannequin = list => list.filter(o => o.kind === 'mannequin').sort((x, y) => y.bounds.max.x - x.bounds.max.x)[0];

  await test('T1', m => {
    reset(); m.pose = a.params.mannequinPose; m.hinge = a.params.mannequin.hinge;
    m.initialMannequin = objects().find(o => o.kind === 'mannequin');
    assert(!m.hinge && m.pose === 'lying' && a.objects.mannequin.bodies.length === 1
      && Math.abs(m.initialMannequin.x - a.params.mannequin.x) <= a.params.epsilon
      && Math.abs(m.initialMannequin.y - a.params.mannequin.y) <= a.params.epsilon, 'T21 không dùng cấu hình cứng, lying của proto v0.4');
    const at = active();
    until(() => a.bolt.s === a.params.boltTravel, 2); m.boltCloseSeconds = a.cycle.now - at;
    a.step(2);
    m.observationSeconds = a.cycle.now - at;
    const hits = a.metrics.collisions.filter(h => h.dir === 'EAST' && h.surface === 'EAST');
    m.arrivalSeconds = Object.fromEntries(['cup', 'pen', 'book', 'mannequin'].map(kind => [kind, hits.find(h => h.kind === kind)?.t - at]));
    m.gelAtEast = objects().filter(o => o.kind === 'gel' && o.x > 3.5).length;
    m.mannequin = nearestMannequin(objects());
    m.boltForceN = a.params.boltMass * a.params.g;
    m.mannequinTableContacts = a.metrics.collisions.filter(h => h.kind === 'mannequin' && h.surface === 'TABLE').length;
    assert(['cup', 'pen', 'book'].every(kind => m.arrivalSeconds[kind] < 1.5), 'Vật trên bàn chưa tới tường Đông trong < 1,5 s');
    assert(m.mannequinTableContacts === 0, 'Hình nộm va chạm bàn');
    assert(Number.isFinite(m.arrivalSeconds.mannequin) && m.mannequin.y < 0.6 && m.gelAtEast >= 58, 'Hình nộm không nằm thấp / <58 gel tới Đông');
    assert(m.boltCloseSeconds >= 0.2 && m.boltCloseSeconds <= 0.4, 'Chốt lệch khoảng ~0,3 s');
  });
  await test('T2', m => {
    finish(); const all = objects();
    const loose = all.filter(o => o.kind !== 'mannequin');
    m.farthestCentreFromEastM = a.params.room.width - Math.min(...loose.map(o => o.x));
    const small = loose.filter(o => ['cup', 'pen', 'book'].includes(o.kind)), gel = loose.filter(o => o.kind === 'gel');
    m.looseDistanceFromEastM = Object.fromEntries(small.map(o => [o.kind, a.params.room.width - o.x]));
    m.farthestGelFromEastM = a.params.room.width - Math.min(...gel.map(o => o.x));
    m.outsideStrip = loose.filter(o => o.x < a.params.room.width - (o.kind === 'gel' ? 1 : 0.5))
      .map(o => ({ id: o.id, kind: o.kind, x: o.x }));
    m.gelOutsideStrip = m.outsideStrip.filter(o => o.kind === 'gel').length;
    m.mannequin = nearestMannequin(all);
    m.maxSpeed = Math.max(...all.map(o => o.speed)); m.boltM = a.bolt.s;
    assert(m.outsideStrip.every(o => o.kind === 'gel') && m.gelOutsideStrip <= 6 && m.boltM === a.params.boltTravel
      && m.mannequin.bounds.max.x >= a.params.room.width - 0.1 && m.mannequin.y < 0.6, 'Không tụ dọc chân Đông theo tiêu chí tâm / hình nộm chưa sát chân Đông');
  });
  await test('T1b', m => {
    reset({ mannequinPose: 'standing' });
    m.initialMannequin = objects().find(o => o.kind === 'mannequin');
    const contacts = [];
    const handler = event => {
      for (const pair of event.pairs) {
        const kinds = [pair.bodyA.parent.plugin.kind, pair.bodyB.parent.plugin.kind];
        if (kinds.includes('mannequin') && kinds.some(k => ['cup', 'pen', 'book'].includes(k)))
          contacts.push({ t: a.cycle.now, kinds });
      }
    };
    a.matter.world.on('collisionstart', handler);
    const at = active(); a.step(3);
    a.matter.world.off('collisionstart', handler);
    const hits = a.metrics.collisions.filter(h => h.dir === 'EAST' && h.surface === 'EAST');
    m.observationSeconds = a.cycle.now - at;
    m.arrivalSeconds = Object.fromEntries(['cup', 'pen', 'book', 'mannequin'].map(kind => [kind, hits.find(h => h.kind === kind)?.t - at]));
    m.mannequinContacts = contacts.map(c => ({ secondsAfterActive: c.t - at, kinds: c.kinds }));
    m.mannequin = objects().find(o => o.kind === 'mannequin');
    m.mannequinTableContacts = a.metrics.collisions.filter(h => h.kind === 'mannequin' && h.surface === 'TABLE').length;
    m.gelAtEast = objects().filter(o => o.kind === 'gel' && o.x > 3.5).length;
  }, 'OBSERVATION');
  await test('T3', m => {
    reset(); a.setBolt(a.params.boltTravel); const at = active('WEST');
    until(() => a.bolt.s === 0, 2); m.boltOpenSeconds = a.cycle.now - at;
    a.step(5); const all = objects();
    m.looseX = Object.fromEntries(all.filter(o => ['cup', 'pen', 'book'].includes(o.kind)).map(o => [o.kind, o.x]));
    m.gelInsideTray = all.filter(o => o.kind === 'gel' && o.x <= a.params.tray.right && o.y >= a.params.tray.bottom && o.y <= a.params.tray.top).length;
    assert(m.gelInsideTray >= 58 && Object.values(m.looseX).every(x => x < 0.5) && a.bolt.s === 0, 'Gel đổ / vật không đi Tây');
  });
  await test('T4', m => {
    reset({ boltDetent: 12 }); active(); a.step(5);
    m.forceN = a.params.boltMass * a.params.g; m.detentN = a.params.boltDetent; m.displacementM = a.bolt.s;
    assert(m.displacementM === 0, 'Chốt tốt vẫn trượt');
  });
  await test('T5', m => {
    reset({ timeScale: 60 }); active('EAST', 900); finish();
    const decals = a.snapshot().decals, pool = decals.find(d => d.type === 'POOL' && d.floor === 'EAST');
    const streak = decals.find(d => d.type === 'STREAK' && d.floor === 'EAST' && d.end.y === 0);
    m.decals = decals; m.poolHeightM = pool?.point.y; m.streakEndY = streak?.end.y;
    m.cupContacts = a.metrics.collisions.filter(h => h.kind === 'cup' && h.normalSpeedMps !== undefined);
    m.physicsSteps = a.metrics.substeps; m.returnAt = a.cycle.log.find(l => l.event === 'RETURN')?.t;
    assert(pool && Math.abs(pool.point.y - 0.9) <= 0.2 && streak, 'Thiếu pool ở cao độ 0,9 ±0,2 m / vệt xuống chân tường');
  });
  await test('T6', m => {
    reset(); a.pour('FLOOR', { x: 1.5, y: 0 }); a.step(60); active();
    const d = a.snapshot().decals; const streak = d.find(d => d.type === 'STREAK');
    m.wetness = streak?.wetness; m.streakLengthM = streak ? Math.hypot(streak.end.x - streak.point.x, streak.end.y - streak.point.y) : 0;
    m.start = streak?.point; m.poolRadiusM = d.find(d => d.type === 'POOL')?.radius;
    assert(streak && m.streakLengthM >= 0.85 && m.streakLengthM <= 1 && m.poolRadiusM > 0, 'Sai vệt còn ướt / mất pool gốc');
  });
  await test('T7', m => {
    reset({ dryTime: 30 }); a.pour('FLOOR', { x: 1.5, y: 0 }); a.step(60); active();
    m.streakCount = a.liquid.decals.filter(d => d.type === 'STREAK').length; m.wetness = a.liquid.decals[0].wetness;
    assert(m.streakCount === 0 && m.wetness === 0, 'Decal khô vẫn sinh vệt');
  });
  await test('T8', m => {
    reset(); a.pour('EAST', { x: 4, y: 0.9 }); m.types = a.liquid.decals.map(d => d.type); m.end = a.liquid.decals.at(-1).end;
    assert(m.types.join(',') === 'SPLASH,STREAK' && m.end.y === 0, 'Ném vào tường DOWN vẫn sinh pool');
  });
  await test('T9', m => {
    reset(); a.hallway.leave(a.cycle); a.start('EAST', 60);
    m.warnEntryAccepted = a.hallway.enter(a.cycle); m.warnLocked = a.cycle.door.locked;
    until(() => a.cycle.state === 'IDLE'); const returnAt = a.cycle.log.at(-1).t;
    m.immediateEntryAccepted = a.hallway.enter(a.cycle);
    a.step(a.params.doorUnlockDelay - a.params.physicsStep * 2); m.beforeDelayLocked = a.cycle.door.locked;
    a.step(a.params.physicsStep * 3); m.afterEntryAccepted = a.hallway.enter(a.cycle); m.unlockSeconds = a.cycle.now - returnAt;
    assert(!m.warnEntryAccepted && m.warnLocked && !m.immediateEntryAccepted && m.beforeDelayLocked && m.afterEntryAccepted, 'Sai khóa / trễ mở cửa');
  });
  await test('T10', m => {
    reset(); a.setDoorOpen(true); m.accepted = a.start('EAST', 60); m.state = a.cycle.state; m.messages = a.cycle.messages;
    assert(!m.accepted && m.state === 'IDLE' && m.messages.some(x => x.includes('cửa đang mở')), 'Cửa mở vẫn xoay / thiếu log từ chối');
  });
  await test('T11', m => {
    reset({ timeScale: 60 }); const at = 22 * a.params.secondsPerHour;
    assert(a.schedule(at, 'EAST', 900), 'Lịch bị từ chối'); a.hallway.leave(a.cycle);
    until(() => a.cycle.state === 'ACTIVE'); a.step(10); a.draw();
    const s = a.snapshot(), mannequin = nearestMannequin(s.objects);
    m.camera = s.hallway; m.mannequin = { x: mannequin.x, y: mannequin.y, bounds: mannequin.bounds };
    m.viewportPx = { width: a.hallway.windowCamera.width, height: a.hallway.windowCamera.height };
    m.boltMotionPx = a.params.boltTravel * a.params.pixelsPerMetre * a.hallway.windowCamera.zoom;
    m.boltM = s.bolt; m.scheduledLogAt = s.log.find(l => l.event === 'SCHEDULED_START')?.t;
    m.activeAt = s.transitions.find(t => t.state === 'ACTIVE')?.t;
    m.journalKeys = [...new Set(s.log.flatMap(l => Object.keys(l)))];
    m.looseAtOldFloor = s.objects.filter(o => o.kind !== 'mannequin' || o.id === mannequin.id)
      .filter(o => o.bounds.max.x < a.params.room.width - 0.05 && o.bounds.min.y <= 0.02)
      .map(o => ({ id: o.id, kind: o.kind, x: o.x, y: o.y }));
    until(() => a.cycle.state === 'IDLE');
    m.returnLogAt = a.cycle.log.find(l => l.event === 'RETURN')?.t;
    m.unlockAt = a.cycle.unlockAt; m.returnLocked = a.cycle.door.locked;
    a.step(a.params.doorUnlockDelay); m.unlockedAfterDelay = !a.cycle.door.locked;
    assert(m.scheduledLogAt === at && m.returnLogAt === at + 900 && m.unlockAt === at + 900 + a.params.doorUnlockDelay
      && m.returnLocked && m.unlockedAfterDelay, 'Sai mốc START / RETURN 22:15:00 / mở khóa 22:15:03');
    assert(!s.hallway.inside && s.hallway.visible && mannequin.bounds.max.x >= a.params.room.width - 0.1
      && s.bolt === a.params.boltTravel && m.boltMotionPx >= 10, 'Sai góc hành lang / hình nộm / chốt <10 px');
    assert(m.journalKeys.every(k => ['t', 'event', 'origin'].includes(k)), 'Nhật ký chứa hướng');
    assert(m.looseAtOldFloor.length <= 2 && m.looseAtOldFloor.every(o => o.kind === 'gel'), 'Còn vật rời ngoài ≤2 gel trên sàn cũ');
  });
  await test('T12', m => {
    reset(); const at = active('EAST', 900);
    const settled = () => [...a.coat.gels.values()].filter(g => g.settledAt !== null).length;
    while (settled() < a.params.gelCount && a.cycle.now - at < 120) a.step(a.params.physicsStep);
    m.gelWaitSeconds = a.cycle.now - at; m.waitLimitSeconds = 120; m.cycleDurationSeconds = 900;
    m.gelSettledBeforeDrop = settled();
    const old = a.objects.bodies.find(b => b.plugin.kind === 'pen');
    const gel = objects().filter(o => o.kind === 'gel');
    const oldPosition = objects().find(o => o.id === old.plugin.id);
    m.oldNearestEligibleGelDistanceM = Math.min(...gel.filter(g => a.coat.gels.get(g.id)?.settledAt !== null
      && a.coat.gels.get(g.id)?.firstSettledAt > oldPosition.bornAt).map(g => Math.hypot(g.x - oldPosition.x, g.y - oldPosition.y)));
    const target = gel.filter(o => o.x > a.params.room.width - 0.1).sort((x, y) => x.y - y.y)[Math.floor(gel.filter(o => o.x > a.params.room.width - 0.1).length / 2)];
    const position = { x: a.params.room.width - 0.3, y: target.y };
    const fresh = a.addObject('pen', position); a.step(10);
    m.stoppedGel = gel.filter(o => o.speed < a.params.gelStopSpeed).length;
    m.settledGel = [...a.coat.gels.values()].filter(g => g.settledAt !== null).length;
    m.oldCoatedAt = a.coat.coated.get(old.plugin.id) ?? null; m.newCoatedAt = a.coat.coated.get(fresh.plugin.id) ?? null;
    m.oldPen = objects().find(o => o.id === old.plugin.id); m.newPen = objects().find(o => o.id === fresh.plugin.id);
    const nearby = object => objects().filter(g => g.kind === 'gel'
      && Math.hypot(g.x - object.x, g.y - object.y) <= a.params.coatRadius);
    const eligible = object => nearby(object).filter(g => a.coat.gels.get(g.id)?.settledAt !== null
      && a.coat.gels.get(g.id)?.firstSettledAt > object.bornAt).length;
    m.coatRadiusM = a.params.coatRadius; m.gelCoatMin = a.params.gelCoatMin;
    m.oldNearbyGel = nearby(m.oldPen).length; m.newNearbyGel = nearby(m.newPen).length;
    m.oldEligibleGel = eligible(m.oldPen); m.newEligibleGel = eligible(m.newPen);
    m.dropPosition = position;
    assert(m.gelSettledBeforeDrop === a.params.gelCount, 'Gel chưa dừng đủ 2 s sau tối đa 120 s ACTIVE; chưa đạt tiền điều kiện thả bút mới');
    assert(m.oldCoatedAt !== null && m.newCoatedAt === null && m.newNearbyGel >= a.params.gelCoatMin, 'Bút cũ không phủ / bút mới bị phủ / bút mới chưa vào đống gel');
  });
  await test('T13', m => {
    reset(); const point = { x: 1.5, y: 0 }; a.pour('FLOOR', point); a.liquid.wipe(point, a.cycle.now);
    a.pour('FLOOR', point); active(); m.layers = a.liquid.decals.map(d => d.type);
    assert(m.layers.join(',') === 'WIPE,POOL,STREAK', 'Thứ tự lớp lau → pool → streak sai');
  });
  await test('T15', m => {
    reset();
    for (const body of a.objects.bodies) a.M.World.remove(a.engine.world, body);
    a.objects.bodies = [];
    a.M.World.remove(a.engine.world, a.room.bodies.find(b => b.plugin.surface === 'CEIL'));
    const cup = a.addObject('cup', { x: 3.2, y: 3 + a.params.cup.height / 2 });
    const start = a.cycle.now;
    until(() => a.metrics.collisions.some(h => h.id === cup.plugin.id && h.surface === 'FLOOR'), 2);
    const hit = a.metrics.collisions.find(h => h.id === cup.plugin.id && h.surface === 'FLOOR');
    m.dropDistanceM = 3; m.fallSeconds = hit.t - start; m.theoreticalSeconds = Math.sqrt(2 * m.dropDistanceM / a.params.g);
    m.stepSeconds = a.params.physicsStep; m.gravityScale = a.engine.gravity.scale;
    assert(m.fallSeconds >= 0.75 && m.fallSeconds <= 0.82, 'Rơi 3 m ngoài khoảng 0,75–0,82 s');
  });
  reset(); a.paused = true; a.draw(); a.refresh();
  return results.sort((x, y) => parseInt(x.id.slice(1)) - parseInt(y.id.slice(1)) || x.id.localeCompare(y.id));
}
