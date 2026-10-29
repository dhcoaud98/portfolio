// Notion 공식 API 클라이언트 (외부 패키지 없이 fetch 사용)
import { PROJECT_DATABASES, RULES, PROPS, LINK_LABELS, KPI_RULES, TRACKS } from '../../config/notion.js';
import { SAMPLE_PROJECTS, SAMPLE_BLOCKS } from './sample.js';

const API = 'https://api.notion.com/v1';
const VERSION = '2022-06-28';

const clean = (id) => String(id || '').replace(/-/g, '').toLowerCase();
const DB_BY_ID = new Map(PROJECT_DATABASES.map((d) => [clean(d.id), d]));

export const hasToken = () => Boolean(process.env.NOTION_TOKEN);

/* ---------- 사이트 버전 (HRD / HRM) ---------- */
export function currentTrack() {
  const t = String(process.env.PORTFOLIO_TRACK || TRACKS.default).trim().toUpperCase();
  return TRACKS.available.includes(t) ? t : TRACKS.default;
}
// '노출 포트폴리오'에 현재 버전이 있으면 표시, 비어 있으면 showWhenEmpty
export function inTrack(tracks, track = currentTrack()) {
  if (!tracks || !tracks.length) return TRACKS.showWhenEmpty;
  return tracks.map((x) => String(x).trim().toUpperCase()).includes(track);
}
const pageTracks = (page) => toList(page.properties[TRACKS.prop] ? readValue(page.properties[TRACKS.prop]) : null);

async function notion(path, { method = 'GET', body } = {}) {
  const res = await fetch(API + path, {
    method,
    headers: {
      Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
      'Notion-Version': VERSION,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text();
    const err = new Error(`Notion ${res.status} ${path}: ${text.slice(0, 300)}`);
    err.status = res.status;
    throw err;
  }
  return res.json();
}

async function queryDatabase(dbId) {
  const results = [];
  let cursor;
  do {
    const data = await notion(`/databases/${dbId}/query`, {
      method: 'POST',
      body: { page_size: 100, ...(cursor ? { start_cursor: cursor } : {}) },
    });
    results.push(...data.results);
    cursor = data.has_more ? data.next_cursor : undefined;
  } while (cursor);
  return results;
}

/* ---------- 속성 읽기 ---------- */
const plain = (rt = []) => rt.map((t) => t.plain_text).join('');

function readValue(p) {
  if (!p) return null;
  switch (p.type) {
    case 'title': return plain(p.title);
    case 'rich_text': return plain(p.rich_text);
    case 'select': return p.select?.name ?? null;
    case 'status': return p.status?.name ?? null;
    case 'multi_select': return p.multi_select.map((o) => o.name);
    case 'date': return p.date ? { start: p.date.start, end: p.date.end } : null;
    case 'url': return p.url;
    case 'checkbox': return p.checkbox;
    case 'number': return p.number;
    case 'email': return p.email;
    case 'phone_number': return p.phone_number;
    case 'people': return p.people.map((u) => u.name).filter(Boolean);
    case 'formula': {
      const f = p.formula;
      return f[f.type] ?? null;
    }
    default: return null;
  }
}

function pick(page, names) {
  for (const n of names) if (page.properties[n]) return readValue(page.properties[n]);
  return null;
}

// '21', '약 21명', 21 → 21 (숫자가 없으면 0)
const toCount = (v) => (typeof v === 'number' ? v : Number(String(v ?? '').replace(/[^0-9.]/g, '')) || 0);

// 핵심 숫자 (공개 프로젝트 중 상태가 '예정'인 과정은 제외)
//  - courses: '유형'에 KPI_RULES.courseRoles 가 모두 있는 과정 수
//  - headcount: '인원수' 합계
function stats(projects) {
  const active = projects.filter((p) => p.status !== '예정');
  return {
    courses: active.filter((p) => KPI_RULES.courseRoles.every((r) => p.roles.includes(r))).length,
    headcount: active.reduce((n, p) => n + (p.headcount || 0), 0),
  };
}

// 표지 이미지: 노션 페이지 커버 → 없으면 '배경사진' 등 파일 속성의 첫 이미지
function coverUrl(page) {
  const f = (x) => (x?.type === 'external' ? x.external?.url : x?.file?.url) || null;
  if (page.cover) return f(page.cover);
  for (const n of PROPS.cover || []) {
    const p = page.properties[n];
    if (p?.type === 'files' && p.files.length) return f(p.files[0]);
  }
  return null;
}

const toList = (v) =>
  Array.isArray(v) ? v : typeof v === 'string' && v.trim() ? v.split(/[,·/]/).map((s) => s.trim()).filter(Boolean) : [];

export function isPublic(page) {
  const p = page.properties[RULES.publicProp];
  if (!p) return RULES.showWhenFlagMissing;
  const v = readValue(p);
  if (typeof v === 'boolean') return v;
  if (Array.isArray(v)) return v.some((x) => RULES.publicValues.includes(String(x).trim()));
  return v != null && RULES.publicValues.includes(String(v).trim());
}

const STATUS_KO = {
  done: '완료', completed: '완료', complete: '완료',
  'in progress': '진행 중', doing: '진행 중',
  'not started': '예정', planned: '예정', todo: '예정',
};
const statusKo = (s) => (s ? STATUS_KO[String(s).toLowerCase()] || s : null);

function toProject(page, db, track = currentTrack()) {
  const titleProp = Object.values(page.properties).find((p) => p.type === 'title');
  let title = titleProp ? plain(titleProp.title).trim() : '제목 없음';
  let client = pick(page, PROPS.client);
  const m = title.match(/^\s*\[([^\]]+)\]\s*(.*)$/);
  if (m) {
    if (!client) client = m[1].trim();
    title = m[2].trim() || title;
  }
  title = title.replace(/_/g, ' · ').replace(/\s+/g, ' ').trim();
  const hidden = new Set([...RULES.hiddenProps]);
  const links = Object.entries(page.properties)
    .filter(([name, p]) => p.type === 'url' && p.url && !hidden.has(name))
    .map(([name, p]) => ({ label: LINK_LABELS[name] || name, url: p.url }));

  return {
    id: clean(page.id),
    title,
    client: client || null,
    org: db.org,
    category: db.category,
    period: pick(page, PROPS.period),
    roles: toList(pick(page, PROPS.role)),
    tech: toList(pick(page, PROPS.tech)),
    status: statusKo(pick(page, PROPS.status)),
    place: pick(page, PROPS.place) || null,
    summary: pick(page, PROPS.summary) || '',
    headcount: toCount(pick(page, PROPS.headcount)),
    cover: coverUrl(page),
    hrmSummary: track === 'HRM' ? pick(page, PROPS.hrmSummary) || null : null,
    links,
    updated: page.last_edited_time,
  };
}

// '기술' 속성이 없는 데이터베이스는 '역할'에 섞인 기술 이름을 기술로 분리
const TECH_RE = /^(react|vue|axios|unity|next|typescript|javascript|python|html|css|jquery|wordpress|워드프레스|aws|three|django|redux|vuetify|tailwind|hygraph|figma)/i;
export function splitTech(p) {
  if (p.tech.length) return p;
  const tech = p.roles.filter((r) => TECH_RE.test(r));
  if (!tech.length) return p;
  return { ...p, tech, roles: p.roles.filter((r) => !TECH_RE.test(r)) };
}

const sortKey = (p) => p.period?.start || '';
const byLatest = (a, b) => sortKey(b).localeCompare(sortKey(a));

/* ---------- 목록 ---------- */
export async function listProjects() {
  const track = currentTrack();
  if (!hasToken()) {
    const list = SAMPLE_PROJECTS.filter((p) => p._public && inTrack(p.tracks, track)).map((p) => strip(p, track)).map(splitTech).sort(byLatest);
    return { source: 'sample', track, projects: list, stats: stats(list), errors: [] };
  }
  const settled = await Promise.allSettled(
    PROJECT_DATABASES.map(async (db) => {
      const pages = await queryDatabase(clean(db.id));
      return pages
        .filter((pg) => !pg.archived && !pg.in_trash && isPublic(pg) && inTrack(pageTracks(pg), track))
        .map((pg) => splitTech(toProject(pg, db, track)));
    })
  );
  const projects = [];
  const errors = [];
  settled.forEach((r, i) => {
    if (r.status === 'fulfilled') projects.push(...r.value);
    else {
      console.error('[notion]', PROJECT_DATABASES[i].org, r.reason?.message);
      errors.push(PROJECT_DATABASES[i].org);
    }
  });
  return { source: 'notion', track, projects: projects.sort(byLatest), stats: stats(projects), errors };
}

// 샘플 데이터 내부 표시(_public, tracks) 제거, HRD 사이트에는 HRM 요약을 보내지 않음
const strip = ({ _public, tracks, hrmSummary, ...p }, track = currentTrack()) =>
  ({ ...p, hrmSummary: track === 'HRM' ? hrmSummary || null : null });

/* ---------- 상세 ---------- */
export async function getProject(rawId) {
  const id = clean(rawId);
  if (!/^[0-9a-f]{32}$/.test(id)) return null;

  const track = currentTrack();
  if (!hasToken()) {
    const p = SAMPLE_PROJECTS.find((x) => x.id === id && x._public && inTrack(x.tracks, track));
    return p ? { source: 'sample', track, project: splitTech(strip(p, track)), blocks: SAMPLE_BLOCKS[id] || SAMPLE_BLOCKS._default } : null;
  }

  let page;
  try {
    page = await notion(`/pages/${id}`);
  } catch (e) {
    if (e.status === 404 || e.status === 400) return null;
    throw e;
  }
  // 설정된 프로젝트 데이터베이스에 속한, 공개 페이지이면서 이 사이트 버전에 노출된 것만 허용
  const db = DB_BY_ID.get(clean(page.parent?.database_id));
  if (!db || page.archived || page.in_trash || !isPublic(page) || !inTrack(pageTracks(page), track)) return null;

  const project = splitTech(toProject(page, db, track));
  const blocks = dropTitleHeading(await getBlocks(id, 0), project);
  return { source: 'notion', track, project, blocks };
}

// 본문 첫 제목이 프로젝트 제목을 반복하면 생략
export function dropTitleHeading(blocks, p) {
  const b = blocks[0];
  if (!b || !/^heading_/.test(b.type)) return blocks;
  const norm = (s) => String(s || '').replace(/[\[\]()（）\s_·]/g, '').toLowerCase();
  const h = norm((b.text || []).map((t) => t.t).join(''));
  const t = norm(p.title), c = norm(p.client);
  return h && (h.includes(t) || t.includes(h) || (c && h.startsWith(c))) ? blocks.slice(1) : blocks;
}

/* ---------- 본문 블록 ---------- */
const MAX_DEPTH = 3;
const SKIP = new Set(['child_page', 'child_database', 'unsupported', 'breadcrumb', 'table_of_contents']);
const FILE_TYPES = new Set(['file', 'pdf', 'audio']);

async function getBlocks(blockId, depth) {
  const raw = [];
  let cursor;
  do {
    const data = await notion(`/blocks/${blockId}/children?page_size=100${cursor ? `&start_cursor=${cursor}` : ''}`);
    raw.push(...data.results);
    cursor = data.has_more ? data.next_cursor : undefined;
  } while (cursor);

  const out = await Promise.all(
    raw.map(async (b) => {
      if (SKIP.has(b.type)) return null;
      if (RULES.hideFileBlocks && FILE_TYPES.has(b.type)) return null;
      const s = simplify(b);
      if (!s) return null;
      if (b.has_children && depth < MAX_DEPTH) s.children = await getBlocks(b.id, depth + 1);
      return s;
    })
  );
  return out.filter(Boolean);
}

const EMOJI_LEAD = /^[\s\p{Extended_Pictographic}\u{FE0F}\u{200D}\u{20E3}\u{1F3FB}-\u{1F3FF}]+/u;

function rich(rt = []) {
  return rt.map((x) => ({
    t: x.plain_text,
    b: x.annotations?.bold || undefined,
    i: x.annotations?.italic || undefined,
    c: x.annotations?.code || undefined,
    s: x.annotations?.strikethrough || undefined,
    u: x.annotations?.underline || undefined,
    href: x.href && /^https?:\/\//.test(x.href) ? x.href : undefined,
  }));
}

function fileUrl(d) {
  if (!d) return null;
  return d.type === 'external' ? d.external?.url : d.file?.url;
}

function simplify(b) {
  const t = b.type;
  const d = b[t] || {};
  switch (t) {
    case 'paragraph':
    case 'bulleted_list_item':
    case 'numbered_list_item':
    case 'toggle':
    case 'quote':
    case 'callout':
      return { type: t, text: rich(d.rich_text) };
    case 'heading_1':
    case 'heading_2':
    case 'heading_3': {
      const text = rich(d.rich_text);
      if (text[0]) text[0].t = text[0].t.replace(EMOJI_LEAD, '');
      return { type: t, text, toggle: d.is_toggleable || undefined };
    }
    case 'to_do':
      return { type: t, text: rich(d.rich_text), checked: d.checked };
    case 'code':
      return { type: t, code: plain(d.rich_text), lang: d.language };
    case 'image':
      return { type: t, url: fileUrl(d), caption: plain(d.caption) };
    case 'video':
    case 'bookmark':
    case 'embed':
    case 'link_preview':
      return { type: 'link', url: d.url || fileUrl(d), caption: plain(d.caption || []) };
    case 'divider':
      return { type: t };
    case 'equation':
      return { type: 'paragraph', text: [{ t: d.expression, c: true }] };
    case 'table':
      return { type: t, header: d.has_column_header };
    case 'table_row':
      return { type: t, cells: d.cells.map(rich) };
    case 'column_list':
    case 'column':
    case 'synced_block':
      return { type: t };
    default:
      return null;
  }
}
