import assert from 'node:assert/strict';

import { VISUAL_ASSETS } from '../src/game-data.js';
import { createInitialState, getResultForState } from '../src/game-engine.js';

const baseUrl = process.env.PUZZLE_BASE_URL ?? 'http://127.0.0.1:4173';
const prizeLeakPattern = /GENTLE|古驰|微信红包|相机代金券|按摩仪|原汁机|鞋款兑换券|眼部按摩仪|原汁机/;

const appShell = await fetchText('/');
assert.match(appShell, /斯莱特林密室试炼/);
assert.match(appShell, /src\/styles\.css/);
assert.match(appShell, /src\/app\.js/);

const [css, appJs, dataJs, engineJs] = await Promise.all([
  fetchText('/src/styles.css'),
  fetchText('/src/app.js'),
  fetchText('/src/game-data.js'),
  fetchText('/src/game-engine.js')
]);

assert.match(css, /@media \(max-width: 760px\)/);
assert.match(css, /aspect-ratio: 1/);
assert.match(css, /transition/);
assert.match(appJs, /localStorage/);
assert.match(appJs, /命运封印/);
assert.match(appJs, /isAccessCardSetValid/);
assert.match(appJs, /runEnhancedTransition/);
assert.match(appShell, /gsap/);
assert.match(dataJs, /S-09/);
assert.match(dataJs, /VISUAL_ASSETS/);
assert.match(dataJs, /Expecto Patronum/);
assert.match(engineJs, /choosePrize/);
assert.match(await fetchText('/.nojekyll'), /^/);

const assetPaths = [
  ...Object.values(VISUAL_ASSETS.textures),
  ...VISUAL_ASSETS.ambience.map((asset) => asset.imageUrl)
].map((assetPath) => assetPath.replace(/^\./, ''));

await Promise.all(assetPaths.map((assetPath) => fetchText(assetPath)));

const publicResult = getResultForState(createInitialState());
assert.equal(/S-0[1-9]/.test(publicResult.envelopeCode), true);
assert.equal(prizeLeakPattern.test(publicResult.publicText), false);

console.log(JSON.stringify({
  ok: true,
  checked: ['app shell', 'css', 'js modules', 'local visual assets', 'public result copy'],
  baseUrl
}, null, 2));

async function fetchText(pathname) {
  const response = await fetch(new URL(pathname, baseUrl));
  assert.equal(response.status, 200, `${pathname} should be served`);
  return response.text();
}
