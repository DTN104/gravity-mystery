// B5 — thẻ trong cột phải thay cho <dialog> modal. Không che phòng, không pause game.
export class Cards {
  constructor(hud) { this.hud = hud; this.root = document.querySelector('#cards'); this.max = hud.scene.params.readable.cardsMax; }
  isOpen(id) { return !!this.root?.querySelector(`[data-card="${id}"]`); }
  show(id, title, body, buttons = []) {
    if (!this.root) return null;
    this.root.querySelector(`[data-card="${id}"]`)?.remove();
    const card = document.createElement('section'); card.className = 'card'; card.dataset.card = id; card.setAttribute('aria-label', title);
    const h = document.createElement('h2'); h.textContent = title; card.append(h);
    for (const node of [].concat(body)) card.append(typeof node === 'string' ? Object.assign(document.createElement('p'), { textContent: node }) : node);
    if (buttons.length) {
      const bar = document.createElement('div'); bar.className = 'toolbar';
      for (const b of buttons) { const el = document.createElement('button'); el.textContent = b.label; if (b.primary) el.className = 'primary'; el.onclick = () => { b.onClick?.(); if (b.closes !== false) this.close(id); }; bar.append(el); }
      card.append(bar);
    }
    this.root.prepend(card);
    while (this.root.children.length > this.max) this.root.lastElementChild.remove();
    card.scrollIntoView({ block: 'nearest' });
    return card;
  }
  close(id) { this.root?.querySelector(`[data-card="${id}"]`)?.remove(); this.hud.onCardClosed?.(id); }
}
