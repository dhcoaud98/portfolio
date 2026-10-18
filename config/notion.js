// =============================================================
// 노션 연결 설정 — 비밀값(토큰)은 여기 넣지 말고 Vercel 환경변수 NOTION_TOKEN 에 넣습니다.
// =============================================================

// 프로젝트 데이터베이스 목록 (노션 메인 페이지의 회사별 인라인 데이터베이스)
// id: 데이터베이스 링크의 32자리 ID (…notion.com/p/<여기>?v=…)
// org: 소속(회사/기관), category: 프로젝트 분류(필터에 사용)
export const PROJECT_DATABASES = [
  { id: '3d524b71477f80a387c1c00e17a9f5c0', org: '코멘토 · 포텐스닷', category: 'AX 기업교육' },
  { id: '440b8b4254774f008bef203fbfb964d6', org: '유비크코리아', category: '웹 퍼블리싱' },
  { id: 'b8fae01dd8f540449ec40dc56aeee223', org: '하우투약', category: '개발' },
  { id: '55f70a4e79fa4ef8bb131c56cdef5ea5', org: '유리프트', category: '교육 콘텐츠' },
  { id: 'aaf14436a8e14b9ea9d8be87e7e5a23f', org: 'SSAFY', category: '개발' },
  { id: '3f824b71477f80ddb51ed8626ae696aa', org: '개인 프로젝트', category: '개인 프로젝트' },
];

export const RULES = {
  // 공개 여부 속성 이름과, '공개'로 인정할 값
  publicProp: '공개여부',
  publicValues: ['공개'],
  // 데이터베이스에 '공개여부' 속성 자체가 없을 때 보여줄지 여부
  // (코멘토 외 데이터베이스에도 '공개여부'를 추가하면 그 값이 우선합니다)
  showWhenFlagMissing: true,
  // 웹앱에 절대 노출하지 않을 속성 (고객사 교안 등 내부 자료 보호)
  hiddenProps: ['파일', '배경사진', '공개여부'],
  // 본문 안의 첨부 파일·PDF 블록 숨김 (교안 등 내부 자료 보호)
  hideFileBlocks: true,
  // 노션 수정 → 웹앱 반영까지 최대 대기 시간(초)
  cacheSeconds: 120,
};

// 핵심 숫자 '참여 기업 AX 교육 과정' 계산 기준: '유형'에 아래 값이 모두 들어 있는 공개 프로젝트
export const KPI_RULES = { courseRoles: ['실습코치', 'B2B'] };

// URL 속성의 버튼 이름 바꾸기
export const LINK_LABELS = { URL: '관련 링크' };

// 속성 이름 매핑 — 노션 속성 이름을 바꾸면 여기만 고치면 됩니다 (앞에 있는 이름 우선)
export const PROPS = {
  period: ['프로젝트 기간', '기간'],
  role: ['유형', '역할'],
  tech: ['기술', '기술 스택'],
  status: ['프로젝트 현황', '현황', '상태'],
  place: ['장소'],
  summary: ['프로젝트 소개', '소개'],
  client: ['고객사', '기업명', '클라이언트'],
  headcount: ['인원수', '인원', '학습자 수'],
};
