import { createReadStream, existsSync } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml; charset=utf-8'
};

export function getProjectRoot(metaUrl = import.meta.url) {
  return resolve(fileURLToPath(new URL('..', metaUrl)));
}

export function createStaticServer(root) {
  return createServer(async (request, response) => {
    const url = new URL(request.url ?? '/', `http://${request.headers.host}`);
    const safePath = normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[/\\])+/, '');
    let filePath = resolve(join(root, safePath));

    if (!filePath.startsWith(root)) {
      response.writeHead(403);
      response.end('Forbidden');
      return;
    }

    if (!existsSync(filePath) || (await stat(filePath)).isDirectory()) {
      filePath = join(root, 'index.html');
    }

    response.writeHead(200, {
      'Content-Type': mimeTypes[extname(filePath)] ?? 'application/octet-stream'
    });
    createReadStream(filePath).pipe(response);
  });
}

export function isCliEntry(metaUrl = import.meta.url, argvPath = process.argv[1]) {
  if (!argvPath) {
    return false;
  }
  return resolve(fileURLToPath(metaUrl)) === resolve(argvPath);
}

if (isCliEntry()) {
  const root = getProjectRoot();
  const port = Number(process.env.PORT ?? 4173);
  const server = createStaticServer(root);

  server.listen(port, () => {
    console.log(`Birthday puzzle game: http://localhost:${port}`);
  });
}
