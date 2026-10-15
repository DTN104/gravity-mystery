import { runFunctionalTests } from './scenarios.js';
const baseline = JSON.parse(sessionStorage.getItem('gravity-raf-baseline') || 'null');
sessionStorage.removeItem('gravity-raf-baseline');
while (!window.proto) await new Promise(resolve => setTimeout(resolve, 20));
const a = window.proto, coatOverride = new URLSearchParams(location.search).get('coatRadius');
if (coatOverride !== null) a.params.coatRadius = Number(coatOverride);
const results = await runFunctionalTests(a);
const show = () => { document.querySelector('#test-results').textContent = JSON.stringify(results, null, 2); };
show();
const requestedScale = Number(new URLSearchParams(location.search).get('timeScale') ?? 60);
const performanceScale = a.params.debug.timeScales.includes(requestedScale) ? requestedScale : 60;
const hasBaseline = baseline && baseline.elapsedSeconds >= 10 && baseline.endedAtEpoch <= performance.timeOrigin;
document.querySelector('#performance-test').textContent = hasBaseline ? `Đo T14 · 30 giây thực · ×${performanceScale}` : 'Đo baseline rAF trang trắng 10 s trước T14';
document.querySelector('#performance-test').onclick = () => {
  if (!hasBaseline) { location.href = './raf-baseline.html'; return; }
  const button = document.querySelector('#performance-test'); button.disabled = true;
  a.params.timeScale = performanceScale; a.reset(); a.start('EAST', a.params.durationMax); a.paused = false;
  const start = { real: performance.now(), sim: a.cycle.now, steps: a.metrics.substeps }; a.lastFrame = start.real;
  setTimeout(() => {
    a.paused = true; const end = performance.now(), samples = a.frameSamples.filter(s => s.real >= start.real);
    const deltas = samples.map(s => s.delta * a.params.millisecondsPerSecond).sort((x, y) => x - y);
    const realSeconds = (end - start.real) / a.params.millisecondsPerSecond, fps = samples.length / realSeconds;
    results.push({ id: 'T14', status: baseline.hz < 55 ? 'môi trường (throttle)' : fps >= 55 && document.visibilityState === 'visible' ? 'PASS' : 'FAIL', measured: {
      baseline,
      frames: samples.length, realSeconds, fps, frameMedianMs: deltas[Math.floor(deltas.length / 2)],
      frameP95Ms: deltas[Math.floor(deltas.length * 0.95)], frameMaxMs: Math.max(...deltas),
      simulatedSeconds: a.cycle.now - start.sim, simulationRate: (a.cycle.now - start.sim) / realSeconds,
      substeps: a.metrics.substeps - start.steps, gelCount: a.params.gelCount, timeScale: a.params.timeScale,
      visibility: document.visibilityState, userAgent: navigator.userAgent, width: a.params.canvas.width, height: a.params.canvas.height,
    }, ...(baseline.hz < 55 ? { reason: 'Đo lại với cửa sổ focus, màn hình chính, không tiết kiệm pin.' } : {}) }); button.disabled = false; show();
  }, 30000);
};
