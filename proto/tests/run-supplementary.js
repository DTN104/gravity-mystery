async page => {
  await page.reload(); await page.waitForFunction(() => !!window.proto);
  return await page.evaluate(() => {
    const a = window.proto; a.paused = true; a.reset();
    const assert = (ok, text) => { if (!ok) throw new Error(text); };
    const before = a.objects.snapshot().find(o => o.kind === 'mannequin');
    assert(a.params.mannequinPose === 'lying' && Math.abs(before.x - a.params.mannequin.x) < a.params.epsilon
      && Math.abs(before.y - a.params.mannequin.y) < a.params.epsilon, 'Tâm mặc định lying sai');
    const mannequinBody = a.objects.bodies.find(b => b.plugin.kind === 'mannequin');
    assert(mannequinBody.parts[2].position.x > mannequinBody.parts[1].position.x, 'Lying không hướng đầu Đông');
    const surfaces = a.room.bodies.map(b => b.plugin.surface);
    assert(surfaces.filter(s => s === 'SHELF').length === 1 && surfaces.filter(s => s === 'TRAY').length === 2, 'SHELF/TRAY không riêng');
    const packedMaxX = Math.max(...a.objects.snapshot().filter(o => o.kind === 'gel').map(o => o.x));
    assert(packedMaxX <= 0.3, 'Gel không xếp ở nửa Tây');
    a.anchor(true);
    const constraint = a.objects.anchorConstraint;
    assert(constraint.stiffness === a.params.anchorStiffness && constraint.length > 0, 'Neo không đúng constraint cứng');
    const after = a.objects.snapshot().find(o => o.kind === 'mannequin');
    assert(before.x === after.x && before.y === after.y, 'Neo làm teleport hình nộm');
    a.anchor(false); assert(a.objects.anchorConstraint === null, 'Thả neo không xóa constraint');
    a.params.mannequinPose = 'standing'; a.reset();
    const standing = a.objects.snapshot().find(o => o.kind === 'mannequin');
    assert(Math.abs(standing.x - a.params.mannequin.standingX) < a.params.epsilon
      && Math.abs(standing.y - a.params.mannequin.standingY) < a.params.epsilon, 'Tâm standing sai');
    a.params.mannequinPose = 'lying'; a.reset();
    const all = [];
    for (const dir of ['DOWN', 'UP', 'WEST', 'EAST']) {
      a.reset(); a.start(dir, 60);
      while (a.cycle.state !== 'ACTIVE') a.step(a.params.physicsStep);
      all.push({ dir, gravity: { ...a.engine.gravity } });
      assert(a.cycle.direction === dir, 'Sai hướng ACTIVE');
    }
    a.reset(); const first = a.addObject('pen'); const second = a.addObject('book');
    assert(first.mass === a.params.pen.mass && second.mass === a.params.book.mass, 'Thêm vật sai mass');
    const logSchemas = a.cycle.log.map(l => Object.keys(l));
    assert(a.matter.world.listenerCount('beforeupdate') === 1, 'Reset rò MouseConstraint listener');
    a.draw(); a.refresh();
    return { status: 'PASS', anchorLengthMetres: constraint.length / a.params.pixelsPerMetre,
      lyingCentre: { x: before.x, y: before.y }, standingCentre: { x: standing.x, y: standing.y },
      surfaces, packedMaxX, directions: all, mouseListenersAfterReset: a.matter.world.listenerCount('beforeupdate'), logSchemas };
  });
}
