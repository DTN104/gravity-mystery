import assert from 'node:assert/strict';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { PARAMS } from '../src/params.js';
import { CaseState, reconstruction, validSandboxState } from '../src/game/case-state.js';
import { JOURNAL, REPLAY_OPTIONS, PEOPLE } from '../src/game/case-data.js';
import { renderDialogue } from '../src/game/dialogue-ui.js';
const results = [];
function test(id, label, fn) { fn(); results.push({ id, label, pass: true }); console.log(`PASS ${id}: ${label}`); }
test('UI-STATE-1', 'Ghi một lần; terminal khóa; diễn giải không lộ trước thí nghiệm', () => {
  const s = new CaseState(); assert.equal(s.collect('unknown'), false); assert.equal(s.collect('E11'), false);
  s.collect('E2'); s.collect('E2'); assert.equal(s.collected.size, 1); assert.equal(s.interpretation('E2'), null);
  assert.equal(s.syncRules(['R1', 'SECRET']), false); assert.equal(s.rules.size, 0);
  s.syncRules(['R1']); assert.match(s.interpretation('E2'), /tường.*sàn/);
});
test('UI-STATE-2', 'Hội thoại ghi đúng nguồn, không trùng; xin quyền cần bốn quy tắc', () => {
  const s = new CaseState(); s.ask('khoa', 'witness'); s.ask('khoa', 'witness');
  assert.equal(s.statements.size, 1); assert.equal(s.statements.values().next().value.person, 'khoa'); assert(s.collected.has('E13'));
  assert.equal(s.ask('lam', 'permission'), null); s.syncRules(['R1', 'R2', 'R3']); assert.equal(s.ask('lam', 'permission'), null);
  s.syncRules(['R4']); assert(s.ask('lam', 'permission')); assert(s.collect('E11')); assert(s.collect('E14'));
});
test('UI-STATE-3', 'Đối chất Khoa theo thứ tự vật chứng và quy tắc, không bỏ qua khóa', () => {
  const s = new CaseState(); for (const id of ['E13', 'E12', 'E8']) s.collect(id);
  assert.equal(s.present('khoa', 'E13'), null); s.syncRules(['R4', 'R5']);
  assert.equal(s.present('khoa', 'E12'), null); assert(s.present('khoa', 'E13')); assert(s.present('khoa', 'E12'));
  assert.equal(s.canPresent('khoa', 'E14'), false); assert(s.present('khoa', 'E8'));
  s.permission = true; s.collect('E14'); assert(s.present('khoa', 'E14'));
});
test('UI-STATE-4', 'Nhật ký bốn trường, không có hướng', () => {
  for (const row of JOURNAL) { assert.deepEqual(Object.keys(row), ['time', 'room', 'event', 'origin']); assert.doesNotMatch(JSON.stringify(row), /EAST|WEST|DOWN|UP|Đông|Tây|direction|\bdir\b/); }
});
test('UI-STATE-5', '16 tổ hợp minh hoạ; nước và hướng đổi kết quả; chốt ban đầu vẫn mơ hồ', () => {
  assert.equal(reconstruction({ pose: 'standing', floor: '', bolt: 'closed', direction: 'EAST' }), null);
  let combinations = 0;
  for (const pose of Object.keys(REPLAY_OPTIONS.pose)) for (const floor of Object.keys(REPLAY_OPTIONS.floor))
    for (const bolt of Object.keys(REPLAY_OPTIONS.bolt)) for (const direction of Object.keys(REPLAY_OPTIONS.direction)) {
      const result = reconstruction({ pose, floor, bolt, direction }); combinations++;
      if (direction === 'WEST') assert(result.filter(r => ['E1', 'E2', 'E3', 'E4'].includes(r.id)).every(r => !r.matches));
      if (direction === 'EAST') { assert.match(result.find(r => r.id === 'E5').note, /không xác định/); assert.equal(result.find(r => r.id === 'E6').matches, floor === 'wet'); }
    }
  assert.equal(combinations, 16);
});
test('UI-STATE-6', 'Kết luận trống, lựa chọn sai, thiếu chứng cứ và kết luận đủ được xử lý', () => {
  const s = new CaseState(); assert(s.conclude().error); s.verdict = { person: 'khoa', lock: 'gravity', timing: 'streak' };
  assert(s.conclude().error); s.collect('E6'); s.syncRules(['R3']); assert(s.conclude().error);
  s.collect('E8'); s.collect('E12'); s.verdict.timing = 'testimony'; assert.match(s.conclude().error, /Một lời khai sai/);
  s.verdict.timing = 'streak'; assert.equal(s.conclude().outcome, 'resolved');
});
test('UI-STATE-7', 'Cầu nối từ chối dữ liệu sai kiểu và ID quy tắc không biết', () => {
  assert(validSandboxState({ type: 'sandbox-state', locked: false, inside: true, unlocked: ['R1'] }));
  for (const data of [null, {}, { type: 'sandbox-state', locked: 'false', inside: true, unlocked: [] },
    { type: 'sandbox-state', locked: false, inside: true, unlocked: ['SECRET'] }]) assert.equal(validSandboxState(data), false);
});
test('UI-STATE-9', 'Lý do khóa nhánh đối chất nói rõ điều kiện còn thiếu, không nói "không có nhánh"', () => {
  const s = new CaseState(); for (const id of ['E13', 'E12', 'E8']) s.collect(id);
  assert.match(s.presentReason('khoa', 'E13'), /R4/); s.syncRules(['R4', 'R5']); assert.equal(s.presentReason('khoa', 'E13'), null);
  assert.match(s.presentReason('khoa', 'E12'), /22:10/); s.present('khoa', 'E13'); assert.equal(s.presentReason('khoa', 'E12'), null);
  assert.match(s.presentReason('khoa', 'E8'), /Đèn soi/); assert.match(s.presentReason('lam', 'E13'), /không có gì để nói/);
  assert.equal(s.presentReason('khoa', 'E6'), 'chưa ghi vào hồ sơ');
});
test('UI-STATE-10', 'renderDialogue: câu vòng hai bị khóa kèm điều kiện, câu đã hỏi có dấu, modal vật chứng ghi lý do', () => {
  const s = new CaseState(); s.ask('khoa', 'witness');
  let html = renderDialogue({ state: s, person: 'lam', reply: '', currentQuestion: '', panel: '' });
  assert.match(html, /data-question="permission"[^>]*disabled/); assert.match(html, /Cần 4 quy tắc/);
  html = renderDialogue({ state: s, person: 'khoa', reply: PEOPLE.khoa.questions.find(q => q.id === 'witness').reply, currentQuestion: 'witness', panel: 'evidence' });
  assert.match(html, /data-question="witness"[^>]*aria-pressed="true"/); assert.match(html, /Lời khai đã ghi vào hồ sơ/);
  assert.match(html, /data-present="E13" disabled>[^<]*<small>cần quy tắc R4/); assert.doesNotMatch(html, /chưa có nhánh đối chất/);
  assert.doesNotMatch(html, /<script/);
});
const before = JSON.parse(await readFile(new URL('./game-ui/params-before-ui.json', import.meta.url), 'utf8'));
test('UI-STATE-8', 'Mọi PARAMS cũ giữ nguyên; chỉ thêm nhánh fullGame', () => { const { fullGame, ...after } = PARAMS; assert.deepEqual(after, before); });
const dir = new URL('./game-ui/', import.meta.url); await mkdir(dir, { recursive: true });
await writeFile(new URL('state-results.json', dir), JSON.stringify(results, null, 2));
