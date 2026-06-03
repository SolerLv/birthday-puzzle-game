import test from 'node:test';
import assert from 'node:assert/strict';

import { getProjectRoot, createStaticServer, isCliEntry } from '../tools/serve.mjs';

test('resolves project root without duplicating Windows drive letters', () => {
  const root = getProjectRoot();

  assert.equal(root.includes('D:\\D:\\'), false);
  assert.equal(root.endsWith('birthday-puzzle-game'), true);
});

test('serves the static app shell', async () => {
  const server = createStaticServer(getProjectRoot());
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));

  try {
    const { port } = server.address();
    const response = await fetch(`http://127.0.0.1:${port}/`);
    const html = await response.text();

    assert.equal(response.status, 200);
    assert.match(response.headers.get('content-type'), /text\/html/);
    assert.match(html, /斯莱特林密室试炼/);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('detects direct CLI execution on Windows-style resolved paths', () => {
  const scriptPath = getProjectRoot().replace(/[/\\]$/, '') + '\\tools\\serve.mjs';
  const metaUrl = new URL('../tools/serve.mjs', import.meta.url).href;

  assert.equal(isCliEntry(metaUrl, scriptPath), true);
});
