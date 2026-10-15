async page => {
  await page.reload(); await page.waitForFunction(() => !!window.proto);
  return await page.evaluate(async () => {
    const a = window.proto, original = structuredClone(a.params);
    try {
      a.params.mannequin.headRadius = 0.10; a.reset();
      const { runFunctionalTests } = await import('/tests/scenarios.js');
      return { version: 'v0.3', patch: { 'mannequin.headRadius': 0.10 },
        results: await runFunctionalTests(a) };
    } finally { Object.assign(a.params, original); a.reset(); a.draw(); a.refresh(); }
  });
}
