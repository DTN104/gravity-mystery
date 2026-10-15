// Keep the document blank and load no engine during the baseline.
const startedAtEpoch = Date.now(), initialVisibility = document.visibilityState;
let start, frames = 0, hidden = initialVisibility !== 'visible';
document.addEventListener('visibilitychange', () => { hidden ||= document.visibilityState !== 'visible'; });
requestAnimationFrame(function sample(t) {
  start ??= t;
  if (t - start < 10000) { frames++; requestAnimationFrame(sample); return; }
  const elapsedSeconds = (t - start) / 1000;
  const result = { frames, elapsedSeconds, hz: frames / elapsedSeconds, startedAtEpoch, endedAtEpoch: Date.now(),
    visibility: document.visibilityState, hiddenDuringSample: hidden, focused: document.hasFocus(), userAgent: navigator.userAgent };
  sessionStorage.setItem('gravity-raf-baseline', JSON.stringify(result));
  const pre = document.createElement('pre'); pre.id = 'baseline-result'; pre.textContent = JSON.stringify(result, null, 2);
  const next = document.createElement('a'); next.href = './regression.html'; next.textContent = 'Chạy T21, rồi đo T14';
  document.body.append(pre, next);
});
