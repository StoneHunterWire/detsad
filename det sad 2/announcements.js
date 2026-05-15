/**
 * Новости и события в localStorage.
 * MbouAnnouncements.seedIfNeeded() — события при первом запуске; новости — комплект по умолчанию (см. версию).
 */
(function (global) {
  var KEY_NEWS = 'mbouApelsinNews';
  var KEY_EVENTS = 'mbouApelsinEvents';
  var KEY_SEED = 'mbouApelsinAnnouncementsSeeded';
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

  function demoEvents() {
    var y = new Date().getFullYear();
    var m = String(new Date().getMonth() + 1).padStart(2, '0');
    return [
      {
        id: 'demo-ev-1',
        date: y + '-' + m + '-09',
        title: 'День семьи',
        description: 'Утренник для родителей, начало в 9:30.',
        createdAt: Date.now() - 86400000 * 5
      },
      {
        id: 'demo-ev-2',
        date: y + '-' + m + '-15',
        title: 'Тематическая неделя «Весна»',
        description: 'Экскурсия на участок, наблюдение за распуском почек.',
        createdAt: Date.now() - 86400000 * 4
      },
      {
        id: 'demo-ev-3',
        date: y + '-' + m + '-23',
        title: 'Спортивный праздник',
        description: 'Все группы — эстафеты и подвижные игры на площадке.',
        createdAt: Date.now() - 86400000 * 3
      },
      {
        id: 'demo-ev-4',
        date: y + '-' + m + '-28',
        title: 'Концерт к 8 Марта',
        description: 'Подготовительная группа — репетиция утром, выступление после обеда.',
        createdAt: Date.now() - 86400000 * 2
      }
    ];
  }

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

  function saveEvents(items) {
    try {
      localStorage.setItem(KEY_EVENTS, JSON.stringify(items));
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
    try {
      if (localStorage.getItem(KEY_SEED)) return;
      var events = parse(KEY_EVENTS, []);
      if (!events.length) {
        saveEvents(demoEvents());
      }
      localStorage.setItem(KEY_SEED, '1');
    } catch (e) {
      /* ignore */
    }
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
    KEY_EVENTS: KEY_EVENTS,
    seedIfNeeded: seedIfNeeded,
    fillNewsCardArticle: fillNewsCardArticle,
    loadNews: function () {
      return parse(KEY_NEWS, []).slice().sort(function (a, b) {
        return (b.createdAt || 0) - (a.createdAt || 0);
      });
    },
    loadEvents: function () {
      return parse(KEY_EVENTS, []).slice().sort(function (a, b) {
        return String(a.date).localeCompare(String(b.date));
      });
    },
    saveNews: saveNews,
    saveEvents: saveEvents
  };
})(typeof window !== 'undefined' ? window : this);
