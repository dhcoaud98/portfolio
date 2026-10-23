// GET /api/site — 이 배포가 어떤 버전(HRD / HRM)인지 알려줍니다. 화면은 이 값으로 소개 문구를 고릅니다.
import { currentTrack } from './_lib/notion.js';
import { send } from './_lib/http.js';

export default function handler(req, res) {
  send(res, 200, { track: currentTrack() }, true);
}
