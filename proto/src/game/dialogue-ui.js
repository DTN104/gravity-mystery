import { PARAMS } from '../params.js';
import { PEOPLE, EVIDENCE } from './case-data.js';

const escape = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const icon = name => `<svg viewBox="0 0 24 24" aria-hidden="true">${{
  book: '<path d="M4 4h6a3 3 0 0 1 2 1 3 3 0 0 1 2-1h6v15h-6a3 3 0 0 0-2 1 3 3 0 0 0-2-1H4z"/><path d="M12 5v15"/>',
  leave: '<path d="M9 4H4v16h5M13 7l5 5-5 5M8 12h12"/>',
  evidence: '<rect x="4" y="6" width="16" height="14" rx="2"/><path d="M8 6V4h8v2M4 11h16M10 11v3h4v-3"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
}[name]}</svg>`;

export function renderDialogue({ state, person, reply, currentQuestion, panel }) {
  const p = PARAMS.fullGame, npc = PEOPLE[person];
  const asked = npc.questions.filter(q => state.questions.has(`${person}:${q.id}`)).length;
  const recorded = [...state.statements.values()].some(s => s.person === person && s.text === reply);
  const status = recorded ? 'Lời khai đã ghi vào hồ sơ.' : reply ? 'Chọn câu hỏi khác hoặc đưa bằng chứng để đối chiếu.' : 'Chọn một câu hỏi để bắt đầu trò chuyện.';
  const choices = npc.questions.map((q, index) => {
    const locked = q.secondRound && state.rules.size < p.secondRoundRules;
    const seen = state.questions.has(`${person}:${q.id}`);
    return `<button class="dialogue-question" data-question="${q.id}" aria-pressed="${q.id === currentQuestion}" aria-label="${escape(q.text)}${locked ? ` · cần ${p.secondRoundRules} quy tắc` : seen ? ' · đã hỏi' : ''}" ${locked ? 'disabled' : ''}>
      <span class="dialogue-question-number">${String(index + 1).padStart(2, '0')}</span><span>${escape(q.text)}${locked ? `<small>Cần ${p.secondRoundRules} quy tắc</small>` : ''}</span><span class="dialogue-question-mark">${seen ? icon('check') : ''}</span></button>`;
  }).join('');
  let overlay = '';
  if (panel) {
    const history = [...state.statements.values()].filter(s => s.person === person);
    const content = panel === 'history'
      ? history.map(s => `<article class="dialogue-history-entry"><p class="eyebrow">${escape(npc.name)}</p><h3>${escape(s.question)}</h3><p>${escape(s.text)}</p></article>`).join('') || '<p class="muted">Chưa có lời khai. Chọn một câu hỏi để nghe nhân vật trả lời.</p>'
      : `<p class="muted">Chọn một vật chứng đã ghi. Nhánh chưa kiểm chứng sẽ ghi rõ điều kiện.</p><div class="stack">${[...state.collected].map(id => { const reason = state.presentReason(person, id); return `<button data-present="${id}" ${reason ? 'disabled' : ''}>${escape(EVIDENCE[id].title)}${reason ? `<small>${escape(reason)}</small>` : ''}</button>`; }).join('') || '<p>Chưa ghi bằng chứng nào. Khám Lab A hoặc phòng điều khiển rồi Ghi vào hồ sơ.</p>'}</div>`;
    overlay = `<div class="dialogue-veil"><section class="dialogue-modal" role="dialog" aria-modal="true" aria-labelledby="dialogue-modal-title" tabindex="-1"><header class="dialogue-modal-head"><h2 id="dialogue-modal-title">${panel === 'history' ? 'Nhật ký hội thoại' : 'Chọn vật chứng để đối chiếu'}</h2><button data-action="close-dialogue-panel">Đóng</button></header>${content}</section></div>`;
  }
  return `<section class="scene corridor dialogue-scene" aria-label="Khung cảnh hội thoại với ${escape(npc.name)}">
    <header class="dialogue-hud"><div class="dialogue-place">Hành lang</div><div class="dialogue-hud-actions"><button data-action="dialogue-history">${icon('book')}Nhật ký</button><button data-go="hallway">${icon('leave')}Kết thúc</button></div></header>
    <div class="portrait dialogue-character" aria-hidden="true" style="--portrait-position:${p.portraits[person]}%"></div>
    <section class="dialogue-questions" aria-labelledby="dialogue-questions-title"><header class="dialogue-questions-head"><span id="dialogue-questions-title">Bạn muốn hỏi gì?</span><span>${asked}/${npc.questions.length} đã hỏi</span></header><div class="dialogue-questions-list">${choices}</div><span class="dialogue-scroll-hint" hidden>Cuộn danh sách để xem thêm câu hỏi</span></section>
    <section class="dialogue-box" aria-label="Lời thoại của nhân vật"><header class="dialogue-speaker-row"><div><h2>${escape(npc.name)}</h2><p>${escape(npc.role)}</p></div><button class="dialogue-evidence-button" data-action="present">${icon('evidence')}Đưa bằng chứng</button></header><div class="dialogue-spoken" tabindex="0" aria-live="polite" aria-atomic="true">${escape(reply || npc.opening)}</div><p class="dialogue-reply-status" data-status="${escape(status)}">${escape(status)}</p></section>
    ${overlay}
  </section>`;
}

export function mountDialogue(root, questionScroll = 0) {
  const list = root.querySelector('.dialogue-questions-list');
  const spoken = root.querySelector('.dialogue-spoken');
  const status = root.querySelector('.dialogue-reply-status');
  const hint = root.querySelector('.dialogue-scroll-hint');
  list.scrollTop = questionScroll;
  const update = () => {
    hint.hidden = list.scrollHeight <= list.clientHeight + PARAMS.fullGame.dialogueScrollHintPx;
    const more = spoken.scrollTop + spoken.clientHeight < spoken.scrollHeight - PARAMS.fullGame.dialogueScrollEndPx;
    status.dataset.more = String(more);
    status.textContent = more ? 'Cuộn lời thoại để đọc tiếp' : status.dataset.status;
  };
  const observer = new ResizeObserver(update);
  observer.observe(list); observer.observe(spoken);
  spoken.addEventListener('scroll', update);
  update();
  root.querySelector('.dialogue-modal')?.focus();
  return () => { observer.disconnect(); spoken.removeEventListener('scroll', update); };
}
