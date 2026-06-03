import {
  ACCESS_CARDS,
  CORRECT_RUNE_ID,
  LOCK_CODE,
  LOCK_DIGITS,
  LOGIC_PATHS,
  POTION_BOTTLES,
  RUNE_CELLS,
  SEAL_PHRASES,
  VISUAL_ASSETS
} from './game-data.js';
import {
  applyChoiceScores,
  createInitialState,
  deserializeState,
  getResultForState,
  isAccessCardSetValid,
  isLockCodeValid,
  isRuneEntranceValid,
  serializeState
} from './game-engine.js';

const STORAGE_KEY = 'slytherin-birthday-puzzle-state';
const app = document.querySelector('#app');
let state = loadState();
let transition = null;

render();

function render(feedback = '') {
  saveState();

  const body = {
    access: renderAccess,
    logic: renderLogic,
    potion: renderPotion,
    lock: renderLock,
    result: renderResult
  }[state.stage] ?? renderAccess;

  app.innerHTML = `
    <main class="shell" style="--scene-image: url('${VISUAL_ASSETS.greatHall.imageUrl}')">
      <section class="crest" aria-label="银蛇与羽笔封印">
        ${renderCrestSvg()}
      </section>
      <section class="game-panel">
        ${renderProgress()}
        ${body(feedback)}
      </section>
      ${renderTransition()}
    </main>
  `;

  bindGlobalActions();
}

function renderProgress() {
  const stages = [
    ['access', '禁书区'],
    ['logic', '逻辑笔记'],
    ['potion', '公共休息室'],
    ['lock', '密室门锁'],
    ['result', '命运封印']
  ];

  return `
    <nav class="progress" aria-label="试炼进度">
      ${stages
        .map(([id, label]) => {
          const active = state.stage === id ? 'is-active' : '';
          const done = state.completedStages.includes(id) ? 'is-done' : '';
          return `<span class="progress-step ${active} ${done}">${label}</span>`;
        })
        .join('')}
    </nav>
  `;
}

function renderAccess(feedback) {
  return `
    <header class="scene-header">
      <p class="eyebrow">Restricted Section</p>
      <h1>禁书区入场</h1>
      <p>从抽奖盒中抽出“禁书区线索包”，挑出三张能组成通行组合的牌。</p>
    </header>

    <section class="access-card-grid" aria-label="禁书区线索牌">
      ${ACCESS_CARDS.map(
        (card) => `
        <button class="clue-card ${state.selectedAccessCards.includes(card.id) ? 'is-selected' : ''}" data-action="access-card" data-id="${card.id}">
          <span class="clue-symbol">${card.symbol}</span>
          <strong>${card.title}</strong>
          <small>${card.visibleText}</small>
        </button>
      `
      ).join('')}
    </section>

    <div class="action-row">
      <button class="primary-button" data-action="solve-access">交给守卫</button>
      <span class="counter">${state.selectedAccessCards.length}/3</span>
    </div>
    ${renderFeedback(feedback)}
    <button class="ghost-button" data-action="reset">重置试炼</button>
  `;
}

function renderLogic(feedback) {
  return `
    <header class="scene-header">
      <p class="eyebrow">Granger's Notebook</p>
      <h1>赫敏的逻辑笔记</h1>
      <p>先选择一种推理方式，再点亮线索券所指向的符文。</p>
    </header>

    <section class="choice-grid" aria-label="推理方式">
      ${LOGIC_PATHS.map(
        (path) => `
        <button class="choice-card ${state.selectedLogicPath === path.id ? 'is-selected' : ''}" data-action="logic-path" data-id="${path.id}">
          <strong>${path.title}</strong>
          <span>${path.visibleText}</span>
        </button>
      `
      ).join('')}
    </section>

    <section class="rune-grid" aria-label="符文九宫格">
      ${RUNE_CELLS.map(
        (cell) => `
        <button class="rune ${cell.isEntrance ? 'has-entrance' : ''} ${state.selectedRune === cell.id ? 'is-selected' : ''}" data-action="rune" data-id="${cell.id}" aria-label="${cell.label}">
          <span class="rune-mark">${cell.glyph}</span>
          <strong>${cell.label}</strong>
        </button>
      `
      ).join('')}
    </section>

    <div class="action-row">
      <button class="primary-button" data-action="solve-logic">翻开下一页</button>
      <button class="secondary-button" data-action="logic-hint">读取提示</button>
    </div>
    ${renderFeedback(feedback)}
  `;
}

function renderPotion(feedback) {
  return `
    <header class="scene-header">
      <p class="eyebrow">Common Room</p>
      <h1>斯莱特林公共休息室</h1>
      <p>从药剂架选择三瓶，让它们在银杯中稳定发光。</p>
    </header>

    <section class="bottle-rack" aria-label="药剂瓶">
      ${POTION_BOTTLES.map(
        (bottle) => `
        <button class="bottle ${state.selectedPotionBottles.includes(bottle.id) ? 'is-selected' : ''}" data-action="bottle" data-id="${bottle.id}">
          <span class="bottle-icon"><i></i></span>
          <strong>${bottle.title}</strong>
          <small>${bottle.visibleText}</small>
        </button>
      `
      ).join('')}
    </section>

    <div class="action-row">
      <button class="primary-button" data-action="brew">倒入银杯</button>
      <span class="counter">${state.selectedPotionBottles.length}/3</span>
    </div>
    ${renderFeedback(feedback)}
  `;
}

function renderLock(feedback) {
  return `
    <header class="scene-header">
      <p class="eyebrow">Chamber Lock</p>
      <h1>密室门锁</h1>
      <p>抽出“密室数字包”，按蛇形路径排好五张数字券，再选一句原著咒语送进锁芯。</p>
    </header>

    <section class="lock-visual" aria-label="蛇形路径示意">
      ${renderSnakePathSvg()}
    </section>

    <form class="lock-form" data-action="lock">
      <label>
        <span>蛇形数字</span>
        <input autocomplete="off" inputmode="numeric" maxlength="5" name="lock-code" placeholder="五位封印码" />
      </label>
    </form>

    <section class="phrase-grid" aria-label="守护语">
      ${SEAL_PHRASES.map(
        (phrase) => `
        <button class="choice-card ${state.selectedSealPhrase === phrase.id ? 'is-selected' : ''}" data-action="phrase" data-id="${phrase.id}">
          <strong>${phrase.spell}</strong>
          <span>${phrase.title}：${phrase.translation}</span>
        </button>
      `
      ).join('')}
    </section>

    <button class="primary-button" data-action="open-lock">打开密室</button>
    ${renderFeedback(feedback)}
  `;
}

function renderResult() {
  const result = getResultForState(state);
  state.finalEnvelopeCode = result.envelopeCode;
  saveState();

  return `
    <header class="scene-header result-header">
      <p class="eyebrow">Final Seal</p>
      <h1>命运封印</h1>
      <p>${result.publicText}</p>
    </header>

    <section class="seal" aria-label="最终封印编号">
      <span>打开编号信封</span>
      <strong>${result.envelopeCode}</strong>
    </section>

    <p class="quiet-note">礼物名不在这里。真正的答案，藏在对应编号的兑换券里。</p>
    <button class="ghost-button" data-action="reset">重新开始</button>
  `;
}

function bindGlobalActions() {
  app.querySelectorAll('[data-action]').forEach((node) => {
    node.addEventListener('click', handleAction);
  });

}

function handleAction(event) {
  const action = event.currentTarget.dataset.action;
  const id = event.currentTarget.dataset.id;

  if (action === 'logic-path') {
    state.selectedLogicPath = id;
    render();
  }

  if (action === 'access-card') {
    toggleAccessCard(id);
  }

  if (action === 'solve-access') {
    solveAccessStage();
  }

  if (action === 'rune') {
    state.selectedRune = id;
    render();
  }

  if (action === 'solve-logic') {
    solveLogicStage();
  }

  if (action === 'logic-hint') {
    const cell = RUNE_CELLS.find((item) => item.id === state.selectedRune);
    render(cell?.hint ?? '线索券说：蛇影与羽毛必须在同一格。');
  }

  if (action === 'bottle') {
    toggleBottle(id);
  }

  if (action === 'brew') {
    solvePotionStage();
  }

  if (action === 'phrase') {
    state.selectedSealPhrase = id;
    render();
  }

  if (action === 'open-lock') {
    solveLockStage();
  }

  if (action === 'reset') {
    if (confirm('要清空这次试炼记录吗？')) {
      localStorage.removeItem(STORAGE_KEY);
      state = createInitialState();
      render();
    }
  }
}

function handleSubmit(event) {
  event.preventDefault();
}

function toggleAccessCard(id) {
  if (state.selectedAccessCards.includes(id)) {
    state.selectedAccessCards = state.selectedAccessCards.filter((item) => item !== id);
  } else if (state.selectedAccessCards.length < 3) {
    state.selectedAccessCards = [...state.selectedAccessCards, id];
  }
  render();
}

function solveAccessStage() {
  if (!isAccessCardSetValid(state.selectedAccessCards)) {
    render('银蛇守卫没有认出这组三张牌。真正的通行组合里，会同时有她、守护与学院。');
    return;
  }

  playTransition('access', () => completeStage('access', 'logic'));
}

function solveLogicStage() {
  if (!state.selectedLogicPath) {
    render('赫敏会先选一种推理方式，再碰符文。');
    return;
  }

  if (!isRuneEntranceValid(state.selectedRune)) {
    render('这枚符文亮了一下，但没有推开笔记页。换一个能回应蛇影、镜面或记忆的入口。');
    return;
  }

  const path = LOGIC_PATHS.find((item) => item.id === state.selectedLogicPath);
  const rune = RUNE_CELLS.find((item) => item.id === state.selectedRune);
  applyChoiceScores(state, path.scoreTags);
  applyChoiceScores(state, rune.scoreTags ?? []);
  playTransition('logic', () => completeStage('logic', 'potion'));
}

function toggleBottle(id) {
  if (state.selectedPotionBottles.includes(id)) {
    state.selectedPotionBottles = state.selectedPotionBottles.filter((item) => item !== id);
  } else if (state.selectedPotionBottles.length < 3) {
    state.selectedPotionBottles = [...state.selectedPotionBottles, id];
  }
  render();
}

function solvePotionStage() {
  if (state.selectedPotionBottles.length !== 3) {
    render('银杯只接受三瓶药剂。多一瓶会沸腾，少一瓶不会发光。');
    return;
  }

  for (const bottleId of state.selectedPotionBottles) {
    const bottle = POTION_BOTTLES.find((item) => item.id === bottleId);
    applyChoiceScores(state, bottle.scoreTags);
  }
  playTransition('potion', () => completeStage('potion', 'lock'));
}

function solveLockStage() {
  const input = app.querySelector('input[name="lock-code"]');
  const code = String(input?.value ?? '').trim();

  if (!isLockCodeValid(code)) {
    render('蛇形路径还没咬住尾巴。按五张数字券的路径重新读一遍。');
    return;
  }

  if (!state.selectedSealPhrase) {
    render('密室门还缺一句守护语。');
    return;
  }

  const phrase = SEAL_PHRASES.find((item) => item.id === state.selectedSealPhrase);
  applyChoiceScores(state, phrase.scoreTags);
  playTransition('lock', () => completeStage('lock', 'result'));
}

function completeStage(currentStage, nextStage) {
  if (!state.completedStages.includes(currentStage)) {
    state.completedStages = [...state.completedStages, currentStage];
  }
  state.stage = nextStage;
  render();
}

function renderFeedback(feedback) {
  return feedback ? `<p class="feedback" role="status">${feedback}</p>` : '';
}

function renderTransition() {
  if (!transition) {
    return '';
  }

  const labels = {
    access: '封蜡裂开，禁书区的门缝亮了起来。',
    logic: '符文沿着羽笔游走，笔记页自动翻开。',
    potion: '三瓶药剂在银杯里汇合，光雾升起。',
    lock: '咒语落入锁芯，密室门正在回应。'
  };

  return `
    <section class="transition ${transition}" aria-live="polite">
      <div class="transition-stage">
        <span></span><span></span><span></span>
      </div>
      <p>${labels[transition]}</p>
    </section>
  `;
}

function playTransition(type, next) {
  transition = type;
  render();
  runEnhancedTransition(type);
  window.setTimeout(() => {
    transition = null;
    next();
  }, 1200);
}

function runEnhancedTransition(type) {
  const gsap = window.gsap;
  if (!gsap) {
    return;
  }

  const nodes = [...document.querySelectorAll('.transition-stage span')];
  const label = document.querySelector('.transition p');
  const timeline = gsap.timeline();

  timeline.fromTo(nodes, {
    y: 28,
    opacity: 0,
    rotate: type === 'potion' ? -8 : 0,
    scale: 0.82
  }, {
    y: 0,
    opacity: 1,
    rotate: 0,
    scale: 1,
    stagger: 0.08,
    duration: 0.38,
    ease: 'back.out(1.8)'
  });

  if (type === 'potion') {
    timeline.to(nodes, {
      x: (index) => [28, 0, -28][index] ?? 0,
      y: (index) => [12, -10, 12][index] ?? 0,
      rotate: (index) => [-22, 0, 22][index] ?? 0,
      duration: 0.42,
      ease: 'power2.inOut'
    }, 0.32);
  } else {
    timeline.to(nodes, {
      y: -18,
      boxShadow: '0 0 70px rgba(182, 155, 94, 0.72)',
      duration: 0.48,
      ease: 'sine.inOut'
    }, 0.34);
  }

  timeline.fromTo(label, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.28 }, 0.18);
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, serializeState(state));
}

function loadState() {
  return deserializeState(localStorage.getItem(STORAGE_KEY));
}

function renderCrestSvg() {
  return `
    <svg viewBox="0 0 220 220" role="img" aria-label="银蛇缠绕羽笔">
      <defs>
        <linearGradient id="crestMetal" x1="0" x2="1">
          <stop offset="0" stop-color="#f2efe5" />
          <stop offset="1" stop-color="#98a89d" />
        </linearGradient>
      </defs>
      <path d="M110 13 188 45v64c0 50-34 82-78 102-44-20-78-52-78-102V45Z" fill="#123d31" stroke="url(#crestMetal)" stroke-width="4"/>
      <path d="M72 142c38 18 85-5 78-34-5-20-35-15-36-1-1 12 17 13 19 5" fill="none" stroke="#d6d0bd" stroke-width="9" stroke-linecap="round"/>
      <path d="M88 66c18 23 38 42 64 66" fill="none" stroke="#b69b5e" stroke-width="5" stroke-linecap="round"/>
      <path d="M81 56c15 1 28 8 36 20-17-4-28-3-42 5 4-8 4-16 6-25Z" fill="#f3ead2"/>
      <circle cx="158" cy="92" r="5" fill="#b69b5e"/>
      <path d="M79 161h82" stroke="#d6d0bd" stroke-width="3" stroke-linecap="round"/>
    </svg>
  `;
}

function renderSnakePathSvg() {
  const points = [
    [34, 84],
    [104, 42],
    [168, 84],
    [232, 126],
    [300, 84]
  ];

  return `
    <svg viewBox="0 0 334 170" role="img" aria-label="五位蛇形数字路径">
      <path d="M34 84C68 12 104 12 136 84s64 72 96 0 64-72 100 0" fill="none" stroke="#8fb7a2" stroke-width="10" stroke-linecap="round"/>
      <g fill="#f2ead2" stroke="#b69b5e" stroke-width="3">
        ${points.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="21"/>`).join('')}
      </g>
      <g fill="#14372d" font-size="24" font-family="Georgia, serif" text-anchor="middle" dominant-baseline="central">
        ${points.map(([x, y], index) => `<text x="${x}" y="${y}">${index + 1}</text>`).join('')}
      </g>
      <path d="M314 74 328 84 314 94" fill="none" stroke="#b69b5e" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;
}
