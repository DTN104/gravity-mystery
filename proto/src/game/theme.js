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
  }@media(max-width:${PARAMS.fullGame.tokens.dialogueMobile}){
    [data-full-game] body[data-game-view=dialogue]{padding-bottom:0}
    [data-full-game] body[data-game-view=dialogue] #navigation{position:static}
    [data-full-game] .scene.dialogue-scene{height:var(--g-dialogueMobileHeight);min-height:var(--g-dialogueMobileHeight)}
    [data-full-game] .dialogue-hud{left:var(--g-dialogueMobileHudInset);right:var(--g-dialogueMobileHudInset);top:var(--g-dialogueMobileHudInset);gap:var(--g-tight)}
    [data-full-game] .dialogue-place{font-size:var(--g-dialogueMobileRoleFont)}
    [data-full-game] .dialogue-hud-actions{gap:var(--g-dialogueMobileQuestionGap)}
    [data-full-game] .dialogue-hud-actions button,[data-full-game] .dialogue-evidence-button{font-size:var(--g-dialogueMobileButtonFont);padding:var(--g-dialogueMobileButtonPadding);min-height:var(--g-dialogueMobileButtonHeight);gap:var(--g-dialogueMobileQuestionGap);white-space:nowrap}
    [data-full-game] .dialogue-scene svg{width:var(--g-dialogueMobileIconSize);height:var(--g-dialogueMobileIconSize)}
    [data-full-game] .dialogue-scene .dialogue-character{height:var(--g-dialogueMobilePortraitHeight);top:var(--g-dialogueMobilePortraitTop);left:50%;bottom:auto;transform:translateX(-50%)}
    [data-full-game] .dialogue-box{top:var(--g-dialogueMobileBoxTop);bottom:auto;left:var(--g-dialogueMobileInset);right:var(--g-dialogueMobileInset);max-height:var(--g-dialogueMobileBoxHeight);padding:var(--g-dialogueMobileBoxPadding)}
    [data-full-game] .dialogue-speaker-row{gap:var(--g-tight)}
    [data-full-game] .dialogue-speaker-row h2{font-size:var(--g-dialogueMobileNameFont)}
    [data-full-game] .dialogue-speaker-row p{font-size:var(--g-dialogueMobileRoleFont)}
    [data-full-game] .dialogue-spoken{font-size:var(--g-dialogueMobileSpokenFont);line-height:var(--g-dialogueMobileSpokenLine);max-height:var(--g-dialogueMobileSpokenHeight)}
    [data-full-game] .dialogue-reply-status,[data-full-game] .dialogue-scroll-hint{font-size:var(--g-dialogueMobileStatusFont)}
    [data-full-game] .dialogue-questions{top:auto;bottom:var(--g-dialogueMobileInset);left:var(--g-dialogueMobileInset);right:var(--g-dialogueMobileInset);width:auto;max-width:none;max-height:var(--g-dialogueMobileQuestionsHeight);gap:var(--g-tight)}
    [data-full-game] .dialogue-questions-head{font-size:var(--g-dialogueMobileHeadingFont)}
    [data-full-game] .dialogue-question{font-size:var(--g-dialogueMobileQuestionFont);padding:var(--g-dialogueMobileQuestionPadding);gap:var(--g-dialogueMobileQuestionGap);grid-template-columns:var(--g-dialogueMobileQuestionNumberWidth) minmax(0,1fr) var(--g-dialogueMobileQuestionMarkWidth)}
    [data-full-game] .dialogue-veil,[data-full-game] .dialogue-modal{padding:var(--g-gap)}
  }`;
}
