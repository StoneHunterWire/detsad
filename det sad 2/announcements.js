/**
 * Новости в localStorage.
 * MbouAnnouncements.seedIfNeeded() — новости по умолчанию (см. версию).
 */
(function (global) {
  var KEY_NEWS = 'mbouApelsinNews';
  var KEY_NEWS_BUNDLE = 'mbouApelsinNewsBundleVersion';
  var NEWS_BUNDLE_VERSION = '3';

  var DEFAULT_NEWS = [
    {
      id: 'default-news-2026-05-23',
      title: '23 мая 2026 г. — Спортивный праздник',
      body: 'Все группы — эстафеты и подвижные игры на площадке.',
      image: 'assets/news-sports-day.png',
      createdAt: new Date('2026-05-23T12:00:00').getTime()
    },
    {
      id: 'default-news-2026-05-09',
      title: '9 мая 2026 г. — День Победы!',
      body: 'Утренник для родителей, начало в 9:30.',
      image: 'assets/news-victory-day.png',
      createdAt: new Date('2026-05-09T12:00:00').getTime()
    }
  ];

  function parse(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      if (!raw) return fallback.slice ? fallback.slice() : fallback;
      var data = JSON.parse(raw);
      return Array.isArray(data) ? data : fallback.slice ? fallback.slice() : fallback;
    } catch (e) {
      return fallback.slice ? fallback.slice() : fallback;
    }
  }

  function saveNews(items) {
    try {
      localStorage.setItem(KEY_NEWS, JSON.stringify(items));
    } catch (e) {
      /* ignore */
    }
  }

  function applyBundledNewsDefaults() {
    try {
      if (localStorage.getItem(KEY_NEWS_BUNDLE) === NEWS_BUNDLE_VERSION) return;
      saveNews(DEFAULT_NEWS.slice());
      localStorage.setItem(KEY_NEWS_BUNDLE, NEWS_BUNDLE_VERSION);
    } catch (e) {
      /* ignore */
    }
  }

  function seedIfNeeded() {
    applyBundledNewsDefaults();
  }

  function fillNewsCardArticle(art, n) {
    art.className = 'news-card';
    var h = document.createElement('h3');
    h.textContent = n.title || '';
    var meta = document.createElement('div');
    meta.className = 'news-card-meta';
    if (n.createdAt) {
      meta.textContent = new Date(n.createdAt).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    }
    art.appendChild(h);
    if (meta.textContent) art.appendChild(meta);
    if (n.image) {
      var img = document.createElement('img');
      img.className = 'news-card-image';
      img.src = n.image;
      img.alt = '';
      img.loading = 'lazy';
      art.appendChild(img);
    }
    var p = document.createElement('p');
    p.textContent = n.body || '';
    art.appendChild(p);
  }

  global.MbouAnnouncements = {
    KEY_NEWS: KEY_NEWS,
    seedIfNeeded: seedIfNeeded,
    fillNewsCardArticle: fillNewsCardArticle,
    loadNews: function () {
      return parse(KEY_NEWS, []).slice().sort(function (a, b) {
        return (b.createdAt || 0) - (a.createdAt || 0);
      });
    },
    saveNews: saveNews
  };
})(typeof window !== 'undefined' ? window : this);
