async page => {
  await page.reload(); await page.waitForFunction(() => !!window.proto);
  return await page.evaluate(async () => {
    const { runFunctionalTests } = await import('/tests/scenarios.js');
    const a = window.proto, original = structuredClone(a.params), rows = [];
    const setups = [
      { name: 'Đầu r=0.10 m', radius: 0.10, left: 3.8 },
      { name: 'Đầu r=0.08 m + giá nhô 0.10 m', radius: 0.08, left: 3.9 },
      { name: 'Đầu r=0.08 m + giá nhô 0.05 m', radius: 0.08, left: 3.95 },
      { name: 'Đầu r=0.10 m + giá nhô 0.10 m', radius: 0.10, left: 3.9 },
      { name: 'Đầu r=0.10 m + giá nhô 0.05 m', radius: 0.10, left: 3.95 },
    ];
    try {
      for (const setup of setups) {
        const patch = { mannequin: { ...original.mannequin, headRadius: setup.radius }, shelf: { ...original.shelf, left: setup.left } };
        Object.assign(a.params, structuredClone(original), patch); a.reset();
        rows.push({ version: 'v0.3', name: setup.name, patch,
          results: (await runFunctionalTests(a)).filter(t => ['T1', 'T2', 'T3', 'T5', 'T11', 'T12', 'T15'].includes(t.id)) });
      }
    } finally { Object.assign(a.params, original); a.reset(); a.draw(); a.refresh(); }
    return rows;
  });
}
