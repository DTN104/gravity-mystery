export class HallwayUI {
  constructor(scene, hud) {
    this.scene = scene; this.hud = hud; this.blockedByBolt = false; this.pendingMaster = false;
    document.querySelector('#hallway-leave').onclick = () => this.leave();
    document.querySelector('#hallway-enter').onclick = () => this.enter();
    document.querySelector('#intercom').onclick = () => this.intercom();
  }
  leave() {
    const a = this.scene, ok = a.hallway.leave(a.cycle);
    if (!ok) this.hud.notice(a.cycle.messages.at(-1)); a.refresh(); return ok;
  }
  enter() {
    const a = this.scene, ok = a.hallway.enter(a.cycle, a.bolt);
    if (!ok) { this.blockedByBolt = !a.cycle.door.locked && a.bolt.s !== 0; this.hud.notice(a.cycle.messages.at(-1)); }
    else this.blockedByBolt = false;
    a.refresh(); return ok;
  }
  intercom() {
    const a = this.scene;
    if (a.hallway.inside || !this.blockedByBolt || this.pendingMaster || a.bolt.s === 0) return false;
    this.pendingMaster = true;
    this.hud.dialogue('Lâm', 'Lại tự khóa à? Chờ tí, tôi xoay Tây một phút cho chốt bật ra.');
    this.step(); a.refresh(); return true;
  }
  step() {
    const a = this.scene, c = a.cycle;
    if (this.pendingMaster && c.state === 'IDLE' && !c.door.locked
      && (!a.params.cooldownEnabled || c.now >= c.readyAt - a.params.epsilon)) {
      if (a.start('WEST', a.params.durationMin, { origin: 'master', user: a.params.masterUser })) this.pendingMaster = false;
    }
  }
  refresh() {
    const a = this.scene, inside = a.hallway.inside;
    document.querySelector('#hallway-leave').hidden = !inside;
    document.querySelector('#hallway-leave').disabled = a.cycle.door.locked;
    document.querySelector('#hallway-enter').hidden = inside;
    document.querySelector('#hallway-enter').disabled = a.cycle.door.locked;
    const intercom = document.querySelector('#intercom'); intercom.hidden = inside || !this.blockedByBolt;
    intercom.disabled = this.pendingMaster || a.cycle.door.locked || a.bolt.s === 0;
  }
}
