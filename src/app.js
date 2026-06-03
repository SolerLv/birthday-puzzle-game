import {
  ACCESS_CARDS,
  CORRECT_RUNE_ID,
  LOCK_QUESTIONS,
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
  isLockQuizComplete,
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

  const scene = getSceneAsset(state.stage);

  app.innerHTML = `
    <main class="shell stage-${state.stage}" style="--scene-image: url('${scene.imageUrl}')">
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
        <button class="clue-card ${state.selectedAccessCards.includes(card.id) ? 'is-selected' : ''}" style="--accent: ${card.tone}" data-action="access-card" data-id="${card.id}">
          <span class="clue-artifact artifact-${card.artifact}" aria-hidden="true">${renderClueArtifact(card)}</span>
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
        <button class="rune artifact-${cell.artifact} ${cell.isEntrance ? 'has-entrance' : ''} ${state.selectedRune === cell.id ? 'is-selected' : ''}" style="--rune-color: ${cell.constellation}" data-action="rune" data-id="${cell.id}" aria-label="${cell.label}">
          <span class="rune-aura" aria-hidden="true"></span>
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
        <button class="bottle bottle-${bottle.artifact} ${state.selectedPotionBottles.includes(bottle.id) ? 'is-selected' : ''}" style="--liquid-a: ${bottle.liquid[0]}; --liquid-b: ${bottle.liquid[1]}" data-action="bottle" data-id="${bottle.id}">
          ${renderBottleIllustration(bottle)}
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
      <p>抽出“密室问答包”，用四道原著线索唤醒四枚锁芯，再选一句守护语送进门缝。</p>
    </header>

    <section class="lock-visual" aria-label="四位生日封印">
      ${renderLockSealSvg()}
      ${renderLockDigits()}
    </section>

    <section class="lock-quiz" aria-label="密室原著问答">
      ${LOCK_QUESTIONS.map((question) => renderLockQuestion(question)).join('')}
    </section>

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

  if (action === 'lock-answer') {
    selectLockAnswer(event.currentTarget.dataset.question, id);
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
  if (!isLockQuizComplete(state.lockAnswers)) {
    render('四枚锁芯还没有全部亮起。回到原著线索里，把每一位数字问出来。');
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

function selectLockAnswer(questionId, optionId) {
  state.lockAnswers = {
    ...(state.lockAnswers ?? {}),
    [questionId]: optionId
  };
  render();
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
    lock: '四枚数字归位，咒语落入锁芯，密室门正在回应。'
  };

  return `
    <section class="transition ${transition}" aria-live="polite">
      <div class="transition-stage" aria-hidden="true">
        ${renderTransitionStage(transition)}
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

  const nodes = [...document.querySelectorAll('.transition-stage span, .transition-stage i, .transition-stage b')];
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

function getSceneAsset(stage) {
  return VISUAL_ASSETS.ambience.find((asset) => asset.stage === stage) ?? VISUAL_ASSETS.ambience[0];
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

function renderClueArtifact(card) {
  const motif = {
    'quill-note': '<path d="M20 55c38-25 54-35 70-45-9 24-24 50-58 78" /><path d="M30 80h52" /><path d="M38 92h30" />',
    'silver-ripple': '<path d="M15 66c20-18 38-18 58 0s38 18 58 0" /><path d="M26 82c14-10 28-10 42 0s28 10 42 0" /><circle cx="78" cy="45" r="11" />',
    'serpent-wax': '<path d="M35 78c30 22 69 3 60-22-5-15-30-11-28 2 1 8 14 8 15 1" /><circle cx="83" cy="43" r="5" /><path d="M22 102h84" />',
    'ash-feather': '<path d="M34 94c8-32 22-56 56-76-3 32-14 58-44 83" /><path d="M45 70h33M39 86h28" />',
    'stag-track': '<path d="M33 77c6-18 13-27 24-36 0 18 0 34-7 48" /><path d="M84 77c-6-18-13-27-24-36 0 18 0 34 7 48" /><circle cx="58" cy="95" r="9" />',
    'moon-ink': '<path d="M78 25c-23 8-31 33-18 51 8 12 23 17 37 12-20 19-55 7-62-20-7-26 14-49 43-43Z" /><path d="M42 102c18-10 36-10 54 0" />',
    'bronze-key': '<circle cx="43" cy="55" r="18" /><path d="M61 55h52M94 55v18M106 55v12" />',
    'green-ribbon': '<path d="M24 42c24-15 45 20 68 4 16-11 27-11 39-2" /><path d="M43 55 28 98M88 56l14 42" />',
    'library-dust': '<path d="M28 82h88l-12 22H40Z" /><path d="M36 45h72M42 58h60M50 71h44" /><circle cx="32" cy="33" r="3" /><circle cx="99" cy="30" r="2" />'
  }[card.artifact] ?? '<circle cx="70" cy="70" r="36" />';

  return `
    <svg viewBox="0 0 140 120" role="img" aria-label="${card.symbol}">
      <g fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">${motif}</g>
      <text x="18" y="24">${card.symbol}</text>
    </svg>
  `;
}

function renderBottleIllustration(bottle) {
  const artwork = getBottleArtwork(bottle.artifact);

  return `
    <span class="bottle-illustration" aria-hidden="true">
      <svg viewBox="0 0 96 132" role="img" aria-label="${bottle.title}">
        <defs>
          <linearGradient id="liquid-${bottle.id}" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stop-color="var(--liquid-a)" />
            <stop offset="1" stop-color="var(--liquid-b)" />
          </linearGradient>
        </defs>
        <path class="glass-neck" d="${artwork.body}" />
        <path class="liquid" d="${artwork.liquid}" fill="url(#liquid-${bottle.id})" />
        <path class="bottle-label" d="${artwork.label}" />
        <path class="glass-shine" d="${artwork.shine}" />
        <path class="cork" d="${artwork.cork}" />
      </svg>
      <i></i><i></i><i></i>
    </span>
  `;
}

function getBottleArtwork(artifact) {
  const shared = {
    shine: 'M34 47c-9 17-10 34-3 50',
    cork: 'M35 6h26v13H35Z',
    label: 'M32 77h32v24H32Z'
  };

  const variants = {
    faceted: {
      body: 'M38 10h20v29l20 30-9 46-21 11-21-11-9-46 20-30Z',
      liquid: 'M26 82c16 7 32-7 48 0l-7 31-19 9-19-9Z',
      label: 'M33 76h30l8 10-8 12H33l-8-12Z',
      shine: 'M34 49c-8 15-9 32-3 47',
      cork: shared.cork
    },
    apothecary: {
      body: 'M39 8h18v30c0 8 17 14 24 34 10 30-6 50-33 50S5 102 15 72c7-20 24-26 24-34Z',
      liquid: 'M20 80c19 9 37-8 56 0 4 24-9 38-28 38S16 104 20 80Z',
      label: 'M32 79h32v23H32Z',
      shine: 'M33 47c-11 18-12 35-3 52',
      cork: 'M33 5h30v14H33Z'
    },
    round: {
      body: 'M29 18h38v26c0 6 16 14 19 35 4 29-15 47-38 47S6 108 10 79c3-21 19-29 19-35Z',
      liquid: 'M15 83c22 10 44-9 66 0 0 26-15 39-33 39S15 109 15 83Z',
      label: 'M31 82h36v21H31Z',
      shine: 'M30 51c-12 18-13 37-3 54',
      cork: 'M30 9h36v14H30Z'
    },
    tall: {
      body: 'M36 8h24v45c0 7 12 13 16 33 5 27-9 40-28 40S15 113 20 86c4-20 16-26 16-33Z',
      liquid: 'M23 82c17 7 33-6 50 0 4 26-8 38-25 38S19 108 23 82Z',
      label: 'M33 83h30v20H33Z',
      shine: 'M35 55c-8 15-9 31-3 47',
      cork: 'M33 4h30v14H33Z'
    },
    'cut-crystal': {
      body: 'M39 12h18v27l27 28-10 49-26 10-26-10-10-49 27-28Z',
      liquid: 'M22 84c18 8 38-8 56 0l-8 30-22 8-22-8Z',
      label: 'M34 77h28l9 11-9 11H34l-9-11Z',
      shine: 'M35 49c-7 14-8 32-2 48',
      cork: 'M34 6h28v14H34Z'
    },
    vine: {
      body: 'M37 8h22v31c0 8 20 19 22 40 4 30-12 45-33 45S11 109 15 79c2-21 22-32 22-40Z',
      liquid: 'M20 82c18 7 37-7 56 0 3 25-10 37-28 37S17 107 20 82Z',
      label: 'M31 78c12 9 24 9 36 0v23c-12 9-24 9-36 0Z',
      shine: 'M33 48c-10 17-11 34-3 50',
      cork: shared.cork
    },
    moon: {
      body: 'M41 9h14v35c0 9 22 18 25 42 4 28-13 40-32 40S16 114 20 86c3-24 21-33 21-42Z',
      liquid: 'M23 84c16 8 34-7 50 0 3 25-8 37-25 37S20 109 23 84Z',
      label: 'M34 82a14 14 0 1 0 28 0 14 14 0 1 0-28 0',
      shine: 'M36 54c-8 16-9 32-2 48',
      cork: 'M34 5h28v13H34Z'
    },
    wide: {
      body: 'M34 14h28v24c0 7 24 15 28 38 5 31-17 49-42 49S1 107 6 76c4-23 28-31 28-38Z',
      liquid: 'M12 82c24 10 48-10 72 0 1 27-18 39-36 39S11 109 12 82Z',
      label: 'M29 79h38v22H29Z',
      shine: 'M28 49c-13 18-14 37-4 55',
      cork: 'M31 7h34v14H31Z'
    }
  };

  return variants[artifact] ?? { ...shared, body: variants.apothecary.body, liquid: variants.apothecary.liquid };
}

function renderTransitionStage(type) {
  const stages = {
    access: '<span class="book"></span><i class="wax"></i><b class="spark one"></b><b class="spark two"></b><b class="spark three"></b>',
    logic: '<span class="page"></span><i class="rune-dot one"></i><i class="rune-dot two"></i><i class="rune-dot three"></i><b class="quill-line"></b>',
    potion: '<span class="pour left"></span><span class="pour center"></span><span class="pour right"></span><span class="cup"></span><i class="mist one"></i><i class="mist two"></i><i class="mist three"></i>',
    lock: '<span class="lock-disc"></span><i class="serpent-line"></i><b class="spark one"></b><b class="spark two"></b><b class="spark three"></b>'
  };

  return stages[type] ?? stages.access;
}

function renderLockDigits() {
  return `
    <div class="lock-digits" aria-label="已解出的四位封印码">
      ${LOCK_QUESTIONS.map((question, index) => {
        const answer = getSelectedLockOption(question);
        const solved = answer?.isCorrect === true;
        return `
          <span class="lock-digit ${solved ? 'is-solved' : ''}">
            <small>${index + 1}</small>
            <strong>${solved ? question.digit : '?'}</strong>
          </span>
        `;
      }).join('')}
    </div>
  `;
}

function renderLockQuestion(question) {
  const selected = state.lockAnswers?.[question.id];
  const selectedOption = getSelectedLockOption(question);
  const isSolved = selectedOption?.isCorrect === true;

  return `
    <article class="lock-question ${isSolved ? 'is-solved' : selected ? 'is-wrong' : ''}">
      <header>
        <span>${question.title}</span>
        <strong>${isSolved ? question.digit : '?'}</strong>
      </header>
      <p>${question.prompt}</p>
      <div class="lock-options">
        ${question.options.map((option) => `
          <button
            class="lock-option ${selected === option.id ? 'is-selected' : ''} ${selected === option.id && option.isCorrect ? 'is-correct' : ''} ${selected === option.id && !option.isCorrect ? 'is-wrong' : ''}"
            data-action="lock-answer"
            data-question="${question.id}"
            data-id="${option.id}"
          >
            ${option.text}
          </button>
        `).join('')}
      </div>
      ${selected ? `<small>${isSolved ? question.reveal : '这枚锁芯没有转动，再换一个原著答案。'}</small>` : ''}
    </article>
  `;
}

function getSelectedLockOption(question) {
  return question.options.find((option) => option.id === state.lockAnswers?.[question.id]);
}

function renderLockSealSvg() {
  return `
    <svg class="lock-seal" viewBox="0 0 334 150" role="img" aria-label="四枚问答锁芯">
      <defs>
        <radialGradient id="lockGlow" cx="50%" cy="45%" r="65%">
          <stop offset="0" stop-color="#f1df9a" stop-opacity="0.9" />
          <stop offset="0.52" stop-color="#5d9f7e" stop-opacity="0.42" />
          <stop offset="1" stop-color="#0d2b25" stop-opacity="0" />
        </radialGradient>
      </defs>
      <path d="M36 76C76 16 108 16 143 76s58 60 95 0 55-60 62-18" fill="none" stroke="#9fc5b2" stroke-width="8" stroke-linecap="round" opacity="0.72"/>
      <path d="M280 47c16 6 26 17 30 32-14-8-27-9-42-3 8-7 10-17 12-29Z" fill="#d7c58f"/>
      <g fill="url(#lockGlow)">
        <circle cx="42" cy="84" r="32" />
        <circle cx="124" cy="50" r="32" />
        <circle cx="210" cy="98" r="32" />
        <circle cx="292" cy="66" r="32" />
      </g>
      <g fill="#efe5c5" stroke="#b69b5e" stroke-width="3">
        <circle cx="42" cy="84" r="22" />
        <circle cx="124" cy="50" r="22" />
        <circle cx="210" cy="98" r="22" />
        <circle cx="292" cy="66" r="22" />
      </g>
      <g fill="#14372d" font-size="20" font-family="Georgia, serif" text-anchor="middle" dominant-baseline="central">
        <text x="42" y="84">?</text>
        <text x="124" y="50">?</text>
        <text x="210" y="98">?</text>
        <text x="292" y="66">?</text>
      </g>
    </svg>
  `;
}
