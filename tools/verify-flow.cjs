const { mkdirSync } = require('node:fs');
const { resolve } = require('node:path');
const { chromium } = require('playwright');

const outputDir = resolve(__dirname, '..', 'artifacts');
mkdirSync(outputDir, { recursive: true });

const prizeLeakPattern = /GENTLE|古驰|微信红包|相机代金券|按摩仪|原汁机|鞋款兑换券/;

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    isMobile: true
  });
  const errors = [];

  page.on('console', (message) => {
    if (message.type() === 'error') {
      errors.push(message.text());
    }
  });
  page.on('pageerror', (error) => errors.push(error.message));

  await page.goto('http://127.0.0.1:4173', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'domcontentloaded' });

  await page.fill('input[name="code-0"]', 'granger');
  await page.fill('input[name="code-1"]', 'otter');
  await page.fill('input[name="code-2"]', 'serpent');
  await page.click('button[type="submit"]');
  await page.click('[data-id="silver-cloak"]');
  await page.click('[data-id="serpent-quill"]');
  await page.click('[data-action="solve-logic"]');
  await page.click('[data-id="mirror-silver"]');
  await page.click('[data-id="old-house"]');
  await page.click('[data-id="frozen-frame"]');
  await page.click('[data-action="brew"]');
  await page.fill('input[name="lock-code"]', '724');
  await page.click('[data-id="serpent-glass"]');
  await page.click('[data-action="open-lock"]');

  const finalText = await page.locator('body').innerText();
  await page.screenshot({ path: resolve(outputDir, 'mobile-result.png'), fullPage: true });

  const desktop = await browser.newPage({ viewport: { width: 1200, height: 900 } });
  await desktop.goto('http://127.0.0.1:4173', { waitUntil: 'domcontentloaded' });
  await desktop.screenshot({ path: resolve(outputDir, 'desktop-load.png'), fullPage: true });

  await browser.close();

  const result = {
    hasSeal: /S-0[1-9]/.test(finalText),
    leaksPrize: prizeLeakPattern.test(finalText),
    errors,
    finalText
  };

  console.log(JSON.stringify(result, null, 2));

  if (!result.hasSeal || result.leaksPrize || result.errors.length > 0) {
    process.exit(1);
  }
})();
