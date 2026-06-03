import test from 'node:test';
import assert from 'node:assert/strict';

import {
  ACCESS_CARDS,
  LOCK_QUESTIONS,
  POTION_BOTTLES,
  RUNE_CELLS,
  VISUAL_ASSETS
} from '../src/game-data.js';
import {
  ACCESS_CARD_IDS,
  LOCK_CODE,
  VALID_RUNE_IDS,
  createInitialState,
  applyChoiceScores,
  choosePrize,
  getResultForState,
  isAccessCodeSetValid,
  isAccessCardSetValid,
  isLockQuizComplete,
  isRuneEntranceValid,
  isLockCodeValid,
  serializeState,
  deserializeState
} from '../src/game-engine.js';

test('validates the forbidden-section clue cards without relying on visible input answers', () => {
  assert.equal(isAccessCardSetValid(['granger-note', 'otter-memory', 'serpent-seal']), true);
  assert.equal(isAccessCardSetValid(['granger-note', 'otter-memory', 'phoenix-ash']), false);
  assert.equal(isAccessCardSetValid([ACCESS_CARD_IDS[0], ACCESS_CARD_IDS[1]]), false);
});

test('disperses forbidden-section key cards instead of putting answers first', () => {
  const keyIndexes = ACCESS_CARD_IDS.map((id) => ACCESS_CARDS.findIndex((card) => card.id === id));

  assert.notDeepEqual(keyIndexes, [0, 1, 2]);
  assert.equal(isAccessCardSetValid(ACCESS_CARDS.slice(0, 3).map((card) => card.id)), false);
  assert.equal(Math.max(...keyIndexes) - Math.min(...keyIndexes) >= 4, true);
});

test('keeps legacy access-code validation available for old saved sessions only', () => {
  assert.equal(isAccessCodeSetValid(['granger', ' OTTER ', 'Serpent']), true);
});

test('applies hidden preference scores without exposing prize names', () => {
  const state = createInitialState();

  applyChoiceScores(state, ['style', 'luxury', 'luxury']);
  applyChoiceScores(state, ['memory']);

  assert.equal(state.scores.style, 1);
  assert.equal(state.scores.luxury, 2);
  assert.equal(state.scores.memory, 1);
  assert.equal(Object.hasOwn(state.scores, 'displayName'), false);
});

test('maps luxury and style preference to a sunglasses seal', () => {
  const state = createInitialState();
  state.scores.style = 3;
  state.scores.luxury = 3;

  const prize = choosePrize(state);

  assert.equal(['S-01', 'S-02'].includes(prize.envelopeCode), true);
  assert.equal(prize.resultCopy.includes(prize.displayName), false);
});

test('allows multiple rune entrances to continue the logic stage', () => {
  assert.equal(VALID_RUNE_IDS.length >= 3, true);
  assert.equal(isRuneEntranceValid('serpent-quill'), true);
  assert.equal(isRuneEntranceValid('mirror-serpent'), true);
  assert.equal(isRuneEntranceValid('moon-owl'), false);
});

test('provides rich local visual assets for clue cards, runes, potions, and ambience', () => {
  assert.equal(VISUAL_ASSETS.ambience.length >= 3, true);
  assert.equal(VISUAL_ASSETS.textures.parchment.startsWith('./artifacts/'), true);

  assert.equal(ACCESS_CARDS.every((card) => card.artifact && card.tone), true);
  assert.equal(RUNE_CELLS.every((cell) => cell.artifact && cell.constellation), true);
  assert.equal(POTION_BOTTLES.every((bottle) => bottle.artifact && bottle.liquid), true);
});

test('uses her birthday as a four-digit chamber lock code', () => {
  assert.equal(LOCK_CODE, '0418');
  assert.equal(LOCK_CODE.length, 4);
  assert.equal(isLockCodeValid(LOCK_CODE), true);
  assert.equal(isLockCodeValid('724'), false);
});

test('derives the chamber lock digits from four original-book quiz questions', () => {
  assert.equal(LOCK_QUESTIONS.length, 4);
  assert.equal(LOCK_QUESTIONS.map((question) => question.digit).join(''), '0418');
  assert.equal(LOCK_QUESTIONS.every((question) => question.source === 'original-books'), true);

  const answers = Object.fromEntries(
    LOCK_QUESTIONS.map((question) => [
      question.id,
      question.options.find((option) => option.isCorrect).id
    ])
  );

  assert.equal(isLockQuizComplete(answers), true);
  assert.equal(isLockQuizComplete({ ...answers, snitch: 'wrong' }), false);
});

test('uses birthday-like tie priority when scores are even', () => {
  const state = createInitialState();
  state.scores.memory = 2;
  state.scores.cash = 2;
  state.scores.style = 2;
  state.scores.luxury = 2;

  assert.equal(choosePrize(state).envelopeCode, 'S-01');
});

test('returns only the seal code and blessing text for the public result', () => {
  const state = createInitialState();
  state.scores.cash = 5;

  const result = getResultForState(state);

  assert.equal(result.envelopeCode, 'S-05');
  assert.equal(result.publicText.includes('微信红包'), false);
  assert.equal(result.publicText.includes('1314'), false);
});

test('round-trips game state for refresh recovery', () => {
  const state = createInitialState();
  state.stage = 'potion';
  state.completedStages = ['access', 'logic'];
  state.scores.care = 2;
  state.selectedLogicPath = 'silver-cloak';

  const restored = deserializeState(serializeState(state));

  assert.deepEqual(restored, state);
});
