# 오채명 웹앱 포트폴리오

노션의 프로젝트 데이터베이스와 연결된 포트폴리오 웹앱입니다. 디자인 가이드 v1.0(A · 네이비)을 따릅니다.
외부 패키지가 없어서 설치나 빌드 과정 없이 Vercel에 바로 올릴 수 있습니다.

## 어떻게 동작하나요

```
노션 프로젝트 DB ──(Notion API)──▶ /api/projects, /api/project  ──▶ 웹앱 화면
   '공개여부 = 공개'만 통과            Vercel 서버 함수, 2분 캐시
```

- 프로젝트는 노션에서 실시간으로 불러옵니다. 노션을 고치면 **최대 약 2분 안에** 웹앱에 반영됩니다.
- `공개여부`가 `공개`인 프로젝트만 보입니다. `비공개`로 바꾸면 목록과 상세 주소 모두에서 사라집니다.
- 노션 페이지의 `파일` 속성(교안 등)과 본문 속 첨부 파일·PDF는 **노출하지 않습니다.**
- 소개 · 경력 · 스킬 · 연락처는 `assets/content.js`에서 직접 고칩니다.

## 폴더 구조

```
index.html            화면 틀
assets/style.css      디자인 가이드 토큰과 스타일
assets/app.js         화면 렌더링 · 라우팅
assets/content.js     ✏️ 소개 · 경력 · 스킬 · 연락처 (직접 수정)
config/notion.js      ✏️ 연결할 노션 DB 목록 · 공개 규칙 · 속성 이름
api/projects.js       공개 프로젝트 목록 API
api/project.js        프로젝트 상세 API
api/_lib/             노션 API 클라이언트 · 샘플 데이터
vercel.json           주소 설정 (/projects/... 등)
dev-server.mjs        로컬 미리보기 서버
```

## 1. 노션 준비 (5분)

1. https://www.notion.so/profile/integrations 에서 **새 통합(Internal integration)** 을 만듭니다.
   - 이름: `portfolio` · 권한: **콘텐츠 읽기**만 체크
   - 만들어진 **내부 통합 시크릿**(`ntn_…`)을 복사해 둡니다.
2. 노션 포트폴리오 메인 페이지(오채명) 오른쪽 위 `•••` → **연결(Connections)** → 방금 만든 `portfolio` 추가.
   하위 데이터베이스와 페이지에 자동으로 권한이 이어집니다.
3. 각 프로젝트 데이터베이스에 `공개여부` 속성을 확인합니다.
   - 유형: **선택(Select)**, 값: `공개` / `비공개` (체크박스도 지원: 체크 = 공개)
   - `공개여부` 속성이 **없는** 데이터베이스는 전체가 보입니다. 숨기고 싶은 DB에는 속성을 추가하세요.
     (모두 숨기려면 `config/notion.js`의 `showWhenFlagMissing`을 `false`로)
4. `config/notion.js`의 데이터베이스 ID가 맞는지 확인합니다.
   - 노션에서 데이터베이스 제목 옆 `•••` → **보기 링크 복사** → 주소의 `?v=` 앞 32자리가 ID입니다.
   - 지금 들어 있는 ID는 메인 페이지 링크에서 가져온 값입니다. 하나가 틀려도 나머지는 정상 표시되고, 틀린 DB는 Vercel 로그에 표시됩니다.

### 노션 속성 → 화면 매핑

| 노션 속성 | 화면 위치 |
|---|---|
| 제목 `[고객사] 과정명` | 대괄호 안 = 기업명(맨 앞), 나머지 = 프로젝트 이름 |
| `고객사` / `기업명` (있으면 우선) | 기업명 |
| `역할` | 역할 배지 |
| `기술` | 기술 배지 |
| `프로젝트 기간` | 기간, 정렬 기준(최신 순) |
| `프로젝트 현황` | 상태 (Done → 완료, In progress → 진행 중, Not started → 예정) |
| `장소`, `프로젝트 소개` | 상세 정보 바, 요약 문장 |
| URL 유형 속성 (Github, Figma 등) | 상세 페이지 링크 버튼 |
| 페이지 본문 | 상세 페이지 본문 (제목의 이모지는 자동 제거) |

속성 이름을 바꾸면 `config/notion.js`의 `PROPS`만 고치면 됩니다.

## 2. 로컬에서 미리보기

```bash
node dev-server.mjs          # http://localhost:3000 (샘플 데이터)
```

실제 노션 데이터로 보려면 `.env.local` 파일을 만들고 `NOTION_TOKEN=ntn_…`을 넣은 뒤 다시 실행합니다.

## 3. Vercel 배포

1. 이 폴더를 GitHub 저장소에 올립니다. (`.env.local`은 올라가지 않습니다)
2. https://vercel.com/new 에서 저장소를 **Import** → Framework Preset: **Other** → 빌드 설정은 비워둡니다.
3. **Environment Variables**에 `NOTION_TOKEN` = 복사한 시크릿 입력 → **Deploy**.
4. 배포 주소(`…vercel.app`)로 들어가 프로젝트가 보이는지 확인합니다.
   "샘플 데이터로 표시 중" 안내가 보이면 토큰이 설정되지 않은 것입니다.

## 수정할 곳 요약

- 전화번호: `assets/content.js` → `contact.phone` (비워두면 숨김)
- 소개 문장 · 핵심 숫자 · 경력 · 스킬: `assets/content.js`
- 반영 대기 시간: `config/notion.js` → `cacheSeconds` (기본 120초)
- 색 · 글씨: `assets/style.css` 맨 위 `:root` 토큰 (디자인 가이드와 동일)
