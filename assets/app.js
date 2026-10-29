/* 오채명 포트폴리오 — 화면 렌더링과 라우팅 (외부 라이브러리 없음) */
(function () {
  'use strict';
  var P = window.PROFILE;
  var TRACK = 'HRD';
  var app = document.getElementById('app');

  // 사이트 버전(HRD / HRM)에 맞춰 고정 콘텐츠를 고릅니다 — content.js 의 PROFILE_VARIANTS 참고
  function applyVariant(track) {
    var base = window.PROFILE, v = (window.PROFILE_VARIANTS || {})[track];
    TRACK = v ? track : 'HRD';
    if (!v) { P = base; return; }
    var out = {};
    Object.keys(base).forEach(function (k) { out[k] = base[k]; });
    Object.keys(v).forEach(function (k) {
      if (k === 'text') { out.text = {}; Object.keys(base.text).forEach(function (t) { out.text[t] = base.text[t]; }); Object.keys(v.text).forEach(function (t) { out.text[t] = v.text[t]; }); }
      else if (k !== 'contactNote' && k !== 'skillsCore') out[k] = v[k];
    });
    out.contact = {}; Object.keys(base.contact).forEach(function (k) { out.contact[k] = base.contact[k]; });
    if (v.contactNote) out.contact.note = v.contactNote;
    out.skills = {}; Object.keys(base.skills).forEach(function (k) { out.skills[k] = base.skills[k]; });
    if (v.skillsCore) out.skills.hrd = v.skillsCore;
    out.career = base.career.map(function (x) {
      var y = {}; Object.keys(x).forEach(function (k) { y[k] = x[k]; });
      if (x.bridgeHrm) y.bridge = x.bridgeHrm;
      return y;
    });
    P = out;
  }
  // 요약 화면: featured 에 적은 프로젝트를 먼저, 나머지는 최신 순
  function featuredFirst(list) {
    var ids = (P.featured || []).map(function (x) { return String(x).replace(/-/g, '').toLowerCase(); });
    if (!ids.length) return list;
    var pinned = ids.map(function (id) { return list.filter(function (p) { return p.id === id; })[0]; }).filter(Boolean);
    return pinned.concat(list.filter(function (p) { return pinned.indexOf(p) < 0; }));
  }

  /* ---------- utils ---------- */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function ym(d) { return d ? d.slice(0, 7).replace('-', '.') : ''; }
  function fmtPeriod(p) {
    if (!p || !p.start) return '—';
    var s = p.start.slice(0, 10), e = p.end ? p.end.slice(0, 10) : null;
    if (!e || e === s) return s.replace(/-/g, '.');
    if (ym(s) === ym(e)) return s.replace(/-/g, '.') + ' – ' + e.slice(8, 10);
    return ym(s) + ' – ' + ym(e);
  }
  function statusChip(s) {
    if (!s) return '';
    var cls = s === '완료' ? 'ok' : s === '예정' ? 'next' : '';
    return '<span class="chip ' + cls + '">' + esc(s) + '</span>';
  }
  function chips(list, cls, max) {
    if (!list || !list.length) return '<span class="sub" style="font-size:13px">—</span>';
    var shown = max ? list.slice(0, max) : list;
    var more = max && list.length > max ? '<span class="chip o">+' + (list.length - max) + '</span>' : '';
    return shown.map(function (x) { return '<span class="chip ' + (cls || '') + '">' + esc(x) + '</span>'; }).join('') + more;
  }
  function toast(msg) {
    var t = document.querySelector('.toast');
    if (!t) { t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
    t.textContent = msg; t.classList.add('on');
    clearTimeout(t._h); t._h = setTimeout(function () { t.classList.remove('on'); }, 1600);
  }
  function copy(text, label) {
    function fallback() {
      var ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); toast(label + ' 복사됨'); } catch (e) { toast(text); }
      ta.remove();
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { toast(label + ' 복사됨'); }, fallback);
    } else fallback();
  }
  var telHref = function (p) { return 'tel:' + String(p).replace(/[^0-9+]/g, ''); };

  /* ---------- data ---------- */
  var listPromise = null;
  function getProjects() {
    if (!listPromise) {
      listPromise = fetch('/api/projects').then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      }).catch(function (e) { listPromise = null; throw e; });
    }
    return listPromise;
  }

  /* ---------- nav ---------- */
  var c;
  var NAV = [
    { href: '/', label: '요약', icon: '<path d="M4 5h16M4 12h16M4 19h10"/>' },
    { href: '/projects', label: '프로젝트', icon: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>' },
    { href: '/career', label: '경력', icon: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/>' },
    { href: '/skills', label: '스킬 · 자격', short: '스킬', icon: '<path d="M22 10L12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 2 9 2 12 0v-5"/>' },
    { href: '/contact', label: '연락처', icon: '<path d="M4 6h16v12H4z"/><path d="M4 7l8 6 8-6"/>' },
  ];
  function setupChrome() {
  c = P.contact;
  document.getElementById('menu').innerHTML = NAV.map(function (n) {
    return '<a href="' + n.href + '" data-link>' + n.label + '</a>';
  }).join('');
  document.getElementById('tabbar').innerHTML = NAV.map(function (n) {
    return '<a href="' + n.href + '" data-link><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + n.icon + '</svg><span>' + (n.short || n.label) + '</span></a>';
  }).join('');
  document.getElementById('pdfBtn').addEventListener('click', function () { window.print(); });
  window.addEventListener('beforeprint', function () {
    document.querySelectorAll('details').forEach(function (d) { d.dataset.wasOpen = d.open ? '1' : ''; d.open = true; });
  });
  window.addEventListener('afterprint', function () {
    document.querySelectorAll('details').forEach(function (d) { d.open = d.dataset.wasOpen === '1'; });
  });

  document.getElementById('foot').innerHTML =
    '<span><b>' + esc(P.name) + '</b> · ' + esc(P.label) + '</span>' +
    '<span class="strip"><a href="mailto:' + esc(c.email) + '">' + esc(c.email) + '</a>' +
    (c.phone ? '<a href="' + telHref(c.phone) + '">' + esc(c.phone) + '</a>' : '') + '</span>';
  var desc = document.querySelector('meta[name="description"]');
  if (desc) desc.setAttribute('content', P.oneLiner);
  }

  /* ---------- shared blocks ---------- */
  function projectTable(list, opts) {
    opts = opts || {};
    if (!list.length) return '<div class="empty">공개된 프로젝트가 없습니다.</div>';
    return '<div class="pgrid">' + list.map(function (p) {
      var orgMain = p.client || p.org, orgSub = p.client ? p.org : p.category;
      return '<a class="pcard" href="/projects/' + p.id + '" data-link>' +
        '<div class="pc-cover"><span class="pc-ph">' + esc(orgMain) + '</span>' +
          (p.cover ? '<img src="' + esc(p.cover) + '" alt="" loading="lazy" onerror="this.remove()">' : '') + '</div>' +
        '<div class="pc-body">' +
          '<div class="pc-top"><span><b>' + esc(orgMain) + '</b> · ' + esc(orgSub) + '</span>' + statusChip(p.status) + '</div>' +
          '<h3 class="pc-title">' + esc(p.title) + '</h3>' +
          (p.summary ? '<p class="pc-sum">' + esc(p.summary) + '</p>' : '') +
          '<div class="chips">' + (p.roles.length ? chips(p.roles, '', 3) : '') + (p.tech.length ? chips(p.tech, 'o', 3) : '') + '</div>' +
          '<div class="pc-date">' + esc(fmtPeriod(p.period)) + '</div>' +
        '</div></a>';
    }).join('') + '</div>';
  }
  function skeleton(n) {
    var s = '<div class="ptable">';
    for (var i = 0; i < n; i++) s += '<div class="skel"></div>';
    return s + '</div>';
  }
  function loadError() {
    return '<div class="empty">프로젝트를 불러오지 못했습니다. 잠시 후 새로고침해 주세요.</div>';
  }
  function sampleNotice(data) {
    return data && data.source === 'sample'
      ? '<p class="notice">샘플 데이터로 표시 중입니다. NOTION_TOKEN을 설정하면 노션 내용이 표시됩니다.</p>' : '';
  }
  function contactBand() {
    return '<div class="ctaband"><p>' + esc(c.note) + '</p><div class="cta" style="display:flex;gap:8px;flex-wrap:wrap">' +
      '<a class="btn" href="/contact" data-link>연락처 보기</a></div></div>';
  }

  /* ---------- pages ---------- */
  function pageHome() {
    document.title = P.name + ' | HR · 교육 운영 포트폴리오';
    app.innerHTML =
      '<div class="page">' +
      '<section class="hero">' +
        '<div><span class="label">' + esc(P.label) + '</span>' +
        '<h1>' + esc(P.name) + '</h1>' +
        '<p class="one">' + esc(P.oneLiner) + '</p>' +
        '<div class="ct"><a href="mailto:' + esc(c.email) + '">' + esc(c.email) + '</a>' +
          (c.phone ? '<a href="' + telHref(c.phone) + '">' + esc(c.phone) + '</a>' : '') +
          '<a href="' + esc(c.blog) + '" target="_blank" rel="noopener">블로그</a>' +
          (c.notion ? '<a href="' + esc(c.notion) + '" target="_blank" rel="noopener">Notion</a>' : '') +
          '<a href="' + esc(c.github) + '" target="_blank" rel="noopener">GitHub</a></div>' +
        '<div class="cta"><a class="btn" href="/projects" data-link>프로젝트 보기</a><a class="btn s" href="/contact" data-link>연락하기</a></div></div>' +
        '<dl class="box facts">' + P.facts.map(function (f) { return '<div><dt>' + esc(f[0]) + '</dt><dd>' + esc(f[1]) + '</dd></div>'; }).join('') + '</dl>' +
      '</section>' +
      '<section class="kpis" aria-label="핵심 숫자">' + P.kpis.map(function (k) {
            return '<div class="kpi"' + (k.auto ? ' data-auto="' + esc(k.auto) + '"' : '') + '><b><span class="kn">' + esc(k.n) + '</span><small>' + esc(k.u) + '</small></b><span>' + esc(k.t) + '</span></div>';
      }).join('') + '</section>' +
      '<section class="block"><div class="secth"><h2>주요 프로젝트</h2><a href="/projects" data-link>전체 프로젝트 →</a></div><div id="homeProjects">' + skeleton(4) + '</div></section>' +
      '<section class="two">' +
        '<div class="block"><div class="secth"><h2>핵심 역량</h2></div><div class="comp">' + P.competencies.map(function (x) {
          return '<div><b>' + esc(x.t) + '</b><span>' + esc(x.d) + '</span></div>';
        }).join('') + '</div></div>' +
        '<div class="block"><div class="secth"><h2>경력 요약</h2><a href="/career" data-link>전체 경력 →</a></div>' + careerList(P.career.slice(0, 5), true) + '</div>' +
      '</section>' +
      contactBand() +
      '</div>';
    getProjects().then(function (d) {
      var el = document.getElementById('homeProjects'); if (!el) return;
      el.innerHTML = sampleNotice(d) + projectTable(d.projects.slice(0, 3))
      // 노션 데이터로 핵심 숫자 갱신 (auto 값: courses, headcount / 0이면 content.js 값 유지)
      document.querySelectorAll('.kpi[data-auto]').forEach(function (k) {
        var v = d.stats && d.stats[k.getAttribute('data-auto')];
        if (v) k.querySelector('.kn').textContent = v.toLocaleString('ko-KR');
      });
    }).catch(function () {
      var el = document.getElementById('homeProjects'); if (el) el.innerHTML = loadError();
    });
  }

  var projFilter = '전체';
  function pageProjects() {
    document.title = '프로젝트 | ' + P.name;
    app.innerHTML = '<div class="page">' +
      '<header class="ph"><span class="label">PROJECTS</span><h1>프로젝트</h1><p>' + esc(P.text.projectsIntro) + '</p></header>' +
      '<section class="block"><div class="toolbar"><div class="filters" id="pf" role="group" aria-label="분류"></div><span class="sub" style="font-size:13px" id="pcount"></span></div><div id="plist">' + skeleton(6) + '</div></section>' +
      contactBand() + '</div>';
    getProjects().then(function (d) {
      var cats = ['전체'];
      d.projects.forEach(function (p) { if (cats.indexOf(p.category) < 0) cats.push(p.category); });
      if (cats.indexOf(projFilter) < 0) projFilter = '전체';
      function draw() {
        var list = d.projects.filter(function (p) { return projFilter === '전체' || p.category === projFilter; });
        var pf = document.getElementById('pf'); if (!pf) return;
        pf.innerHTML = cats.map(function (cat) {
          var n = cat === '전체' ? d.projects.length : d.projects.filter(function (p) { return p.category === cat; }).length;
          return '<button type="button" class="filter" data-cat="' + esc(cat) + '" aria-pressed="' + (cat === projFilter) + '">' + esc(cat) + '<span class="cnt">' + n + '</span></button>';
        }).join('');
        document.getElementById('pcount').textContent = list.length + '개';
        document.getElementById('plist').innerHTML = sampleNotice(d) + projectTable(list);
      }
      draw();
      document.getElementById('pf').addEventListener('click', function (e) {
        var b = e.target.closest('[data-cat]'); if (!b) return;
        projFilter = b.getAttribute('data-cat'); draw();
      });
    }).catch(function () { document.getElementById('plist').innerHTML = loadError(); });
  }

  function pageProject(id) {
    document.title = '프로젝트 | ' + P.name;
    app.innerHTML = '<div class="page"><div class="crumb"><a href="/projects" data-link>프로젝트</a> › 불러오는 중</div>' + skeleton(3) + '</div>';
    fetch('/api/project?id=' + encodeURIComponent(id)).then(function (r) {
      if (r.status === 404) return null;
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    }).then(function (d) {
      if (!d) return pageNotFound('공개되지 않았거나 존재하지 않는 프로젝트입니다.');
      var p = d.project;
      document.title = p.title + ' | ' + P.name;
      var who = [p.client, p.org].filter(Boolean).join(' · ');
      app.innerHTML = '<article class="page">' +
        '<header class="dhead"><div class="crumb"><a href="/projects" data-link>프로젝트</a> › ' + esc(p.category) + '</div>' +
          '<span class="who">' + esc(who) + '</span><h1>' + esc(p.title) + '</h1>' + (p.summary ? '<p>' + esc(p.summary) + '</p>' : '') + '</header>' +
        (p.hrmSummary && P.text.focusLabel ? '<section class="focus" aria-label="' + esc(P.text.focusLabel) + '"><span class="k">' + esc(P.text.focusLabel) + '</span><p>' + esc(p.hrmSummary) + '</p></section>' : '') +
        '<dl class="info">' +
          '<div><dt>기업 · 소속</dt><dd>' + esc(p.client || p.org) + '</dd></div>' +
          '<div><dt>기간</dt><dd class="num">' + esc(fmtPeriod(p.period)) + '</dd></div>' +
          '<div><dt>장소</dt><dd>' + esc(p.place || '—') + '</dd></div>' +
          '<div><dt>상태</dt><dd>' + esc(p.status || '—') + '</dd></div>' +
        '</dl>' +
        '<dl class="taxo"><div><dt>역할</dt><dd class="chips">' + chips(p.roles) + '</dd></div><div><dt>기술</dt><dd class="chips">' + chips(p.tech, 'o') + '</dd></div>' +
          (p.links.length ? '<div><dt>링크</dt><dd class="links">' + p.links.map(function (l) {
            return '<a class="btn s sm" href="' + esc(l.url) + '" target="_blank" rel="noopener">' + esc(l.label) + ' ↗</a>';
          }).join('') + '</dd></div>' : '') + '</dl>' +
        sampleNotice(d) +
        (d.blocks && d.blocks.length ? '<div class="doc">' + renderBlocks(d.blocks) + '</div>' : '') +
        '<div class="ctaband"><a class="btn t" href="/projects" data-link>← 프로젝트 목록</a><a class="btn" href="/contact" data-link>이 프로젝트에 대해 문의하기</a></div>' +
        '</article>';
    }).catch(function () {
      app.innerHTML = '<div class="page"><div class="crumb"><a href="/projects" data-link>프로젝트</a></div>' + loadError() + '</div>';
    });
  }

  var CAT = { edu: ['교육 · HRD', ''], dev: ['개발', 'o'], svc: ['서비스', 'o'], hr: ['인사', 'o'] };
  function careerList(list, compact) {
    return '<div class="tl">' + list.map(function (x) {
      var head = '<time>' + esc(x.date) + '</time><span class="who"><b>' + esc(x.org) + '</b>' + (x.now ? '<span class="nowb">NOW</span>' : '') + '<em>' + esc(x.role) + '</em></span><span class="chip ' + CAT[x.cat][1] + '">' + CAT[x.cat][0] + '</span>';
      if (compact) return '<div class="titem"><summary style="cursor:default">' + head + '<span></span></summary></div>';
      return '<details class="titem"' + (x.now ? ' open' : '') + '><summary>' + head + '<span class="chev" aria-hidden="true">▼</span></summary>' +
        '<div class="tb"><ul>' + x.body.map(function (b) { return '<li>' + esc(b) + '</li>'; }).join('') + '</ul>' +
        (x.bridge ? '<p class="bridge"><b>' + esc(P.text.bridgeLabel) + '</b>' + esc(x.bridge) + '</p>' : '') + '</div></details>';
    }).join('') + '</div>';
  }
  var careerFilter = 'all';
  function pageCareer() {
    document.title = '경력 | ' + P.name;
    app.innerHTML = '<div class="page">' +
      '<header class="ph"><span class="label">CAREER</span><h1>경력</h1><p>' + esc(P.text.careerIntro) + '</p></header>' +
      '<section class="block"><div class="filters" id="cf" role="group" aria-label="분야"></div><div id="clist"></div></section>' +
      contactBand() + '</div>';
    function draw() {
      var opts = [['all', '전체']].concat(Object.keys(CAT).map(function (k) { return [k, CAT[k][0]]; }));
      document.getElementById('cf').innerHTML = opts.map(function (o) {
        var n = o[0] === 'all' ? P.career.length : P.career.filter(function (x) { return x.cat === o[0]; }).length;
        return '<button type="button" class="filter" data-c="' + o[0] + '" aria-pressed="' + (careerFilter === o[0]) + '">' + o[1] + '<span class="cnt">' + n + '</span></button>';
      }).join('');
      document.getElementById('clist').innerHTML = careerList(P.career.filter(function (x) { return careerFilter === 'all' || x.cat === careerFilter; }));
    }
    draw();
    document.getElementById('cf').addEventListener('click', function (e) {
      var b = e.target.closest('[data-c]'); if (!b) return; careerFilter = b.getAttribute('data-c'); draw();
    });
  }

  function pageSkills() {
    document.title = '스킬 · 자격 | ' + P.name;
    var S = P.skills;
    app.innerHTML = '<div class="page">' +
      '<header class="ph"><span class="label">SKILLS · EDUCATION</span><h1>스킬 · 자격</h1><p>' + esc(P.text.skillsIntro) + '</p></header>' +
      '<section class="grid2">' +
        '<div class="block"><div class="secth"><h2>' + esc(P.text.skillsAi) + '</h2></div><div class="chips">' + chips(S.ai) + '</div></div>' +
        '<div class="block"><div class="secth"><h2>' + esc(P.text.skillsCore) + '</h2></div><div class="chips">' + chips(S.hrd, 'o') + '</div></div>' +
      '</section>' +
      '<section class="block"><div class="secth"><h2>개발</h2></div><div>' + S.dev.map(function (r) {
        return '<div class="srow"><b>' + esc(r[0]) + '</b><span class="lv">' + esc(r[1]) + '</span><span>' + esc(r[2]) + '</span></div>';
      }).join('') + '</div></section>' +
      '<section class="block"><div class="secth"><h2>학력 · 교육</h2></div><div class="edu">' + P.education.map(function (e) {
        return '<div><time>' + esc(e.date) + '</time><div><b>' + esc(e.name) + '</b>' + (e.sub ? '<p>' + esc(e.sub) + '</p>' : '') +
          (e.items.length ? '<ul>' + e.items.map(function (i) { return '<li>' + esc(i) + '</li>'; }).join('') + '</ul>' : '') + '</div></div>';
      }).join('') + '</div></section>' +
      '<section class="block"><div class="secth"><h2>자격 · 수상 · 어학</h2></div><div class="tscroll"><table class="tbl"><thead><tr><th>이름</th><th>취득일</th><th>발급처 · 비고</th></tr></thead><tbody>' +
        P.certs.map(function (r) {
          return '<tr class="' + (r[3] === 'hrd' ? 'hrd' : '') + '"><td>' + esc(r[0]) + (r[3] === 'award' ? ' <span class="chip g">수상</span>' : '') + '</td><td class="num">' + esc(r[1]) + '</td><td>' + esc(r[2]) + '</td></tr>';
        }).join('') + '</tbody></table></div></section>' +
      '</div>';
  }

  function pageContact() {
    document.title = '연락처 | ' + P.name;
    app.innerHTML = '<div class="page">' +
      '<header class="ph"><span class="label">CONTACT</span><h1>연락처</h1><p>' + esc(c.note) + '</p></header>' +
      '<section class="contact">' +
        '<div class="box cbox"><span class="k">EMAIL</span><span class="v">' + esc(c.email) + '</span><div class="row">' +
          '<a class="btn" href="mailto:' + esc(c.email) + '?subject=' + encodeURIComponent('[포트폴리오 문의] ') + '">메일 보내기</a>' +
          '<button class="btn s" type="button" data-copy="' + esc(c.email) + '" data-label="이메일">복사</button></div></div>' +
        (c.phone ? '<div class="box cbox"><span class="k">PHONE</span><span class="v num">' + esc(c.phone) + '</span><div class="row">' +
          '<a class="btn" href="' + telHref(c.phone) + '">전화 걸기</a>' +
          '<button class="btn s" type="button" data-copy="' + esc(c.phone) + '" data-label="전화번호">복사</button></div></div>' : '') +
      '</section>' +
      '<section class="block"><div class="secth"><h2>더 알아보기</h2></div><div class="strip">' +
        '<a href="' + esc(c.blog) + '" target="_blank" rel="noopener">채명로그 (네이버 블로그) ↗</a>' +
        (c.notion ? '<a href="' + esc(c.notion) + '" target="_blank" rel="noopener">Notion 포트폴리오 ↗</a>' : '') +
        '<a href="' + esc(c.github) + '" target="_blank" rel="noopener">GitHub ↗</a>' +
        '<a href="/projects" data-link>프로젝트 목록 →</a></div></section>' +
      '</div>';
  }

  function pageNotFound(msg) {
    document.title = '페이지를 찾을 수 없습니다 | ' + P.name;
    app.innerHTML = '<div class="page"><header class="ph"><span class="label">404</span><h1>페이지를 찾을 수 없습니다</h1><p>' +
      esc(msg || '주소가 바뀌었거나 삭제된 페이지입니다.') + '</p></header><div><a class="btn" href="/" data-link>요약으로 돌아가기</a></div></div>';
  }

  /* ---------- Notion block renderer ---------- */
  function rt(spans) {
    return (spans || []).map(function (s) {
      var h = esc(s.t).replace(/\n/g, '<br>');
      if (s.c) h = '<code>' + h + '</code>';
      if (s.b) h = '<strong>' + h + '</strong>';
      if (s.i) h = '<em>' + h + '</em>';
      if (s.s) h = '<s>' + h + '</s>';
      if (s.u) h = '<u>' + h + '</u>';
      if (s.href) h = '<a href="' + esc(s.href) + '" target="_blank" rel="noopener">' + h + '</a>';
      return h;
    }).join('');
  }
  function kids(b) { return b.children && b.children.length ? '<div class="doc-kids doc">' + renderBlocks(b.children) + '</div>' : ''; }
  function renderBlocks(blocks) {
    var out = '', i = 0;
    while (i < blocks.length) {
      var b = blocks[i];
      if (b.type === 'bulleted_list_item' || b.type === 'numbered_list_item') {
        var tag = b.type === 'bulleted_list_item' ? 'ul' : 'ol', items = '';
        while (i < blocks.length && blocks[i].type === b.type) { items += '<li>' + rt(blocks[i].text) + kids(blocks[i]) + '</li>'; i++; }
        out += '<' + tag + '>' + items + '</' + tag + '>';
        continue;
      }
      out += renderOne(b);
      i++;
    }
    return out;
  }
  function renderOne(b) {
    switch (b.type) {
      case 'paragraph': return b.text && b.text.length ? '<p>' + rt(b.text) + '</p>' + kids(b) : kids(b);
      case 'heading_1': case 'heading_2': case 'heading_3': {
        var lvl = { heading_1: 2, heading_2: 3, heading_3: 4 }[b.type];
        var h = '<h' + lvl + '>' + rt(b.text) + '</h' + lvl + '>';
        return b.toggle ? '<details><summary>' + rt(b.text) + '</summary>' + kids(b) + '</details>' : h + kids(b);
      }
      case 'quote': return '<blockquote>' + rt(b.text) + kids(b) + '</blockquote>';
      case 'callout': return '<div class="callout"><div>' + rt(b.text) + '</div>' + kids(b) + '</div>';
      case 'toggle': return '<details><summary>' + rt(b.text) + '</summary>' + kids(b) + '</details>';
      case 'to_do': return '<div class="todo"><input type="checkbox" disabled' + (b.checked ? ' checked' : '') + ' aria-label="할 일"><div>' + rt(b.text) + '</div></div>' + kids(b);
      case 'code': return '<pre><code>' + esc(b.code) + '</code></pre>';
      case 'divider': return '<hr>';
      case 'image': return b.url ? '<figure><img src="' + esc(b.url) + '" alt="' + esc(b.caption || '') + '" loading="lazy">' + (b.caption ? '<figcaption>' + esc(b.caption) + '</figcaption>' : '') + '</figure>' : '';
      case 'link': return b.url ? '<p><a class="lnk" href="' + esc(b.url) + '" target="_blank" rel="noopener">' + esc(b.caption || b.url) + ' ↗</a></p>' : '';
      case 'table': {
        var rows = (b.children || []).filter(function (r) { return r.type === 'table_row'; });
        return '<div class="tscroll"><table>' + rows.map(function (r, idx) {
          var tagc = b.header && idx === 0 ? 'th' : 'td';
          return '<tr>' + r.cells.map(function (cell) { return '<' + tagc + '>' + rt(cell) + '</' + tagc + '>'; }).join('') + '</tr>';
        }).join('') + '</table></div>';
      }
      case 'column_list': return '<div class="cols">' + (b.children || []).map(function (col) { return '<div class="col">' + renderBlocks(col.children || []) + '</div>'; }).join('') + '</div>';
      case 'column': case 'synced_block': return renderBlocks(b.children || []);
      default: return '';
    }
  }

  /* ---------- router ---------- */
  function route() {
    var path = location.pathname.replace(/\/+$/, '') || '/';
    var m;
    if (path === '/') pageHome();
    else if (path === '/projects') pageProjects();
    else if ((m = path.match(/^\/projects\/([0-9a-fA-F-]{32,36})$/))) pageProject(m[1]);
    else if (path === '/career') pageCareer();
    else if (path === '/skills') pageSkills();
    else if (path === '/contact') pageContact();
    else pageNotFound();
    var section = '/' + (path.split('/')[1] || '');
    document.querySelectorAll('.menu a, .tabbar a').forEach(function (a) {
      if (a.getAttribute('href') === section) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  }
  document.addEventListener('click', function (e) {
    var cp = e.target.closest('[data-copy]');
    if (cp) { copy(cp.getAttribute('data-copy'), cp.getAttribute('data-label') || ''); return; }
    var a = e.target.closest('a[data-link]');
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    var href = a.getAttribute('href');
    if (href !== location.pathname) history.pushState(null, '', href);
    route();
    window.scrollTo(0, 0);
    app.focus({ preventScroll: true });
  });
  window.addEventListener('popstate', route);

  // 시작: 이 배포의 버전(HRD / HRM)을 확인한 뒤 화면을 그립니다. 확인 실패 시 HRD
  function start(track) { applyVariant(track); setupChrome(); route(); }
  var started = false;
  function once(track) { if (!started) { started = true; start(track); } }
  setTimeout(function () { once('HRD'); }, 1500);
  fetch('/api/site').then(function (r) { return r.ok ? r.json() : {}; })
    .then(function (d) { once(d && d.track); }, function () { once('HRD'); });
})();
