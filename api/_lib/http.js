import { RULES } from '../../config/notion.js';

// Vercel·로컬 서버 모두에서 동작하도록 Node 기본 응답 객체만 사용
export function send(res, status, data, cache = false) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader(
    'Cache-Control',
    cache ? `public, max-age=0, s-maxage=${RULES.cacheSeconds}, stale-while-revalidate=600` : 'no-store'
  );
  res.end(JSON.stringify(data));
}
