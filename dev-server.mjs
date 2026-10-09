// 로컬 미리보기 서버: node dev-server.mjs → http://localhost:3000
// .env.local 에 NOTION_TOKEN 을 넣으면 실제 노션 데이터, 없으면 샘플 데이터로 동작합니다.
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';

const root = new URL('.', import.meta.url).pathname;
if (existsSync(join(root, '.env.local'))) {
  for (const line of readFileSync(join(root, '.env.local'), 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon' };

http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  try {
    if (url.pathname.startsWith('/api/')) {
      const name = url.pathname.replace(/^\/api\//, '').replace(/[^a-z-]/g, '');
      const mod = await import(join(root, 'api', `${name}.js`));
      return mod.default(req, res);
    }
    const safe = normalize(url.pathname).replace(/^(\.\.[/\\])+/, '');
    let file = join(root, safe);
    if (!safe.startsWith('/assets/') && safe !== '/favicon.svg') file = join(root, 'index.html');
    const body = await readFile(file);
    res.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream' });
    res.end(body);
  } catch (e) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not found');
  }
}).listen(process.env.PORT || 3000, () => {
  console.log(`▶ http://localhost:${process.env.PORT || 3000}  (${process.env.NOTION_TOKEN ? '노션 연결' : '샘플 데이터'})`);
});
