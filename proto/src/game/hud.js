import { clockText } from '../params.js';
import { RULES } from './detector.js';
import { PanelUI, DIRECTION_LABELS } from './panel-ui.js';
import { HallwayUI } from './hallway-ui.js';
import { Cards } from './cards.js';
import { Guide, TASKS } from './guide.js';

const THU = [
  null, // bước mở đầu nay là Guide (C1)
  'Lần đầu em thấy thế này em cũng đứng im một lúc. Giờ thì quen rồi. Quen đến mức không nghĩ về nó nữa.',
  'Anh nhanh hơn em hồi đó.',
];

export class Hud {
  constructor(scene) {
    this.scene = scene; this.queue = []; this.thuSeen = new Set(); this.completed = false;
    const p = scene.params, root = document.documentElement;
    for (const [key, value] of Object.entries(p.colors)) root.style.setProperty(`--${key}`, `#${value.toString(16).padStart(6, '0')}`);
    for (const [key, value] of Object.entries(p.sandbox)) {
      if (typeof value === 'number') root.style.setProperty(`--${key}`, `${value}px`);
      else if (typeof value === 'string') root.style.setProperty(`--${key}`, value);
    }
    root.style.setProperty('--canvasWidth', `${p.canvas.width}px`);
    root.style.setProperty('--cardFraction', `${p.sandbox.cardFraction * 100}%`);
    for (const key of ['layoutMax', 'sideColumn', 'eventFont']) root.style.setProperty(`--${key}`, `${p.readable[key]}px`);
    document.querySelector('#bolt-inset').innerHTML = `<strong>Chốt bên trong · ×${p.boltInsetZoom}</strong><canvas id="bolt-detail"></canvas><span id="bolt-label"></span>`;
    document.querySelector('#game-hud').innerHTML = `<p id="handrail-hint"></p>
      <div class="toolbar"><button id="open-book">Sổ tay</button>
      <button id="hallway-leave">Ra hành lang</button><button id="hallway-enter" hidden>Vào phòng</button><button id="intercom" hidden>Intercom → Phòng điều khiển</button></div>
      <div class="toolbar" id="tools"><button data-tool="drag">Kéo/đặt vật</button><button data-tool="pour" id="water-tool">Bình nước</button>
      <button data-tool="wipe">Giẻ lau</button><button data-tool="pen">Lấy bút mới</button><button id="refill">Đổ đầy lại</button></div>
      <p id="hover-name"></p><p id="tool-hint"></p><p id="game-notice" class="refusal" aria-live="polite"></p>`;
    this.cards = new Cards(this); this.guide = new Guide(scene, this);
    this.panel = new PanelUI(scene, this); this.hallway = new HallwayUI(scene, this);
    document.querySelector('#skip-wait').onclick = () => { if (!scene.skipWait()) this.notice('Không có gì để bỏ qua lúc này.'); };
    document.querySelector('#open-book').onclick = () => this.book();
    for (const button of document.querySelectorAll('[data-tool]')) button.onclick = () => scene.selectTool(button.dataset.tool);
    document.querySelector('#refill').onclick = () => scene.refill();
    const inset = document.querySelector('#bolt-detail'); inset.width = p.sandbox.insetWidth; inset.height = p.sandbox.insetHeight;
    const cursor = document.createElement('canvas'), size = p.sandbox.cursorSize; cursor.width = cursor.height = size;
    const width = size * p.bottle.width / p.bottle.height, ctx = cursor.getContext('2d');
    ctx.fillStyle = `#${p.colors.bottle.toString(16)}`; ctx.fillRect((size - width) / 2, 0, width, size);
    ctx.strokeStyle = `#${p.colors.hover.toString(16)}`; ctx.lineWidth = p.sandbox.borderWidth; ctx.strokeRect((size - width) / 2, 0, width, size);
    this.waterCursor = `url(${cursor.toDataURL()}) ${size / 2} ${size / 2}, crosshair`;
    this.refresh(); this.renderEvents([]); this.guide.start();
  }
  onCardClosed(id) { if (id === 'quiz') { this.currentQuiz = null; this.nextQuiz(); } }
  onRotate(dir) { this.guide.onRotate(dir); }
  onReturn() { this.guide.onReturn(); this.nextQuiz(); } // B4: câu hỏi xếp hàng tới khi về Xuống
  renderEvents(lines) {
    const box = document.querySelector('#events'); if (!box) return;
    if (this.scene.uiMode) lines = lines.slice(-this.scene.params.fullGame.eventLineLimit);
    if (!lines.length) { box.replaceChildren(Object.assign(document.createElement('p'), { className: 'older', textContent: 'Sự kiện trong phòng sẽ hiện ở đây.' })); return; }
    box.replaceChildren(...lines.map((line, i) => {
      const el = document.createElement('p'); el.textContent = line.text;
      const age = lines.length - 1 - i; if (age === 1 || age === 2) el.className = 'old'; else if (age >= 3) el.className = 'older';
      return el;
    }));
  }
  // B5: "overlay" nay chỉ có nghĩa là đang có câu hỏi quy tắc mở (để xếp hàng câu hỏi), không chặn thao tác.
  get overlayOpen() { return this.cards.isOpen('quiz'); }
  notice(text) {
    document.querySelector('#game-notice').textContent = text; clearTimeout(this.noticeTimer);
    this.noticeTimer = setTimeout(() => { document.querySelector('#game-notice').textContent = ''; }, this.scene.params.sandbox.refusalSeconds * this.scene.params.millisecondsPerSecond);
  }
  dialogue(speaker, text, done = false) {
    this.scene.params.timeScale = 1;
    this.cards.show('dialogue', speaker, text, [{ label: done ? 'Xong' : 'Đã hiểu', primary: true, onClick: () => {
      if (done) { this.completed = true; document.querySelector('#handrail-hint').textContent = 'Đã hoàn thành buồng thử nghiệm.'; } } }]);
    this.refresh();
  }
  book() {
    const body = [];
    for (const rule of RULES) {
      const button = document.createElement('button'); button.className = 'rule';
      const unlocked = this.scene.detector.unlocked.has(rule.id), discovered = this.scene.detector.discovered.has(rule.id);
      button.textContent = `${rule.id} · ${unlocked ? rule.answers[0] : discovered ? '? — đã có quan sát, bấm để trả lời' : '?'}`;
      button.onclick = () => {
        if (!discovered) return this.notice('Chưa có quan sát cho ô này. Hãy thử trong buồng.');
        this.cards.close('book'); this.quiz(rule.id);
      };
      if (unlocked) button.classList.add('unlocked'); body.push(button);
    }
    this.cards.show('book', 'Sổ quy tắc', body, [{ label: 'Đóng sổ' }]);
  }
  detected(ids) { if (this.scene.params.ruleAutoOpen) { this.queue.push(...ids); this.nextQuiz(); } }
  nextQuiz() {
    if (this.overlayOpen || !this.queue.length || this.scene.cycle.state !== 'IDLE') return; // B4: không hiện giữa chu kỳ
    const id = this.queue.shift(); if (!this.scene.detector.unlocked.has(id)) this.quiz(id);
  }
  quiz(id) {
    const rule = RULES.find(r => r.id === id); this.currentQuiz = id; this.scene.params.timeScale = 1;
    const feedback = document.createElement('p'); feedback.id = 'quiz-feedback'; feedback.setAttribute('aria-live', 'polite');
    const choices = rule.answers.map((text, answer) => ({ text, answer }));
    for (let i = choices.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [choices[i], choices[j]] = [choices[j], choices[i]]; }
    const body = [feedback];
    for (const choice of choices) {
      const button = document.createElement('button'); button.className = 'answer'; button.textContent = choice.text;
      button.onclick = () => {
        if (!this.scene.detector.answer(id, choice.answer, this.scene.cycle.now)) { feedback.textContent = 'Chưa chắc. Thử lại rồi xem.'; return; }
        this.cards.close('quiz'); this.refresh();
        if (this.scene.detector.unlocked.size === RULES.length && this.scene.params.thuDialogue && !this.thuSeen.has(2)) {
          this.thuSeen.add(2); this.dialogue('Thư', THU[2], true);
        }
      }; body.push(button);
    }
    this.cards.show('quiz', `Quan sát ${id} · Bạn rút ra điều gì?`, body, [{ label: 'Để sau' }]);
    this.refresh();
  }
  drawInset() {
    const a = this.scene, p = a.params, canvas = document.querySelector('#bolt-detail'), ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const scale = p.pixelsPerMetre * p.boltInsetZoom, travel = p.boltTravel * scale;
    const x = (canvas.width - travel - p.bolt.width * scale) / 2, y = canvas.height / 2;
    ctx.strokeStyle = `#${p.colors.static.toString(16)}`; ctx.lineWidth = p.view.coatWidth;
    ctx.strokeRect(x, y - p.bolt.height * scale, travel + p.bolt.width * scale, p.bolt.height * scale * 2);
    ctx.fillStyle = `#${p.colors.bolt.toString(16)}`; ctx.fillRect(x + a.bolt.s * scale, y - p.bolt.height * scale / 2, p.bolt.width * scale, p.bolt.height * scale);
    document.querySelector('#bolt-label').textContent = a.bolt.s === 0 ? 'Mở' : a.bolt.s === p.boltTravel ? 'Đã cài' : 'Đang trượt';
  }
  refresh() {
    const a = this.scene, c = a.cycle, p = a.params;
    const floor = { DOWN: 'XUỐNG', UP: 'LÊN', WEST: 'TÂY', EAST: 'ĐÔNG' }[c.direction] || '— (không trọng lực)';
    const mmss = sec => { const w = Math.max(0, Math.ceil(sec)); return `${Math.floor(w / 60)}:${String(w % 60).padStart(2, '0')}`; };
    let next = '';
    if (c.state === 'WARN') next = `xoay sau ${mmss(c.deadline - c.now)}`;
    else if (c.state === 'ZERO_G') next = `không trọng lực ${mmss(c.deadline - c.now)}`;
    else if (c.state === 'ACTIVE' || c.state === 'WARN_RETURN') next = `về Xuống sau ${mmss(c.returnAt - c.now)}`;
    else if (c.door.locked) next = `mở khóa sau ${mmss(c.unlockAt - c.now)}`;
    else { const e = c.scheduleEntries?.find(x => !x.fired); if (e) next = `hẹn ${clockText(e.atSeconds).slice(0, 5)} (còn ${mmss(e.atSeconds - c.now)})`; else next = 'đang chờ'; }
    document.querySelector('#game-status').textContent = `${clockText(c.now).slice(0, 5)} · SÀN: ${floor} · ${next} · ×${p.timeScale} · ${a.hallway.inside ? 'trong buồng' : 'hành lang'}`;
    const skip = document.querySelector('#skip-wait'), target = a.nextMilestone?.();
    const skipping = a.skipTarget !== null && a.skipTarget !== undefined;
    skip.hidden = !skipping && (target === null || target === undefined || target - p.readable.skipToMarginSec <= c.now);
    skip.disabled = skipping; skip.textContent = skipping ? `Đang tua ×${p.readable.skipSpeed}…` : 'Bỏ qua chờ ▸';
    if (!this.completed) document.querySelector('#handrail-hint').textContent = c.state !== 'IDLE' ? 'Bạn đang bám tay vịn.' : this.hallway.pendingMaster ? 'Lâm đang đợi buồng hết cooldown.' : '';
    this.panel.refresh(); this.hallway.refresh();
    document.querySelector('#tools').hidden = !a.hallway.inside;
    for (const button of document.querySelectorAll('#tools button')) button.disabled = !a.canInteract();
    for (const button of document.querySelectorAll('[data-tool]')) button.setAttribute('aria-pressed', button.dataset.tool === a.tool);
    document.querySelector('#water-tool').textContent = a.uiMode
      ? `Đổ nước · ${(a.bottle?.plugin.volume || 0).toLocaleString('vi-VN', { minimumFractionDigits: p.fullGame.volumeDigits, maximumFractionDigits: p.fullGame.volumeDigits })} L`
      : `Bình nước · ${(a.bottle?.plugin.volume || 0).toFixed(1)} L`;
    document.querySelector('#tool-hint').textContent = { drag: p.mannequinAnchored ? 'Hình nộm đã móc vào tay vịn. Bấm tay vịn để tháo.' : 'Giữ chuột để kéo. Đưa hình nộm gần tay vịn để móc; bấm tay vịn để tháo.',
      pour: 'Bình nước đã chọn · bấm lên bề mặt để đổ.', wipe: 'Giẻ đã chọn · bấm vào dấu vết để lau.', pen: 'Bút mới đã chọn · bấm trong phòng để đặt.' }[a.tool];
    if (a.uiMode && a.tool === 'drag' && !p.mannequinAnchored) document.querySelector('#tool-hint').textContent = '';
    document.querySelector('#canvas').style.cursor = a.canInteract() ? a.tool === 'drag' ? 'grab' : a.tool === 'pour' ? this.waterCursor : 'crosshair' : 'default';
    document.querySelector('#bolt-inset').hidden = a.hallway.inside; this.drawInset();
    TASKS.forEach((task, i) => document.querySelector(`#task-${i}`).classList.toggle('complete', task.rules.every(id => a.detector.unlocked.has(id))));
    if (p.thuDialogue && !a.hallway.inside && c.state === 'ACTIVE' && !this.thuSeen.has(1) && !this.overlayOpen && !this.guide.active) {
      this.thuSeen.add(1); this.dialogue('Thư', THU[1]);
    }
  }
}
