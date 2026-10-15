async page => {
  await page.reload(); await page.waitForFunction(() => !!window.proto);
  const actions = [], stamp = () => new Date().toISOString();
  const record = async name => actions.push({ at: stamp(), action: name, snapshot: await page.evaluate(() => window.proto.snapshot()) });
  const reset = () => page.getByRole('button', { name: 'Reset vật + luật', exact: true }).click();
  const drags = [];
  for (const pose of ['lying', 'standing']) {
    await page.getByRole('combobox', { name: 'Tư thế (reset để áp dụng)', exact: true }).selectOption(pose); await reset();
    const point = await page.evaluate(() => window.proto.objects.bodies.find(b => b.plugin.kind === 'mannequin').position);
    const box = await page.locator('#canvas canvas').boundingBox();
    await page.mouse.move(box.x + point.x, box.y + point.y); await page.mouse.down();
    await page.mouse.move(box.x + point.x + 30, box.y + point.y - 20, { steps: 10 }); await page.waitForTimeout(300);
    drags.push({ pose, grabbed: await page.evaluate(() => window.proto.mouse.constraint.bodyB?.plugin.kind ?? null) });
    await page.mouse.up();
  }
  await page.getByRole('combobox', { name: 'Tư thế (reset để áp dụng)', exact: true }).selectOption('lying'); await reset();
  await page.getByRole('button', { name: 'Start', exact: true }).click();
  await record('Start EAST from UI at x1');
  await page.waitForFunction(() => window.proto.cycle.state === 'ACTIVE'); await page.waitForTimeout(2500);
  await page.screenshot({ path: 'proto/tests/east-active.png' }); await record('EAST ACTIVE after 2.5 real seconds');
  await page.waitForFunction(() => window.proto.cycle.state === 'IDLE', null, { timeout: 90000 }); await page.waitForTimeout(5000);
  await page.screenshot({ path: 'proto/tests/after-return.png' }); await record('Manual EAST RETURN +5 real seconds');
  await reset();
  await page.getByRole('textbox', { name: 'Chu kỳ tới RETURN (s)', exact: true }).fill('900');
  await page.getByRole('textbox', { name: 'Hẹn lúc', exact: true }).fill('22:00:00');
  await page.getByRole('combobox', { name: 'Tốc độ', exact: true }).selectOption('60');
  await page.getByRole('button', { name: 'Ghi lịch', exact: true }).click();
  await page.getByRole('button', { name: 'Ra hành lang', exact: true }).click();
  await page.waitForFunction(() => window.proto.cycle.state === 'ACTIVE'); await page.waitForTimeout(500);
  await page.screenshot({ path: 'proto/tests/hallway.png' }); await record('Scheduled EAST at x60 through hallway window');
  await page.waitForFunction(() => window.proto.cycle.state === 'IDLE'); await page.waitForTimeout(100);
  await record('Scheduled RETURN and journal');
  await page.getByRole('button', { name: 'Vào phòng', exact: true }).click(); await reset();
  await page.getByRole('textbox', { name: 'Chu kỳ tới RETURN (s)', exact: true }).fill('60');
  await page.getByRole('combobox', { name: 'Tốc độ', exact: true }).selectOption('1');
  await page.getByRole('button', { name: 'WEST', exact: true }).click();
  await page.getByRole('button', { name: 'Start', exact: true }).click();
  await page.waitForFunction(() => window.proto.cycle.state === 'ACTIVE'); await page.waitForTimeout(2500);
  await record('WEST at x1: tray retains gel');
  await page.waitForFunction(() => window.proto.cycle.state === 'IDLE', null, { timeout: 90000 });
  await record('WEST RETURN');
  await page.evaluate(() => { const a = window.proto; a.paused = true; a.draw(); a.refresh(); });
  return { end: stamp(), drags, actions };
}
