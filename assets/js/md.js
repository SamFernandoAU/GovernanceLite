/* A small, dependency-free Markdown renderer for the GovernanceLite docs.
   Supports: headings (GitHub-style ids), paragraphs, emphasis, inline code, links,
   ordered/unordered lists, task lists, GFM tables, fenced code, blockquotes, rules.
   All text is HTML-escaped; raw HTML in the source is not rendered. */
(function () {
  'use strict';

  function esc(s) {
    return s.replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; });
  }

  // GitHub-compatible heading slug
  function slug(text) {
    return text.toLowerCase().trim()
      .replace(/<[^>]+>/g, '')
      .replace(/[^\p{L}\p{N}\s_-]/gu, '')
      .replace(/\s/g, '-');
  }

  function inline(src, opt) {
    var store = [];
    function keep(html) { store.push(html); return '\u0000' + (store.length - 1) + '\u0000'; }
    var s = src;
    // code spans first (raw)
    s = s.replace(/`([^`]+)`/g, function (_, c) { return keep('<code>' + esc(c) + '</code>'); });
    // links [text](href)
    s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, function (_, t, h) {
      var r = opt.link ? opt.link(h) : { href: h };
      var attrs = ' href="' + esc(r.href) + '"';
      if (r.external) attrs += ' target="_blank" rel="noopener"';
      if (r.anchor) attrs += ' data-anchor="' + esc(r.anchor) + '"';
      return keep('<a' + attrs + '>' + emph(esc(t)) + (r.external ? ' <span aria-hidden="true">↗</span>' : '') + '</a>');
    });
    s = emph(esc(s));
    return s.replace(/\u0000(\d+)\u0000/g, function (_, i) { return store[+i]; });
  }

  function emph(s) {
    return s
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/(^|[^*\w])\*([^*\s][^*]*?)\*(?!\*)/g, '$1<em>$2</em>')
      .replace(/(^|[\s(])_([^_\s][^_]*?)_(?=[\s.,;:)!?]|$)/g, '$1<em>$2</em>');
  }

  var DOC_START = '\u0000doc:start', DOC_END = '\u0000doc:end';

  var RE = {
    fence: /^```\s*([\w+-]*)\s*$/,
    heading: /^(#{1,6})\s+(.*?)\s*#*\s*$/,
    hr: /^ {0,3}([-*_])(\s*\1){2,}\s*$/,
    list: /^(\s*)([-*+]|\d+[.)])\s+(.*)$/,
    quote: /^\s*>\s?(.*)$/,
    tableSep: /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/
  };

  function splitRow(line) {
    var l = line.trim().replace(/^\|/, '').replace(/\|$/, '');
    var cells = [], cur = '', inCode = false;
    for (var i = 0; i < l.length; i++) {
      var ch = l[i];
      if (ch === '`') inCode = !inCode;
      if (ch === '\\' && l[i + 1] === '|') { cur += '|'; i++; continue; }
      if (ch === '|' && !inCode) { cells.push(cur.trim()); cur = ''; continue; }
      cur += ch;
    }
    cells.push(cur.trim());
    return cells;
  }

  function blocks(lines, opt) {
    var out = [], i = 0;
    while (i < lines.length) {
      var line = lines[i];
      if (!line.trim()) { i++; continue; }
      var m;

      if (line === DOC_START) {
        var inner = [];
        i++;
        while (i < lines.length && lines[i] !== DOC_END) { inner.push(lines[i]); i++; }
        i++;
        // headings inside a sheet stay out of the page's table of contents
        var sub = { link: opt.link, headings: [] };
        var body = blocks(inner, sub).replace(/\[([^\[\]<>]{1,80})\](?!\()/g, '<span class="blank">$1</span>');
        out.push('<section class="sheet" data-src="' + esc(inner.join('\n').trim()) + '">' + body + '</section>');
        continue;
      }

      if ((m = RE.fence.exec(line))) {
        var lang = m[1], code = [];
        i++;
        while (i < lines.length && !/^```\s*$/.test(lines[i])) { code.push(lines[i]); i++; }
        i++;
        out.push('<pre data-lang="' + esc(lang) + '"><code>' + esc(code.join('\n')) + '</code></pre>');
        continue;
      }
      if ((m = RE.heading.exec(line))) {
        var lvl = m[1].length, txt = m[2], id = slug(txt.replace(/`/g, ''));
        opt.headings.push({ level: lvl, text: txt.replace(/[`*_]/g, ''), id: id });
        out.push('<h' + lvl + ' id="' + esc(id) + '">' + inline(txt, opt) + '</h' + lvl + '>');
        i++; continue;
      }
      if (RE.hr.test(line)) { out.push('<hr>'); i++; continue; }
      if (RE.quote.test(line)) {
        var q = [];
        while (i < lines.length && lines[i].trim() && RE.quote.test(lines[i])) { q.push(RE.quote.exec(lines[i])[1]); i++; }
        out.push('<blockquote>' + blocks(q, opt) + '</blockquote>');
        continue;
      }
      if (line.indexOf('|') > -1 && i + 1 < lines.length && RE.tableSep.test(lines[i + 1])) {
        var head = splitRow(line), rows = [];
        i += 2;
        while (i < lines.length && lines[i].trim() && lines[i].indexOf('|') > -1) { rows.push(splitRow(lines[i])); i++; }
        out.push('<div class="table-wrap"><table><thead><tr>' + head.map(function (h) { return '<th>' + inline(h, opt) + '</th>'; }).join('') +
          '</tr></thead><tbody>' + rows.map(function (r) {
            return '<tr>' + head.map(function (_, k) { return '<td>' + inline(r[k] || '', opt) + '</td>'; }).join('') + '</tr>';
          }).join('') + '</tbody></table></div>');
        continue;
      }
      if ((m = RE.list.exec(line))) {
        var base = m[1].length, ordered = /\d/.test(m[2]), items = [], cur = null;
        while (i < lines.length) {
          var l = lines[i], lm = RE.list.exec(l);
          if (lm && lm[1].length === base) { cur = [lm[3]]; items.push(cur); i++; continue; }
          if (!l.trim()) {
            // blank line: continue the list only if the next line is indented content or another item
            var nx = lines[i + 1];
            if (nx !== undefined && (/^\s{2,}\S/.test(nx) || (RE.list.exec(nx) && RE.list.exec(nx)[1].length === base))) { if (cur) cur.push(''); i++; continue; }
            break;
          }
          if (/^\s+\S/.test(l) && cur) { cur.push(l.replace(new RegExp('^\\s{0,' + (base + 4) + '}'), '')); i++; continue; }
          break;
        }
        var isTasks = items.every(function (it) { return /^\[[ xX]\]\s/.test(it[0]); });
        var tag = ordered ? 'ol' : 'ul';
        out.push('<' + tag + (isTasks ? ' class="tasks"' : '') + '>' + items.map(function (it) {
          var first = it[0], rest = it.slice(1), task = /^\[([ xX])\]\s+(.*)$/.exec(first);
          var restHtml = rest.join('\n').trim() ? blocks(rest, opt) : '';
          if (task) {
            return '<li class="task"><input type="checkbox"' + (task[1] !== ' ' ? ' checked' : '') + ' aria-label="' + esc(task[2].replace(/[`*_]/g, '')) + '"><span>' + inline(task[2], opt) + restHtml + '</span></li>';
          }
          return '<li>' + inline(first, opt) + restHtml + '</li>';
        }).join('') + '</' + tag + '>');
        continue;
      }
      // paragraph
      var p = [];
      while (i < lines.length && lines[i].trim() && !RE.fence.test(lines[i]) && !RE.heading.test(lines[i]) && !RE.quote.test(lines[i]) &&
        !RE.list.test(lines[i]) && !RE.hr.test(lines[i]) && !(lines[i].indexOf('|') > -1 && RE.tableSep.test(lines[i + 1] || ''))) {
        p.push(lines[i].trim()); i++;
      }
      out.push('<p>' + inline(p.join(' '), opt) + '</p>');
    }
    return out.join('\n');
  }

  window.MD = {
    render: function (src, opt) {
      opt = opt || {};
      opt.headings = [];
      src = src.replace(/\r\n?/g, '\n')
        .replace(/^<!--\s*doc:start\s*-->\s*$/gm, DOC_START).replace(/^<!--\s*doc:end\s*-->\s*$/gm, DOC_END)
        .replace(/<!--[\s\S]*?-->/g, '');
      var html = blocks(src.split('\n'), opt);
      return { html: html, headings: opt.headings };
    },
    slug: slug,
    esc: esc
  };
})();
