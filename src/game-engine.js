import { ACCESS_CARD_IDS, LOCK_CODE, LOCK_QUESTIONS, PRIZES, SCORE_KEYS, VALID_RUNE_IDS } from './game-data.js';

export const ACCESS_CODES = ['OTTER', 'SERPENT', 'GRANGER'];
export { ACCESS_CARD_IDS, LOCK_CODE, LOCK_QUESTIONS, VALID_RUNE_IDS };

const TIE_PRIORITY = [
  'gentle-monster',
  'gucci-sunglasses',
  'camera',
  'shoes',
  'red-packet',
  'morphy-eye',
  'meeegou-care',
  'skg-neck',
  'juicer'
];

export function createInitialState() {
  return {
    stage: 'welcome',
    completedStages: [],
    scores: Object.fromEntries(SCORE_KEYS.map((key) => [key, 0])),
    selectedAccessCards: [],
    selectedLogicPath: null,
    selectedRune: null,
    selectedPotionBottles: [],
    lockAnswers: {},
    selectedSealPhrase: null,
    finalEnvelopeCode: null
  };
}

export function isAccessCodeSetValid(codes) {
  if (!Array.isArray(codes) || codes.length !== ACCESS_CODES.length) {
    return false;
  }

  const normalized = codes.map(normalizeCode).sort();
  return normalized.join('|') === [...ACCESS_CODES].sort().join('|');
}

export function isAccessCardSetValid(cardIds) {
  if (!Array.isArray(cardIds) || cardIds.length !== ACCESS_CARD_IDS.length) {
    return false;
  }

  const normalized = cardIds.map((id) => String(id ?? '').trim()).sort();
  return normalized.join('|') === [...ACCESS_CARD_IDS].sort().join('|');
}

export function isRuneEntranceValid(runeId) {
  return VALID_RUNE_IDS.includes(runeId);
}

export function isLockCodeValid(code) {
  return String(code ?? '').trim() === LOCK_CODE;
}

export function isLockQuizComplete(answers) {
  if (!answers || typeof answers !== 'object') {
    return false;
  }

  return LOCK_QUESTIONS.every((question) => {
    const selectedOption = question.options.find((option) => option.id === answers[question.id]);
    return selectedOption?.isCorrect === true;
  });
}

export function applyChoiceScores(state, tags) {
  for (const tag of tags) {
    if (Object.hasOwn(state.scores, tag)) {
      state.scores[tag] += 1;
    }
  }
  return state;
}

export function choosePrize(state) {
  const ranked = PRIZES.map((prize) => ({
    prize,
    score: scorePrize(prize, state.scores),
    priority: TIE_PRIORITY.indexOf(prize.id)
  })).sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return a.priority - b.priority;
  });

  return ranked[0].prize;
}

export function getResultForState(state) {
  const prize = choosePrize(state);
  return {
    envelopeCode: prize.envelopeCode,
    publicText: prize.resultCopy
  };
}

export function serializeState(state) {
  return JSON.stringify(state);
}

export function deserializeState(value) {
  try {
    const parsed = JSON.parse(value);
    return normalizeState(parsed);
  } catch {
    return createInitialState();
  }
}

function normalizeCode(code) {
  return String(code ?? '').trim().toUpperCase();
}

function normalizeState(candidate) {
  const initial = createInitialState();
  const scores = { ...initial.scores, ...(candidate?.scores ?? {}) };

  return {
    ...initial,
    ...candidate,
    scores
  };
}

function scorePrize(prize, scores) {
  switch (prize.id) {
    case 'gentle-monster':
      return scores.style * 2 + scores.luxury * 3;
    case 'gucci-sunglasses':
      return scores.style * 2 + scores.luxury * 2 + scores.classic * 3;
    case 'shoes':
      return scores.style * 2 + scores.practical * 3 + scores.comfort;
    case 'camera':
      return scores.memory * 4 + scores.romance;
    case 'red-packet':
      return scores.cash * 4 + scores.romance * 2;
    case 'morphy-eye':
      return scores.care * 2 + scores.eye * 4;
    case 'meeegou-care':
      return scores.care * 2 + scores.body * 4;
    case 'skg-neck':
      return scores.care * 2 + scores.neck * 4;
    case 'juicer':
      return scores.home * 4;
    default:
      return 0;
  }
}
