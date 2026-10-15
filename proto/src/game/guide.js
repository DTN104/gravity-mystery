// C1 — Thư dẫn ba bước có trỏ. C2 — thẻ "Việc có thể thử" là nút, bấm thì khoanh vật liên quan (không làm hộ).
export const TASKS = [
  { text: 'Ca nước: ca đã ở trên bàn. Chọn ▶ Đông, 1 phút, rồi XOAY NGAY. Nhìn nước trên tường lúc xoay và khi trở về Xuống.', rules: ['R1'], targets: ['cup', 'board'] },
  { text: 'Nước trên sàn: chọn Bình nước, bấm sát sàn để đổ. Chờ vài giây rồi xoay ▶ Đông. Nhìn vũng nước thay đổi.', rules: ['R2'], targets: ['bottle', 'floor', 'board'] },
  { text: 'Qua ô kính: chọn ▶ Đông, 1 phút; nhập Giờ/Phút sau mốc "Sớm nhất có thể hẹn tiếp", rồi + Thêm lịch. Ra hành lang trước còi, nhìn hình nộm và chốt. Khi cửa hết khóa, thử Vào phòng; nếu chốt chặn, bấm Intercom → Phòng điều khiển rồi chờ vào lại.', rules: ['R3', 'R4'], targets: ['board', 'door', 'mannequin'] },
  { text: 'Bút mới và gel: xoay ▶ Đông để gel văng khỏi khay. Chờ trở về Xuống và gel đứng yên, rồi Lấy bút mới → bấm vào đống gel. So sánh bút mới với vật có sẵn.', rules: ['R5'], targets: ['tray', 'pen-tool'] },
];

const STEPS = [
  null,
  { who: 'Thư', text: 'Thử kéo cái ca đang được khoanh sang chỗ khác trên bàn, rồi thả.' },
  { who: 'Thư', text: 'Giờ mở Bảng cục bộ: bấm ▶ Đông, rồi bấm XOAY NGAY.' },
  { who: 'Thư', text: 'Nhìn.' },
  { who: 'Thư', text: 'Còn lại anh tự thử. Danh sách "Việc có thể thử" — bấm một dòng để được chỉ chỗ.' },
];

export class Guide {
  constructor(scene, hud) {
    this.scene = scene; this.hud = hud; this.root = document.querySelector('#guide'); this.step = 0; this.done = false;
    const list = document.querySelector('#tasks');
    if (list) TASKS.forEach((task, i) => {
      const li = document.createElement('li'); li.id = `task-${i}`;
      const button = document.createElement('button'); button.className = 'task'; button.textContent = task.text;
      button.onclick = () => this.point(task.targets); li.append(button); list.append(li);
    });
  }
  get active() { return this.step > 0 && !this.done; }
  target(name) {
    const s = this.scene, p = s.params, body = kind => s.objects.bodies.find(b => b.plugin.kind === kind);
    switch (name) {
      case 'cup': case 'bottle': case 'mannequin': return { kind: 'body', body: body(name) };
      case 'board': return { kind: 'board' };
      case 'floor': return { kind: 'point', x: p.room.width / 2, y: 0.05, r: 0.3 };
      case 'door': return { kind: 'rect', x: p.door.x, y: p.door.y, w: p.door.width, h: p.door.height };
      case 'tray': return { kind: 'rect', x: (p.tray.left + p.tray.right) / 2, y: (p.tray.bottom + p.tray.top) / 2, w: p.tray.right - p.tray.left, h: p.tray.top - p.tray.bottom };
      default: return null;
    }
  }
  flash(selector, ms) {
    for (const el of document.querySelectorAll(selector)) { el.classList.add('guide-target'); clearTimeout(el.guideTimer); if (ms) el.guideTimer = setTimeout(() => el.classList.remove('guide-target'), ms); }
  }
  unflash() { for (const el of document.querySelectorAll('.guide-target')) { clearTimeout(el.guideTimer); el.classList.remove('guide-target'); } }
  // C2
  point(targets) {
    const ms = this.scene.params.readable.taskPointMs, sec = ms / this.scene.params.millisecondsPerSecond;
    for (const name of targets) {
      if (name === 'pen-tool') this.flash('#tools [data-tool="pen"]', ms);
      else if (name === 'board') { this.scene.marks?.ring(this.target(name), sec); this.flash('#panel-dock', ms); }
      else this.scene.marks?.ring(this.target(name), sec);
    }
  }
  // C1
  start() {
    this.done = false; this.step = 0; this.unflash();
    if (!this.scene.params.thuDialogue || !this.root) { this.render(); return; }
    this.goto(1);
  }
  skip() { this.done = true; this.scene.marks?.clearRing('guide'); this.unflash(); this.render(); }
  goto(step) {
    this.step = step; this.scene.marks?.clearRing('guide'); this.unflash();
    if (step === 1) this.scene.marks?.ring(this.target('cup'), Infinity, 'guide');
    if (step === 2) { this.scene.marks?.ring(this.target('board'), Infinity, 'guide'); this.flash('#panel-dock, #directions [data-dir="EAST"], #rotate-now'); }
    this.render();
  }
  onDrop(body) { if (this.active && this.step === 1 && body?.plugin.kind === 'cup') this.goto(2); }
  onRotate(dir) {
    if (!this.active || this.step !== 2) return;
    if (dir === 'DOWN') return this.hud.notice('Chọn một hướng khác Xuống để thấy khác biệt.');
    this.goto(3);
  }
  onReturn() { if (this.active && this.step === 3) this.goto(4); }
  render() {
    if (!this.root) return;
    this.root.hidden = !this.active; this.root.replaceChildren();
    if (!this.active) return;
    const s = STEPS[this.step];
    const h = document.createElement('h2'); h.textContent = `${s.who} · ${Math.min(this.step, 3)}/3`;
    const p = document.createElement('p'); p.textContent = s.text; p.className = 'guide-text';
    const bar = document.createElement('div'); bar.className = 'toolbar';
    const skip = document.createElement('button'); skip.textContent = this.step === 4 ? 'Xong' : 'Bỏ hướng dẫn'; skip.onclick = () => this.skip();
    bar.append(skip); this.root.append(h, p, bar);
  }
}
