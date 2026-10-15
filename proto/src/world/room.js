export function toScreen(point, p) {
  return { x: p.canvas.origin.x + point.x * p.pixelsPerMetre, y: p.canvas.origin.y - point.y * p.pixelsPerMetre };
}

export function toWorld(point, p) {
  const origin = toScreen({ x: 0, y: 0 }, p), unit = toScreen({ x: 1, y: 1 }, p);
  return { x: (point.x - origin.x) / (unit.x - origin.x), y: (point.y - origin.y) / (unit.y - origin.y) };
}

export function createRoom(scene, p) {
  const M = Phaser.Physics.Matter.Matter;
  const bodies = [];
  function rectangle(x, y, width, height, surface, name) {
    const point = toScreen({ x, y }, p);
    const c = p.collisionCategories;
    const body = M.Bodies.rectangle(point.x, point.y, width * p.pixelsPerMetre, height * p.pixelsPerMetre,
      { isStatic: true, friction: p.room.friction, label: name,
        collisionFilter: { category: surface === 'TABLE' ? c.table : c.world, mask: c.world | c.table | c.loose | c.mannequin } });
    body.plugin = { surface, name }; bodies.push(body); return body;
  }
  const { width: w, height: h, wall: d } = p.room;
  rectangle(w / 2, -d / 2, w + 2 * d, d, 'FLOOR', 'Sàn');
  rectangle(w / 2, h + d / 2, w + 2 * d, d, 'CEIL', 'Trần');
  rectangle(-d / 2, h / 2, d, h, 'WEST', 'Tường Tây');
  rectangle(w + d / 2, h / 2, d, h, 'EAST', 'Tường Đông');
  const table = p.table;
  rectangle((table.left + table.right) / 2, table.y - table.thickness / 2, table.right - table.left, table.thickness, 'TABLE', 'Mặt bàn');
  for (const x of [table.left + table.legInset, table.right - table.legInset])
    rectangle(x, (table.y - table.thickness) / 2, table.legWidth, table.y - table.thickness, 'TABLE', 'Chân bàn');
  const shelf = p.shelf;
  rectangle((shelf.left + shelf.right) / 2, shelf.y - shelf.thickness / 2, shelf.right - shelf.left, shelf.thickness, 'SHELF', 'Thanh giá');
  const tray = p.tray;
  for (const y of [tray.bottom, tray.top]) rectangle((tray.left + tray.right) / 2, y, tray.right - tray.left, tray.thickness, 'TRAY', 'Khay gel');
  M.World.add(scene.matter.world.localWorld, bodies);
  const graphics = scene.add.graphics();
  const topLeft = toScreen({ x: 0, y: h }, p);
  graphics.fillStyle(p.colors.room).fillRect(topLeft.x, topLeft.y, w * p.pixelsPerMetre, h * p.pixelsPerMetre);
  const door = toScreen({ x: p.door.x - p.door.width / 2, y: p.door.y + p.door.height / 2 }, p);
  graphics.fillStyle(p.colors.door, p.view.poolAlpha).fillRect(door.x, door.y, p.door.width * p.pixelsPerMetre, p.door.height * p.pixelsPerMetre);
  const window = toScreen({ x: p.window.x - p.window.width / 2, y: p.window.y + p.window.height / 2 }, p);
  graphics.lineStyle(p.view.lineWidth, p.colors.static).strokeRect(window.x, window.y, p.window.width * p.pixelsPerMetre, p.window.height * p.pixelsPerMetre);
  graphics.fillStyle(p.sandboxMode ? p.sandbox.wallColor : p.colors.static);
  for (const body of bodies) graphics.fillPoints(body.vertices, true);
  for (const rail of p.handrails) {
    const point = toScreen(rail, p);
    graphics.fillStyle(p.colors.static).fillCircle(point.x, point.y, p.bolt.height * p.pixelsPerMetre);
  }
  return { bodies, graphics };
}
