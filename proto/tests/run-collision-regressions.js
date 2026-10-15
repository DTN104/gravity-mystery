async page => {
  await page.reload(); await page.waitForFunction(() => !!window.proto);
  return await page.evaluate(() => {
    const a = window.proto, defaults = structuredClone(a.params), M = a.M;
    a.paused = true;
    const reset = pose => { Object.assign(a.params, structuredClone(defaults)); if (pose) a.params.mannequinPose = pose; a.reset(); };
    const assert = (ok, text) => { if (!ok) throw new Error(text); };
    const filters = [], spills = [], engineSpills = [], tilts = [];
    for (const pose of ['lying', 'standing']) {
      reset(pose);
      const targets = [...a.room.bodies.map((b, index) => ({ index, surface: b.plugin.surface, name: b.plugin.name })),
        ...['cup', 'pen', 'book', 'gel'].map(kind => ({ kind }))];
      for (const fixture of targets) {
        reset(pose);
        const man = a.objects.bodies.find(b => b.plugin.kind === 'mannequin');
        const target = fixture.kind ? a.objects.bodies.find(b => b.plugin.kind === fixture.kind) : a.room.bodies[fixture.index];
        const expected = fixture.surface !== 'TABLE'; let contacts = 0;
        const handler = event => { for (const pair of event.pairs) {
          const parents = [pair.bodyA.parent, pair.bodyB.parent];
          if (parents.includes(man) && parents.includes(target)) contacts++;
        } };
        a.matter.world.on('collisionstart', handler);
        M.Body.setPosition(man, target.position); a.wake(); a.step(a.params.physicsStep);
        a.matter.world.off('collisionstart', handler);
        filters.push({ pose, target: fixture.name || fixture.kind, surface: fixture.surface || 'LOOSE', contacts, expected });
        assert((contacts > 0) === expected, `Filter sai: ${pose}/${fixture.name || fixture.kind}`);
        assert(man.parts.every(part => !(part.collisionFilter.mask & a.params.collisionCategories.table)), 'Compound part vẫn va bàn');
      }
    }
    const cases = [
      { name: 'slide 2 m/s', cup: [2, 0], other: [0, 0], normal: [0, 1], expected: false },
      { name: 'normal 0.6 m/s', cup: [0, 0.6], other: [0, 0], normal: [0, 1], expected: true },
      { name: 'boundary 0.5 m/s', cup: [0, 0.5], other: [0, 0], normal: [0, 1], expected: false },
      { name: 'separating 0.6 m/s', cup: [0, -0.6], other: [0, 0], normal: [0, 1], expected: false },
      { name: 'same velocity 1 m/s', cup: [0, 1], other: [0, 1], normal: [0, 1], expected: false },
      { name: 'relative 0.8 m/s', cup: [0, 1], other: [0, 0.2], normal: [0, 1], expected: true },
      { name: 'reversed pair', cup: [0, 0.6], other: [0, 0], normal: [0, -1], reversed: true, expected: true },
      { name: 'oblique below threshold', cup: [0.6, 0], other: [0, 0], normal: [Math.SQRT1_2, Math.SQRT1_2], expected: false },
      { name: 'oblique above threshold', cup: [0.8, 0], other: [0, 0], normal: [Math.SQRT1_2, Math.SQRT1_2], expected: true },
    ];
    for (const c of cases) {
      reset(); const cup = a.objects.bodies.find(b => b.plugin.kind === 'cup'), table = a.room.bodies.find(b => b.plugin.surface === 'TABLE');
      const scale = a.params.pixelsPerMetre * M.Body._baseDelta / a.params.millisecondsPerSecond;
      for (const [body, v] of [[cup, c.cup], [table, c.other]]) M.Body.setVelocity(body, { x: v[0] * scale, y: v[1] * scale });
      const [bodyA, bodyB] = c.reversed ? [cup, table] : [table, cup];
      a.collisions({ pairs: [{ bodyA, bodyB, collision: { bodyA, bodyB, normal: { x: c.normal[0], y: c.normal[1] }, supports: [cup.position] } }] });
      const spilled = cup.plugin.volume === 0, speed = a.metrics.collisions.at(-1).normalSpeedMps;
      spills.push({ name: c.name, normalSpeedMps: speed, spilled, expected: c.expected });
      assert(spilled === c.expected, `Đổ ca sai: ${c.name}`);
    }
    for (const [vx, vy, reversed] of [[2, 0, false], [0, 0.6, false], [0, 0.6, true], [0, 0.5, false]]) {
      reset(); const p = a.params, engine = M.Engine.create({ gravity: { x: 0, y: 0, scale: 0 } });
      const makeCup = () => M.Bodies.rectangle(p.canvas.origin.x, p.canvas.origin.y - p.cup.height * p.pixelsPerMetre / 2 + 1,
        p.cup.width * p.pixelsPerMetre, p.cup.height * p.pixelsPerMetre, { frictionAir: p.airFriction });
      const makeFloor = () => M.Bodies.rectangle(p.canvas.origin.x, p.canvas.origin.y + p.room.wall * p.pixelsPerMetre / 2,
        p.room.width * p.pixelsPerMetre, p.room.wall * p.pixelsPerMetre, { isStatic: true });
      let cup, floor;
      if (reversed) { cup = makeCup(); floor = makeFloor(); } else { floor = makeFloor(); cup = makeCup(); }
      cup.plugin = { kind: 'cup', id: 'fixture-cup', volume: p.waterVolume }; floor.plugin = { surface: 'FLOOR' };
      const scale = p.pixelsPerMetre * M.Body._baseDelta / p.millisecondsPerSecond;
      M.Body.setVelocity(cup, { x: vx * scale, y: vy * scale }); M.World.add(engine.world, [cup, floor]);
      M.Events.on(engine, 'collisionStart', event => a.collisions(event));
      M.Engine.update(engine, p.physicsStep * p.millisecondsPerSecond);
      const hit = a.metrics.collisions.at(-1), spilled = cup.plugin.volume === 0;
      engineSpills.push({ vxMps: vx, vyMps: vy, reversed, normalSpeedMps: hit?.normalSpeedMps, spilled });
      assert(hit && spilled === (vy > p.spillSpeed), 'Vận tốc/chiều pháp tuyến sai trong Engine.update thật');
      M.World.clear(engine.world); M.Engine.clear(engine);
    }
    for (const offset of [-0.01, 0.01]) {
      reset(); const cup = a.objects.bodies.find(b => b.plugin.kind === 'cup');
      M.Body.setPosition(cup, { x: a.params.canvas.origin.x + 3 * a.params.pixelsPerMetre, y: a.params.canvas.origin.y - 2 * a.params.pixelsPerMetre });
      M.Body.setAngle(cup, a.params.spillAngle + offset); a.step(a.params.physicsStep);
      const spilled = cup.plugin.volume === 0;
      tilts.push({ angleDegrees: cup.angle * 180 / Math.PI, spilled });
      assert(spilled === (offset > 0), 'Luật nghiêng >60° sai');
    }
    reset(); a.draw(); a.refresh();
    return { status: 'PASS', filters, spills, engineSpills, tilts };
  });
}
