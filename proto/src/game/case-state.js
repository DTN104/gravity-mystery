import { PARAMS } from '../params.js';
import { EVIDENCE, PEOPLE, PRESENT, REPLAY_OPTIONS, VERDICT_OPTIONS } from './case-data.js';
import { RULES } from './detector.js';

export class CaseState {
  constructor() {
    this.active = false; this.collected = new Set(); this.visited = new Set(); this.rules = new Set(); this.statements = new Map();
    this.questions = new Set(); this.presented = new Set(); this.permission = false; this.inference = { what: '', when: '', who: '' };
    this.replay = { pose: '', floor: '', bolt: '', direction: '' }; this.verdict = { person: '', lock: '', timing: '' }; this.result = null;
  }
  available(id) { return !!EVIDENCE[id] && (!EVIDENCE[id].terminal || this.permission); }
  visit(id) { if (!this.available(id)) return false; this.visited.add(id); return true; }
  collect(id) { if (!this.visit(id)) return false; this.collected.add(id); return true; }
  interpretation(id) { const e = EVIDENCE[id]; return e?.rule && this.rules.has(e.rule) ? e.after : null; }
  ask(person, id) {
    const q = PEOPLE[person]?.questions.find(q => q.id === id);
    if (!q || q.secondRound && this.rules.size < PARAMS.fullGame.secondRoundRules) return null;
    this.questions.add(`${person}:${id}`); if (q.permission) this.permission = true;
    if (q.evidence) this.collect(q.evidence);
    if (!q.system) this.statements.set(`${person}:${id}`, { person, question: q.text, text: q.reply });
    return q;
  }
  // Trả về null khi đưa được; ngược lại là lý do bằng lời (dùng làm nhãn trong hội thoại).
  presentReason(person, id) {
    if (!this.collected.has(id)) return 'chưa ghi vào hồ sơ';
    if (!PRESENT[person]?.[id]) return `${PEOPLE[person]?.short || 'Nhân vật'} không có gì để nói về vật này`;
    if (person === 'khoa') {
      if (id === 'E13' && !this.rules.has('R4')) return 'cần quy tắc R4 (người ở trên tường lúc xoay)';
      if (id === 'E12') {
        if (!this.rules.has('R5')) return 'cần quy tắc R5 (vật thả sau khi gel đứng yên)';
        if (!this.presented.has('khoa:E13')) return 'đối chất Lời khai lúc 22:10 trước';
      }
      if (id === 'E8' && !this.presented.has('khoa:E12')) return 'đối chất Đèn soi phủ gel trước';
      if (id === 'E14') {
        if (!this.collected.has('E8') || !this.collected.has('E12')) return 'cần ghi Bảng cục bộ và Đèn soi phủ gel';
        if (!this.presented.has('khoa:E8')) return 'đối chất Bảng cục bộ trước';
      }
    }
    return null;
  }
  canPresent(person, id) { return this.presentReason(person, id) === null; }
  present(person, id) {
    if (!this.canPresent(person, id)) return null;
    const text = PRESENT[person][id]; this.presented.add(`${person}:${id}`);
    this.statements.set(`${person}:evidence:${id}`, { person, question: `Đối chất: ${EVIDENCE[id].title}`, text });
    return text;
  }
  syncRules(ids) {
    if (!Array.isArray(ids) || !ids.every(id => RULES.some(r => r.id === id))) return false;
    for (const id of ids) this.rules.add(id); return true;
  }
  conclude() {
    const v = this.verdict;
    if (!Object.entries(VERDICT_OPTIONS).every(([key, options]) => Object.hasOwn(options, v[key]))) return { error: 'Chọn đủ ba mục trước khi gửi kết luận.' };
    if (!this.collected.has('E6') || !this.rules.has('R3')) return { error: 'Chưa đủ cơ sở kiểm chứng. Hãy xem vệt trên sàn và thử cơ chế chốt trong buồng hiệu chuẩn.' };
    if (v.person === 'khoa' && v.lock === 'gravity' && v.timing === 'streak') {
      if (!this.collected.has('E8') || !this.collected.has('E12')) return { error: 'Cần đối chiếu vật chứng và lần sửa lịch trước khi khép lại hồ sơ.' };
      this.result = 'resolved'; return { outcome: this.result };
    }
    return { error: v.timing === 'testimony'
      ? 'Một lời khai sai chứng minh người nói dối, không chứng minh người nằm trên sàn lúc nào.'
      : 'Lời giải thay thế vẫn còn đứng vững. Hãy đối chiếu dấu vết, cơ chế phòng khóa và thời điểm trước khi kết luận.' };
  }
}

export function reconstruction(values) {
  if (!Object.entries(REPLAY_OPTIONS).every(([key, options]) => Object.hasOwn(options, values[key]))) return null;
  const east = values.direction === 'EAST', wet = values.floor === 'wet';
  return [
    ...['E1', 'E2', 'E3', 'E4'].map(id => ({ id, matches: east })),
    { id: 'E6', matches: east && wet },
    { id: 'E5', matches: east, note: east ? 'Chốt mở hoặc đóng ban đầu đều có thể dẫn tới cửa đóng. Ảnh cuối không xác định được ai đã cài chốt.' : 'Hướng Tây đưa chốt về mở.' },
  ];
}

export function validSandboxState(data) {
  return !!data && data.type === 'sandbox-state' && typeof data.locked === 'boolean' && typeof data.inside === 'boolean'
    && Array.isArray(data.unlocked) && data.unlocked.every(id => RULES.some(r => r.id === id));
}
