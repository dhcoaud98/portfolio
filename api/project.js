// GET /api/project?id=<노션 페이지 ID> — 공개 프로젝트 상세 + 본문
import { getProject } from './_lib/notion.js';
import { send } from './_lib/http.js';

export default async function handler(req, res) {
  try {
    const id = new URL(req.url, 'http://localhost').searchParams.get('id');
    const data = await getProject(id);
    if (!data) return send(res, 404, { error: '공개된 프로젝트가 아니거나 존재하지 않습니다.' });
    send(res, 200, data, true);
  } catch (e) {
    console.error('[api/project]', e);
    send(res, 500, { error: '프로젝트를 불러오지 못했습니다.' });
  }
}
