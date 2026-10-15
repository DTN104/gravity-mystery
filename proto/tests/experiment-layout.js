async page => {
  await page.reload(); await page.waitForFunction(() => !!window.proto);
  return await page.evaluate(async () => {
    const { runFunctionalTests } = await import('/tests/scenarios.js');
    const a = window.proto, original = structuredClone(a.params), rows = [];
    const setups = [
      { name: 'Spec v0.3', patch: {} },
      { name: 'Thanh giá cao 0.6 m', patch: { shelf: { ...original.shelf, y: 0.6 } } },
      { name: 'Thanh giá nhô 0.05 m', patch: { shelf: { ...original.shelf, left: 3.95 } } },
      { name: 'Thân hình nộm dày 0.32 m', patch: { mannequin: { ...original.mannequin, width: 0.32 } } },
      { name: 'Đầu hình nộm r=0.08 m', patch: { mannequin: { ...original.mannequin, headRadius: 0.08 } } },
      { name: 'Solver 12/8', patch: { positionIterations: 12, velocityIterations: 8 } },
      { name: 'Timestep 1/240 s', patch: { physicsStep: 1 / 240 } },
    ];
    try {
      for (const setup of setups) {
        Object.assign(a.params, structuredClone(original), setup.patch); a.reset();
        rows.push({ version: 'v0.3', name: setup.name, patch: setup.patch,
          results: (await runFunctionalTests(a)).filter(t => ['T1', 'T2', 'T3', 'T5', 'T11', 'T12', 'T15'].includes(t.id)) });
      }
    } finally { Object.assign(a.params, original); a.reset(); a.draw(); a.refresh(); }
    return rows;
  });
}
