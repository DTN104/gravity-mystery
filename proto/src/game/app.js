import { PARAMS } from '../params.js';
import { applyTheme } from './theme.js';
import { CaseState, reconstruction, validSandboxState } from './case-state.js';
import { EVIDENCE, PEOPLE, PRESENT, JOURNAL, REPLAY_OPTIONS, VERDICT_OPTIONS, CONFESSION } from './case-data.js';
import { RULES } from './detector.js';

applyTheme();
const p = PARAMS.fullGame, stage = document.querySelector('#stage'), frame = document.querySelector('#calibration-frame');
let state = new CaseState(), view = 'menu', selected = null, person = 'lam', reply = '', currentQuestion = '', fileTab = 'evidence', replayResult = null;
let sandbox = null, pendingView = null, resetAsked = false, presenting = false, diagnosticAt = null, diagnosticWaiting = false;
let toastTimer;
const escape = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const button = (text, attributes = '', primary = false) => `<button ${attributes} class="${primary ? 'primary' : ''}">${escape(text)}</button>`;
const goButton = (text, target, primary = false) => button(text, `data-go="${target}"`, primary);
const portrait = id => `<div class="portrait" aria-hidden="true" style="--portrait-position:${p.portraits[id]}%"></div>`;
const coordinates = values => `--x:${values[0]}%;--y:${values[1]}%`;
const titles = { menu: ['Hồ sơ điều tra', ''], hallway: ['Hành lang', 'Chọn phòng hoặc người muốn gặp.'], lab: ['Lab A · Ảnh hiện trường', 'Bấm một dấu vết để xem xét và ghi vào hồ sơ.'], dialogue: ['Hội thoại', 'Hỏi từ lời khai và vật chứng đã ghi nhận.'], file: ['Hồ sơ vụ án', 'Quan sát, lời khai và giả thuyết được lưu trong phiên này.'], control: ['Phòng điều khiển', 'Đọc nhật ký và kiểm tra dữ liệu vận hành.'], calibration: ['Buồng hiệu chuẩn', 'Tự thử cơ chế; quy tắc được mở từ quan sát của bạn.'], replay: ['Tái hiện Lab A', 'Minh hoạ các điều kiện ban đầu theo kịch bản.'], conclusion: ['Kết luận điều tra', 'Chọn kết luận và bằng chứng của bạn.'], help: ['Cách chơi', 'Khám hiện trường → hỏi nhân vật → thí nghiệm → đối chiếu.'] };

function notify(text) {
  const el = document.querySelector('#notification'); el.textContent = text; el.hidden = false;
  clearTimeout(toastTimer); toastTimer = setTimeout(() => { el.hidden = true; }, p.notifyMs);
}
function options(values, chosen, placeholder = 'Chọn…') { return `<option value="">${placeholder}</option>${Object.entries(values).map(([id, label]) => `<option value="${id}" ${chosen === id ? 'selected' : ''}>${escape(label)}</option>`).join('')}`; }
function send(data) { if (frame.src) frame.contentWindow.postMessage(data, location.origin); }
function go(target, allowExit = false) {
  if (target === 'book') { fileTab = 'rules'; target = 'file'; }
  if (!Object.hasOwn(titles, target)) return;
  if (view === 'calibration' && target !== view && !allowExit) {
    if (!sandbox) return notify('Buồng đang tải. Chờ bảng điều khiển hiện rồi thử lại.');
    if (sandbox.inside) {
      if (sandbox.locked) return notify('Cửa đang khóa. Chờ trở về Xuống và mở khóa trước khi ra khỏi buồng.');
      pendingView = target; send({ type: 'sandbox-exit' }); return;
    }
  }
  if (target === 'calibration' && !frame.src) frame.src = './sandbox.html?ui=game';
  document.querySelector('#notification').hidden = true; clearTimeout(toastTimer);
  view = target; send({ type: 'sandbox-visibility', visible: view === 'calibration' }); render();
  window.scrollTo({ top: 0, behavior: 'instant' });
}
function observation(id) {
  const e = EVIDENCE[id];
  if (!e) return '<h2>Chọn một dấu vết</h2><p class="muted">Các vòng tròn đánh dấu điểm có thể khám nghiệm. Bạn cũng có thể dùng danh sách bên dưới.</p>';
  if (!state.available(id)) return `<h2>${escape(e.title)}</h2><p class="muted">Terminal đang khóa. Hỏi Lâm xin quyền sau khi đã học đủ quy tắc.</p>${button('Gặp Lâm', 'data-person="lam"')}`;
  return `<p class="eyebrow">${escape(e.kind || 'Quan sát')}</p><h2>${escape(e.title)}</h2><p>${escape(e.text)}</p><p class="source">Nguồn: ${escape(e.place)}</p>
    ${state.interpretation(id) ? `<div class="interpretation"><strong>Đọc lại sau thí nghiệm</strong><p>${escape(state.interpretation(id))}</p></div>` : ''}
    ${button(state.collected.has(id) ? 'Đã ghi vào hồ sơ' : 'Ghi vào hồ sơ', `data-collect="${id}" ${state.collected.has(id) ? 'disabled' : ''}`, true)}
    ${id === 'E8' ? `<h3>Nhật ký · không lưu hướng</h3>${journalTable(JOURNAL.filter(r => r.room === 'Lab A'))}` : ''}
    ${e.rule ? `<div class="actions">${goButton('Kiểm chứng trong buồng hiệu chuẩn', 'calibration')}</div>` : ''}`;
}
function journalTable(rows) { return `<table><thead><tr>${['Giờ', 'Phòng', 'Sự kiện', 'Nguồn'].map(t => `<th scope="col">${t}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${['time', 'room', 'event', 'origin'].map(k => `<td>${escape(r[k])}</td>`).join('')}</tr>`).join('')}</tbody></table>`; }
function menu() {
  return `<section class="scene menu"><div class="menu-copy"><p class="eyebrow">Điều tra viên Nguyễn Hoài An</p><h2>TRẠM<br>THIÊN BÌNH</h2><p>Một người chết trong phòng khóa kín. Công cụ điều tra của bạn là những thí nghiệm về trọng lực.</p>
    <div class="stack">${state.active ? button('Quay lại phiên đang chơi', 'data-go="hallway"', true) : ''}${button('Bắt đầu điều tra', 'data-action="start"', !state.active)}${goButton('Buồng hiệu chuẩn', 'calibration')}${goButton('Cách chơi', 'help')}</div>
    ${resetAsked ? `<div class="panel"><p>Bắt đầu lượt mới sẽ xóa bằng chứng, lời khai, giả thuyết và phiên buồng hiện tại.</p><div class="actions">${button('Xóa phiên và bắt đầu lại', 'data-action="restart"', true)}${button('Giữ phiên hiện tại', 'data-action="cancel-reset"')}</div></div>` : ''}
    <p class="source">Bản thử nghiệm · Chưa lưu tiến trình</p></div></section>`;
}
function hallway() {
  return `<div class="split"><section class="scene corridor">${Object.entries(p.doors).map(([id, xy]) => `<button class="door-link" style="${coordinates(xy)}" data-go="${id}">${{ lab: 'Lab A', calibration: 'Hiệu chuẩn', control: 'Điều khiển' }[id]}</button>`).join('')}<div class="scene-caption"><strong>Biên bản sơ bộ</strong><p>Lâm đề xuất kết luận “tai nạn vận hành”. Bạn có quyền chưa ký và tự kiểm chứng.</p></div></section>
    <aside class="panel"><p class="eyebrow">Trạm Thiên Bình · 09:30</p><h2>Gặp nhân vật</h2><div class="stack">${Object.entries(PEOPLE).map(([id, npc]) => `<button class="person-button" data-person="${id}">${portrait(id)}<span>${npc.short}<small>${npc.role}</small></span></button>`).join('')}</div><div class="actions">${goButton('Mở hồ sơ', 'file')}</div></aside></div>`;
}
function lab() {
  const all = { ...p.hotspots, TERMINAL: p.hotspots.TERMINAL };
  return `<div class="split"><section class="scene lab-scene" aria-label="Ảnh hiện trường Lab A"><div class="victim" role="img" aria-label="Minh hoạ vị trí ông Hạo" style="${coordinates(p.victimPosition)}"></div>${Object.entries(all).map(([id, xy]) => `<button class="hotspot ${selected === id ? 'selected' : ''}" style="${coordinates(xy)}" data-evidence="${id}" aria-label="${escape(id === 'TERMINAL' ? 'Terminal Hạo' : EVIDENCE[id].title)}">${state.collected.has(id) ? '✓' : '○'}<span class="hotspot-label">${escape(id === 'TERMINAL' ? 'Terminal Hạo' : EVIDENCE[id].title)}</span></button>`).join('')}</section><aside class="panel">${observation(selected)}</aside></div>
    <div class="actions" aria-label="Các điểm khám nghiệm">${Object.keys(p.hotspots).filter(id => id !== 'TERMINAL').map(id => button(EVIDENCE[id].title, `data-evidence="${id}"`)).join('')}${button('Terminal Hạo', 'data-evidence="TERMINAL"')}</div>
    ${state.visited.size >= p.hypothesisAfter ? `<section class="panel"><h3>Chuyện gì đã xảy ra?</h3><p class="muted">Ghi giả thuyết ban đầu của bạn. Bạn có thể sửa sau khi thí nghiệm.</p>${inferences()}</section>` : ''}`;
}
function dialogue() {
  const npc = PEOPLE[person];
  const choices = npc.questions.map(q => `<button data-question="${q.id}" aria-pressed="${q.id === currentQuestion}" ${q.secondRound && state.rules.size < p.secondRoundRules ? 'disabled' : ''}>${escape(q.text)}${q.secondRound && state.rules.size < p.secondRoundRules ? ` · cần ${p.secondRoundRules} quy tắc` : state.questions.has(`${person}:${q.id}`) ? ' · đã hỏi' : ''}</button>`).join('');
  return `<div class="split"><section class="scene corridor dialogue-scene">${portrait(person)}</section><aside class="panel"><p class="eyebrow">${escape(npc.role)}</p><h2>${escape(npc.name)}</h2><div class="quote">${escape(reply || npc.opening)}</div><h3>Bạn muốn hỏi gì?</h3><div class="stack">${choices}</div>
    <div class="actions">${button(presenting ? 'Ẩn bằng chứng' : 'Đưa bằng chứng', 'data-action="present"')}${goButton('Kết thúc trò chuyện', 'hallway')}</div>
    ${presenting ? `<p class="muted">Chọn một vật chứng đã ghi. Nhánh chưa kiểm chứng sẽ ghi rõ điều kiện.</p><div class="stack">${[...state.collected].map(id => button(EVIDENCE[id].title + (state.canPresent(person, id) ? '' : ' · chưa có nhánh đối chất'), `data-present="${id}" ${state.canPresent(person, id) ? '' : 'disabled'}`)).join('') || '<p>Chưa ghi bằng chứng nào.</p>'}</div>` : ''}</aside></div>`;
}
function inferences() {
  return `<p class="source">Giả thuyết tạm thời — có thể để trống hoặc sửa sau thí nghiệm.</p><div class="inferences">${[['what', 'Chuyện gì?', { accident: 'Tai nạn', fight: 'Ẩu đả', unknown: 'Chưa rõ' }], ['when', 'Khi nào?', { before: 'Trước chu kỳ', during: 'Trong chu kỳ', unknown: 'Chưa rõ' }], ['who', 'Ai?', { lam: 'Lâm', thu: 'Thư', khoa: 'Khoa', unknown: 'Chưa rõ' }]].map(([id, label, values]) => `<label>${label}<select data-inference="${id}">${options(values, state.inference[id], 'Chưa kết luận')}</select></label>`).join('')}</div>`;
}
function file() {
  const tabs = [['evidence', 'Bằng chứng'], ['statements', 'Lời khai'], ['inference', 'Giả thuyết'], ['rules', 'Sổ quy tắc']];
  let content = '';
  if (fileTab === 'evidence') content = `<div class="file-layout"><div class="panel stack file-list">${[...state.collected].map(id => button(EVIDENCE[id].title, `data-file-evidence="${id}"`)).join('') || '<p class="muted">Chưa ghi vật chứng nào. Vào Lab A, chọn dấu vết rồi Ghi vào hồ sơ.</p>'}</div><article class="panel">${observation(selected && state.collected.has(selected) ? selected : [...state.collected][0])}</article></div>${inferences()}`;
  if (fileTab === 'statements') content = `<div class="stack">${[...state.statements.values()].map(s => `<article class="panel"><p class="source">Lời khai · ${escape(PEOPLE[s.person].name)}</p><h3>${escape(s.question)}</h3><p>${escape(s.text)}</p>${button(`Hỏi lại ${PEOPLE[s.person].short}`, `data-person="${s.person}"`)}</article>`).join('') || '<section class="panel">Chưa có lời khai. Gặp nhân vật ở hành lang để hỏi.</section>'}</div>`;
  if (fileTab === 'inference') content = `<section class="panel"><h2>Giả thuyết của bạn</h2><p>Đây là ghi nhận của bạn, chưa được chấm đúng sai.</p>${inferences()}<div class="actions">${goButton('Tái hiện điều kiện ban đầu', 'replay')}${goButton('Viết kết luận', 'conclusion')}</div></section>`;
  if (fileTab === 'rules') content = `<section class="panel"><h2>Quy tắc đã tự kiểm chứng</h2><div class="stack">${RULES.map(r => `<article class="quote"><strong>${r.id}</strong><p>${state.rules.has(r.id) ? escape(r.answers[0]) : 'Chưa có quy tắc được xác nhận. Hãy quan sát và trả lời câu hỏi trong buồng hiệu chuẩn.'}</p></article>`).join('')}</div>${goButton('Vào buồng hiệu chuẩn', 'calibration', true)}</section>`;
  return `<div class="tab-row" role="group" aria-label="Mục hồ sơ">${tabs.map(([id, text]) => `<button data-tab="${id}" aria-pressed="${fileTab === id}">${text}</button>`).join('')}</div>${content}<div class="actions">${goButton('Trở lại điều tra', 'hallway')}</div>`;
}
function control() {
  return `<div class="split control-layout"><section class="scene control-scene"><div class="scene-caption"><strong>Bảng tổng · phiên của Lâm</strong><p>Nhật ký ghi thời điểm và nguồn lệnh. Hướng chỉ nằm trong lịch hiện tại của bảng cục bộ.</p></div></section><aside class="panel"><h2>Nhật ký đêm qua</h2>${journalTable(JOURNAL)}<h3>Tài liệu vận hành</h3><div class="stack">${['E9', 'E10', 'TICKET'].map(id => button(EVIDENCE[id].title, `data-control-evidence="${id}"`)).join('')}</div><h3>Chẩn đoán hệ thống</h3><p id="diagnostic-status" class="muted">Chạy thử; cứ ${p.diagnosticMinutes} phút hệ thống sẽ đợi xác nhận tay.</p>${button('Chạy chẩn đoán', 'data-action="diagnostic"')}${button('Xác nhận tay', 'id="diagnostic-confirm" data-action="confirm-diagnostic" hidden')}</aside></div>
    ${selected && ['E9', 'E10', 'TICKET'].includes(selected) ? `<article class="panel">${observation(selected)}</article>` : ''}`;
}
function replay() {
  const labels = { pose: 'Hạo lúc 21:59', floor: 'Sàn cạnh bàn', bolt: 'Chốt cửa', direction: 'Hướng trọng lực' };
  const end = p.replayEnd[state.replay.direction];
  const m = PARAMS.mannequin, standing = state.replay.pose === 'standing';
  const start = [(standing ? m.standingX : m.x) / PARAMS.room.width * 100, (1 - (standing ? m.standingY : m.y) / PARAMS.room.height) * 100];
  const props = `<div class="replay-door" style="left:${(PARAMS.door.x - PARAMS.door.width / 2) / PARAMS.room.width * 100}%;top:${(1 - (PARAMS.door.y + PARAMS.door.height / 2) / PARAMS.room.height) * 100}%;width:${PARAMS.door.width / PARAMS.room.width * 100}%;height:${PARAMS.door.height / PARAMS.room.height * 100}%"><span>Chốt: ${state.replay.bolt ? REPLAY_OPTIONS.bolt[state.replay.bolt] : 'chưa chọn'}</span></div><div class="replay-table" style="left:${PARAMS.table.left / PARAMS.room.width * 100}%;top:${(1 - PARAMS.table.y / PARAMS.room.height) * 100}%;width:${(PARAMS.table.right - PARAMS.table.left) / PARAMS.room.width * 100}%"></div>`;
  return `<p class="source">Tái hiện minh hoạ · kết quả soạn sẵn theo kịch bản, không phải phép đo mới của engine.</p><div class="columns comparison"><section><h3>Giả thuyết</h3><div class="scene replay-room">${props}${replayResult ? `<div class="replay-model" aria-label="Vị trí minh hoạ của ông Hạo" style="${coordinates(end)};--start-x:${start[0]}%;--start-y:${start[1]}%;--start-angle:${standing ? -m.lyingAngle : 0}rad;--replay-ms:${p.replayAnimationMs}ms"></div>${state.replay.floor === 'wet' ? '<div class="replay-streak"></div>' : ''}<div class="scene-caption">${state.replay.direction === 'EAST' ? 'Đông' : 'Tây'} → trở về Xuống</div>` : '<div class="scene-caption">Chưa chạy tái hiện.</div>'}</div></section><section><h3>Ảnh hiện trường</h3><div class="scene lab-scene"><div class="victim" style="${coordinates(p.victimPosition)}"></div></div></section></div>
    <div class="inferences">${Object.entries(REPLAY_OPTIONS).map(([id, values]) => `<label>${labels[id]}<select data-replay="${id}">${options(values, state.replay[id])}</select></label>`).join('')}</div><p id="replay-feedback" class="feedback" role="status"></p><div class="actions">${button('Chạy tái hiện', 'data-action="reconstruct"', true)}${goButton('Quay lại hồ sơ', 'file')}</div>
    ${replayResult ? `<div class="panel">${replayResult.map(r => `<p class="${r.matches ? 'match' : 'mismatch'}">${r.matches ? 'Khớp' : 'Lệch'} · ${EVIDENCE[r.id].title}${r.note ? ` — ${escape(r.note)}` : ''}</p>`).join('')}<p class="source">Tư thế được chọn: ${REPLAY_OPTIONS.pose[state.replay.pose]}. Dấu vết cuối không đủ xác định mọi điều kiện ban đầu; vẫn cần đối chiếu thời điểm và lời khai.</p></div>` : ''}`;
}
function conclusion() {
  if (state.result) return `<section class="panel conclusion"><p class="eyebrow">Kết thúc phiên điều tra</p><h2>${state.result === 'resolved' ? 'Nguyên nhân: xem phụ lục.' : 'Trạm tiếp tục hoạt động.'}</h2><p>${state.result === 'resolved' ? 'An ký biên bản; ô “tai nạn” để trống.' : 'An lên tàu. Thư nhìn theo. Ba tuần sau, chốt Lab A được thay.'}</p>${state.result === 'resolved' ? `<h3>Khoa</h3><div class="quote">${escape(CONFESSION)}</div>` : ''}${button('Chơi lại', 'data-action="new-round"')}</section>`;
  const labels = { person: 'Người chịu trách nhiệm', lock: 'Phòng khóa thế nào?', timing: 'Bằng chứng thời điểm' };
  return `<section class="panel conclusion"><p class="eyebrow">Báo cáo điều tra</p><h2>Kết luận của bạn</h2><p>Chọn kết luận và bằng chứng bạn đã tự kiểm chứng. Bạn có thể trở lại điều tra.</p>${Object.entries(VERDICT_OPTIONS).map(([id, values]) => `<label>${labels[id]}<select data-verdict="${id}">${options(values, state.verdict[id])}</select></label>`).join('')}<p class="feedback" id="verdict-feedback" role="status"></p><div class="actions">${button('Gửi kết luận', 'data-action="verdict"', true)}${goButton('Tiếp tục điều tra', 'hallway')}</div><div class="early"><p class="source">Kết thúc điều tra sớm</p>${button('Ký xác nhận tai nạn', 'data-action="early"')}</div></section>`;
}
function render() {
  const [title, objective] = titles[view]; document.querySelector('#page-title').textContent = title; document.querySelector('#objective').textContent = objective;
  document.querySelector('#navigation').hidden = view === 'menu'; document.querySelector('#verdict-link').hidden = view === 'menu';
  document.querySelector('#hallway-return').hidden = view === 'menu' || view === 'hallway';
  document.querySelector('#calibration-holder').hidden = view !== 'calibration'; stage.hidden = view === 'calibration';
  for (const b of document.querySelectorAll('#navigation button')) b.setAttribute('aria-pressed', b.dataset.go === view || b.dataset.go === 'book' && view === 'file' && fileTab === 'rules');
  if (view === 'calibration') return;
  stage.innerHTML = ({ menu, hallway, lab, dialogue, file, control, replay, conclusion,
    help: () => `<section class="panel conclusion"><h2>Điều tra bằng thí nghiệm</h2><p>Bạn là Nguyễn Hoài An, điều tra viên an toàn. Trưởng trạm Hạo chết trong Lab A khóa kín. Bạn cần kiểm chứng biên bản sơ bộ trước khi ký.</p><ol><li>Vào Lab A, bấm dấu vết và Ghi vào hồ sơ.</li><li>Gặp Lâm, Thư, Khoa; lời khai được ghi riêng với quan sát.</li><li>Thử đổi trọng lực trong buồng hiệu chuẩn, rồi đọc lại hiện trường.</li><li>Đối chiếu hồ sơ, tái hiện giả thuyết và gửi kết luận.</li></ol><p class="source">Chưa lưu tiến trình. Tải lại trang sẽ bắt đầu phiên mới.</p>${goButton('Ra hành lang', 'hallway', true)}</section>` })[view]();
}
document.addEventListener('click', event => {
  const b = event.target.closest('button'); if (!b || b.disabled) return;
  if (b.dataset.go) return go(b.dataset.go);
  if (b.dataset.person) { person = b.dataset.person; reply = ''; currentQuestion = ''; presenting = false; return go('dialogue'); }
  if (b.dataset.evidence) {
    const id = b.dataset.evidence;
    if (id === 'TERMINAL') { selected = state.permission ? 'E11' : 'E11'; if (state.permission) state.visit('E11'); }
    else { selected = id; state.visit(id); }
    render(); if (id === 'TERMINAL' && state.permission) stage.querySelector('aside').insertAdjacentHTML('beforeend', button('Đọc mục 4 của báo cáo', 'data-evidence="E14"')); return;
  }
  if (b.dataset.collect) { if (state.collect(b.dataset.collect)) { notify('Đã ghi vào hồ sơ.'); render(); } return; }
  if (b.dataset.fileEvidence) { selected = b.dataset.fileEvidence; render(); return; }
  if (b.dataset.controlEvidence) { selected = b.dataset.controlEvidence; state.visit(selected); render(); return; }
  if (b.dataset.question) { const q = state.ask(person, b.dataset.question); if (q) { reply = q.reply; currentQuestion = q.id; render(); } return; }
  if (b.dataset.present) { const text = state.present(person, b.dataset.present); if (text) { reply = text; currentQuestion = ''; presenting = false; render(); } return; }
  if (b.dataset.tab) { fileTab = b.dataset.tab; render(); return; }
  switch (b.dataset.action) {
    case 'start': if (state.active || state.collected.size || state.rules.size) resetAsked = true; else { state.active = true; go('hallway'); return; } break;
    case 'restart': state = new CaseState(); state.active = true; selected = null; sandbox = null; diagnosticAt = null; replayResult = null; frame.removeAttribute('src'); resetAsked = false; go('hallway', true); return;
    case 'cancel-reset': resetAsked = false; break;
    case 'new-round': resetAsked = true; go('menu'); return;
    case 'present': presenting = !presenting; break;
    case 'reconstruct': replayResult = reconstruction(state.replay); if (!replayResult) { document.querySelector('#replay-feedback').textContent = 'Chọn đủ bốn điều kiện trước khi chạy.'; return; } break;
    case 'verdict': { const result = state.conclude(); if (result.error) { document.querySelector('#verdict-feedback').textContent = result.error; return; } break; }
    case 'early': state.result = 'accident'; break;
    case 'diagnostic': diagnosticAt = Date.now(); diagnosticWaiting = false; break;
    case 'confirm-diagnostic': if (diagnosticWaiting) { diagnosticAt = Date.now(); diagnosticWaiting = false; notify('Đã xác nhận tay; chẩn đoán tiếp tục.'); } break;
    default: return;
  }
  render();
});
document.addEventListener('change', event => {
  const el = event.target; const maps = [['replay', REPLAY_OPTIONS], ['verdict', VERDICT_OPTIONS]];
  for (const [kind, values] of maps) if (el.dataset[kind] && Object.hasOwn(values, el.dataset[kind]) && (!el.value || Object.hasOwn(values[el.dataset[kind]], el.value))) {
    const key = el.dataset[kind]; state[kind][key] = el.value;
    if (kind === 'replay') { replayResult = null; render(); document.querySelector(`[data-replay="${key}"]`)?.focus({ preventScroll: true }); }
    return;
  }
  if (el.dataset.inference && Object.hasOwn(state.inference, el.dataset.inference)) state.inference[el.dataset.inference] = el.value;
});
window.addEventListener('message', event => {
  if (event.origin !== location.origin || event.source !== frame.contentWindow) return;
  if (validSandboxState(event.data)) { sandbox = event.data; const before = state.rules.size; state.syncRules(sandbox.unlocked); if (state.rules.size !== before && view === 'file') render(); }
  else if (event.data?.type === 'sandbox-exit-result' && typeof event.data.ok === 'boolean' && pendingView) {
    const target = pendingView; pendingView = null; if (event.data.ok) go(target, true); else notify('Không ra được: cửa hoặc chốt đang chặn.');
  }
});
setInterval(() => {
  if (view !== 'control' || diagnosticAt === null) return;
  const elapsed = Date.now() - diagnosticAt, interval = p.diagnosticMinutes * PARAMS.secondsPerMinute * PARAMS.millisecondsPerSecond;
  diagnosticWaiting = elapsed >= interval;
  const label = document.querySelector('#diagnostic-status'), confirm = document.querySelector('#diagnostic-confirm');
  if (label) label.textContent = diagnosticWaiting ? 'Đang đợi xác nhận tay. Chẩn đoán đã dừng.' : `Đang chạy · cần xác nhận sau ${Math.ceil((interval - elapsed) / PARAMS.millisecondsPerSecond)} giây.`;
  if (confirm) confirm.hidden = !diagnosticWaiting;
}, p.tickerMs);
render();
