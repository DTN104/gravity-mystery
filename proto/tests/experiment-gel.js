async page => {
  await page.reload(); await page.waitForFunction(() => !!window.proto);
  return await page.evaluate(() => {
    const a = window.proto, original = structuredClone(a.params), rows = [];
    a.paused = true;
    try {
      for (const radius of [0.015, 0.014, 0.0125, 0.01, 0.0075, 0.005]) {
        Object.assign(a.params, structuredClone(original), { mannequin: { ...original.mannequin, x: 2.9 },
          gel: { ...original.gel, radius } }); a.reset(); a.start('EAST', 60);
        while (a.cycle.state !== 'ACTIVE') a.step(a.params.physicsStep);
        const at = a.cycle.now; a.step(3);
        const gelsAtEast = a.objects.snapshot().filter(o => o.kind === 'gel' && o.x >= a.params.room.width - 0.5).length;
        while (a.cycle.state !== 'IDLE') a.step(a.params.physicsStep);
        a.step(a.params.doorUnlockDelay + 5);
        const objects = a.objects.snapshot(), loose = objects.filter(o => o.kind !== 'mannequin');
        const outside = loose.filter(o => o.x < a.params.room.width - 0.5);
        const mannequin = objects.find(o => o.kind === 'mannequin');
        rows.push({ mannequinX: a.params.mannequin.x, radiusM: radius, gelsAtEast,
          gelOutside: outside.filter(o => o.kind === 'gel').length, nonGelOutside: outside.filter(o => o.kind !== 'gel').length,
          farthestCentreFromEastM: a.params.room.width - Math.min(...loose.map(o => o.x)), mannequin,
          T2: outside.length <= 2 && outside.every(o => o.kind === 'gel')
            && mannequin.bounds.max.x >= a.params.room.width - 0.05 && mannequin.y < 0.6 ? 'PASS' : 'FAIL',
          oldPen: objects.find(o => o.kind === 'pen'), activeAt: at });
      }
    } finally { Object.assign(a.params, original); a.reset(); a.draw(); a.refresh(); }
    return rows;
  });
}
