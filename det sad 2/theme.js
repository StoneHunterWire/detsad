/**
 * Тёмная тема: класс theme-dark на documentElement и body, ключ mbouApelsinTheme.
 * Кнопки с атрибутом data-theme-toggle переключают тему.
 */
(function () {
  var STORAGE_KEY = 'mbouApelsinTheme';

  function getStoredTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function saveTheme(mode) {
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch (e) {
      /* ignore */
    }
  }

  function isDark() {
    return document.documentElement.classList.contains('theme-dark');
  }

  function applyTheme(mode) {
    var dark = mode === 'dark';
    document.documentElement.classList.toggle('theme-dark', dark);
    if (document.body) {
      document.body.classList.toggle('theme-dark', dark);
    }
    document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
      btn.setAttribute('aria-pressed', dark ? 'true' : 'false');
      var label = dark ? 'Светлая тема' : 'Тёмная тема';
      btn.setAttribute('aria-label', label);
      btn.setAttribute('title', label);
      var icon = btn.querySelector('.theme-toggle-icon');
      if (icon) {
        icon.textContent = dark ? '☀️' : '🌙';
      }
    });
  }

  function resolveInitial() {
    var saved = getStoredTheme();
    if (saved === 'dark' || saved === 'light') {
      return saved;
    }
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  function init() {
    applyTheme(resolveInitial());

    document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var next = isDark() ? 'light' : 'dark';
        saveTheme(next);
        applyTheme(next);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
