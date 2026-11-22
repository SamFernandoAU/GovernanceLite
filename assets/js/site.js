/* GovernanceLite site: renders the framework's Markdown (single source of truth in /framework)
   and adds a self-check whose progress is stored only in this browser. */
(function () {
  'use strict';

  var REPO = 'https://github.com/SamFernandoAU/GovernanceLite';
  var PRACTICES = [
    { id: 'practices/01-ownership', gl: 'GL1', title: 'Ownership', icon: 'usercheck' },
    { id: 'practices/02-identity-and-access', gl: 'GL2', title: 'Identity and access', icon: 'fingerprint' },
    { id: 'practices/03-ai-usage-rules', gl: 'GL3', title: 'AI usage rules', icon: 'bot' },
    { id: 'practices/04-secure-design', gl: 'GL4', title: 'Secure design', icon: 'layers' },
    { id: 'practices/05-guardrailed-pipeline', gl: 'GL5', title: 'Guardrailed pipeline', icon: 'branch' },
    { id: 'practices/06-data-protection', gl: 'GL6', title: 'Data protection', icon: 'database' },
    { id: 'practices/07-suppliers-and-integrations', gl: 'GL7', title: 'Suppliers and integrations', icon: 'handshake' },
    { id: 'practices/08-logging-and-evidence', gl: 'GL8', title: 'Logging and evidence', icon: 'eye' },
    { id: 'practices/09-incident-readiness', gl: 'GL9', title: 'Incident readiness', icon: 'siren' },
    { id: 'practices/10-monthly-review', gl: 'GL10', title: 'Monthly review', icon: 'calendar' }
  ];
  var NAV = [
    { h: 'Start here', items: [['overview', 'Overview'], ['adopt-in-30-days', 'Adopt in 30 days'], ['maturity-levels', 'Maturity levels'], ['self-check', 'Self-check']] },
    { h: 'The ten practices', items: PRACTICES.map(function (p) { return [p.id, p.title, p.gl]; }) },
    { h: 'Reference', items: [['metrics', 'Metrics'], ['mappings', 'Mappings'], ['faq', 'FAQ']] }
  ];
  var ORDER = [];
  NAV.forEach(function (g) { g.items.forEach(function (it) { if (it[0] !== 'self-check') ORDER.push(it); }); });
  var LEVEL_NAMES = ['Not yet', 'Baseline', 'Established', 'Evidenced'];
  var RAW = /\.(ya?ml|rego|json|txt)$|(^|\/)CODEOWNERS$/;

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var view = $('#view'), side = $('#side'), toc = $('#toc'), shell = $('#shell');
  var MD = window.MD;

  /* ---------- storage (browser only) */
  var checks = {};
  try { checks = JSON.parse(localStorage.getItem('gl.fw.checks') || '{}') || {}; } catch (e) { checks = {}; }
  function saveChecks() { try { localStorage.setItem('gl.fw.checks', JSON.stringify(checks)); } catch (e) { /* unavailable */ } }

  function hash(s) { var h = 5381; for (var i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0; return (h >>> 0).toString(36); }

  /* ---------- fetching */
  var cache = {};
  function fileFor(route) {
    if (route === 'overview') return 'framework/README.md';
    if (RAW.test(route)) return 'framework/' + route;
    return 'framework/' + route + '.md';
  }
  function get(path) {
    if (!cache[path]) cache[path] = fetch(path, { cache: 'no-cache' }).then(function (r) { if (!r.ok) throw new Error(r.status + ' ' + path); return r.text(); });
    return cache[path];
  }

  /* ---------- tasks parsed from Markdown (same keys on practice pages and in the self-check) */
  function parseTasks(route, src) {
    var level = 0, out = [], inFence = false;
    src.replace(/\r\n?/g, '\n').split('\n').forEach(function (l) {
      if (/^```/.test(l)) inFence = !inFence;
      if (inFence) return;
      var h = /^##\s+(.*)$/.exec(l);
      if (h) { var m = /^Level\s+(\d)/i.exec(h[1]); level = m ? +m[1] : 0; return; }
      var t = /^\s*[-*+]\s+\[[ xX]\]\s+(.*)$/.exec(l);
      if (t) out.push({ level: level, text: t[1], key: route + ':' + hash(t[1]) });
    });
    return out;
  }
  function levelOf(tasks) {
    var lv = 0;
    for (var L = 1; L <= 3; L++) {
      var at = tasks.filter(function (t) { return t.level === L; });
      if (!at.length || !at.every(function (t) { return checks[t.key]; })) break;
      lv = L;
    }
    return lv;
  }
  function levelBadge(lv, short) { return '<span class="lvl l' + lv + '"><i></i>' + (short ? 'L' + lv : 'L' + lv + ' · ' + LEVEL_NAMES[lv]) + '</span>'; }
  var practiceTasks = {};
  function loadAllPractices() {
    return Promise.all(PRACTICES.map(function (p) {
      return get(fileFor(p.id)).then(function (src) { practiceTasks[p.id] = parseTasks(p.id, src); p.src = src; return p; });
    }));
  }

  /* ---------- link resolution: Markdown links work on GitHub AND on this site */
  function normalize(path) {
    var out = [];
    path.split('/').forEach(function (seg, i, arr) {
      if (seg === '..') out.pop();
      else if (seg !== '.' && !(seg === '' && i < arr.length - 1)) out.push(seg);
    });
    return out.join('/');
  }
  function resolver(fileDir, route) {
    return function (href) {
      if (/^(https?:|mailto:)/.test(href)) return { href: href, external: true };
      if (href.charAt(0) === '#') return { href: '#/' + route + '?h=' + href.slice(1), anchor: href.slice(1) };
      var hi = href.indexOf('#'), path = hi > -1 ? href.slice(0, hi) : href, frag = hi > -1 ? href.slice(hi + 1) : '';
      var res = normalize(fileDir + path);
      if (res === '') return { href: frag.charAt(0) === '/' ? '#' + frag : './' };
      if (res.indexOf('framework/') === 0) {
        var rel = res.slice(10);
        if (/\.md$/.test(rel)) {
          var r = rel.slice(0, -3);
          if (r === 'README') r = 'overview';
          return { href: '#/' + r + (frag ? '?h=' + frag : ''), anchor: frag || undefined };
        }
        return { href: '#/' + rel };
      }
      return { href: REPO + '/blob/main/' + res, external: true };
    };
  }

  /* ---------- chrome */
  function buildSide(route) {
    side.innerHTML = NAV.map(function (g) {
      return '<h5>' + g.h + '</h5>' + g.items.map(function (it) {
        var lv = '';
        if (it[2] && practiceTasks[it[0]]) lv = '<span class="lv">' + levelBadge(levelOf(practiceTasks[it[0]]), true) + '</span>';
        return '<a href="#/' + it[0] + '"' + (it[0] === route ? ' class="on" aria-current="page"' : '') + '>' + (it[2] ? '<span class="gl">' + it[2] + '</span>' : '') + it[1] + lv + '</a>';
      }).join('');
    }).join('') + '<h5>Source</h5><a href="' + REPO + '" target="_blank" rel="noopener">GitHub repository ↗</a>';
  }
  function setTopNav(route) {
    $$('.top nav a').forEach(function (a) {
      var r = a.getAttribute('href').replace(/^#\//, '');
      var on = r === route || (r === 'practices/01-ownership' && route.indexOf('practices/') === 0);
      a.classList.toggle('on', on);
    });
  }
  function buildToc(headings) {
    var hs = headings.filter(function (h) { return h.level === 2; });
    toc.innerHTML = hs.length ? '<h5>On this page</h5>' + hs.map(function (h) { return '<a href="#" data-scroll="' + MD.esc(h.id) + '">' + MD.esc(h.text) + '</a>'; }).join('') : '';
  }
  function scrollToId(id) {
    var el = id && document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); else window.scrollTo(0, 0);
  }
  var toastT;
  function toast(msg) {
    var t = $('#toast'); t.textContent = msg; t.classList.add('show');
    clearTimeout(toastT); toastT = setTimeout(function () { t.classList.remove('show'); }, 1800);
  }
  function copy(text, msg) {
    function done() { toast(msg || 'Copied'); }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, fallback); else fallback();
    function fallback() {
      var ta = document.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); } catch (e) { /* ignore */ } ta.remove(); done();
    }
  }
  function download(name, text) {
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([text], { type: 'text/plain' }));
    a.download = name; document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }
  function addCopyButtons(root) {
    $$('pre', root).forEach(function (pre) {
      var b = document.createElement('button'); b.type = 'button'; b.className = 'copy'; b.textContent = 'copy';
      b.addEventListener('click', function () { copy(pre.querySelector('code').innerText, 'Code copied'); });
      pre.appendChild(b);
    });
  }

  /* document sheets (one-page templates): print, copy as Markdown, download */
  function addSheetTools(root) {
    $$('.sheet', root).forEach(function (sheet) {
      var src = sheet.getAttribute('data-src') || '';
      var h = sheet.querySelector('h3'), name = (h ? h.textContent : 'template').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      var bar = document.createElement('div'); bar.className = 'sheet-tools';
      bar.innerHTML = '<span class="mono">' + MD.esc(name + '.md') + '</span><span class="sp"></span>' +
        '<button type="button" class="btn sm ghost" data-act="print"><svg class="ico"><use href="#i-printer"/></svg>Print</button>' +
        '<button type="button" class="btn sm ghost" data-act="copy"><svg class="ico"><use href="#i-copy"/></svg>Copy Markdown</button>' +
        '<button type="button" class="btn sm ghost" data-act="download"><svg class="ico"><use href="#i-download"/></svg>Download</button>';
      bar.addEventListener('click', function (e) {
        var b = e.target.closest('button'); if (!b) return;
        var act = b.getAttribute('data-act');
        if (act === 'copy') copy(src + '\n', 'Template copied as Markdown');
        if (act === 'download') download(name + '.md', src + '\n');
        if (act === 'print') {
          document.body.classList.add('print-sheet'); sheet.classList.add('print-target');
          var undo = function () { document.body.classList.remove('print-sheet'); sheet.classList.remove('print-target'); window.removeEventListener('afterprint', undo); };
          window.addEventListener('afterprint', undo);
          window.print();
        }
      });
      sheet.parentNode.insertBefore(bar, sheet);
    });
  }

  /* ---------- pages */
  function pager(route) {
    var i = ORDER.findIndex(function (o) { return o[0] === route; });
    if (i < 0) return '';
    var p = ORDER[i - 1], n = ORDER[i + 1];
    return '<nav class="pager">' + (p ? '<a href="#/' + p[0] + '"><small>← Previous</small>' + p[1] + '</a>' : '<span></span>') +
      (n ? '<a class="next" href="#/' + n[0] + '"><small>Next →</small>' + n[1] + '</a>' : '') + '</nav>';
  }
  function crumbs(route, title) {
    var sec = route.indexOf('practices/') === 0 ? '<a href="#/overview">Practices</a> /' : '';
    return '<div class="crumbs"><a href="#/">GovernanceLite</a> / ' + sec + ' <span>' + MD.esc(title) + '</span></div>';
  }

  function renderDoc(route, anchor) {
    shell.classList.remove('home');
    var file = fileFor(route), fileDir = file.replace(/[^/]+$/, '');
    view.innerHTML = '<div class="doc"><p class="loading">Loading…</p></div>';
    var isPractice = route.indexOf('practices/') === 0, isRaw = RAW.test(route);
    return get(file).then(function (src) {
      var html, headings, title;
      if (isRaw) {
        title = route.split('/').pop();
        var lang = (/\.(\w+)$/.exec(title) || [])[1] || 'text';
        var intro = (src.split('\n').filter(function (l) { return /^#\s/.test(l); }).slice(0, 3).map(function (l) { return l.replace(/^#\s?/, ''); }).join(' '));
        html = '<h1>' + MD.esc(title) + '</h1>' + (intro ? '<p>' + MD.esc(intro) + '</p>' : '') + '<pre data-lang="' + lang + '"><code>' + MD.esc(src) + '</code></pre>';
        headings = [];
      } else {
        var r = MD.render(src, { link: resolver(fileDir, route) });
        html = r.html; headings = r.headings;
        title = (headings[0] && headings[0].level === 1) ? headings[0].text : route;
      }
      var actions = '<div class="doc-actions">';
      actions += '<a class="btn sm ghost" href="' + REPO + '/blob/main/' + file + '" target="_blank" rel="noopener"><svg class="ico"><use href="#i-github"/></svg>View on GitHub</a></div>';
      var prog = isPractice ? '<div class="progress-card" data-prog></div>' : '';
      view.innerHTML = '<article class="doc">' + crumbs(route, title) + actions + prog + '<div class="md">' + html + '</div>' + pager(route) + '</article>';
      document.title = title + ' · GovernanceLite';
      buildToc(headings);
      addCopyButtons(view);
      addSheetTools(view);
      if (!isRaw) wireTasks(route, src);
      if (anchor) setTimeout(function () { scrollToId(anchor); }, 30); else window.scrollTo(0, 0);
    }).catch(function (e) {
      view.innerHTML = '<div class="doc"><div class="err"><b>Couldn\'t load this page.</b><br><span class="muted">' + MD.esc(String(e.message || e)) + '</span><br><br>If you opened the file directly from disk, run a local web server instead (see README).</div></div>';
    });
  }

  function wireTasks(route, src) {
    var tasks = parseTasks(route, src), lis = $$('.md li.task', view), isPractice = route.indexOf('practices/') === 0;
    lis.forEach(function (li, k) {
      var t = tasks[k]; if (!t) return;
      var cb = $('input', li);
      cb.checked = !!checks[t.key]; li.classList.toggle('done', cb.checked);
      li.addEventListener('click', function (e) {
        if (e.target.closest('a')) return;
        if (e.target !== cb) cb.checked = !cb.checked;
        if (cb.checked) checks[t.key] = 1; else delete checks[t.key];
        li.classList.toggle('done', cb.checked); saveChecks();
        if (isPractice) paintPractice(route, tasks);
      });
    });
    if (isPractice) {
      practiceTasks[route] = tasks;
      $$('.md h2', view).forEach(function (h) {
        var m = /^Level\s+(\d)/i.exec(h.textContent);
        if (m) { var s = document.createElement('span'); s.dataset.lvcount = m[1]; h.appendChild(s); }
      });
      paintPractice(route, tasks);
    }
  }
  function paintPractice(route, tasks) {
    var lv = levelOf(tasks), done = tasks.filter(function (t) { return t.level && checks[t.key]; }).length, total = tasks.filter(function (t) { return t.level; }).length;
    var pc = $('[data-prog]', view);
    if (pc) pc.innerHTML = '<span>Your team: ' + levelBadge(lv) + '</span><div class="bar"><i style="width:' + (total ? done / total * 100 : 0) + '%"></i></div><span class="mono muted" style="font-size:13px">' + done + ' / ' + total + ' done</span><a class="btn sm ghost" href="#/self-check">Full self-check</a>';
    $$('[data-lvcount]', view).forEach(function (s) {
      var L = +s.dataset.lvcount, at = tasks.filter(function (t) { return t.level === L; }), d = at.filter(function (t) { return checks[t.key]; }).length;
      s.className = 'lvl' + (d === at.length && at.length ? ' l' + L : '');
      s.innerHTML = '<i></i>' + d + ' / ' + at.length;
    });
    buildSide(route);
  }

  /* ---------- home */
  function renderHome() {
    shell.classList.add('home');
    toc.innerHTML = '';
    document.title = 'GovernanceLite · a mini governance framework for engineering teams';
    view.innerHTML =
      '<section class="hero"><div class="hero-in"><div>' +
      '<p class="kicker">// a mini governance framework for engineering teams</p>' +
      '<h1>Governance<span>Lite</span></h1>' +
      '<p class="lede">Ten practices. Three levels. Thirty minutes a month. Security governance that produces its own evidence, built for teams where AI writes a lot of the code.</p>' +
      '<div class="cta"><a class="btn primary" href="#/adopt-in-30-days"><svg class="ico"><use href="#i-rocket"/></svg>Adopt in 30 days</a>' +
      '<a class="btn" href="#/self-check"><svg class="ico"><use href="#i-clipboard"/></svg>Take the self-check</a>' +
      '<a class="btn ghost" href="#/overview"><svg class="ico"><use href="#i-book"/></svg>Read the framework</a></div>' +
      '<p class="muted" style="font-size:14.5px;max-width:600px;margin:16px 0 0"><strong>A practical start, not a replacement.</strong> GovernanceLite isn\'t a replacement for robust frameworks such as ISO/IEC 27001, SOC 2 or the NIST Cybersecurity Framework. It\'s a practical starting point for engineering teams that aren\'t chasing a certification, or that want good habits in place before they do.</p></div>' +
      '<div class="term"><div class="bar"><i></i><i></i><i></i><span>governancelite status</span></div><pre data-status><span class="d">loading…</span></pre></div></div></section>' +

      '<section class="section"><h2>The ten practices</h2><p class="sub">Each one has a clear outcome, practical steps for this week, three levels, platform how-tos, a metric and a mapping to the standards you already know.</p><div class="cards" data-cards></div></section>' +

      '<section class="section"><h2>Principles</h2><p class="sub">Six ideas that keep it light.</p><div class="principles" data-principles></div></section>' +

      '<section class="section"><h2>Three levels, one loop</h2><p class="sub">Every practice has the same three levels. The monthly review keeps them moving, one practice at a time.</p>' +
      '<div class="levels">' +
      '<div class="level">' + levelBadge(1) + '<b>Baseline</b><span>The minimum that stops the common incidents. About a month for most teams.</span></div>' +
      '<div class="level">' + levelBadge(2) + '<b>Established</b><span>Running as a habit, automated where it can be, checked on a schedule.</span></div>' +
      '<div class="level">' + levelBadge(3) + '<b>Evidenced</b><span>Records an auditor or a customer questionnaire could rely on.</span></div></div>' +
      '<div class="loop"><div><b>Practices</b><span>do the work in the tools you already use</span></div><div><b>Evidence</b><span>falls out as a side effect: Git history, settings, logs</span></div><div><b>Monthly review</b><span>30 minutes: metrics, risks, actions</span></div><div><b>Raise one</b><span>one practice up a level each quarter</span></div></div></section>' +

      '<section class="section"><h2>Maps to what auditors ask for</h2><p class="sub">Not a certification, but every practice lines up with controls in the frameworks your customers ask about.</p>' +
      '<div class="maps"><a href="#/mappings?h=isoiec-270012022-and-soc-2"><svg class="ico"><use href="#i-badge"/></svg>ISO/IEC 27001:2022</a><a href="#/mappings?h=isoiec-270012022-and-soc-2"><svg class="ico"><use href="#i-badge"/></svg>SOC 2</a><a href="#/mappings?h=asd-essential-eight"><svg class="ico"><use href="#i-badge"/></svg>ASD Essential Eight</a><a href="#/mappings?h=owasp-top-102025"><svg class="ico"><use href="#i-badge"/></svg>OWASP Top 10:2025</a><a href="#/mappings?h=whats-left-for-certification"><svg class="ico"><use href="#i-file"/></svg>What\'s left for certification</a></div></section>';


    Promise.all([loadAllPractices(), get('framework/README.md')]).then(function (res) {
      var readme = res[1];
      $('[data-cards]', view).innerHTML = PRACTICES.map(function (p) {
        var m = /^>\s*\*\*Outcome:\*\*\s*(.*)$/m.exec(p.src), tasks = practiceTasks[p.id], lv = levelOf(tasks);
        var done = tasks.filter(function (t) { return t.level && checks[t.key]; }).length, total = tasks.filter(function (t) { return t.level; }).length;
        return '<a class="pcard" href="#/' + p.id + '"><div class="row"><span class="ib"><svg class="ico"><use href="#i-' + p.icon + '"/></svg></span>' + (done ? levelBadge(lv, true) : '<span class="num">' + p.gl + '</span>') + '</div>' +
          '<b>' + p.gl + ' · ' + p.title + '</b><p>' + (m ? MD.esc(m[1]) : '') + '</p><div class="pbar"><i style="width:' + (total ? done / total * 100 : 0) + '%"></i></div></a>';
      }).join('');
      var sec = /## Principles\n([\s\S]*?)\n## /.exec(readme.replace(/\r\n?/g, '\n'));
      if (sec) {
        $('[data-principles]', view).innerHTML = sec[1].split('\n').filter(function (l) { return /^\d+\.\s/.test(l); }).map(function (l) {
          var mm = /^\d+\.\s+\*\*(.+?)\*\*\s*(.*)$/.exec(l);
          return mm ? '<div class="principle"><b>' + MD.esc(mm[1].replace(/\.$/, '')) + '</b><span>' + MD.esc(mm[2].replace(/\*([^*]+)\*/g, '$1')) + '</span></div>' : '';
        }).join('');
      }
      $('[data-status]', view).innerHTML = statusText();
    }).catch(function (e) { $('[data-cards]', view).innerHTML = '<div class="err">Couldn\'t load the practices: ' + MD.esc(String(e.message || e)) + '</div>'; });
    window.scrollTo(0, 0);
  }
  function statusText() {
    var any = Object.keys(checks).some(function (k) { return k.indexOf('practices/') === 0; });
    var lines = ['<span class="d">$</span> <span class="w">governancelite status</span>' + (any ? '' : '   <span class="d"># example team</span>')];
    var example = [2, 1, 1, 1, 2, 1, 0, 1, 1, 1];
    PRACTICES.forEach(function (p, i) {
      var lv = any ? levelOf(practiceTasks[p.id]) : example[i];
      var bar = '', cls = ['d', 'a', 't', 'g'][lv];
      for (var k = 1; k <= 3; k++) bar += k <= lv ? '■' : '□';
      lines.push('<span class="g">' + (p.gl + ' ').slice(0, 4) + '</span>  ' + (p.title + '                          ').slice(0, 27) + '<span class="' + cls + '">' + bar + '</span>  <span class="' + cls + '">' + LEVEL_NAMES[lv] + '</span>');
    });
    lines.push('');
    lines.push('<span class="d">next:</span> raise <span class="a">' + (function () {
      var min = 9, who = PRACTICES[0];
      PRACTICES.forEach(function (p, i) { var lv = any ? levelOf(practiceTasks[p.id]) : example[i]; if (lv < min) { min = lv; who = p; } });
      return who.gl + ' ' + who.title;
    })() + '</span> next quarter');
    return lines.join('\n');
  }

  /* ---------- self-check */
  function renderSelfCheck() {
    shell.classList.remove('home');
    toc.innerHTML = '';
    document.title = 'Self-check · GovernanceLite';
    view.innerHTML = '<div class="doc"><p class="loading">Loading the practices…</p></div>';
    loadAllPractices().then(function () {
      var body = PRACTICES.map(function (p) {
        var tasks = practiceTasks[p.id];
        var cols = [1, 2, 3].map(function (L) {
          return '<div class="sc-col"><h6>Level ' + L + ' · ' + LEVEL_NAMES[L] + '</h6>' + tasks.filter(function (t) { return t.level === L; }).map(function (t) {
            return '<label' + (checks[t.key] ? ' class="done"' : '') + '><input type="checkbox" data-key="' + t.key + '"' + (checks[t.key] ? ' checked' : '') + '><span>' + MD.render(t.text, { link: resolver('framework/practices/', p.id) }).html.replace(/^<p>|<\/p>$/g, '') + '</span></label>';
          }).join('') + '</div>';
        }).join('');
        return '<details class="sc-practice" data-p="' + p.id + '"><summary><span class="n">' + p.gl + '</span><b>' + p.title + '</b><span data-badge></span><span class="cnt" data-cnt></span></summary><div class="sc-body">' + cols + '</div></details>';
      }).join('');
      view.innerHTML = '<article class="doc" style="max-width:1080px">' + crumbs('self-check', 'Self-check') +
        '<div class="md"><h1>Self-check</h1><p>Tick what your team does <strong>today</strong>, not what\'s planned. A practice reaches a level when every item at that level and below is done. Your answers are saved only in this browser. Nothing is sent anywhere.</p></div>' +
        '<div class="sc-summary"><div class="sc-profile" data-profile></div><div class="sc-side"><div><div class="big" data-total>0%</div><div class="muted" style="font-size:14px">of all items done</div></div><code data-profile-str></code>' +
        '<div style="display:flex;gap:8px;flex-wrap:wrap"><button type="button" class="btn sm primary" data-export-copy><svg class="ico"><use href="#i-copy"/></svg>Copy as Markdown</button><button type="button" class="btn sm" data-export-dl><svg class="ico"><use href="#i-download"/></svg>Download .md</button><button type="button" class="btn sm ghost" data-reset>Reset</button></div>' +
        '<p class="muted" style="font-size:13px;margin:0">Paste the export into your <a href="#/practices/10-monthly-review">monthly review</a> minutes each quarter.</p></div></div>' +
        body + '</article>';
      paintSelfCheck();
      if (!view.dataset.scWired) { view.addEventListener('change', onScChange); view.dataset.scWired = '1'; }
      $('[data-export-copy]', view).addEventListener('click', function () { copy(exportMd(), 'Self-check copied as Markdown'); });
      $('[data-export-dl]', view).addEventListener('click', function () { download('governancelite-self-check-' + today() + '.md', exportMd()); });
      $('[data-reset]', view).addEventListener('click', function () {
        if (!window.confirm('Clear all self-check answers in this browser?')) return;
        Object.keys(checks).forEach(function (k) { if (k.indexOf('practices/') === 0) delete checks[k]; });
        saveChecks(); renderSelfCheck();
      });
      var lowest = PRACTICES.reduce(function (a, p) { return levelOf(practiceTasks[p.id]) < levelOf(practiceTasks[a.id]) ? p : a; }, PRACTICES[0]);
      var d = $('details[data-p="' + lowest.id + '"]', view); if (d) d.open = true;
      window.scrollTo(0, 0);
    }).catch(function (e) { view.innerHTML = '<div class="doc"><div class="err">Couldn\'t load the practices: ' + MD.esc(String(e.message || e)) + '</div></div>'; });
  }
  function onScChange(e) {
    var cb = e.target; if (!cb.dataset || !cb.dataset.key) return;
    if (cb.checked) checks[cb.dataset.key] = 1; else delete checks[cb.dataset.key];
    cb.closest('label').classList.toggle('done', cb.checked);
    saveChecks(); paintSelfCheck();
  }
  function paintSelfCheck() {
    var all = 0, done = 0, prof = [];
    $('[data-profile]', view).innerHTML = '<h5 class="mono muted" style="margin:0 0 8px;font-size:12px;letter-spacing:.08em">YOUR PROFILE</h5>' + PRACTICES.map(function (p) {
      var tasks = practiceTasks[p.id], lv = levelOf(tasks);
      prof.push(p.gl + ':' + lv);
      var cells = [1, 2, 3].map(function (L) {
        var at = tasks.filter(function (t) { return t.level === L; }), d = at.filter(function (t) { return checks[t.key]; }).length;
        all += at.length; done += d;
        return '<i title="Level ' + L + ': ' + d + '/' + at.length + '"><b style="width:' + (at.length ? d / at.length * 100 : 0) + '%"></b></i>';
      }).join('');
      var det = $('details[data-p="' + p.id + '"]', view);
      if (det) {
        $('[data-badge]', det).innerHTML = levelBadge(lv);
        var lt = tasks.filter(function (t) { return t.level; });
        $('[data-cnt]', det).textContent = lt.filter(function (t) { return checks[t.key]; }).length + ' / ' + lt.length;
      }
      return '<div class="sc-row"><a href="#/' + p.id + '"><span class="gl">' + p.gl + '</span>' + p.title + '</a><div class="sc-steps">' + cells + '</div>' + levelBadge(lv) + '</div>';
    }).join('');
    $('[data-total]', view).textContent = Math.round(all ? done / all * 100 : 0) + '%';
    $('[data-profile-str]', view).textContent = prof.join(' ');
    buildSide('self-check');
  }
  function today() { var d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function exportMd() {
    var out = ['# GovernanceLite self-check · ' + today(), '', '| Practice | Level | Level 1 | Level 2 | Level 3 |', '| --- | --- | --- | --- | --- |'];
    var prof = [];
    PRACTICES.forEach(function (p) {
      var t = practiceTasks[p.id], lv = levelOf(t);
      prof.push(p.gl + ':' + lv);
      var c = [1, 2, 3].map(function (L) { var at = t.filter(function (x) { return x.level === L; }); return at.filter(function (x) { return checks[x.key]; }).length + '/' + at.length; });
      out.push('| ' + p.gl + ' ' + p.title + ' | ' + lv + ' · ' + LEVEL_NAMES[lv] + ' | ' + c.join(' | ') + ' |');
    });
    out.push('', 'Profile: `' + prof.join(' ') + '`', '', '## Next steps', '');
    PRACTICES.forEach(function (p) {
      var t = practiceTasks[p.id], lv = levelOf(t);
      if (lv >= 3) return;
      var todo = t.filter(function (x) { return x.level === lv + 1 && !checks[x.key]; });
      if (!todo.length) return;
      out.push('### ' + p.gl + ' ' + p.title + ' → Level ' + (lv + 1) + ' (' + LEVEL_NAMES[lv + 1] + ')', '');
      todo.forEach(function (x) { out.push('- [ ] ' + x.text.replace(/\]\((\.\.\/|\.\/)?[^)]*\)/g, ']')); });
      out.push('');
    });
    out.push('_Generated with the GovernanceLite self-check: https://samfernandoau.github.io/GovernanceLite/#/self-check_');
    return out.join('\n');
  }

  /* ---------- router */
  var current = null;
  function parse() {
    var h = location.hash.replace(/^#\/?/, ''), q = h.indexOf('?'), route = q > -1 ? h.slice(0, q) : h, anchor = null;
    if (q > -1) { var m = /(?:^|&)h=([^&]+)/.exec(h.slice(q + 1)); if (m) anchor = decodeURIComponent(m[1]); }
    return { route: route.replace(/\/$/, ''), anchor: anchor };
  }
  function route() {
    var r = parse();
    document.body.classList.remove('nav-open');
    if (r.route === current && r.anchor) { scrollToId(r.anchor); return; }
    current = r.route;
    setTopNav(r.route);
    buildSide(r.route);
    if (!r.route) return renderHome();
    if (r.route === 'self-check') return renderSelfCheck();
    if (r.route === 'practices') { location.replace('#/overview?h=the-ten-practices'); return; }
    renderDoc(r.route, r.anchor);
  }
  window.addEventListener('hashchange', route);
  document.addEventListener('click', function (e) {
    var s = e.target.closest('[data-scroll]');
    if (s) { e.preventDefault(); scrollToId(s.dataset.scroll); return; }
    if (e.target.closest('[data-menu]')) document.body.classList.toggle('nav-open');
  });
  // load practice levels for the sidebar, then route
  loadAllPractices().then(function () { buildSide(current || ''); }).catch(function () { /* sidebar works without levels */ });
  route();
})();
