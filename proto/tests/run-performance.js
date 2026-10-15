async page => {
  const gameUrl = page.url();
  await page.goto(new URL('tests/raf-baseline.html', gameUrl).href);
  await page.locator('#baseline-result').waitFor({ timeout: 15000 });
  const baseline = JSON.parse(await page.locator('#baseline-result').textContent());
  await page.goto(gameUrl); await page.waitForFunction(() => !!window.proto);
  await page.evaluate(() => {
    const a = window.proto;
    a.params.timeScale = 60; a.params.doorIsOpen = false;
    a.reset(); a.start('EAST', 1800); a.paused = false;
    a.performanceStart = { real: performance.now(), sim: a.cycle.now, steps: a.metrics.substeps };
    a.lastFrame = a.performanceStart.real;
  });
  await page.waitForTimeout(30000);
  return await page.evaluate(baseline => {
    const a = window.proto, start = a.performanceStart, end = performance.now();
    a.paused = true;
    const samples = a.frameSamples.filter(s => s.real >= start.real);
    const deltas = samples.map(s => s.delta * a.params.millisecondsPerSecond).sort((x, y) => x - y);
    const realSeconds = (end - start.real) / a.params.millisecondsPerSecond;
    const firstSecond = samples.filter(s => s.real - start.real <= a.params.millisecondsPerSecond);
    return {
      id: 'T14', status: baseline.hz < 55 ? 'môi trường (throttle)' : samples.length / realSeconds >= 55 ? 'PASS' : 'FAIL',
      ...(baseline.hz < 55 ? { reason: 'Đo lại với cửa sổ focus, màn hình chính, không tiết kiệm pin.' } : {}),
      measured: { baseline, frames: samples.length, realSeconds, fps: samples.length / realSeconds,
        frameMedianMs: deltas[Math.floor(deltas.length / 2)], frameP95Ms: deltas[Math.floor(deltas.length * 0.95)],
        frameMaxMs: Math.max(...deltas), firstSecondFrames: firstSecond.length,
        simulatedSeconds: a.cycle.now - start.sim, simulationRate: (a.cycle.now - start.sim) / realSeconds,
        substeps: a.metrics.substeps - start.steps, gelCount: a.params.gelCount, timeScale: a.params.timeScale,
        userAgent: navigator.userAgent, hardwareConcurrency: navigator.hardwareConcurrency, renderer: 'Phaser CANVAS',
        visibility: document.visibilityState, width: a.params.canvas.width, height: a.params.canvas.height },
    };
  }, baseline);
}
