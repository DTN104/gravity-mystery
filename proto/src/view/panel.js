import { DIRECTIONS } from '../params.js';

export async function createPanel(app) {
  const { default: GUI } = await import('https://cdn.jsdelivr.net/npm/lil-gui@0.20.0/+esm');
  const p = app.params;
  const gui = new GUI({ title: 'Debug · SI (m, s, kg, N)', width: p.ui.width });
  const gravity = gui.addFolder('Trọng lực');
  const actions = {
    start: () => app.start(p.direction, p.duration), stop: () => app.stop(),
    schedule: () => {
      const match = /^(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(p.scheduleAt);
      if (!match || +match[1] >= p.secondsPerDay / p.secondsPerHour || +match[2] >= p.secondsPerMinute || +(match[3] || 0) >= p.secondsPerMinute)
        return app.message('Giờ hẹn không hợp lệ (HH:MM:SS).');
      app.schedule(+match[1] * p.secondsPerHour + +match[2] * p.secondsPerMinute + +(match[3] || 0), p.direction, p.duration);
    },
    pour: () => { app.tool = 'pour'; }, wipe: () => { app.tool = 'wipe'; }, drag: () => { app.tool = 'drag'; },
    reset: () => app.reset(), cup: () => app.addObject('cup'), pen: () => app.addObject('pen'), book: () => app.addObject('book'),
    anchor: () => app.anchor(!p.mannequinAnchored),
  };
  for (const dir of Object.keys(DIRECTIONS)) gravity.add({ [dir]: () => { p.direction = dir; } }, dir);
  gravity.add(p, 'direction', Object.keys(DIRECTIONS)).name('Hướng').listen();
  gravity.add(p, 'g', 0, p.debug.gMax).name('g (m/s²)');
  gravity.add(p, 'duration', p.durationMin, p.durationMax).name('Chu kỳ tới RETURN (s)');
  gravity.add(actions, 'start').name('Start'); gravity.add(actions, 'stop').name('Stop / trả về an toàn');
  gravity.add(p, 'scheduleAt').name('Hẹn lúc'); gravity.add(actions, 'schedule').name('Ghi lịch');
  gravity.add(p, 'doorIsOpen').name('Cửa đang mở').listen().onChange(value => app.setDoorOpen(value));
  const timing = gui.addFolder('Thời gian');
  timing.add(p, 'timeScale', p.debug.timeScales).name('Tốc độ').listen();
  timing.add(p, 'cooldownEnabled').name('Bật cooldown');
  for (const key of ['warnTime', 'zeroGTime', 'doorUnlockDelay', 'cooldown']) timing.add(p, key, 0, p.cooldown);
  const bolt = gui.addFolder('Chốt');
  bolt.add(p, 'boltDetent', 0, p.debug.boltForceMax).name('Lực lẫy (N)');
  bolt.add(p, 'boltMass', p.epsilon, p.debug.boltMassMax).name('Khối lượng (kg)');
  bolt.add(p, 'boltTravel', p.epsilon, p.room.width).name('Hành trình (m)').onChange(() => app.bolt.set(app.bolt.s));
  const manual = { s: app.bolt.s };
  bolt.add(manual, 's', 0, p.boltTravel).name('Kéo tay (IDLE)').onChange(s => app.setBolt(s));
  const liquid = gui.addFolder('Chất lỏng');
  liquid.add(p, 'dryTime', p.debug.dryMin, p.debug.dryMax).name('Khô sau (s)');
  liquid.add(p, 'streakLength', 0, p.room.width).name('Vệt tối đa (m)');
  liquid.add(p, 'waterVolume', 0, 1).name('Lượng nước (L)');
  liquid.add(p, 'poolRadiusPerLitre', 0, 1).name('Hệ số bán kính');
  liquid.add(actions, 'pour').name('Đổ tại chuột'); liquid.add(actions, 'wipe').name('Lau tại chuột');
  liquid.add(actions, 'drag').name('Kéo vật');
  const objects = gui.addFolder('Vật');
  objects.add(actions, 'reset').name('Reset vật + luật');
  objects.add(p, 'mannequinPose', ['lying', 'standing']).name('Tư thế (reset để áp dụng)');
  for (const key of ['cup', 'pen', 'book']) objects.add(actions, key).name(`Thêm ${key}`);
  objects.add(actions, 'anchor').name('Neo / thả neo hình nộm');
  objects.add(p, 'mannequinMass', p.epsilon, p.debug.mannequinMassMax).onChange(() => app.setMannequinMass());
  objects.add(p, 'gelCount', 0, p.debug.gelMax, 1).name('Hạt gel (reset để áp dụng)');
  objects.add(p, 'gelCoatMin', 1, p.debug.gelMax, 1);
  objects.add(p, 'coatRadius', 0, p.room.width).name('Bán kính phủ (m)');
  const display = gui.addFolder('Hiển thị');
  for (const key of ['showDecals', 'showCoated', 'showGravity']) display.add(p, key);
  display.add(p, 'windowZoom').name('Ô kính (reset để áp dụng)');
  const geometry = gui.addFolder('PARAMS bổ sung (reset để áp dụng)').close();
  for (const key of ['physicsStep', 'airFriction', 'zeroGNoise', 'gelStopSpeed', 'gelStopTime', 'coatInterval', 'wipeRadius']) geometry.add(p, key);
  for (const key of ['collisionCategories', 'room', 'door', 'window', 'bolt', 'table', 'shelf', 'tray', 'cup', 'pen', 'book', 'gel', 'mannequin']) {
    const folder = geometry.addFolder(key).close();
    for (const field of Object.keys(p[key])) {
      if (typeof p[key][field] === 'object') {
        const nested = folder.addFolder(field).close();
        for (const [name, values] of Object.entries(p[key][field])) {
          const part = nested.addFolder(name).close();
          for (const property of Object.keys(values)) part.add(values, property);
        }
      } else folder.add(p[key], field);
    }
  }
  if (p.sandboxMode) gui.hide();
  app.gui = gui; return gui;
}
