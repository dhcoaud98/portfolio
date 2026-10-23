// NOTION_TOKEN 이 없을 때(로컬 미리보기 등) 쓰는 스냅샷 데이터 — 2026.10.09 노션 기준.
// 실제 배포에서는 노션 API 데이터가 이 내용을 대체합니다.
// tracks: 노션 '노출 포트폴리오' (없으면 HRD·HRM 양쪽), hrmSummary: 노션 'HRM 요약'

const P = (o) => ({ links: [], place: null, client: null, summary: '', updated: '2026-10-09T00:00:00.000Z', ...o });

export const SAMPLE_PROJECTS = [
  // ---- 코멘토 · 포텐스닷 (공개여부 속성 있음)
  P({ id: '3e324b71477f8049b19acd40042bda31', _public: true, title: '로컬 AI 메이커스랩 2차수', org: '코멘토 · 포텐스닷', category: 'AX 기업교육',
      period: { start: '2026-10-06', end: '2026-10-07' }, roles: ['실습코치', '운영', 'B2G'],
      tech: ['앱스스크립트', '프롬프트엔지니어링', '구글워크스페이스', 'Google AI Studio', 'vscode', 'python'],
      status: '진행 중', place: '수토피아', summary: '비개발자도 쉽게 할 수 있는 생성형 AI 사전교육 (14시간) 운영 매니저',
      hrmSummary: '33명 대상 2일·14시간 과정 운영 매니저. 수강생 명단·출석 체크 준비, 강사 컨택, 교육장 세팅부터 현장 정리까지 운영 전 과정 담당.' }),
  P({ id: '3e924b71477f80c38c98c04e28cc231f', _public: true, client: '대상(주)', title: 'AI 실무 활용과정 · 추가2차수 · 업무자동화 Track', org: '코멘토 · 포텐스닷', category: 'AX 기업교육',
      period: { start: '2026-10-01', end: '2026-10-02' }, roles: ['실습코치'], tech: [], status: '완료', summary: 'AI 실무 활용과정 실습 코치' }),
  P({ id: '3ea24b71477f8041b51cf1822e63af13', _public: true, client: '한국피앤지', title: '마케팅 직무 면접 운영', org: '코멘토 · 포텐스닷', category: 'AX 기업교육',
      period: { start: '2026-09-30', end: null }, roles: ['면접', 'HR'], tech: ['google meet'], status: '완료',
      summary: '한국피앤지 마케팅 직무 온라인 면접 지원 업무',
      hrmSummary: '온라인 면접 3타임·지원자 10명 진행 지원. 구글밋 면접장 오픈, 시작·마무리 안내, 면접 평가표 작성, 보안유지 서약서 작성까지 채용 면접 운영 실무 수행.',
      links: [{ label: '관련 링크', url: 'https://comento.kr/career/dreamverse/internz-mirae_startup-44' }] }),
  P({ id: '3eb24b71477f807392b3fe18587aca53', _public: false, title: '엑셀 자동화 업무', org: '코멘토 · 포텐스닷', category: 'AX 기업교육',
      period: { start: '2026-09-29', end: null }, roles: ['업무자동화'], tech: [], status: '예정' }),
  P({ id: '3e224b71477f800f9b41dd8762e00bea', _public: true, client: 'GS리테일', title: '하반기 팀장과정', org: '코멘토 · 포텐스닷', category: 'AX 기업교육',
      period: { start: '2026-09-22', end: null }, roles: ['실습코치'], tech: ['구글워크스페이스', '프롬프트엔지니어링'],
      status: '완료', summary: 'GS리테일 하반기 팀장과정 실습 코치' }),
  P({ id: '3dc24b71477f800cb9f0e7325238ce4d', _public: true, client: '파리크라상', title: 'AI STARTER 2기', org: '코멘토 · 포텐스닷', category: 'AX 기업교육',
      period: { start: '2026-09-21', end: null }, roles: ['실습코치'], tech: ['Claude Code', '구글워크스페이스', '앱스스크립트', '프롬프트엔지니어링'],
      status: '완료', place: 'SPC 인재 교육원', summary: 'AI 기업 교육의 실습 코치' }),
  P({ id: 'd2224b71477f82cfa94881a60fa72b83', _public: true, title: '코멘토 교육매니저 기업교육팀', org: '코멘토 · 포텐스닷', category: 'AX 기업교육',
      period: { start: '2026-09-17', end: '2026-12-16' }, roles: ['인턴', 'AI와 친숙한 HRD 전문가'],
      tech: ['Claude Code', '구글워크스페이스', '앱스스크립트', '프롬프트엔지니어링', 'GEMINI', 'Selenium'],
      status: '진행 중', summary: '“당신이 설계한 교육 리드가 누군가의 커리어를 바꿉니다”' }),
  P({ id: '3f224b71477f8065a725da2f146e8791', _public: false, client: '애경산업', title: 'AI리터러시 2일 과정', org: '코멘토 · 포텐스닷', category: 'AX 기업교육',
      period: { start: '2026-10-12', end: '2026-10-13' }, roles: ['실습코치'], tech: [], status: '예정' }),
  P({ id: '3f324b71477f806badcbf74a7357ed50', _public: false, client: '삼성카드', title: 'AX과제 도출', org: '코멘토 · 포텐스닷', category: 'AX 기업교육',
      period: null, roles: [], tech: [], status: '예정' }),

  // ---- 그 외 데이터베이스 (공개여부 속성 없음 → 표시)
  P({ id: 'd7624b71477f82dbb54901b09fd48775', _public: true, tracks: ['HRD'], title: '부성테크', org: '유비크코리아', category: '웹 퍼블리싱',
      period: { start: '2023-08-27', end: '2023-12-27' }, roles: ['웹퍼블리셔'], tech: [], status: '완료', summary: '부성테크 홈페이지 추가 제작' }),
  P({ id: 'a7f24b71477f83b59566011526bc879a', _public: true, tracks: ['HRD'], title: '(과제) 하우투약', org: '하우투약', category: '개발',
      period: { start: '2023-08-21', end: '2023-08-27' }, roles: ['개발팀'], tech: [], status: '완료', summary: '하우투약 홈페이지 nextjs13으로 전환' }),
  P({ id: 'c6424b71477f831b856101bfb6a8d463', _public: true, title: '코딩밸리', org: '유리프트', category: '교육 콘텐츠',
      period: { start: '2023-02-01', end: null }, roles: ['컨텐츠 제작'], tech: [], status: '진행 중', summary: '이제 코딩도 모바일로 학습해요!' }),
  P({ id: '66724b71477f8367845c017345a9e33d', _public: true, tracks: ['HRD'], title: '나.작.귀(나의 작고 귀여운 화이트 크리스마스)', org: 'SSAFY', category: '개발',
      period: { start: '2022-10-11', end: '2022-11-18' }, roles: ['Frontend', '와이어프레임', 'React', '로그인', 'axios', 'Unity', 'PPT', 'Notion관리'], tech: [],
      status: '완료', summary: '스노우 볼을 만들어 친구에게 선물하세요!',
      links: [{ label: 'Figma', url: 'https://www.figma.com/file/gXm7jYNyc1DVKgzznc8p3s/A601?node-id=0%3A1' }, { label: 'Github', url: 'https://github.com/dhcoaud98/Doyouwannabuildasnowball' }] }),
  P({ id: '7eb24b71477f837995c5817a6277c37b', _public: true, title: 'GIRINEE', org: 'SSAFY', category: '개발',
      period: { start: '2022-08-22', end: '2022-10-07' }, roles: ['Frontend', '와이어프레임', '로그인', 'React', 'axios', 'PPT', 'UCC', 'Jira관리', 'Notion관리', 'Myrecord기능', '화면 Swiper', '데이터셋제작'], tech: [],
      status: '완료', summary: '기타 초보를 위한 기타연습 사이트 입니다.',
      links: [{ label: 'Figma', url: 'https://www.figma.com/file/Pcgh0OiAFDwuTpME69k7j4/Untitled?node-id=0%3A1' }, { label: 'Github', url: 'https://github.com/dhcoaud98/GIRINEE' }] }),
  P({ id: '99c24b71477f83918d29819057b6dda8', _public: true, tracks: ['HRD'], title: 'PROSN', org: 'SSAFY', category: '개발',
      period: { start: '2022-08-19', end: '2022-11-29' }, roles: ['Frontend', '와이어프레임', 'vue', '회원가입 및 로그인', 'axios', 'PPT', 'UCC', '프로필 개발', '스터디 기능 개발', '검색기능', '사이드바 개발'], tech: [],
      status: '완료', summary: 'IT 학습을 위한 웹 사이트 입니다.',
      links: [{ label: 'Github', url: 'https://github.com/dhcoaud98/PROSN' }] }),
];

/* ---------- 본문: 노션에서 읽어 온 내용을 간단한 텍스트 형식으로 보관 ----------
   줄 형식:  [들여쓰기 2칸 × 깊이]타입|내용   (**굵게** 지원)
   타입: H2 H3 P UL OL Q(인용) CO(콜아웃) HR(구분선)                                  */
const ROLE4 = `H3|MY ROLE
P|**01. 교육 운영**
P|교육 환경 및 진행 상황 점검, 강의 모니터링
P|**02. 실습 코칭**
P|학습자 질문 응대 및 실습 지원
P|**03. 이슈 대응**
P|실습 오류 및 학습 과정의 문제 해결
  UL|문제 발생
  UL|대응
  UL|학습자 실습 개선
P|**04. 강사 지원**
P|학습자 상황 및 주요 질문 공유`;

const BODIES = {
  '3e324b71477f8049b19acd40042bda31': `P|AI | 교육 현장 운영
H3|교육 개요
P|비개발자도 이해할 수 있는 언어로 생성형 AI의 핵심 개념과 현업 중심의 활용 방법을 학습
P|사전 교육으로써 이후 일경험 과정에서 기업의 문제를 해결하기 위한 DEMO 수준의 프로토타입을 제작할 수 있는 기초 역량을 갖추도록 지원
P|**교육 대상 및 장소**
P|선발 된 대학생, 최대 30명 / 부산 수스페이스 교육
P|**교육 기간**
P|10월 6일 - 10월 7일 (총 2일, 14시간)
P|**교육 목표**
OL|생성형 AI의 핵심 개념을 이해하고, 아이디어를 도출할 수 있게 된다.
OL|프롬프트 엔지니어링을 통해 문제해결을 위한 AI 활용법을 경험하고, 프로토타입을 직접 구현할 수 있다.
OL|GAS를 통해 팀별로 생성형 AI 솔루션 프로토 타입을 설계하고 제작할 수 있다.
P|**교육 내용**
P|Google Apps Script(GAS)를 활용해 간단한 챗봇, 자동화 솔루션 등 AI 기반 아이디어를 직접 기획, 구현하며, 팀 협업을 통해 웹페이지를 배포한다.
H3|MY ROLE
P|**01. 교육 운영**
P|교육 환경 및 진행 상황 점검, 강의실 세팅
  UL|마이크, 인터넷 연결 확인
  UL|교육장 컨디션 확인
  UL|다과 준비
  UL|수강생 리스트, 출석체크 준비
  UL|강사 컨택
P|**02. 실습 코칭**
P|학습자 질문 응대 및 실습 지원
P|**03. 이슈 대응**
P|실습 오류 및 학습 과정의 문제 해결
  UL|문제 발생
  UL|학습자 실습 개선
  UL|기술 문제 대응
P|**04. 강사 지원**
P|학습자 상황 및 주요 질문 공유
P|**05. 현장 관리**
P|뒷정리, 교육 안내 사항 전달
H3|HRD INSIGHT
Q|**“교육 운영자는 교육을 직접 가르치는 사람이 아니라, 학습자가 교육에 온전히 몰입할 수 있도록 환경과 과정을 설계하고 관리하는 역할이다.”**
P|교육 운영은 단순한 행정 지원을 넘어 **교육 환경, 학습자, 강사를 유기적으로 연결하여 학습이 원활하게 이루어지도록 관리하는 과정**임을 경험했습니다.
P|교육 전에는 강의실 환경과 출석, 장비 등을 점검하고, 교육 중에는 학습자의 질문과 실습 오류에 대응하며 **학습 과정에서 발생하는 문제를 빠르게 파악하고 해결**했습니다. 또한 학습자의 주요 질문과 어려움을 강사에게 공유하여 강의가 학습자의 수준과 상황에 맞게 진행될 수 있도록 지원했습니다.
P|이를 통해 교육 운영에서 중요한 것은 **사전 준비 → 실시간 모니터링 → 이슈 대응 → 강사,학습자 간 소통**이 유기적으로 연결되는 것임을 배웠습니다.`,

  '3e924b71477f80c38c98c04e28cc231f': `P|기업교육 | AI | 교육운영 | 실습코칭
H3|교육 개요
P|매일 반복되는 데이터 취합, 파일 처리, 문서 작업을 AI와 VBA를 결합하여 자동화하며, 나만의 업무 도구를 만드는 실무 역량을 키우는 과정입니다.
P|**교육 대상**
P|대상(주)의 임직원
P|**교육 기간**
P|26.10.01(목) ~ 26.10.02(금) 09:00 ~ 17:00
P|**교육 내용**
OL|AI/AX 실무 교육
OL|엑셀 VBA 활용
OL|SAP활용 (VBS → VBA)
OL|핸즈온 (나만의 업무자동화 서비스 만들기)
${ROLE4}
H3|HRD INSIGHT
P|이번 교육을 통해 AI와 VBA를 결합한 업무 자동화가 단순한 업무 효율화를 넘어, 구성원이 반복 업무에서 벗어나 핵심 업무에 집중할 수 있도록 돕는 HRD의 역할임을 확인했다. 특히 실습 중심의 교육을 통해 학습자가 자신의 실제 업무에 AI를 적용하고, 직접 업무 도구를 만들어보는 과정에서 현업 적용력과 디지털 역량을 함께 높일 수 있다는 점이 인상적이었다.`,

  '3ea24b71477f8041b51cf1822e63af13': `P|면접관, 면접진행자, 지원자가 함께 있는 구글밋 공간에서 온라인으로 면접을 진행합니다.
P|한국피앤지 회사의 디지털 광고 소재 제작/디자인 면접으로 총 10분의 지원자들을 3타임에 걸쳐 확인하게 됩니다.
P|**일정**
P|9/30(수)
  UL|12:00~13:00
  UL|14:00~15:00
  UL|15:00~16:00`,

  '3e224b71477f800f9b41dd8762e00bea': `P|기업교육 | AI | 교육운영 | 실습코칭
H3|교육 개요
P|기업 구성원의 AI 업무 활용 역량 향상을 위한 실습 중심 교육
  P|→ 프롬프트 엔지니어링
P|**교육 대상**
P|GS리테일 팀장, 40명
P|**교육 기간**
P|2026.09.22, 13:30 ~ 17:00
P|**교육 내용**
OL|실습 안내
OL|생성형 AI와 대화하기 (구글 제미나이 프롬프트 작성해보기)
OL|업무자동화 경험하기
OL|구글워크스페이스 활용하기/기본도구
OL|구글 워크스페이스 활용하기/데이터가공~리포트구성
OL|Apps Script와 첫 인사
${ROLE4}
H3|HRD INSIGHT
Q|**“AI 기업교육에서는 콘텐츠 자체뿐만 아니라 학습자가 실제 업무에 적용할 수 있도록 실습 과정에서 지속적으로 지원하는 것이 중요하다는 것을 경험했다.”**
P|AI가 익숙하지 않은 사람의 경우 AI에 대한 필요성을 느끼지 못하는 경우가 많음. 때문에 이를 먼저 교육하여 필요성을 먼저 느끼게 하고, 교육을 진행해야 한다는 것을 느낌.
P|교육생의 수준 차이가 있기 때문에 교육을 진행 할 때 구분하여 진행하는 것이 중요.
  P|→ 그게 아니라면 실습코치 혹은 누군가의 도움이 중요.
H3|강의 예시
P|**구글워크스페이스 활용하기/ 데이터가공~리포트구성 + 경영진 보고용 리포트 만들기**
P|AI 프롬프트 예시
CO|방금 합친 표를 바탕으로 점포별 한 줄 요약 리포트를 만들어줘. 폐업 예정인 점포는 눈에 띄게 표시해줘. 이 리포트를 팀장이 경영진에게 바로 보낼 수 있는 보고 메일 형식(제목·인사말·본문·맺음말)으로 다시 만들어줘.
P|결과
P|점포별 주간 실적 한 줄 요약, 폐업 예정 점포 강조, 향후 계획까지 포함된 경영진 보고 메일 초안이 생성되었습니다.`,

  '3dc24b71477f800cb9f0e7325238ce4d': `P|기업교육 | AI | 교육운영 | 실습코칭
H3|교육 개요
P|기업 구성원의 AI 업무 활용 역량 향상을 위한 실습 중심 교육
P|**교육 대상**
UL|교육생 : 약 21명 (5인 1팀, 총4팀)
UL|업무용 노트북으로 진행
UL|AI는 유료 Claude 사용
P|**교육 기간**
P|2026.09.21, 09:00 ~ 18:00
P|**교육 내용**
P|**PART 1. 생성형AI와 대화하는 원리**
  P|판단기준을 함께 줘서 누가 실행해도 같은 항목으로 답을 받을 수 있다.
P|**PART 2. 엑셀 업무 자동화**
  P|VBA 기본 세팅, 데이터 취합, 데이터 전처리, HTML 대시보드 제작, PPT 업데이트
P|**PART 3. Python으로 수집을 자동화하고 도구로 배포하기**
  P|파이썬, VS Code, GUI 도구, HTML, EXE
P|**PART 4. 흩어진 데이터를 한 곳에. DB와 웹앱**
  P|앱스스크립트, 구글 RSS 기반 웹앱
P|**PART 5. Claude Code로 팀 과제 모듈 만들기**
  P|핸즈온 세션으로
${ROLE4}
H3|HRD INSIGHT
P|일반 실무자들이 프로그래밍과 AI를 이해하고 업무에 활용하는 것이 기업의 업무 효율 기여에 긍정적인 효과를 가져옴을 이해.
P|실습과 이론을 이해하고, 적용해 본 실무자들이 업무에 사용할 수 있음을 기대하고 있고, 적극적으로 배움에 임하고 있었음.
P|기업에서는 임직원을 대상으로 이러한 교육을 다양하게 진행하는 것 HRD의 관점으로 필요함.
H3|강의 예시
P|AI 프롬프트 예시
  OL|현재 열려있는 엑셀파일에서 실행할 거야. VBA 코드를 작성해줘.
  OL|E열의 '출고일자' 열과 F열의 '도착일자'열의 날자형식을 "YYYY-MM-DD"형식으로 통일해줘.
  OL|L열의 '청구금액', M열의 '부가세', N열의 '합계금액' 열의 모든 값은 빈칸·기호를 제거하고 천 단위 콤마, 오른쪽 정렬로 통일 시켜줘.
P|**코드 적용 및 실행 방법**
OL|엑셀 파일에서 Alt + F11 키를 눌러 **VBA 편집기**를 엽니다.
OL|상단 메뉴에서 삽입 → 모듈을 클릭합니다.
OL|나타나는 모듈 창에 위 **VBA 코드를 복사해서 붙여넣기**합니다.
OL|Alt + Q 키를 눌러 VBA 편집기를 닫고 엑셀로 돌아옵니다.
OL|Alt + F8 키를 눌러 매크로 창을 연 후, FormatShippingData를 선택하고 **[실행]** 버튼을 누릅니다.`,

  'd2224b71477f82cfa94881a60fa72b83': `H3|기업 소개
P|**"Workforce AX Partner” 코멘토 | 포텐스닷**
P|코멘토는 커리어의 시작을 준비하는 사람들이나 이제 막 커리어를 시작한 사람들의 커리어 시작과 성장을 도와주는 플랫폼 서비스입니다.
P|포텐스닷은 기업이 생성형AI를 활용하여 Workforce를 혁신하도록 지원하는 교육-컨설팅-솔루션 제공 서비스입니다.
H3|직무 역할
Q|"막연하게만 느껴졌던 AI 실무가 현장에서 구동되는 순간을 보며, 저 또한 교육 전문가로 성장할 확신을 얻었습니다."
P|코멘토(Potens.AI) 실습코치 인턴은 단순히 현장을 '운영'하거나 '보조'하는 사람이 아닙니다. 학습자의 변화를 설계하고, 그 변화의 마침표를 최전선에서 직접 매듭짓는 사람입니다.
H3|업무 내용
P|**1. AI 학습 촉진 (AI Facilitating)**
UL|주 강사의 강의와 실습 사이의 가교 역할을 수행합니다.
UL|생성형 AI 툴 활용 중 겪는 병목 지점을 해결하고 최적의 프롬프트 가이드를 제공합니다.
P|**2. 교육 품질 수호 (Quality Operation)**
UL|교육 전 환경 세팅부터 실시간 모니터링까지, 완벽한 몰입 환경을 구축합니다.
UL|운영 이슈를 단순 사고가 아닌 '학습 구조 개선의 기회'로 재정의하여 EM과 협업합니다.
P|**3. 현장 데이터 분석 (Data Insight)**
UL|현장에서 발생하는 학습자의 피드백과 반응을 데이터화합니다.
UL|교육 전-중-후 피드백 루프를 통해 차수별 교육 고도화에 기여합니다.
P|**근무 기간**
P|3개월(9월 17일 ~ 12월 16일), 월~금 9시 - 18시`,

  'd7624b71477f82dbb54901b09fd48775': `H3|서비스 소개
P|부성테크 홈페이지 ESG 탭(지배구조 · 사회 · 환경) 추가
P|워드프레스를 활용하여 홈페이지 추가 제작
H3|기술 스택
P|워드프레스, HTML, CSS, jQuery
H3|결과
UL|ESG - 지배구조 (웹 · 반응형)
UL|ESG - 사회 (웹 · 반응형)
UL|ESG - 환경 (웹 · 반응형)
H3|회고
P|웹 퍼블리셔로서 워드프레스를 처음 사용하였던 홈페이지로 적응하는데 초점을 두고, 짧은 시간에 제작하였다. 워드프레스의 블록 기능과 HTML CSS를 활용하여 홈페이지를 제작할 수 있었다.`,

  'a7f24b71477f83b59566011526bc879a': `H3|서비스 소개
P|하우투약 기업 홈페이지 (www.dangyoung.kr)
UL|하우투약 홈페이지 nextjs13으로 전환
UL|AWS EC2를 통해 배포
H3|기술 스택
P|nextjs13, typescript, javascript, Tailwind css / AWS EC2, AWS Route 53, Nginx
H3|회고
P|AWS를 통한 배포는 처음 시도하는 부분이어서 구글링과 AWS 문서를 공부하며 해결했다. instance 용량 문제는 t2.micro의 기존 용량을 늘리는 방향으로 해결했다.
P|nextjs 13의 문법을 이해하게 되었고, 프로젝트를 빌드하는 과정을 통해 프론트엔드로서의 개발자 경험을, AWS를 이용한 배포 과정으로 풀스택 경험도 할 수 있었다.`,

  'c6424b71477f831b856101bfb6a8d463': `H3|서비스 소개
P|언제 어디서든 모바일로 학습하는 코딩 교육 — 코스별 강의와 핵심노트, 실습 프로젝트, 재미있는 학습 드라마
H3|역할
UL|HTML · CSS 코스: 핵심노트, 실습, 퀴즈, 프로젝트 제작 / 하이그래프 작업
UL|파이썬 도약 · 심화: 강의 교안 검수 및 대본 검수, 촬영 어시스턴스(프롬프터)
UL|JavaScript, 파이썬 첫걸음: 컨텐츠 검수 (오탈자, 문제 오류 등)
UL|일반 강의 · 학습 드라마 CG 참고서 제작 및 검수
UL|학습 드라마 대본, 프로젝트 코드 제작, 드라마 준비
H3|회고
P|교육은 정확한 지식을 겸비해야 하고, 그것을 상대방의 상황에 따라 얼마나 적절하게 전달해야 하는지가 중요합니다. 입문자를 페르소나로 설정해 반복해서 문제를 확인하고 풀어보며 난이도를 조절했습니다.
P|코딩이 어렵다고 느끼는 순간 학습에 흥미를 잃을 수 있습니다. 컨텐츠 제작의 목적을 중요하게 생각하고, 서비스 제공자의 입장에서 작업하는 습관을 지니게 되었습니다.`,

  '66724b71477f8367845c017345a9e33d': `H3|서비스 소개
P|연말, 크리스마스를 기념하는 이벤트 프로젝트로 지인들과 함께 연말의 기쁨과 추억을 서로 주고 받기 위해 탄생했습니다.
UL|유저들이 스노우볼을 3D로 직접 커스텀 할 수 있습니다. (8가지 분류, 약 70개 요소)
UL|각 스노우볼과 일치하는 요소들을 지닌 유니티 마을로 이동할 수 있습니다.
H3|기능 구현 및 역할
UL|와이어프레임 설계, 카카오 소셜 로그인 구현
UL|친구목록 · 방명록 디자인, 설계, 개발
UL|Unity 가상마을 디자인, 구현 (joystick, 카메라 전환, object Drag & Drop)
UL|로고 · 파비콘 제작, PPT 제작
H3|회고
P|Unity를 사용해 C#을 학습하며 script를 object에 적용해 동적인 환경을 만들 수 있었습니다. useCallback과 useMemo를 이해하고, S3 이미지 업로드를 공식 문서로 학습해 적용했습니다.`,

  '7eb24b71477f837995c5817a6277c37b': `H3|서비스 소개
P|‘기타’와 초급자를 뜻하는 ‘어린이’의 합성어 ‘기린이’ — 기타 입문자 혹은 초보자를 위한 기타 코드 연주 학습 서비스입니다.
P|음원파일 인식과 분류모델을 통해 연주자가 해당 코드를 제대로 쳤는지, 시간 내에 운지를 바꾸었는지 파악하고 피드백을 줍니다.
H3|기능 구현 및 역할
UL|와이어 프레임 제작, 카카오 소셜 로그인 구현
UL|myrecord 페이지 설계 및 개발 (코드별 · 게임별 정확도)
UL|서비스 전체 화면을 React-swiper로 개발
UL|Jira 스프린트 관리 및 Notion 관리
UL|인공지능 학습을 위한 데이터 셋 제작 (기타 코드별 소리를 100 ~ 110회 녹음)
H3|회고
P|인터넷 데이터 셋의 정확도가 낮아, 팀장님과 직접 코드를 나누어 녹음해 데이터 셋을 제작했습니다. 컨설턴트님께 굉장히 좋은 경험이었다는 피드백을 받았습니다.
P|SSAFY 특화 프로젝트 **우수상** 수상 (2022.10.07)`,

  '99c24b71477f83918d29819057b6dda8': `H3|서비스 소개
P|IT 공부를 위한 SNS, ‘프로즌’은 IT 관련 학습 또는 취업을 원하는 사용자들을 위해 개발되었습니다.
H3|기능 구현 및 역할
UL|회원가입 및 로컬 로그인, 소셜로그인(카카오) 구현
UL|프로필 · 스터디 · 우측 사이드바 · 검색 기능 와이어프레임 설계 및 개발
UL|중간발표, 최종발표 PPT 제작, 홍보 UCC 제작
H3|회고
P|매일 9시 데일리 스크럼으로 온라인 협업을 진행했고, Jira와 git에 익숙해질 수 있었습니다. Postman으로 요청과 응답을 확인하며 axios 연결 문제를 해결했습니다.`,
};

/* ---------- 텍스트 → 블록 변환 ---------- */
const TYPES = { H2: 'heading_2', H3: 'heading_3', P: 'paragraph', UL: 'bulleted_list_item', OL: 'numbered_list_item', Q: 'quote', CO: 'callout', HR: 'divider' };
function spans(s) {
  return s.split(/(\*\*[^*]+\*\*)/).filter(Boolean).map((x) => (x.startsWith('**') ? { t: x.slice(2, -2), b: true } : { t: x }));
}
function parse(src) {
  const root = { children: [] };
  const stack = [{ depth: -1, node: root }];
  for (const line of src.split('\n')) {
    if (!line.trim()) continue;
    const depth = (line.match(/^ */)[0].length) / 2;
    const [tag, ...rest] = line.trim().split('|');
    const node = { type: TYPES[tag] || 'paragraph', text: spans(rest.join('|')) };
    while (stack[stack.length - 1].depth >= depth) stack.pop();
    const parent = stack[stack.length - 1].node;
    (parent.children = parent.children || []).push(node);
    stack.push({ depth, node });
  }
  return root.children;
}

export const SAMPLE_BLOCKS = Object.fromEntries(Object.entries(BODIES).map(([k, v]) => [k, parse(v)]));
SAMPLE_BLOCKS._default = parse('P|상세 내용은 노션 연동 후 표시됩니다.');
