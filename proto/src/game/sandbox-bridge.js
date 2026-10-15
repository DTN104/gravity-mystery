import { PARAMS } from '../params.js';
import { applyTheme } from './theme.js';
import { toScreen } from '../world/room.js';

export function attach(scene) {
  const root = document.documentElement, p = scene.params, ui = PARAMS.fullGame;
  root.setAttribute('data-full-game', ''); scene.uiVisible = true; scene.uiMode = true;
  const link = document.createElement('link'); link.rel = 'stylesheet'; link.href = './src/game/interface.css'; document.head.append(link);
  applyTheme(root);
  const panel = document.querySelector('#panel-dock');
  const scheduleLine = document.querySelector('#schedule-hour').closest('p'), schedule = document.createElement('details');
  const summary = document.createElement('summary'); summary.textContent = 'Hẹn giờ'; schedule.append(summary, scheduleLine, document.querySelector('#schedule-list'), document.querySelector('#schedule-earliest')); panel.append(schedule);
  const send = data => { if (window.parent !== window) window.parent.postMessage(data, location.origin); };
  const status = () => send({ type: 'sandbox-state', unlocked: [...scene.detector.unlocked], locked: scene.cycle.door.locked, inside: scene.hallway.inside });
  window.addEventListener('message', event => {
    if (event.origin !== location.origin || event.source !== window.parent) return;
    if (event.data?.type === 'sandbox-visibility' && typeof event.data.visible === 'boolean') scene.uiVisible = event.data.visible;
    if (event.data?.type === 'sandbox-exit') {
      const ok = !scene.hallway.inside || scene.hallway.leave(scene.cycle);
      scene.refresh(); status(); send({ type: 'sandbox-exit-result', ok });
    }
  });
  const timer = setInterval(status, ui.bridgeMs); status();
  scene.events.once('shutdown', () => clearInterval(timer));
  const labels = { drag: 'Kéo', wipe: 'Lau', pen: 'Bút mới' };
  for (const [tool, text] of Object.entries(labels)) document.querySelector(`[data-tool="${tool}"]`).textContent = text;
  document.querySelector('#refill').textContent = 'Nạp bình';
  // Cột trái chỉ còn trạng thái + phòng + dòng sự kiện (chiều cao cố định); công cụ/thoại sang cột phải để phòng không co theo chữ.
  const side = document.querySelector('#side'); side.insertBefore(document.querySelector('#game-hud'), panel);
  const left = document.querySelector('#left'), box = document.querySelector('#canvas');
  let layoutKey;
  const fit = (force = false) => {
    const key = `${window.innerHeight}:${left.clientWidth}`;
    if (!force && key === layoutKey) return;
    layoutKey = key;
    const chrome = ['#status-bar', '#events'].reduce((sum, sel) => {
      const el = document.querySelector(sel); if (!el) return sum; const style = getComputedStyle(el);
      return sum + Math.max(el.offsetHeight, parseFloat(style.minHeight) || 0) + (parseFloat(style.marginTop) || 0) + (parseFloat(style.marginBottom) || 0);
    }, 0);
    const main = getComputedStyle(left.parentElement), padding = parseFloat(main.paddingTop) + parseFloat(main.paddingBottom);
    const available = Math.max(ui.minRoomHeight, window.innerHeight - chrome - padding - ui.fitMargin);
    box.style.setProperty('width', `${Math.min(left.clientWidth, available * p.room.width / p.room.height)}px`, 'important');
    scene.scale.refresh();
  };
  link.onload = () => fit(true); window.addEventListener('resize', () => fit());
  const observer = new ResizeObserver(() => fit()); observer.observe(left); scene.events.once('shutdown', () => observer.disconnect());
  scene.hud.refresh(); fit();
  addArt(scene);
}

function addArt(scene) {
  const p = scene.params, ui = PARAMS.fullGame;
  scene.load.image('ui-wall', ui.assets.calibration); scene.load.image('ui-objects', ui.assets.objects);
  scene.load.once('complete', () => {
    const wall = scene.add.image(...Object.values(toScreen({ x: p.room.width / 2, y: p.room.height / 2 }, p)), 'ui-wall')
      .setDisplaySize(p.room.width * p.pixelsPerMetre, p.room.height * p.pixelsPerMetre).setDepth(ui.artDepth);
    const texture = scene.textures.get('ui-objects'), image = texture.source[0].image;
    const canvas = document.createElement('canvas'); canvas.width = image.width; canvas.height = image.height;
    const ctx = canvas.getContext('2d', { willReadFrequently: true }); ctx.drawImage(image, 0, 0);
    const pixels = ctx.getImageData(0, 0, image.width, image.height).data;
    const cellW = Math.floor(image.width / ui.atlasColumns), splitY = Math.floor(image.height * ui.atlasSplit);
    // Chỉ cắt frame hiển thị; giữ nguyên PNG và thân vật lý.
    ui.spriteKinds.forEach((kind, index) => {
      const x0 = index % ui.atlasColumns * cellW, y0 = index < ui.atlasColumns ? 0 : splitY;
      const cellH = index < ui.atlasColumns ? splitY : image.height - splitY;
      let left = cellW, top = cellH, right = 0, bottom = 0;
      for (let y = 0; y < cellH; y++) for (let x = 0; x < cellW; x++) if (pixels[((y0 + y) * image.width + x0 + x) * 4 + 3] > ui.alphaThreshold) {
        left = Math.min(left, x); top = Math.min(top, y); right = Math.max(right, x); bottom = Math.max(bottom, y);
      }
      if (right >= left && bottom >= top) texture.add(kind, 0, x0 + left, y0 + top, right - left + 1, bottom - top + 1);
    });
    const sprites = new Map();
    const ragAt = toScreen(p.sandbox.rag, p), rag = scene.add.image(ragAt.x, ragAt.y, 'ui-objects', 'rag')
      .setDisplaySize(p.sandbox.rag.width * p.pixelsPerMetre * ui.spriteScale.rag, p.sandbox.rag.height * p.pixelsPerMetre * ui.spriteScale.rag).setDepth(ui.spriteDepth);
    const coat = scene.add.graphics().setDepth(p.readable.marksDepth);
    const sync = () => {
      scene.room.graphics.setAlpha(ui.roomAlpha); scene.objectGraphics.setVisible(false);
      const current = new Set(); coat.clear();
      // objectGraphics bị ẩn nên vẽ lại chốt và viền còi ở đây (cùng công thức với ProtoScene.draw)
      const bolt = toScreen({ x: p.bolt.x + scene.bolt.s, y: p.bolt.y }, p), ppm = p.pixelsPerMetre;
      coat.fillStyle(p.colors.bolt).fillRect(bolt.x - p.bolt.width * ppm / 2, bolt.y - p.bolt.height * ppm / 2, p.bolt.width * ppm, p.bolt.height * ppm);
      coat.lineStyle(p.view.lineWidth, p.colors.static).strokeRect(bolt.x - p.bolt.width * ppm / 2, bolt.y - p.bolt.height * ppm / 2, p.bolt.width * ppm, p.bolt.height * ppm);
      if (scene.cycle.state.includes('WARN') && Math.floor(scene.cycle.now / p.view.blinkPeriod) % 2 === 0)
        coat.lineStyle(p.view.coatWidth, p.colors.warning).strokeRect(p.canvas.origin.x, p.canvas.origin.y - p.room.height * ppm, p.room.width * ppm, p.room.height * ppm);
      for (const body of scene.objects.bodies) {
        current.add(body.id); const kind = body.plugin.kind;
        let sprite = sprites.get(body.id);
        if (!sprite) {
          if (kind === 'gel') sprite = scene.add.circle(0, 0, p.gel.radius * p.pixelsPerMetre * ui.spriteScale.gel, p.colors.gel);
          else if (texture.has(kind)) {
            sprite = scene.add.image(0, 0, 'ui-objects', kind);
            const size = p[kind], height = kind === 'mannequin' ? size.height + size.headRadius * 2 : size.height;
            if (kind === 'mannequin') {
              sprite.setScale(height * p.pixelsPerMetre * ui.spriteScale[kind] / sprite.frame.realHeight);
              // Đầu nằm phía trên thân: đặt điểm xoay theo tâm thân, không theo tâm cả ảnh.
              sprite.setOrigin(0.5, 0.5 + size.headRadius / height);
            }
            else sprite.setDisplaySize(size.width * p.pixelsPerMetre * ui.spriteScale[kind], height * p.pixelsPerMetre * ui.spriteScale[kind]);
          } else continue;
          sprite.setDepth(ui.spriteDepth); sprites.set(body.id, sprite);
        }
        sprite.setPosition(body.position.x, body.position.y).setRotation(body.angle).setVisible(scene.hallway.inside || scene.hallway.windowCamera.visible);
        if (scene.coat.coated.has(body.plugin.id)) coat.lineStyle(p.view.coatWidth, p.colors.coated).strokeRect(body.bounds.min.x, body.bounds.min.y,
          body.bounds.max.x - body.bounds.min.x, body.bounds.max.y - body.bounds.min.y);
      }
      for (const [id, sprite] of sprites) if (!current.has(id)) { sprite.destroy(); sprites.delete(id); }
    };
    scene.events.on('postupdate', sync);
    scene.events.once('shutdown', () => { scene.events.off('postupdate', sync); wall.destroy(); rag.destroy(); coat.destroy(); for (const s of sprites.values()) s.destroy(); });
  });
  scene.load.on('loaderror', file => scene.hud.notice(`Không tải được hình ${file.key}; buồng vẫn dùng mô phỏng hiện có.`));
  scene.load.start();
}
