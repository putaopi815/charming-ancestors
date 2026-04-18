/* ================================================================
   迷人的老祖宗 · app.js
   Phase 1: 基础设施（i18n + store + router + theme + lang + toast）+ 首页
   Phase 2: 答题 + 结算（将追加）
   Phase 3: 知识卡 + 错题 + 徽章（将追加）
   零依赖，ES5 兼容（为 file:// 打开最大兼容）
   ================================================================ */

(function () {
  'use strict';

  /* ==============================================================
     0. 常量 & 工具
     ============================================================== */

  var LS_KEY = 'charming-ancestors-progress-v1';
  var LS_VERSION = 1;

  var DYNASTY_ORDER = ['xia', 'shang', 'zhou', 'qin', 'han', 'sanguo', 'suitang', 'song', 'yuan', 'mingqing'];

  // 简单 $ / $$
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  // HTML escape（所有用户生成内容都走）
  function esc(s) {
    if (s == null) return '';
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ==============================================================
     1. i18n runtime
     ============================================================== */

  var LOCALE = {}; // { zh: {...}, en: {...} }
  var currentLang = document.documentElement.getAttribute('lang') || 'zh';

  function loadLocales() {
    ['zh', 'en'].forEach(function (l) {
      var el = document.getElementById('locale-' + l);
      if (!el) {
        console.warn('[i18n] locale-' + l + ' script tag missing');
        LOCALE[l] = {};
        return;
      }
      try {
        LOCALE[l] = JSON.parse(el.textContent || '{}');
      } catch (e) {
        console.error('[i18n] locale-' + l + ' parse fail', e);
        LOCALE[l] = {};
      }
    });
  }

  var ICONS = {
    'arrow-left':   '<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>',
    'arrow-right':  '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    'sun':          '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
    'moon':         '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
    'monitor':      '<rect width="20" height="14" x="2" y="3" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/>',
    'globe':        '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
    'layers':       '<path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m6.08 9.5-3.5 1.6a1 1 0 0 0 0 1.81l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9a1 1 0 0 0 0-1.83l-3.5-1.59"/><path d="m6.08 14.5-3.5 1.6a1 1 0 0 0 0 1.81l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9a1 1 0 0 0 0-1.83l-3.5-1.59"/>',
    'star':         '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
    'check-circle': '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/>',
    'play':         '<polygon points="6 3 20 12 6 21 6 3"/>',
    'lock':         '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    'eye':          '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
    'check':        '<path d="M20 6 9 17l-5-5"/>',
    'circle-x':     '<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>',
    'sprout':       '<path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/><path d="M14.1 6a7 7 0 0 1 3.9 7H14c.1-2.4-.4-4.2-1.2-5.5A5.5 5.5 0 0 1 14.1 6z"/>',
    'ellipsis':     '<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>',
    'landmark':     '<line x1="3" x2="21" y1="22" y2="22"/><line x1="6" x2="6" y1="22" y2="11"/><line x1="10" x2="10" y1="22" y2="11"/><line x1="14" x2="14" y1="22" y2="11"/><line x1="18" x2="18" y1="22" y2="11"/><polyline points="3 11 12 2 21 11"/>'
  };
  function iconSvg(name, filled) {
    var p = ICONS[name]; if (!p) return '';
    return '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"' +
      ' fill="' + (filled ? 'currentColor' : 'none') + '" stroke="currentColor" stroke-width="1.75"' +
      ' stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + '</svg>';
  }

  function getByPath(obj, path) {
    var parts = path.split('.');
    var cur = obj;
    for (var i = 0; i < parts.length; i++) {
      if (cur == null) return undefined;
      cur = cur[parts[i]];
    }
    return cur;
  }

  /**
   * t(key, vars?) — 取文案
   * 支持 {var} 替换 + ICU 复数 {count, plural, one {x} other {y}}
   * Missing key fallback: 尝试主语言 → 英语 → 返回 key 本身 + console.warn
   */
  function t(key, vars) {
    var val = getByPath(LOCALE[currentLang], key);
    if (val == null) {
      val = getByPath(LOCALE.en, key);
      if (val == null) val = getByPath(LOCALE.zh, key);
      if (val == null) {
        console.warn('[i18n] missing key:', key);
        return key;
      }
    }
    if (typeof val !== 'string') return val; // 对象原样返回
    return interp(val, vars || {});
  }

  function interp(str, vars) {
    // ICU plural
    str = str.replace(/\{(\w+), plural, ([^}]+(?:\{[^}]*\}[^}]*)*)\}/g, function (_, name, cases) {
      var n = vars[name];
      var catg = pluralCategory(n, currentLang);
      var m = cases.match(new RegExp('(?:^|\\s)' + catg + '\\s*\\{([^}]*)\\}'));
      if (!m) m = cases.match(/(?:^|\s)other\s*\{([^}]*)\}/);
      if (!m) return String(n);
      return m[1].replace(/#/g, String(n));
    });
    // 简单 {var}
    str = str.replace(/\{(\w+)\}/g, function (_, name) {
      return vars[name] != null ? String(vars[name]) : '{' + name + '}';
    });
    return str;
  }

  function pluralCategory(n, lang) {
    if (lang === 'zh') return 'other'; // 中文无复数
    // 英语简单版
    if (n === 1) return 'one';
    return 'other';
  }

  /* ==============================================================
     2. localStorage Store
     ============================================================== */

  function freshState() {
    return {
      version: LS_VERSION,
      lang: null,      // 未设置 = 跟随 navigator
      theme: 'system', // 默认 system
      progress: {},    // { [dynId]: { completed, bestScore, attempts, perfectBadge } }
      unlockedCards: [],
      wrongQuestions: [],
      currentSession: null,
      unreadCards: 0   // 有解锁但未查看的卡片数量（顶栏红点用）
    };
  }

  var memState = null; // 内存态（fallback）
  var storageAvailable = true;

  function readState() {
    if (memState) return memState;
    if (!storageAvailable) return memState = freshState();
    try {
      var raw = localStorage.getItem(LS_KEY);
      if (!raw) return memState = freshState();
      var parsed = JSON.parse(raw);
      if (!parsed || parsed.version !== LS_VERSION) {
        // 版本不匹配：目前只有 v1，未来再做 migrate
        memState = freshState();
        writeState(memState);
        showToast(t('error.storage_reset'));
        return memState;
      }
      // 合并默认字段
      var fresh = freshState();
      for (var k in fresh) {
        if (!(k in parsed)) parsed[k] = fresh[k];
      }
      memState = parsed;
      return memState;
    } catch (e) {
      console.warn('[store] read fail', e);
      memState = freshState();
      return memState;
    }
  }

  function writeState(state) {
    memState = state;
    if (!storageAvailable) return;
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('[store] write fail', e);
      storageAvailable = false;
      showToast(t('error.storage_full'));
    }
  }

  function updateState(patch) {
    var s = readState();
    for (var k in patch) s[k] = patch[k];
    writeState(s);
  }

  // 探测 localStorage 可用性
  (function probeStorage() {
    try {
      var k = '__probe_' + Date.now();
      localStorage.setItem(k, '1');
      localStorage.removeItem(k);
    } catch (e) {
      storageAvailable = false;
      console.warn('[store] localStorage not available, using in-memory only');
    }
  })();

  /* ==============================================================
     3. 朝代状态解析（来自 state-machine.md §2）
     ============================================================== */

  function getDynastyState(dynId, state) {
    state = state || readState();
    var idx = DYNASTY_ORDER.indexOf(dynId);
    if (idx < 0) return 'locked';

    var prog = state.progress[dynId];
    var sess = state.currentSession;

    // 第 1 关默认 unlocked
    var prevCleared = idx === 0 ? true : !!(state.progress[DYNASTY_ORDER[idx - 1]] && state.progress[DYNASTY_ORDER[idx - 1]].completed);
    if (!prevCleared) return 'locked';

    if (sess && sess.dynastyId === dynId && (!prog || !prog.completed)) return 'active';
    if (prog && prog.perfectBadge) return 'perfect';
    if (prog && prog.completed) return 'cleared';
    return 'unlocked';
  }

  function getLastVisitedDynasty(state) {
    // 找最近通关或最近进行的朝代；fallback 第一关
    state = state || readState();
    if (state.currentSession) return state.currentSession.dynastyId;
    // 最高 index 的 completed 朝代
    for (var i = DYNASTY_ORDER.length - 1; i >= 0; i--) {
      var d = DYNASTY_ORDER[i];
      if (state.progress[d] && state.progress[d].completed) return d;
    }
    return null;
  }

  function getProgressSummary(state) {
    state = state || readState();
    var cleared = 0, perfect = 0;
    DYNASTY_ORDER.forEach(function (d) {
      var p = state.progress[d];
      if (p && p.completed) cleared++;
      if (p && p.perfectBadge) perfect++;
    });
    return { cleared: cleared, perfect: perfect };
  }

  /* ==============================================================
     4. Router（hashchange）
     ============================================================== */

  var currentRoute = { name: 'home', params: {} };
  var prevRoute = null;

  function parseHash() {
    var h = (window.location.hash || '').replace(/^#/, '');
    if (!h || h === '/' || h === '/home') return { name: 'home', params: {} };
    var parts = h.split('/').filter(Boolean);
    // 支持 /quiz/:dyn / /result/:dyn / /card/:id / /cards / /wrong / /wrong/:dyn
    if (parts[0] === 'quiz' && parts[1]) return { name: 'quiz', params: { dynasty: parts[1] } };
    if (parts[0] === 'result' && parts[1]) return { name: 'result', params: { dynasty: parts[1] } };
    if (parts[0] === 'card' && parts[1]) return { name: 'card', params: { card: parts[1] } };
    if (parts[0] === 'cards') return { name: 'cards', params: {} };
    if (parts[0] === 'wrong') return { name: 'wrong', params: { dynasty: parts[1] || null } };
    return { name: 'home', params: {} };
  }

  function navigate(path) {
    if (window.location.hash === '#' + path) {
      // 同路径强制重渲染
      render();
    } else {
      window.location.hash = '#' + path;
    }
  }

  function render() {
    prevRoute = currentRoute;
    currentRoute = parseHash();
    var app = $('#app');
    // 关闭任何 open 的 dialog
    closeAllDialogs();
    // 清除残留的 card-detail 浮层（独立于 dialog 体系）
    $$('.card-detail-backdrop').forEach(function (el) {
      if (el.parentNode) el.parentNode.removeChild(el);
    });
    document.body.style.overflow = '';

    switch (currentRoute.name) {
      case 'home':
        renderHome(app);
        break;
      case 'quiz':
        renderQuiz(app, currentRoute.params.dynasty);
        break;
      case 'result':
        renderResult(app, currentRoute.params.dynasty);
        break;
      case 'cards':
        renderCards(app);
        break;
      case 'card':
        renderCardDetail(app, currentRoute.params.card);
        break;
      case 'wrong':
        renderWrong(app, currentRoute.params.dynasty);
        break;
      default:
        renderHome(app);
    }

    // 滚到顶（路由切换默认行为）
    window.scrollTo(0, 0);
  }

  window.addEventListener('hashchange', render);

  /* ==============================================================
     5. Theme (light/dark/system, FW12/14)
     ============================================================== */

  var systemMql = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');

  function getThemePref() {
    var s = readState();
    return s.theme || 'system';
  }

  function applyTheme() {
    var pref = getThemePref();
    var applied;
    if (pref === 'light' || pref === 'dark') {
      applied = pref;
    } else {
      applied = (systemMql && systemMql.matches) ? 'dark' : 'light';
    }
    document.documentElement.setAttribute('data-theme', applied);
    document.documentElement.setAttribute('data-theme-pref', pref);
  }

  function setTheme(pref) {
    updateState({ theme: pref });
    applyTheme();
    // 刷新顶栏 aria-pressed
    updateThemeButtons();
  }

  function cycleTheme() {
    var cur = getThemePref();
    var next = cur === 'light' ? 'dark' : (cur === 'dark' ? 'system' : 'light');
    setTheme(next);
    // 播报
    showToast(t('nav.theme_' + next));
  }

  function updateThemeButtons() {
    var cur = getThemePref();
    $$('.tool-btn--theme').forEach(function (btn) {
      btn.setAttribute('aria-pressed', cur !== 'system' ? 'true' : 'false');
      var icon = $('.tool-btn__icon', btn);
      if (icon) icon.innerHTML = cur === 'dark' ? iconSvg('moon') : (cur === 'light' ? iconSvg('sun') : iconSvg('monitor'));
      var short = $('.tool-btn__label--short', btn);
      if (short) short.textContent = t('nav.theme_switch_label_short');
      var full = $('.tool-btn__label--full', btn);
      if (full) full.textContent = t('nav.theme_' + cur);
      btn.setAttribute('aria-label', t('nav.theme_switch_label') + ' · ' + t('nav.theme_' + cur));
    });
  }

  if (systemMql && systemMql.addEventListener) {
    systemMql.addEventListener('change', function () {
      if (getThemePref() === 'system') applyTheme();
    });
  }

  /* ==============================================================
     6. Language
     ============================================================== */

  function setLang(lang) {
    if (lang !== 'zh' && lang !== 'en') return;
    currentLang = lang;
    updateState({ lang: lang });
    document.documentElement.setAttribute('lang', lang);
    render();
    applyTranslations();  // FIX-P3-09 修复 2026-04-17：#app 外的 data-i18n 节点（Skip Link 等）切语言
    showToast(t('nav.lang_switch_label') + ' · ' + (lang === 'zh' ? t('nav.lang_zh') : t('nav.lang_en')));
  }

  function toggleLang() {
    setLang(currentLang === 'zh' ? 'en' : 'zh');
  }

  /**
   * 扫描全 DOM 的 [data-i18n] 节点并按 currentLang 覆盖 textContent。
   * 目的：覆盖 #app 外的静态节点（Skip Link 等），#app 内节点通过 render() 重绘即可。
   * 约束 I9：data-i18n 目标 MUST 为纯文本节点（不含 <br>/<em>/<span> 子节点）。
   * FIX-P3-09 · 2026-04-17
   */
  function applyTranslations() {
    var nodes = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < nodes.length; i++) {
      var key = nodes[i].getAttribute('data-i18n');
      if (!key) continue;
      var val = t(key);
      // t() 未命中会回退 zh 或返回 key 字符串本身；只在有实际值时覆盖
      if (val && val !== key) nodes[i].textContent = val;
    }
  }

  /* ==============================================================
     7. Toast
     ============================================================== */

  var toastTimer = null;
  function showToast(msg, duration) {
    var el = $('#toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('is-visible');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      el.classList.remove('is-visible');
    }, duration || 2400);
  }

  /* ==============================================================
     8. Dialog 基础（MidQuizPrompt / ExitConfirm / ReplayConfirm）
     ============================================================== */

  var openDialogs = [];

  function openDialog(config) {
    // config: { title, body, actions: [{ label, variant?, onClick, autofocus? }], onDismiss? }
    // 互斥：同屏只允许一个 dialog（除非 allowStack）· spec §5 P0-07
    if (openDialogs.length && !(config && config.allowStack)) {
      closeAllDialogs();
    }
    // spec §4.2 强制排序：ghost → outline/secondary → primary → danger
    if (config && config.actions && config.actions.length) {
      var _vOrder = { ghost: 0, outline: 1, secondary: 1, primary: 2, danger: 3 };
      config.actions = config.actions.slice().sort(function (a, b) {
        return (_vOrder[a.variant || 'primary'] || 2) - (_vOrder[b.variant || 'primary'] || 2);
      });
    }
    var backdrop = document.createElement('div');
    backdrop.className = 'dialog-backdrop';
    backdrop.setAttribute('data-dialog-root', '1');

    var sheet = document.createElement('div');
    sheet.className = 'dialog-sheet';
    sheet.setAttribute('role', config.role || 'dialog');
    sheet.setAttribute('aria-modal', 'true');
    var titleId = 'dlg-title-' + Date.now();
    var bodyId = 'dlg-body-' + Date.now();
    sheet.setAttribute('aria-labelledby', titleId);
    if (config.body) sheet.setAttribute('aria-describedby', bodyId);

    var html = '';
    html += '<h2 class="dialog__title" id="' + titleId + '">' + esc(config.title) + '</h2>';
    if (config.body) html += '<p class="dialog__body" id="' + bodyId + '">' + esc(config.body) + '</p>';
    html += '<div class="dialog__actions">';
    (config.actions || []).forEach(function (act, i) {
      var variant = act.variant || 'primary';
      html += '<button type="button" class="btn btn--' + variant + '" data-action="' + i + '"' + (act.autofocus ? ' data-autofocus="1"' : '') + '>' + esc(act.label) + '</button>';
    });
    html += '</div>';
    sheet.innerHTML = html;
    backdrop.appendChild(sheet);
    document.body.appendChild(backdrop);

    // actions
    $$('button[data-action]', sheet).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var idx = +btn.getAttribute('data-action');
        var act = config.actions[idx];
        closeDialog(backdrop);
        if (act && act.onClick) act.onClick();
      });
    });

    // dismiss by backdrop (if not alertdialog)
    backdrop.addEventListener('click', function (e) {
      if (e.target === backdrop && config.role !== 'alertdialog') {
        closeDialog(backdrop);
        if (config.onDismiss) config.onDismiss();
      }
    });

    // ESC
    function onKey(e) {
      if (e.key === 'Escape') {
        closeDialog(backdrop);
        if (config.onDismiss) config.onDismiss();
      } else if (e.key === 'Tab') {
        // 基本焦点陷阱
        var focusables = $$('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])', sheet);
        if (!focusables.length) return;
        var first = focusables[0], last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }
    document.addEventListener('keydown', onKey);
    backdrop._onKey = onKey;

    // autofocus
    setTimeout(function () {
      var af = $('[data-autofocus]', sheet) || $('button', sheet);
      if (af) af.focus();
    }, 0);

    openDialogs.push(backdrop);
    // prevent body scroll
    document.body.style.overflow = 'hidden';
    return backdrop;
  }

  function closeDialog(el) {
    if (!el || !el.parentNode) return;
    document.removeEventListener('keydown', el._onKey);
    el.parentNode.removeChild(el);
    var idx = openDialogs.indexOf(el);
    if (idx >= 0) openDialogs.splice(idx, 1);
    if (!openDialogs.length) document.body.style.overflow = '';
  }

  function closeAllDialogs() {
    openDialogs.slice().forEach(closeDialog);
  }

  /* ==============================================================
     9. Header 渲染（所有页面共用）
     ============================================================== */

  function renderHeader(variant) {
    // variant: 'home' | 'quiz' | 'page' | 'back'
    variant = variant || 'home';
    var state = readState();
    var hasUnread = state.unreadCards > 0;

    if (variant === 'quiz') {
      // 答题页顶栏：返回 + 朝代名 + 进度点（由 quiz 模块自己渲染 + 填充）
      return '' +
        '<header class="app-header app-header--quiz" role="banner">' +
          '<div class="app-header__inner">' +
            '<button type="button" class="back-btn" data-action="quiz-back" aria-label="' + esc(t('nav.back')) + '">' +
              '<span aria-hidden="true">' + iconSvg('arrow-left') + '</span>' +
            '</button>' +
            '<h1 class="quiz-header__dynasty" id="quiz-header-dynasty" style="font-family:var(--font-display);font-weight:600;font-size:22px;line-height:1.2;"></h1>' +
            '<div class="quiz-header__progress" id="quiz-header-progress" aria-live="polite"></div>' +
          '</div>' +
        '</header>';
    }

    if (variant === 'back') {
      return '' +
        '<header class="app-header" role="banner">' +
          '<div class="app-header__inner">' +
            '<button type="button" class="back-btn" data-action="page-back" aria-label="' + esc(t('nav.back')) + '">' +
              '<span aria-hidden="true">' + iconSvg('arrow-left') + '</span>' +
            '</button>' +
            '<h1 style="font-family:var(--font-display);font-weight:600;font-size:20px;line-height:1.2;margin-inline-start:var(--space-3);" id="page-title"></h1>' +
          '</div>' +
        '</header>';
    }

    // home / page（含完整工具按钮）
    var logoHtml = '' +
      '<a href="#/home" class="logo-group" aria-label="' + esc(t('brand.name')) + '" data-action="logo">' +
        '<!-- ASSET_MISSING: brand-logo-svg · 占位"祖"+青瓷方块，参见 ASSET-LIST #001 -->' +
        '<span class="logo-mark" aria-hidden="true">祖</span>' +
        '<span class="logo-text desktop-up">' + esc(t('brand.name')) + '</span>' +
        '<span class="logo-text tablet-up mobile-only-hidden-on-desktop" aria-hidden="true"></span>' +
      '</a>';

    // Tablet 简写 + Desktop 完整（复用 .tablet-up / .desktop-up 工具类）
    // 改写：用 mobile-only / tablet-only / desktop-up 更清晰
    logoHtml = '' +
      '<a href="#/home" class="logo-group" aria-label="' + esc(t('brand.name')) + '" data-action="logo">' +
        '<!-- ASSET_MISSING: brand-logo-svg · 占位"祖"+青瓷方块，参见 ASSET-LIST #001 -->' +
        '<span class="logo-mark" aria-hidden="true">祖</span>' +
        '<span class="logo-text logo-text--short">' + esc(t('brand.name_short')) + '</span>' +
        '<span class="logo-text logo-text--full">' + esc(t('brand.name')) + '</span>' +
      '</a>';

    var themePref = getThemePref();
    var themeIcon = themePref === 'dark' ? iconSvg('moon') : (themePref === 'light' ? iconSvg('sun') : iconSvg('monitor'));
    var themeLabel = t('nav.theme_' + themePref);

    return '' +
      '<header class="app-header" role="banner">' +
        '<div class="app-header__inner">' +
          logoHtml +
          '<div class="header-tools">' +
            // 语言
            '<button type="button" class="tool-btn tool-btn--lang" data-action="lang">' +
              '<span class="tool-btn__icon" aria-hidden="true">' + iconSvg('globe') + '</span>' +
              '<span class="tool-btn__label tool-btn__label--short">' + esc(t('nav.lang_switch_label_short')) + '</span>' +
              '<span class="tool-btn__label tool-btn__label--full">' + esc(currentLang === 'zh' ? t('nav.lang_zh') + ' / ' + t('nav.lang_en') : t('nav.lang_en') + ' / ' + t('nav.lang_zh')) + '</span>' +
            '</button>' +
            // 主题
            '<button type="button" class="tool-btn tool-btn--theme" data-action="theme" aria-pressed="' + (themePref !== 'system' ? 'true' : 'false') + '" ' +
              'aria-label="' + esc(t('nav.theme_switch_label') + ' · ' + themeLabel) + '">' +
              '<span class="tool-btn__icon" aria-hidden="true">' + themeIcon + '</span>' +
              '<span class="tool-btn__label tool-btn__label--short">' + esc(t('nav.theme_switch_label_short')) + '</span>' +
              '<span class="tool-btn__label tool-btn__label--full">' + esc(themeLabel) + '</span>' +
            '</button>' +
            // 卡册
            '<button type="button" class="tool-btn tool-btn--cards' + (hasUnread ? ' has-unread' : '') + '" data-action="cards" ' +
              'aria-label="' + esc(t('nav.cards')) + '">' +
              '<span class="tool-btn__icon" aria-hidden="true">' + iconSvg('layers') + '</span>' +
              '<span class="tool-btn__label tool-btn__label--short">' + esc(t('nav.cards')) + '</span>' +
              '<span class="tool-btn__label tool-btn__label--full">' + esc(t('nav.cards')) + '</span>' +
            '</button>' +
          '</div>' +
        '</div>' +
      '</header>';
  }

  function bindHeader(root) {
    $$('[data-action]', root).forEach(function (el) {
      var action = el.getAttribute('data-action');
      el.addEventListener('click', function (e) {
        if (action === 'logo') { e.preventDefault(); navigate('/home'); }
        else if (action === 'lang') { toggleLang(); }
        else if (action === 'theme') { cycleTheme(); }
        else if (action === 'cards') { navigate('/cards'); }
        else if (action === 'page-back') { navigate('/home'); }
      });
    });
  }

  /* ==============================================================
     10. 首页 · Home
     ============================================================== */

  function renderHome(app) {
    var state = readState();
    var summary = getProgressSummary(state);
    var firstVisit = summary.cleared === 0 && !state.currentSession;

    // 欢迎区文案
    var welcomeTitle, welcomeBody, welcomeBodyMobile;
    if (firstVisit) {
      welcomeTitle = t('home.welcome_first.title');
      welcomeBody = t('home.welcome_first.body');
      welcomeBodyMobile = t('home.welcome_first.body_mobile');
    } else {
      welcomeTitle = t('home.welcome_return.title');
      var last = getLastVisitedDynasty(state);
      var dynName = last ? t('dynasty.' + last + '.name') : '';
      welcomeBody = t('home.welcome_return.body', { dynasty: dynName });
      welcomeBodyMobile = t('home.welcome_return.body', { dynasty: dynName });
    }

    // progress_summary（非首访时插入副标）
    var progressLine = firstVisit ? '' : t('home.progress_summary', { cleared: summary.cleared, perfect: summary.perfect });

    var firstUnlockedIdx = -1;
    for (var _i = 0; _i < DYNASTY_ORDER.length; _i++) {
      var _st = getDynastyState(DYNASTY_ORDER[_i], state);
      if (_st === 'unlocked' || _st === 'active') { firstUnlockedIdx = _i; break; }
    }
    var dynastiesHtml = DYNASTY_ORDER.map(function (dynId, idx) {
      return renderDynastyCard(dynId, idx, state, idx === firstUnlockedIdx);
    }).join('');

    var wrongEntryHtml = state.wrongQuestions.length > 0 ? renderWrongEntry(state.wrongQuestions.length) : '';

    var cardsPreviewHtml = renderCardsPreview(state);

    var html = '' +
      renderHeader('home') +
      '<main id="main-content" class="main-home" aria-label="' + esc(t('nav.home')) + '">' +
        // Welcome · 2026-04-17 全屏 header/welcome 修复：.welcome 背景全宽，.welcome__inner 1200 居中
        '<section class="welcome" role="status" aria-live="polite">' +
          '<div class="welcome-landscape" aria-hidden="true">' +
            '<svg viewBox="0 0 375 90" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:90px;display:block;position:absolute;inset-block-end:0;inset-inline:0;pointer-events:none">' +
              '<path d="M0,90 L0,52 L8,28 L15,45 L22,10 L30,42 L38,15 L46,35 L55,5 L63,30 L70,15 L78,32 L86,18 L94,38 L102,22 L110,40 L120,12 L128,35 L136,20 L145,42 L153,25 L162,45 L170,30 L178,50 L186,35 L195,55 L204,38 L212,58 L220,42 L228,60 L236,45 L244,62 L252,48 L260,65 L268,50 L276,68 L285,52 L293,70 L302,55 L310,72 L320,58 L328,75 L337,60 L345,78 L354,62 L362,80 L375,65 L375,90 Z" fill="rgba(90,65,15,0.10)"/>' +
              '<path d="M0,90 L0,62 L12,42 L24,58 L38,35 L52,55 L66,28 L80,50 L95,32 L110,55 L125,38 L140,60 L155,42 L170,65 L185,48 L200,68 L215,52 L230,70 L245,55 L260,72 L275,58 L290,75 L305,60 L320,78 L335,62 L350,80 L365,68 L375,72 L375,90 Z" fill="rgba(70,48,10,0.14)"/>' +
            '</svg>' +
          '</div>' +
          '<div class="welcome__inner">' +
            '<h1 class="welcome__title">' + esc(welcomeTitle) + '</h1>' +
            // Mobile: body_mobile（首访）或 progress_summary（回访） — 简短
            // Tablet + Desktop: 完整 body +（回访时额外拼 progress_summary）
            (firstVisit
              ? '<p class="welcome__body welcome__body--mobile">' + esc(welcomeBodyMobile) + '</p>' +
                '<p class="welcome__body welcome__body--wide">' + esc(welcomeBody) + '</p>'
              : '<p class="welcome__body welcome__body--mobile">' + esc(welcomeBodyMobile) + '</p>' +
                '<p class="welcome__body welcome__body--wide">' + esc(welcomeBody) + '</p>'
            ) +
            (progressLine ? '<p class="welcome__progress">' + esc(progressLine) + '</p>' : '') +
          '</div>' +
        '</section>' +
        // Dynasty section
        '<section class="section-dynasties" aria-labelledby="section-dynasties-title">' +
          '<h2 class="section-title" id="section-dynasties-title">' + esc(t('home.section_dynasties')) + '</h2>' +
          '<div class="dynasty-grid" role="list">' + dynastiesHtml + '</div>' +
        '</section>' +
        // Wrong entry（条件）
        (wrongEntryHtml ? '<div class="wrong-entry-wrapper">' + wrongEntryHtml + '</div>' : '') +
        // Cards preview
        cardsPreviewHtml +
      '</main>' +
      '<footer class="app-footer">' + esc(t('brand.tagline')) + '</footer>';

    app.innerHTML = html;

    bindHeader(app);

    // Dynasty card click
    $$('.dynasty-card', app).forEach(function (card) {
      card.addEventListener('click', function () {
        var dynId = card.getAttribute('data-dynasty');
        var st = card.getAttribute('data-state');
        onDynastyClick(dynId, st);
      });
    });

    // Wrong entry click
    var we = $('.wrong-entry', app);
    if (we) {
      we.addEventListener('click', function () { navigate('/wrong'); });
    }

    // Cards preview click (打开卡册)
    $$('.card-thumb', app).forEach(function (thumb) {
      thumb.addEventListener('click', function () {
        var cid = thumb.getAttribute('data-card');
        if (thumb.classList.contains('card-thumb--locked')) {
          showToast(t('error.card_locked'));
        } else if (thumb.classList.contains('card-thumb--more')) {
          navigate('/cards');
        } else if (cid) {
          navigate('/card/' + cid);
        }
      });
    });

    // MidQuizPrompt：只在冷启动首次进 home 弹一次；切语言/路由跳转/返回首页不再弹
    if (state.currentSession && state.currentSession.dynastyId) {
      var midQuizShown = false;
      try { midQuizShown = sessionStorage.getItem('midQuizShownThisSession') === '1'; } catch (e) {}
      if (!midQuizShown) {
        try { sessionStorage.setItem('midQuizShownThisSession', '1'); } catch (e) {}
        setTimeout(function () { maybePromptMidQuiz(state); }, 600);
      }
    }
  }

  /**
   * 朝代卡渲染（Mobile 横向 row + Desktop 纵向 column，由 CSS 响应式切换）
   */
  function renderDynastyCard(dynId, idx, state, isRecommended) {
    var st = getDynastyState(dynId, state);
    var name = t('dynasty.' + dynId + '.name');
    var era = t('dynasty.' + dynId + '.era');
    var prog = state.progress[dynId] || { bestScore: 0, attempts: 0 };
    var sess = state.currentSession;

    // icon & badge
    var iconChar, badgeText;
    if (st === 'perfect') {
      iconChar = iconSvg('star', true);
      badgeText = t('dynasty.status.perfect');
    } else if (st === 'cleared') {
      iconChar = iconSvg('check-circle');
      badgeText = t('dynasty.status.cleared', { score: prog.bestScore || 0 });
    } else if (st === 'active') {
      iconChar = iconSvg('play', true);
      var currentQ = (sess && sess.dynastyId === dynId) ? (sess.currentQuestionIdx + 1) : 1;
      badgeText = t('dynasty.status.in_progress', { current: currentQ });
    } else if (st === 'locked') {
      iconChar = iconSvg('lock');
      badgeText = ''; // locked 无 badge
    } else {
      // unlocked
      iconChar = String(idx + 1);
      badgeText = t('dynasty.status.unlocked');
    }

    var disabled = st === 'locked';
    var ariaLabel = name + ' · ' + t('dynasty.status.' + (st === 'unlocked' ? 'unlocked' : st === 'active' ? 'in_progress' : st === 'cleared' ? 'cleared' : st === 'perfect' ? 'perfect' : 'locked'),
      { score: prog.bestScore || 0, current: (sess && sess.currentQuestionIdx + 1) || 1, prev: idx > 0 ? t('dynasty.' + DYNASTY_ORDER[idx - 1] + '.name') : '' });

    return '' +
      '<button type="button" class="dynasty-card dynasty-card--' + st + (isRecommended ? ' dynasty-card--recommended' : '') + '" ' +
        'data-dynasty="' + dynId + '" data-state="' + st + '" role="listitem" ' +
        (disabled ? 'aria-disabled="true"' : '') +
        ' aria-label="' + esc(ariaLabel) + '">' +
        // row（Mobile + Desktop 顶部）
        '<div class="dynasty-card__row">' +
          '<span class="dynasty-card__icon" aria-hidden="true">' + iconChar + '</span>' +
          '<div class="dynasty-card__name-block">' +
            '<span class="dynasty-card__name">' + esc(name) + '</span>' +
            '<span class="dynasty-card__era">' + esc(era) + '</span>' +
          '</div>' +
        '</div>' +
        // badge（Mobile 右 / Desktop 底）
        (badgeText ? '<span class="dynasty-card__badge">' + esc(badgeText) + '</span>' : '') +
      '</button>';
  }

  function onDynastyClick(dynId, st) {
    if (st === 'locked') {
      var idx = DYNASTY_ORDER.indexOf(dynId);
      var prev = idx > 0 ? t('dynasty.' + DYNASTY_ORDER[idx - 1] + '.name') : '';
      showToast(t('dynasty.status.locked_hint', { prev: prev }));
      return;
    }
    if (st === 'cleared' || st === 'perfect') {
      // 重玩二次确认（破坏性操作用 alertdialog，autofocus 在取消防误触）
      openDialog({
        role: 'alertdialog',
        title: t('dynasty.replay_confirm.title'),
        body: t('dynasty.replay_confirm.body'),
        actions: [
          { label: t('dynasty.replay_confirm.cancel'), variant: 'outline', autofocus: true, onClick: function () {} },
          { label: t('dynasty.replay_confirm.ok'), variant: 'primary', onClick: function () {
            // 清该朝 currentSession（如果恰好是）
            var s = readState();
            if (s.currentSession && s.currentSession.dynastyId === dynId) {
              s.currentSession = null;
              writeState(s);
            }
            navigate('/quiz/' + dynId);
          }}
        ]
      });
      return;
    }
    // active / unlocked: 直接进答题
    navigate('/quiz/' + dynId);
  }

  function maybePromptMidQuiz(state) {
    var sess = state.currentSession;
    if (!sess || !sess.dynastyId) return;
    try {
      if (sessionStorage.getItem('skipMidQuizOnce')) {
        sessionStorage.removeItem('skipMidQuizOnce');
        return;
      }
    } catch (e) {}
    var dynName = t('dynasty.' + sess.dynastyId + '.name');
    openDialog({
      role: 'dialog',
      title: t('mid_quiz.title'),
      body: t('mid_quiz.body', { dynasty: dynName, current: sess.currentQuestionIdx + 1 }),
      actions: [
        { label: t('mid_quiz.cta.restart'), variant: 'outline', onClick: function () {
          var s = readState(); s.currentSession = null; writeState(s);
          navigate('/quiz/' + sess.dynastyId);
        }},
        { label: t('mid_quiz.cta.continue'), variant: 'primary', autofocus: true, onClick: function () { navigate('/quiz/' + sess.dynastyId); } }
      ],
      onDismiss: function () {
        // 保留 session，用户下次直访首页会再次提示
      }
    });
  }

  function renderWrongEntry(count) {
    return '' +
      '<button type="button" class="wrong-entry" aria-label="' + esc(t('home.wrong_entry', { count: count })) + '">' +
        '<span class="wrong-entry__left">' +
          '<span class="wrong-entry__icon" aria-hidden="true">' + iconSvg('eye') + '</span>' +
          '<span class="wrong-entry__text">' +
            '<span class="wrong-entry__title">' + esc(t('home.wrong_entry', { count: count })) + '</span>' +
            '<span class="wrong-entry__subtitle" aria-hidden="true">' + esc(t('wrong.subtitle')) + '</span>' +
          '</span>' +
        '</span>' +
        '<span class="wrong-entry__arrow" aria-hidden="true">' + iconSvg('arrow-right') + '</span>' +
      '</button>';
  }

  function renderCardsPreview(state) {
    var unlocked = state.unlockedCards || [];
    var progressText = t('cards_page.progress', { unlocked: unlocked.length });
    var title = unlocked.length ? t('home.cards_hint') : t('home.cards_hint_empty');

    // 显示前 5 张（已解锁的优先）+ 剩余位置用未解锁占位
    var thumbs = [];
    var maxShow = 5;
    for (var i = 0; i < Math.min(DYNASTY_ORDER.length, maxShow); i++) {
      var dynId = DYNASTY_ORDER[i];
      var isUnlocked = unlocked.indexOf(dynId) >= 0;
      if (isUnlocked) {
        thumbs.push(renderCardThumb(dynId, false));
      } else {
        thumbs.push(renderCardThumb(dynId, true));
      }
    }

    return '' +
      '<section class="cards-preview" aria-labelledby="cards-preview-title">' +
        '<div class="cards-preview__head">' +
          '<h2 class="cards-preview__title" id="cards-preview-title">' + esc(title) + '</h2>' +
          '<span class="cards-preview__progress">' + esc(progressText) + '</span>' +
        '</div>' +
        '<div class="cards-row" role="list">' +
          thumbs.join('') +
        '</div>' +
      '</section>';
  }

  function renderCardThumb(dynId, locked) {
    var name = t('dynasty.' + dynId + '.name');
    var cardName = locked ? '' : t('card.story.' + dynId + '.name');
    var type = locked ? '' : t('card.story.' + dynId + '.type');
    var labelShort = locked ? '?' : (name + '·' + type.charAt(0));
    return '' +
      '<button type="button" class="card-thumb' + (locked ? ' card-thumb--locked' : '') + '" ' +
        'data-card="' + dynId + '" role="listitem" ' +
        'aria-label="' + esc(locked ? t('error.card_locked') + '：' + name : name + ' · ' + cardName) + '">' +
        '<!-- ASSET_MISSING: card-thumb-' + dynId + ' · ASSET-LIST #003 -->' +
        '<span class="card-thumb__cover" aria-hidden="true">' + (locked ? iconSvg('lock') : iconSvg('landmark')) + '</span>' +
        '<span class="card-thumb__label">' + esc(labelShort) + '</span>' +
      '</button>';
  }

  /* ==============================================================
     11. Quiz · Phase 2
     ============================================================== */

  var QUIZ_META = null;
  function loadQuizMeta() {
    if (QUIZ_META) return QUIZ_META;
    var el = document.getElementById('quiz-meta');
    try { QUIZ_META = el ? JSON.parse(el.textContent || '{}') : {}; }
    catch (e) { console.error('[quiz-meta] parse fail', e); QUIZ_META = {}; }
    return QUIZ_META;
  }

  function validateQuizDynasty(dynId) {
    var meta = loadQuizMeta();
    if (!meta[dynId]) return false;
    var count = meta[dynId].count;
    var q0 = getByPath(LOCALE[currentLang], 'quiz.questions.' + dynId + '.0');
    if (!q0 && LOCALE.en) q0 = getByPath(LOCALE.en, 'quiz.questions.' + dynId + '.0');
    return count > 0 && !!q0;
  }

  function getQuizSession(dynId) {
    var state = readState();
    if (state.currentSession && state.currentSession.dynastyId === dynId) {
      return state.currentSession;
    }
    var sess = {
      dynastyId: dynId,
      currentQuestionIdx: 0,
      answers: [],
      startedAt: Date.now()
    };
    state.currentSession = sess;
    writeState(state);
    return sess;
  }

  // Quiz 运行时状态
  var quizRT = {
    dynId: null, session: null, questionCount: 0, current: null
  };

  function renderQuiz(app, dynId) {
    if (DYNASTY_ORDER.indexOf(dynId) < 0) {
      showToast(t('error.dynasty_not_found'));
      navigate('/home');
      return;
    }
    if (getDynastyState(dynId) === 'locked') {
      showToast(t('error.dynasty_locked'));
      navigate('/home');
      return;
    }
    if (!validateQuizDynasty(dynId)) {
      app.innerHTML = renderHeader('back') +
        '<main id="main-content" style="padding:48px 24px;text-align:center;">' +
          '<h1 style="font-family:var(--font-display);font-size:24px;margin-block-end:16px;">' + esc(t('quiz.load_error.title')) + '</h1>' +
          '<p style="color:var(--color-fg-muted);margin-block-end:24px;">' + esc(t('quiz.load_error.body')) + '</p>' +
          '<button type="button" class="btn btn--outline" data-back-home>' + esc(t('quiz.load_error.give_up')) + '</button>' +
        '</main>';
      bindHeader(app);
      var bh = $('[data-back-home]', app); if (bh) bh.addEventListener('click', function () { navigate('/home'); });
      return;
    }

    var sess = getQuizSession(dynId);
    var meta = loadQuizMeta();
    quizRT.dynId = dynId;
    quizRT.session = sess;
    quizRT.questionCount = meta[dynId].count;
    quizRT.current = null;

    var html = renderQuizHeader(dynId, sess.currentQuestionIdx, quizRT.questionCount) +
      '<main id="main-content" class="quiz-main" aria-label="' + esc(t('dynasty.' + dynId + '.name')) + '">' +
        '<div class="dynasty-illust" role="img" aria-label="' + esc(t('dynasty.' + dynId + '.name')) + '">' +
          '<!-- ASSET_MISSING: dynasty-illust-' + dynId + ' · ASSET-LIST #002 -->' +
          '<span aria-hidden="true">' + iconSvg('landmark') + '</span>' +
        '</div>' +
        '<div class="quiz-body">' +
          '<span class="quiz-body__progress-label">' + esc(t('quiz.progress', { current: sess.currentQuestionIdx + 1, total: quizRT.questionCount })) + '</span>' +
          '<h1 class="quiz-question" id="quiz-question"></h1>' +
          '<ul class="quiz-options" id="quiz-options" role="radiogroup" aria-labelledby="quiz-question"></ul>' +
          '<div id="quiz-feedback-slot"></div>' +
          '<div id="quiz-cta-slot" hidden></div>' +
        '</div>' +
      '</main>';

    app.innerHTML = html;
    bindHeader(app);
    bindQuizHeader(app);
    renderCurrentQuestion();
  }

  function renderQuizHeader(dynId, curIdx, total) {
    var dots = '';
    for (var i = 0; i < total; i++) {
      var cls = 'progress-dot';
      if (i < curIdx) cls += ' progress-dot--done';
      else if (i === curIdx) cls += ' progress-dot--current';
      dots += '<span class="' + cls + '"></span>';
    }
    return '' +
      '<header class="app-header app-header--quiz" role="banner">' +
        '<div class="app-header__inner">' +
          '<button type="button" class="back-btn" data-action="quiz-back" aria-label="' + esc(t('nav.back')) + '">' +
            '<span aria-hidden="true">' + iconSvg('arrow-left') + '</span>' +
          '</button>' +
          '<h1 class="quiz-header__dynasty">' + esc(t('dynasty.' + dynId + '.name')) + '</h1>' +
          '<div class="quiz-header__progress" role="progressbar" aria-label="' + esc(t('quiz.progress', { current: curIdx + 1, total: total })) + '" aria-valuenow="' + (curIdx + 1) + '" aria-valuemin="1" aria-valuemax="' + total + '" aria-valuetext="' + esc(t('quiz.progress', { current: curIdx + 1, total: total })) + '">' +
            '<span class="quiz-header__progress-label">' + esc(t('quiz.progress', { current: curIdx + 1, total: total })) + '</span>' +
            '<span class="progress-dots" aria-hidden="true">' + dots + '</span>' +
          '</div>' +
        '</div>' +
      '</header>';
  }

  function bindQuizHeader(app) {
    var backBtn = $('.back-btn', app);
    if (backBtn) backBtn.addEventListener('click', openExitConfirm);
  }

  function updateQuizHeader() {
    var header = $('.app-header--quiz');
    if (!header) return;
    var curIdx = quizRT.session.currentQuestionIdx;
    var total = quizRT.questionCount;
    var dotsEl = $('.progress-dots', header);
    if (dotsEl) {
      var html = '';
      for (var i = 0; i < total; i++) {
        var cls = 'progress-dot';
        if (i < curIdx) cls += ' progress-dot--done';
        else if (i === curIdx) cls += ' progress-dot--current';
        html += '<span class="' + cls + '"></span>';
      }
      dotsEl.innerHTML = html;
    }
    var label = $('.quiz-header__progress-label', header);
    if (label) label.textContent = t('quiz.progress', { current: curIdx + 1, total: total });
    var progressBar = $('.quiz-header__progress', header);
    if (progressBar) {
      progressBar.setAttribute('aria-valuenow', curIdx + 1);
      progressBar.setAttribute('aria-valuetext', t('quiz.progress', { current: curIdx + 1, total: total }));
    }
    var bodyLabel = $('.quiz-body__progress-label');
    if (bodyLabel) bodyLabel.textContent = t('quiz.progress', { current: curIdx + 1, total: total });
  }

  function renderCurrentQuestion() {
    var sess = quizRT.session;
    var dynId = quizRT.dynId;
    var idx = sess.currentQuestionIdx;
    var qKey = 'quiz.questions.' + dynId + '.' + idx;
    var q = getByPath(LOCALE[currentLang], qKey) || getByPath(LOCALE.en, qKey);
    if (!q) {
      console.warn('[quiz] missing question', qKey);
      showToast(t('quiz.load_error.title'));
      navigate('/home');
      return;
    }
    quizRT.current = null;

    var metaEntry = QUIZ_META[dynId].questions[idx];
    var correctIdx = metaEntry.answer_index;

    var qEl = $('#quiz-question');
    var optsEl = $('#quiz-options');
    var feedbackSlot = $('#quiz-feedback-slot');
    var ctaSlot = $('#quiz-cta-slot');

    if (qEl) qEl.textContent = q.question;
    if (feedbackSlot) feedbackSlot.innerHTML = '';
    if (ctaSlot) { ctaSlot.hidden = true; ctaSlot.innerHTML = ''; }

    if (optsEl) {
      var prefixes = ['A', 'B', 'C', 'D'];
      var optsHtml = '';
      for (var i = 0; i < 4; i++) {
        var optText = q['option_' + i];
        if (!optText) continue;
        optsHtml += '' +
          '<li role="presentation"><button type="button" class="quiz-option" role="radio" aria-checked="false" data-opt="' + i + '" aria-label="' + esc(prefixes[i] + '. ' + optText) + '">' +
            '<span class="quiz-option__prefix" aria-hidden="true">' +
              '<span class="quiz-option__prefix-text">' + prefixes[i] + '</span>' +
              '<span class="quiz-option__prefix-icon"></span>' +
            '</span>' +
            '<span class="quiz-option__text">' + esc(optText) + '</span>' +
          '</button></li>';
      }
      optsEl.innerHTML = optsHtml;
      $$('.quiz-option', optsEl).forEach(function (btn) {
        btn.addEventListener('click', function () {
          var chosen = +btn.getAttribute('data-opt');
          onOptionChosen(chosen, correctIdx, q);
        });
      });
    }

    updateQuizHeader();
    window.scrollTo(0, 0);
  }

  function onOptionChosen(chosenIdx, correctIdx, q) {
    if (quizRT.current) return;
    var isCorrect = chosenIdx === correctIdx;
    quizRT.current = { chosen: chosenIdx, correct: isCorrect, correctIdx: correctIdx };

    $$('.quiz-option').forEach(function (btn) {
      var i = +btn.getAttribute('data-opt');
      btn.disabled = true;
      btn.setAttribute('aria-checked', i === chosenIdx ? 'true' : 'false');
      if (i === correctIdx) {
        btn.classList.add('quiz-option--correct');
        var iconEl = $('.quiz-option__prefix-icon', btn);
        if (iconEl) iconEl.innerHTML = iconSvg('check');
      } else if (i === chosenIdx && !isCorrect) {
        btn.classList.add('quiz-option--wrong');
        var iconEl2 = $('.quiz-option__prefix-icon', btn);
        if (iconEl2) iconEl2.innerHTML = iconSvg('circle-x');
      }
    });

    var sess = quizRT.session;
    sess.answers.push({ questionIdx: sess.currentQuestionIdx, chosenIdx: chosenIdx, correct: isCorrect });

    var state = readState();
    var qid = QUIZ_META[quizRT.dynId].questions[sess.currentQuestionIdx].id;
    if (!isCorrect) {
      state.wrongQuestions = state.wrongQuestions.filter(function (w) { return w.questionId !== qid; });
      state.wrongQuestions.push({
        questionId: qid,
        dynastyId: quizRT.dynId,
        myAnswerIdx: chosenIdx,
        correctAnswerIdx: correctIdx,
        timestamp: Date.now()
      });
    } else {
      state.wrongQuestions = state.wrongQuestions.filter(function (w) { return w.questionId !== qid; });
    }
    state.currentSession = sess;
    writeState(state);

    renderFeedback(isCorrect, q, correctIdx);
    renderQuizCta();
  }

  function renderFeedback(isCorrect, q, correctIdx) {
    var slot = $('#quiz-feedback-slot');
    if (!slot) return;
    var explanation = q.explanation || '';
    var cls = isCorrect ? 'quiz-feedback--correct' : 'quiz-feedback--wrong';
    var titleKey = isCorrect ? 'quiz.feedback_correct.title' : 'quiz.feedback_wrong.title';
    var bodyKey = isCorrect ? 'quiz.feedback_correct.body' : 'quiz.feedback_wrong.body';

    var correctLine = '';
    if (!isCorrect) {
      var correctText = q['option_' + correctIdx];
      var prefix = ['A', 'B', 'C', 'D'][correctIdx];
      correctLine = '' +
        '<p class="quiz-feedback__correct-line">' +
          '<span>' + esc(t('quiz.feedback.correct_answer_label')) + '</span>' +
          '<span class="quiz-feedback__correct-text">' + esc(prefix + '. ' + correctText) + '</span>' +
        '</p>';
    }

    slot.innerHTML = '' +
      '<div class="quiz-feedback ' + cls + '" role="region" aria-live="polite">' +
        '<h2 class="quiz-feedback__title">' + esc(t(titleKey)) + '</h2>' +
        '<p class="quiz-feedback__body">' + esc(t(bodyKey) + ' ' + explanation) + '</p>' +
        correctLine +
      '</div>';
  }

  function renderQuizCta() {
    var sess = quizRT.session;
    var isLast = sess.currentQuestionIdx === quizRT.questionCount - 1;
    var label = isLast ? t('quiz.cta.settle') : t('quiz.cta.next');

    var ctaSlot = $('#quiz-cta-slot');
    if (ctaSlot) {
      ctaSlot.innerHTML = '' +
        '<div class="quiz-cta" id="quiz-cta-bar">' +
          '<button type="button" class="btn btn--primary quiz-cta__btn" data-next-q>' + esc(label) + '</button>' +
        '</div>';
      ctaSlot.hidden = false;
    }

    var btn = $('[data-next-q]');
    if (btn) {
      btn.addEventListener('click', onNextQuestion);
      requestAnimationFrame(function () { btn.focus(); });
    }
  }

  function onNextQuestion() {
    var sess = quizRT.session;
    if (sess.currentQuestionIdx < quizRT.questionCount - 1) {
      sess.currentQuestionIdx++;
      var s = readState(); s.currentSession = sess; writeState(s);
      renderCurrentQuestion();
    } else {
      settleQuiz();
    }
  }

  function settleQuiz() {
    var sess = quizRT.session;
    var dynId = quizRT.dynId;
    var score = sess.answers.filter(function (a) { return a.correct; }).length;
    var state = readState();

    var prog = state.progress[dynId] || { completed: false, bestScore: 0, attempts: 0, perfectBadge: false };
    prog.completed = true;
    prog.bestScore = Math.max(prog.bestScore, score);
    prog.attempts = (prog.attempts || 0) + 1;
    if (score === quizRT.questionCount) prog.perfectBadge = true;
    state.progress[dynId] = prog;

    var cardUnlocked = false;
    if (state.unlockedCards.indexOf(dynId) < 0) {
      state.unlockedCards.push(dynId);
      state.unreadCards = (state.unreadCards || 0) + 1;
      cardUnlocked = true;
    }

    state.currentSession = null;
    state.lastResult = {
      dynastyId: dynId,
      score: score,
      total: quizRT.questionCount,
      perfect: score === quizRT.questionCount,
      cardUnlocked: cardUnlocked,
      timestamp: Date.now()
    };
    writeState(state);
    navigate('/result/' + dynId);
  }

  /* ==============================================================
     11.1 ExitConfirm
     ============================================================== */

  function openExitConfirm() {
    openDialog({
      role: 'alertdialog',
      title: t('quiz.confirm_exit.title'),
      body: t('quiz.confirm_exit.body'),
      actions: [
        { label: t('quiz.confirm_exit.keep'), variant: 'outline', onClick: function () {
          try { sessionStorage.setItem('skipMidQuizOnce', '1'); } catch (e) {}
          navigate('/home');
        }},
        { label: t('quiz.confirm_exit.continue'), variant: 'primary', autofocus: true, onClick: function () {} }
      ],
      onDismiss: function () {}
    });
  }

  /* ==============================================================
     12. Result · Phase 2
     ============================================================== */

  function renderResult(app, dynId) {
    if (DYNASTY_ORDER.indexOf(dynId) < 0) {
      navigate('/home');
      return;
    }
    var state = readState();
    var lastResult = state.lastResult;

    if (!lastResult || lastResult.dynastyId !== dynId) {
      var prog = state.progress[dynId];
      if (!prog || !prog.completed) {
        showToast(t('error.dynasty_locked'));
        navigate('/home');
        return;
      }
      lastResult = {
        dynastyId: dynId,
        score: prog.bestScore,
        total: (loadQuizMeta()[dynId] || { count: 5 }).count,
        perfect: prog.perfectBadge,
        cardUnlocked: false,
        timestamp: Date.now(),
        replay: true
      };
    }

    var score = lastResult.score;
    var total = lastResult.total;
    var isPerfect = lastResult.perfect;
    var isPartial = score === 0;

    var bannerText, bannerCls;
    if (isPerfect) { bannerText = t('result.banner.perfect'); bannerCls = 'result-banner--perfect'; }
    else if (isPartial) { bannerText = t('result.banner.cleared_partial'); bannerCls = 'result-banner--cleared-partial'; }
    else { bannerText = t('result.banner.cleared'); bannerCls = 'result-banner--cleared'; }

    var cardName = t('card.story.' + dynId + '.name');
    var cardType = t('card.story.' + dynId + '.type');
    var fromDynasty = t('card.from_dynasty', { dynasty: t('dynasty.' + dynId + '.name') });
    var cardLabelText = lastResult.cardUnlocked ? t('result.card_reveal.label') : t('result.card_reveal.again');

    var wrongInThisDyn = state.wrongQuestions.filter(function (w) { return w.dynastyId === dynId; }).length;
    var hasWrong = !isPerfect && wrongInThisDyn > 0;

    var curIdx = DYNASTY_ORDER.indexOf(dynId);
    var nextDyn = curIdx < DYNASTY_ORDER.length - 1 ? DYNASTY_ORDER[curIdx + 1] : null;

    var pageTitle = t('dynasty.' + dynId + '.name') + ' · ' + (isPerfect ? t('result.banner.perfect') : t('result.banner.cleared'));
    var scoreCls = isPerfect ? 'result-score result-score--perfect' : 'result-score';
    var cardCls = isPerfect ? 'result-card result-card--perfect' : 'result-card';
    var badgeHtml = isPerfect ? '<span class="result-card__badge" aria-label="' + esc(t('result.badge_reveal.label')) + '">' + iconSvg('star', true) + '</span>' : '';

    var html = '' +
      renderHeader('back') +
      '<main id="main-content" class="result-main" aria-label="' + esc(pageTitle) + '">' +
        '<section class="result-stage1" role="status" aria-live="polite">' +
          '<h1 class="result-banner ' + bannerCls + '">' + esc(bannerText) + '</h1>' +
          '<p class="' + scoreCls + '">' + score + ' / ' + total + '</p>' +
        '</section>' +
        '<section class="result-stage2">' +
          '<p class="result-card-label">' + esc(cardLabelText) + '</p>' +
          '<button type="button" class="' + cardCls + '" data-card-id="' + dynId + '" aria-label="' + esc(cardName + ' · ' + cardType) + '">' +
            '<!-- ASSET_MISSING: card-main-' + dynId + ' · ASSET-LIST #004 -->' +
            '<div class="result-card__cover" aria-hidden="true">' + iconSvg('landmark') + '</div>' +
            '<div class="result-card__info">' +
              '<span class="result-card__tag">' + esc(cardType + ' · ' + fromDynasty) + '</span>' +
              '<h2 class="result-card__name">' + esc(cardName) + '</h2>' +
              '<p class="result-card__hint">' + esc(t('result.card_reveal.tap_hint')) + '</p>' +
            '</div>' +
            badgeHtml +
          '</button>' +
        '</section>' +
        (hasWrong ? '' +
          '<button type="button" class="result-wrong-entry" data-wrong>' +
            '<span class="result-wrong-entry__text">' + esc(t('result.wrong_entry')) + '</span>' +
            '<span class="result-wrong-entry__arrow" aria-hidden="true">' + iconSvg('arrow-right') + '</span>' +
          '</button>' : '') +
        '<div class="result-ctas-sticky">' +
          (nextDyn ? '<button type="button" class="btn btn--primary" data-next-dyn>' + esc(t('result.cta.next_dynasty', { dynasty: t('dynasty.' + nextDyn + '.name') })) + ' ' + iconSvg('arrow-right') + '</button>'
                   : '<button type="button" class="btn btn--primary" data-home>' + esc(t('result.cta.home')) + '</button>') +
          '<button type="button" class="btn btn--icon" data-more aria-label="' + esc(t('result.cta.more')) + '">' + iconSvg('ellipsis') + '</button>' +
        '</div>' +
      '</main>';

    app.innerHTML = html;
    bindHeader(app);

    var cardBtn = $('.result-card', app);
    if (cardBtn) cardBtn.addEventListener('click', function () { navigate('/card/' + dynId); });
    var we = $('[data-wrong]', app);
    if (we) we.addEventListener('click', function () { navigate('/wrong/' + dynId); });
    var ndb = $('[data-next-dyn]', app);
    if (ndb) ndb.addEventListener('click', function () { navigate('/quiz/' + nextDyn); });
    var hb = $('[data-home]', app);
    if (hb) hb.addEventListener('click', function () { navigate('/home'); });
    var mb = $('[data-more]', app);
    if (mb) {
      mb.addEventListener('click', function () {
        openDialog({
          title: t('result.cta.more'),
          actions: [
            { label: t('result.cta.home'), variant: 'ghost', onClick: function () { navigate('/home'); } },
            { label: t('result.cta.replay'), variant: 'primary', autofocus: true, onClick: function () {
              var s = readState(); s.currentSession = null; s.lastResult = null; writeState(s);
              navigate('/quiz/' + dynId);
            }}
          ]
        });
      });
    }

    var t1 = $('#page-title', app); if (t1) t1.textContent = pageTitle;
  }

  /* ==============================================================
     13. Cards 卡册页 · Phase 3
     ============================================================== */

  function renderCards(app) {
    var state = readState();
    // 进入卡册即清零红点
    if (state.unreadCards > 0) {
      state.unreadCards = 0;
      writeState(state);
    }
    var unlocked = state.unlockedCards || [];
    var unlockedSet = {};
    unlocked.forEach(function (d) { unlockedSet[d] = true; });

    var html = '' +
      renderHeader('back') +
      '<main id="main-content" class="cards-page" aria-label="' + esc(t('cards_page.title')) + '">' +
        '<div class="cards-page__head">' +
          '<h1 class="cards-page__title">' + esc(t('cards_page.title')) + '</h1>' +
          '<span class="cards-page__progress">' + esc(t('cards_page.progress', { unlocked: unlocked.length })) + '</span>' +
        '</div>';

    if (unlocked.length === 0) {
      html += '' +
        '<div class="cards-empty" role="status">' +
          '<!-- ASSET_MISSING: empty-cards · ASSET-LIST #006 -->' +
          '<div class="empty-illust" aria-hidden="true">📖</div>' +
          '<h2 class="empty-title">' + esc(t('cards_page.empty.title')) + '</h2>' +
          '<p class="empty-body">' + esc(t('cards_page.empty.body')) + '</p>' +
          '<button type="button" class="btn btn--primary" data-go-home>' + esc(t('cards_page.empty.cta')) + '</button>' +
        '</div>';
    } else {
      html += '<div class="cards-grid" role="list">';
      for (var i = 0; i < DYNASTY_ORDER.length; i++) {
        var dynId = DYNASTY_ORDER[i];
        var isUnlocked = !!unlockedSet[dynId];
        html += renderCardTile(dynId, isUnlocked, state);
      }
      html += '</div>';
    }

    html += '</main>';

    app.innerHTML = html;
    bindHeader(app);
    var t1 = $('#page-title', app); if (t1) t1.textContent = t('cards_page.title');

    // empty state CTA
    var goHomeBtn = $('[data-go-home]', app);
    if (goHomeBtn) goHomeBtn.addEventListener('click', function () { navigate('/home'); });

    // card tile clicks
    $$('.card-tile', app).forEach(function (tile) {
      var did = tile.getAttribute('data-card-dyn');
      var locked = tile.classList.contains('card-tile--locked');
      tile.addEventListener('click', function () {
        if (locked) {
          showToast(t('cards_page.locked_hint', { dynasty: t('dynasty.' + did + '.name') }));
        } else {
          navigate('/card/' + did);
        }
      });
    });
  }

  function renderCardTile(dynId, isUnlocked, state) {
    var prog = state.progress[dynId];
    var isPerfect = prog && prog.perfectBadge;
    var cls = 'card-tile';
    if (!isUnlocked) cls += ' card-tile--locked';
    if (isPerfect) cls += ' card-tile--perfect';

    var cardName = isUnlocked ? t('card.story.' + dynId + '.name') : '?';
    var cardType = isUnlocked ? t('card.story.' + dynId + '.type') : '';
    var fromDyn = t('card.from_dynasty', { dynasty: t('dynasty.' + dynId + '.name') });
    var coverIcon = isUnlocked ? iconSvg('landmark') : iconSvg('lock');

    var ariaLabel = isUnlocked
      ? cardName + ' · ' + cardType + ' · ' + fromDyn
      : t('cards_page.locked_hint', { dynasty: t('dynasty.' + dynId + '.name') });

    var tagHtml = isUnlocked
      ? '<span class="card-tile__tag">' + esc(cardType + ' · ' + fromDyn) + '</span>'
      : '<span class="card-tile__tag">' + esc(t('dynasty.' + dynId + '.name')) + '</span>';

    var hintHtml = isUnlocked ? '' : '<p class="card-tile__hint">' + esc(t('dynasty.status.locked')) + '</p>';

    return '' +
      '<button type="button" class="' + cls + '" data-card-dyn="' + dynId + '" role="listitem" aria-label="' + esc(ariaLabel) + '"' + (!isUnlocked ? ' aria-disabled="true"' : '') + '>' +
        '<!-- ASSET_MISSING: card-tile-' + dynId + ' · ASSET-LIST #003 -->' +
        '<div class="card-tile__cover" aria-hidden="true">' + coverIcon + '</div>' +
        '<div class="card-tile__info">' +
          tagHtml +
          '<h3 class="card-tile__name">' + esc(cardName) + '</h3>' +
          hintHtml +
        '</div>' +
      '</button>';
  }

  /* ==============================================================
     14. CardDetail 浮层 · Phase 3
     ============================================================== */

  function renderCardDetail(app, cardId) {
    // 权限校验
    if (DYNASTY_ORDER.indexOf(cardId) < 0) {
      showToast(t('error.card_locked'));
      navigate('/cards');
      return;
    }
    var state = readState();
    var isUnlocked = (state.unlockedCards || []).indexOf(cardId) >= 0;
    if (!isUnlocked) {
      showToast(t('error.card_locked'));
      navigate('/cards');
      return;
    }

    var prog = state.progress[cardId];
    var isPerfect = prog && prog.perfectBadge;
    var cardName = t('card.story.' + cardId + '.name');
    var cardType = t('card.story.' + cardId + '.type');
    var cardStory = t('card.story.' + cardId + '.story');
    var dynName = t('dynasty.' + cardId + '.name');

    var cls = 'card-detail';
    if (isPerfect) cls += ' card-detail--perfect';

    var backTarget = '/cards';

    var html = '' +
      '<div class="card-detail-backdrop" data-card-backdrop>' +
        '<div class="' + cls + '" role="dialog" aria-modal="true" aria-labelledby="card-detail-name" data-card-sheet>' +
          // Topbar 作为独立顶层，Mobile 左上 / Desktop 右上 (CSS 控制)
          '<div class="card-detail__topbar">' +
            '<button type="button" class="card-detail__close" aria-label="' + esc(t('card.close')) + '" data-card-close>' +
              '<span aria-hidden="true">' + iconSvg('circle-x') + '</span>' +
            '</button>' +
          '</div>' +
          '<!-- ASSET_MISSING: card-main-' + cardId + ' · ASSET-LIST #004 -->' +
          '<div class="card-detail__cover" aria-hidden="true">' + iconSvg('landmark') + '</div>' +
          '<div class="card-detail__info">' +
            '<div class="card-detail__tags">' +
              '<span class="card-detail__tag card-detail__tag--category">' + esc(cardType) + '</span>' +
              '<span class="card-detail__tag card-detail__tag--dynasty">' + esc(t('card.from_dynasty', { dynasty: dynName })) + '</span>' +
            '</div>' +
            '<h1 class="card-detail__name" id="card-detail-name">' + esc(cardName) + '</h1>' +
            '<p class="card-detail__story">' + esc(cardStory) + '</p>' +
            (isPerfect ? (
              '<div class="card-detail__badge-section">' +
                '<span class="card-detail__badge-label">' + esc(t('card.badge_reveal.label')) + '</span>' +
                '<strong class="card-detail__badge-name">' + esc(t('card.badge.' + cardId + '.name')) + '</strong>' +
                '<p class="card-detail__badge-story">' + esc(t('card.badge.' + cardId + '.story')) + '</p>' +
              '</div>'
            ) : '') +
            ''  +
          '</div>' +
        '</div>' +
      '</div>';

    // Card Detail 作为浮层渲染，保留下层原页面（home 或 cards）
    // 为了简单起见：app.innerHTML = 下层页面 + 浮层
    // 策略：先渲染下层，再 append 浮层
    var state2 = readState();
    // 决定下层：如果从 home 来的就渲染 home，从 cards 来的就 cards
    var prevName = prevRoute ? prevRoute.name : 'home';
    if (prevName === 'cards') {
      renderCards(app);
    } else {
      renderHome(app);
    }
    // 追加浮层
    var overlay = document.createElement('div');
    overlay.innerHTML = html;
    var backdrop = overlay.firstChild;
    document.body.appendChild(backdrop);

    // a11y: 标记下层 #app 给辅助技术（SR 忽略下层）· FIX-P3-03 修复 2026-04-17
    var appRoot = document.getElementById('app');
    if (appRoot) appRoot.setAttribute('aria-hidden', 'true');

    var sheet = $('[data-card-sheet]', backdrop);
    // 焦点保留当前（MUST 在 navigate 之前使用，navigate 会销毁下层 DOM）
    var activeBefore = document.activeElement;
    // lock scroll
    document.body.style.overflow = 'hidden';

    function closeDetail() {
      if (backdrop && backdrop.parentNode) {
        backdrop.parentNode.removeChild(backdrop);
      }
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
      if (appRoot) appRoot.removeAttribute('aria-hidden');
      // 焦点归还：必须在 navigate 之前尝试一次（下层 DOM 仍存在），
      // navigate 之后 activeBefore 引用的节点已被 innerHTML 替换失效 · FIX-P3-03
      var returned = false;
      if (activeBefore && activeBefore.focus && document.body.contains(activeBefore)) {
        try { activeBefore.focus(); returned = true; } catch (e) {}
      }
      // 决定回退目标：如果来自 result 跳 home；否则跳 cards（或 home）
      navigate(prevRoute && prevRoute.name === 'cards' ? '/cards' : '/home');
      // 若焦点归还失败，fallback 到下一个可聚焦元素（新页面首个 button 或 #main-content）
      if (!returned) {
        setTimeout(function () {
          var fallback = document.querySelector('#main-content') || document.querySelector('button, [href]');
          if (fallback && fallback.focus) fallback.focus();
        }, 50);
      }
    }

    // 焦点陷阱 · 参考 Phase 1 openDialog 实现 · FIX-P3-03 修复 2026-04-17
    function onKey(e) {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeDetail();
        return;
      }
      if (e.key === 'Tab' && sheet) {
        var focusables = $$(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
          sheet
        ).filter(function (el) {
          return !el.disabled && el.offsetParent !== null;
        });
        if (!focusables.length) return;
        var first = focusables[0];
        var last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener('keydown', onKey);

    // bind close
    var closeBtn = $('[data-card-close]', backdrop);
    if (closeBtn) closeBtn.addEventListener('click', closeDetail);

    // backdrop click close (Tablet+Desktop)
    backdrop.addEventListener('click', function (e) {
      if (e.target === backdrop && window.innerWidth >= 768) {
        closeDetail();
      }
    });

    // 焦点到关闭按钮（IX-A11y）
    setTimeout(function () {
      if (closeBtn) closeBtn.focus();
    }, 100);
  }

  /* ==============================================================
     15. Wrong Review · Phase 3 · IMPLEMENTATION-GUIDE §9
     ============================================================== */

  function renderWrong(app, filterDyn) {
    loadQuizMeta();  // 确保 QUIZ_META 已加载（用于 question count）
    var state = readState();
    var wrong = state.wrongQuestions || [];

    // filter
    var filtered = filterDyn ? wrong.filter(function (w) { return w.dynastyId === filterDyn; }) : wrong;

    var html = '' + renderHeader('back') +
      '<main id="main-content" class="wrong-page" aria-label="' + esc(t('wrong.title')) + '">' +
        '<div class="wrong-head">' +
          '<h1 class="wrong-head__title">' + esc(t('wrong.title')) + '</h1>' +
          '<p class="wrong-head__subtitle">' + esc(t('wrong.subtitle')) + '</p>' +
        '</div>';

    if (wrong.length === 0) {
      html += '' +
        '<div class="wrong-empty" role="status">' +
          '<!-- ASSET_MISSING: empty-wrong · ASSET-LIST #006 -->' +
          '<div class="empty-illust" aria-hidden="true">' + iconSvg('sprout') + '</div>' +
          '<h2 class="empty-title">' + esc(t('wrong.empty.title')) + '</h2>' +
          '<p class="empty-body">' + esc(t('wrong.empty.body')) + '</p>' +
          '<button type="button" class="btn btn--primary" data-go-home>' + esc(t('cards_page.empty.cta')) + '</button>' +
        '</div>';
    } else {
      // filter controls
      var dynsWithWrong = [];
      var seenDyn = {};
      wrong.forEach(function (w) {
        if (!seenDyn[w.dynastyId]) { seenDyn[w.dynastyId] = true; dynsWithWrong.push(w.dynastyId); }
      });
      // 排序按 DYNASTY_ORDER
      dynsWithWrong.sort(function (a, b) { return DYNASTY_ORDER.indexOf(a) - DYNASTY_ORDER.indexOf(b); });

      html += '' +
        '<div class="wrong-filter">' +
          // Mobile: native select
          '<select class="wrong-filter__select" id="wrong-filter-select" aria-label="' + esc(t('wrong.filter.by_dynasty')) + '">' +
            '<option value="">' + esc(t('wrong.filter.all') + ' (' + wrong.length + ')') + '</option>' +
            dynsWithWrong.map(function (d) {
              var cnt = wrong.filter(function (w) { return w.dynastyId === d; }).length;
              return '<option value="' + d + '"' + (filterDyn === d ? ' selected' : '') + '>' + esc(t('dynasty.' + d + '.name') + ' (' + cnt + ')') + '</option>';
            }).join('') +
          '</select>' +
          // Tablet+: tab list
          '<div class="wrong-filter__tabs" role="tablist" aria-label="' + esc(t('wrong.filter.by_dynasty')) + '">' +
            '<button type="button" class="wrong-filter__tab" role="tab" aria-selected="' + (!filterDyn ? 'true' : 'false') + '" data-filter="">' +
              esc(t('wrong.filter.all') + ' (' + wrong.length + ')') +
            '</button>' +
            dynsWithWrong.map(function (d) {
              var cnt = wrong.filter(function (w) { return w.dynastyId === d; }).length;
              return '<button type="button" class="wrong-filter__tab" role="tab" aria-selected="' + (filterDyn === d ? 'true' : 'false') + '" data-filter="' + d + '">' + esc(t('dynasty.' + d + '.name') + ' (' + cnt + ')') + '</button>';
            }).join('') +
          '</div>' +
        '</div>';

      // Desktop: 双栏
      html += '<div class="wrong-layout wrong-layout--desktop">' +
        '<ul class="wrong-list" role="list">' +
          filtered.map(function (w, idx) {
            return renderWrongItem(w, idx, false);
          }).join('') +
        '</ul>' +
        // Desktop 右侧详情面板
        '<div class="wrong-detail-panel" id="wrong-detail-panel" role="region" aria-label="' + esc(t('wrong.item.explanation')) + '">' +
          '<p class="wrong-detail-panel__empty">' + esc(t('wrong.empty.body')) + '</p>' +
        '</div>' +
      '</div>';
    }

    html += '</main>';
    app.innerHTML = html;
    bindHeader(app);
    var t1 = $('#page-title', app); if (t1) t1.textContent = t('wrong.title');

    // wrong-empty CTA
    var goHomeBtn = $('[data-go-home]', app);
    if (goHomeBtn) goHomeBtn.addEventListener('click', function () { navigate('/home'); });

    // Mobile select
    var sel = $('#wrong-filter-select', app);
    if (sel) {
      sel.addEventListener('change', function () {
        var v = sel.value;
        navigate('/wrong' + (v ? '/' + v : ''));
      });
    }

    // Tablet+ tabs
    $$('.wrong-filter__tab', app).forEach(function (tab) {
      tab.addEventListener('click', function () {
        var v = tab.getAttribute('data-filter');
        navigate('/wrong' + (v ? '/' + v : ''));
      });
    });
    // APG Tabs pattern: ArrowLeft/Right/Home/End keyboard navigation (FIX-P3-06)
    $$('.wrong-filter__tab', app).forEach(function (tab, idx, tabs) {
      tab.addEventListener('keydown', function (e) {
        var newIdx = -1;
        if (e.key === 'ArrowRight') newIdx = (idx + 1) % tabs.length;
        else if (e.key === 'ArrowLeft') newIdx = (idx - 1 + tabs.length) % tabs.length;
        else if (e.key === 'Home') newIdx = 0;
        else if (e.key === 'End') newIdx = tabs.length - 1;
        if (newIdx >= 0) {
          e.preventDefault();
          tabs[newIdx].focus();
          var v = tabs[newIdx].getAttribute('data-filter');
          navigate('/wrong' + (v ? '/' + v : ''));
        }
      });
    });

    // wrong items: mobile inline expand / desktop active-in-panel
    $$('.wrong-item', app).forEach(function (item) {
      item.addEventListener('click', function () {
        if (window.innerWidth >= 1024) {
          // Desktop: set active + update right panel
          $$('.wrong-item', app).forEach(function (it) {
            it.classList.remove('wrong-item--active');
            it.setAttribute('aria-expanded', 'false');
          });
          item.classList.add('wrong-item--active');
          item.setAttribute('aria-expanded', 'true');
          var idx = +item.getAttribute('data-idx');
          var w = filtered[idx];
          renderWrongDetailPanel(w);
        } else {
          // Mobile/Tablet: inline expand toggle, 其他折叠
          var wasExpanded = item.getAttribute('aria-expanded') === 'true';
          $$('.wrong-item', app).forEach(function (it) {
            it.setAttribute('aria-expanded', 'false');
            var d = it.querySelector('.wrong-item__detail');
            if (d) d.setAttribute('aria-hidden', 'true');
          });
          item.setAttribute('aria-expanded', wasExpanded ? 'false' : 'true');
          var detail = item.querySelector('.wrong-item__detail');
          if (detail) detail.setAttribute('aria-hidden', wasExpanded ? 'true' : 'false');
        }
      });
    });

    // Desktop: 默认选中第一项展开
    if (window.innerWidth >= 1024 && filtered && filtered.length > 0) {
      var firstItem = $('.wrong-item', app);
      if (firstItem) {
        firstItem.classList.add('wrong-item--active');
        firstItem.setAttribute('aria-expanded', 'true');
        renderWrongDetailPanel(filtered[0]);
      }
    }
  }

  function renderWrongItem(w, idx, isDesktopContext) {
    var dynId = w.dynastyId;
    var q = getByPath(LOCALE[currentLang], 'quiz.questions.' + dynId + '.' + getQIdxFromId(w.questionId))
         || getByPath(LOCALE.en, 'quiz.questions.' + dynId + '.' + getQIdxFromId(w.questionId));
    if (!q) return '';

    var dynTagCls = 'wrong-item__dyn-tag';
    var myAnswerText = q['option_' + w.myAnswerIdx] || '';
    var correctText = q['option_' + w.correctAnswerIdx] || '';
    var explanation = q.explanation || '';

    var qIdx = getQIdxFromId(w.questionId);

    return '' +
      '<li><button type="button" class="wrong-item" data-idx="' + idx + '" role="button" aria-expanded="false" aria-label="' + esc(t('dynasty.' + dynId + '.name') + ' · ' + q.question) + '">' +
        '<span class="wrong-item__summary">' +
          '<span class="' + dynTagCls + '" aria-hidden="true">' + esc(t('dynasty.' + dynId + '.name')) + '</span>' +
          '<span class="wrong-item__meta">' +
            '<span class="wrong-item__q-label" aria-hidden="true">' + esc(t('quiz.progress', { current: qIdx + 1, total: QUIZ_META[dynId] ? QUIZ_META[dynId].count : 5 })) + '</span>' +
            '<span class="wrong-item__q-text">' + esc(q.question) + '</span>' +
          '</span>' +
          '<span class="wrong-item__arrow" aria-hidden="true">' + iconSvg('arrow-right') + '</span>' +
        '</span>' +
        '<span class="wrong-item__detail" aria-hidden="true">' +
          '<span class="wrong-block wrong-block--my">' +
            '<span class="wrong-block__label">' + esc(t('wrong.item.your_answer')) + '</span>' +
            '<span class="wrong-block__text">' + esc(['A', 'B', 'C', 'D'][w.myAnswerIdx] + '. ' + myAnswerText) + '</span>' +
          '</span>' +
          '<span class="wrong-block wrong-block--correct">' +
            '<span class="wrong-block__label">' + iconSvg('check') + ' ' + esc(t('wrong.item.correct_answer')) + '</span>' +
            '<span class="wrong-block__text">' + esc(['A', 'B', 'C', 'D'][w.correctAnswerIdx] + '. ' + correctText) + '</span>' +
          '</span>' +
          '<span class="wrong-block wrong-block--explanation">' +
            '<span class="wrong-block__label">' + esc(t('wrong.item.explanation')) + '</span>' +
            '<span class="wrong-block__text">' + esc(explanation) + '</span>' +
          '</span>' +
        '</span>' +
      '</button></li>';
  }

  function renderWrongDetailPanel(w) {
    if (!w) return;
    var panel = $('#wrong-detail-panel');
    if (!panel) return;
    var dynId = w.dynastyId;
    var qIdx = getQIdxFromId(w.questionId);
    var q = getByPath(LOCALE[currentLang], 'quiz.questions.' + dynId + '.' + qIdx)
         || getByPath(LOCALE.en, 'quiz.questions.' + dynId + '.' + qIdx);
    if (!q) return;

    var myAnswerText = q['option_' + w.myAnswerIdx] || '';
    var correctText = q['option_' + w.correctAnswerIdx] || '';
    var explanation = q.explanation || '';

    panel.innerHTML = '' +
      '<h2 class="wrong-detail-panel__q">' + esc(q.question) + '</h2>' +
      '<div class="wrong-detail-panel__blocks">' +
        '<div class="wrong-block wrong-block--my">' +
          '<span class="wrong-block__label">' + esc(t('wrong.item.your_answer')) + '</span>' +
          '<span class="wrong-block__text">' + esc(['A', 'B', 'C', 'D'][w.myAnswerIdx] + '. ' + myAnswerText) + '</span>' +
        '</div>' +
        '<div class="wrong-block wrong-block--correct">' +
          '<span class="wrong-block__label">' + iconSvg('check') + ' ' + esc(t('wrong.item.correct_answer')) + '</span>' +
          '<span class="wrong-block__text">' + esc(['A', 'B', 'C', 'D'][w.correctAnswerIdx] + '. ' + correctText) + '</span>' +
        '</div>' +
        '<div class="wrong-block wrong-block--explanation">' +
          '<span class="wrong-block__label">' + esc(t('wrong.item.explanation')) + '</span>' +
          '<span class="wrong-block__text">' + esc(explanation) + '</span>' +
        '</div>' +
      '</div>';
  }

  function getQIdxFromId(qid) {
    // questionId 形如 "xia-q01" → 0
    var m = /q(\d+)/.exec(qid || '');
    return m ? Math.max(0, parseInt(m[1], 10) - 1) : 0;
  }

  /* ==============================================================
     12. Boot
     ============================================================== */

  function boot() {
    loadLocales();
    var state = readState();
    // 应用语言
    if (state.lang) currentLang = state.lang;
    else {
      currentLang = (navigator.language || 'zh').toLowerCase().indexOf('zh') === 0 ? 'zh' : 'en';
    }
    document.documentElement.setAttribute('lang', currentLang);
    // 主题（已在 head 预应用，这里再次确保）
    applyTheme();
    // 初次路由渲染
    render();
    // Skip Link 等 #app 外静态 [data-i18n] 节点 · FIX-P3-09 · 2026-04-17
    applyTranslations();

    // Storage 不可用提示
    if (!storageAvailable) {
      setTimeout(function () { showToast(t('error.storage_unavailable'), 4000); }, 500);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  // 对外 debug 接口
  window.__CA__ = {
    readState: readState, writeState: writeState, updateState: updateState,
    t: t, navigate: navigate, DYNASTY_ORDER: DYNASTY_ORDER, setLang: setLang, setTheme: setTheme,
    getDynastyState: getDynastyState
  };
})();
