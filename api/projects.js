// GET /api/projects — 공개 프로젝트 목록
import { listProjects } from './_lib/notion.js';
import { send } from './_lib/http.js';

export default async function handler(req, res) {
  try {
    const data = await listProjects();
    send(res, 200, data, true);
  } catch (e) {
    console.error('[api/projects]', e);
    send(res, 500, { error: '프로젝트를 불러오지 못했습니다.' });
  }
}
