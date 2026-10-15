async page => {
  await page.reload();
  await page.waitForFunction(() => !!window.proto);
  const result = await page.evaluate(async () => {
    const { runFunctionalTests } = await import('/tests/scenarios.js');
    return await runFunctionalTests(window.proto);
  });
  return result;
}
