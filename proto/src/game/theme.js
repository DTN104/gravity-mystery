import { PARAMS } from '../params.js';
export function applyTheme(root = document.documentElement) {
  for (const [key, value] of Object.entries(PARAMS.fullGame.tokens)) root.style.setProperty(`--g-${key}`, value);
  for (const [key, value] of Object.entries(PARAMS.fullGame.assets)) root.style.setProperty(`--g-${key}`, `url("${new URL(value, root.ownerDocument.baseURI).href}")`);
  let sheet = root.ownerDocument.querySelector('#game-responsive');
  if (!sheet) { sheet = root.ownerDocument.createElement('style'); sheet.id = 'game-responsive'; root.ownerDocument.head.append(sheet); }
  sheet.textContent = `@media(max-width:${PARAMS.fullGame.tokens.mobile}){
    [data-full-game] .split,[data-full-game] .file-layout,[data-full-game] main:not(#stage){grid-template-columns:minmax(0,1fr)}
    [data-full-game] .app-header{flex-wrap:wrap;gap:var(--g-tight)}
    [data-full-game] .brand{width:100%;text-align:left}
    [data-full-game] .scene{min-height:0;aspect-ratio:var(--g-aspect)}
    [data-full-game] .menu{min-height:calc(var(--g-sceneMin)*2);aspect-ratio:auto}
    [data-full-game] .door-link{padding:var(--g-tight);font-size:var(--g-small)}
  }@media(max-width:${PARAMS.fullGame.tokens.narrow}){
    [data-full-game] body[data-game-shell]{padding-bottom:calc(var(--g-navHeight)*2)}
    [data-full-game] .columns{grid-template-columns:minmax(0,1fr)}
    [data-full-game] .app-header,[data-full-game] #stage,[data-full-game] #calibration-holder{padding:var(--g-gap)}
    [data-full-game] .heading{flex-basis:100%}
    [data-full-game] #navigation{grid-template-columns:repeat(2,minmax(0,1fr));padding:var(--g-tight)}
    [data-full-game] .panel{padding:var(--g-gap)}
    [data-full-game] .dialogue-scene{aspect-ratio:auto;min-height:var(--g-portraitMin)}
    [data-full-game] .corridor:has(.door-link){aspect-ratio:auto;display:flex;flex-direction:column;align-items:flex-end;padding:var(--g-gap);padding-top:calc(var(--g-sceneMin)/3)}
    [data-full-game] .door-link{position:static;transform:none;margin-bottom:var(--g-tight)}
    [data-full-game] .corridor:has(.door-link) .scene-caption{position:relative;left:auto;right:auto;bottom:auto;margin-top:var(--g-gap);width:100%}
  }`;
}
