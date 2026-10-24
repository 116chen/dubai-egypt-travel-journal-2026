(() => {
  'use strict';

  const data = window.TRAVEL_DATA;
  if (!data?.photos?.length || !data?.content) return;

  const { photos, aliases, content } = data;
  const photoById = new Map(photos.map(photo => [photo.id, photo]));
  const $ = selector => document.querySelector(selector);
  const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
  const photoFor = filename => photoById.get(aliases[filename.toUpperCase()]);
  const dateLabel = date => date.replace('2026-', '').replace('-', '.');
  const photoButton = (photo, caption, group, useThumbnail = false, extraClass = '') => `
    <button class="photo-button ${extraClass}" data-photo="${photo.id}" data-group="${group}" aria-label="放大照片：${escapeHTML(caption)}">
      <img src="${useThumbnail ? photo.thumb : photo.src}" width="${photo.width}" height="${photo.height}" loading="lazy" decoding="async" alt="${escapeHTML(caption)}">
    </button>`;

  const groups = new Map();
  groups.set('cover', [photoFor(content.hero), ...content.hero_small.map(photoFor)]);
  let selectedDay = 1;
  let country = '全部';
  let date = '全部';
  let filteredPhotos = photos;
  let visibleCount = 0;
  const pageSize = 24;
  const galleryGrid = $('#photo-grid');
  const dayRepresentatives = [
    null, 'P1018502.jpg', 'IMG_9466.JPG', 'P1018550.jpg',
    'P1019037.jpg', 'P1019133.jpg', 'P1019238.jpg', null,
    'P1029600.jpg', 'P1029696.jpg', 'IMG_9694.JPG'
  ];

  function renderDayList() {
    $('#day-list').innerHTML = content.days.map((day, index) => `
      <button class="day-button${index === selectedDay ? ' active' : ''}" data-day="${index}" aria-pressed="${index === selectedDay}" aria-controls="day-panel">
        <span class="day-date">${day.label}</span><span class="day-city">${escapeHTML(day.city)}</span><span class="day-arrow" aria-hidden="true">↗</span>
      </button>`).join('');
  }

  function renderDayPanel() {
    const day = content.days[selectedDay];
    const dayPhotos = photos.filter(photo => photo.date === day.date);
    groups.set('day', dayPhotos);
    const primary = dayRepresentatives[selectedDay]
      ? photoFor(dayRepresentatives[selectedDay])
      : dayPhotos.find(photo => photo.width > photo.height) || dayPhotos[0];
    $('#day-panel').innerHTML = `
      <figure class="day-photo">${photoButton(primary, primary.caption, 'day')}</figure>
      <div class="day-panel-head">
        <p class="eyebrow">${day.label} · ${escapeHTML(day.city)}</p>
        <div class="day-switch">
          <button data-day-step="-1" aria-label="前一天" ${selectedDay === 0 ? 'disabled' : ''}>←</button>
          <button data-day-step="1" aria-label="后一天" ${selectedDay === content.days.length - 1 ? 'disabled' : ''}>→</button>
        </div>
      </div>
      <h3>${escapeHTML(day.title)}</h3>
      <p class="day-description">${escapeHTML(day.text)}</p>
      <ul class="stops" aria-label="当天经过的地点">${day.stops.map(stop => `<li>${escapeHTML(stop)}</li>`).join('')}</ul>
      <a href="#gallery" class="day-gallery-link" data-day-gallery="${day.date}">翻看这一天的 ${dayPhotos.length} 张照片 <span aria-hidden="true">↗</span></a>`;
  }

  function selectDay(index) {
    selectedDay = Math.max(0, Math.min(content.days.length - 1, index));
    document.querySelectorAll('.day-button').forEach(button => {
      const active = Number(button.dataset.day) === selectedDay;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    renderDayPanel();
  }

  renderDayList();
  renderDayPanel();
  $('#day-list').addEventListener('click', event => {
    const button = event.target.closest('[data-day]');
    if (button) selectDay(Number(button.dataset.day));
  });
  $('#day-panel').addEventListener('click', event => {
    const step = event.target.closest('[data-day-step]');
    if (step) {
      const direction = Number(step.dataset.dayStep);
      selectDay(selectedDay + direction);
      const nextStep = $(`[data-day-step="${direction}"]`);
      if (nextStep?.disabled) $(`[data-day-step="${-direction}"]`)?.focus({ preventScroll: true });
      else nextStep?.focus({ preventScroll: true });
    }
    const link = event.target.closest('[data-day-gallery]');
    if (link) {
      country = '全部';
      date = link.dataset.dayGallery;
      updateGallery();
    }
  });

  $('#chapter-list').innerHTML = content.chapters.map(chapter => {
    const chapterPhotos = chapter.photos.map(photoFor);
    groups.set(chapter.id, chapterPhotos);
    return `
      <article class="chapter chapter-${chapter.id} wrap" id="${chapter.id}" aria-labelledby="title-${chapter.id}">
        <div class="chapter-intro">
          <span class="chapter-number" aria-hidden="true">${chapter.number}</span>
          <div><p class="eyebrow">${escapeHTML(chapter.eyebrow)}</p><h3 id="title-${chapter.id}">${escapeHTML(chapter.title)}</h3></div>
          <p>${escapeHTML(chapter.text)}</p>
        </div>
        <div class="chapter-photos">${chapterPhotos.map((photo, index) => `
          <figure>${photoButton(photo, chapter.captions[index], chapter.id)}
            <figcaption><span class="mono">${String(index + 1).padStart(2, '0')}</span><span>${escapeHTML(chapter.captions[index])}</span></figcaption>
          </figure>`).join('')}</div>
      </article>`;
  }).join('');

  const storageKey = 'dubai-egypt-journey-2026-memories-v1';
  const storyTexts = new Map(content.stories.map(story => [story.id, story.text]));
  let editing = false;
  let storedNotes;
  try {
    storedNotes = JSON.parse(localStorage.getItem(storageKey) || 'null');
  } catch {
    storedNotes = null;
  }
  if (storedNotes && typeof storedNotes === 'object' && !Array.isArray(storedNotes)) {
    for (const story of content.stories) {
      if (typeof storedNotes[story.id] === 'string') storyTexts.set(story.id, storedNotes[story.id]);
    }
  }
  groups.set('stories', content.stories.flatMap(story => [
    photoFor(story.photo), ...(story.second_photo ? [photoFor(story.second_photo)] : [])
  ]));
  $('#story-list').innerHTML = content.stories.map(story => `
    <article class="story" aria-labelledby="story-title-${story.id}">
      <div class="story-photos">
        ${photoButton(photoFor(story.photo), story.title, 'stories')}
        ${story.second_photo ? photoButton(photoFor(story.second_photo), '金字塔前的骆驼', 'stories', true, 'story-inset') : ''}
      </div>
      <p class="eyebrow">${escapeHTML(story.tag)}</p>
      <h3 id="story-title-${story.id}">${escapeHTML(story.title)}</h3>
      <p class="story-text" data-story-text="${story.id}">${escapeHTML(storyTexts.get(story.id))}</p>
      <textarea class="story-editor" data-story-editor="${story.id}" aria-label="编辑小记：${escapeHTML(story.title)}" maxlength="20000" hidden></textarea>
    </article>`).join('');

  function setEditing(value) {
    editing = value;
    for (const story of content.stories) {
      const paragraph = $(`[data-story-text="${story.id}"]`);
      const editor = $(`[data-story-editor="${story.id}"]`);
      paragraph.hidden = value;
      editor.hidden = !value;
      if (value) editor.value = storyTexts.get(story.id);
      else paragraph.textContent = storyTexts.get(story.id);
    }
    $('#edit-notes').textContent = value ? '保存小记 ✓' : '编辑小记 ↗';
    $('#cancel-notes').hidden = !value;
  }

  $('#edit-notes').addEventListener('click', () => {
    if (!editing) {
      setEditing(true);
      $('#notes-status').textContent = '小记已进入编辑状态。写好后，点击“保存小记”。';
      const firstEditor = $('[data-story-editor]');
      firstEditor.focus({ preventScroll: true });
      firstEditor.scrollIntoView({ behavior: 'auto', block: 'center' });
      return;
    }
    const updated = Object.fromEntries(content.stories.map(story => [
      story.id, $(`[data-story-editor="${story.id}"]`).value.trim()
    ]));
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch {
      $('#notes-status').textContent = '这个浏览器暂时无法保存小记。文字仍在编辑框中，可点击“导出小记”保存成文件。';
      return;
    }
    for (const story of content.stories) storyTexts.set(story.id, updated[story.id]);
    setEditing(false);
    $('#notes-status').textContent = '小记已保存，下次在这个浏览器打开会自动显示。也可以导出一份留存。';
  });
  $('#cancel-notes').addEventListener('click', () => {
    setEditing(false);
    $('#notes-status').textContent = '已取消这次编辑，保留上次的小记。';
    $('#edit-notes').focus({ preventScroll: true });
  });
  $('#export-notes').addEventListener('click', () => {
    const body = [content.title, content.subtitle, content.dates, '', ...content.stories.flatMap(story => [
      `${story.tag} · ${story.title}`,
      editing ? $(`[data-story-editor="${story.id}"]`).value : storyTexts.get(story.id),
      ''
    ])].join('\n');
    const blob = new Blob([body], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = '迪拜与埃及-旅途小记.txt';
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    $('#notes-status').textContent = '已生成小记文本文件。';
  });

  function rebuildDates() {
    const available = [...new Set(photos.filter(photo => country === '全部' || photo.country === country).map(photo => photo.date))];
    if (date !== '全部' && !available.includes(date)) date = '全部';
    $('#gallery-date').innerHTML = '<option value="全部">所有日期</option>' + available.map(value => {
      const day = content.days.find(item => item.date === value);
      return `<option value="${value}">${dateLabel(value)} · ${escapeHTML(day?.city || '')}</option>`;
    }).join('');
    $('#gallery-date').value = date;
  }

  function galleryStatus() {
    const category = [country === '全部' ? '' : country, date === '全部' ? '' : dateLabel(date)].filter(Boolean).join(' · ');
    $('#gallery-count').textContent = `${category ? `${category} · ` : ''}共 ${filteredPhotos.length} 张，已展开 ${visibleCount} 张`;
    $('#reset-filters').hidden = country === '全部' && date === '全部';
    const finished = visibleCount >= filteredPhotos.length;
    $('#load-more').hidden = finished;
    $('#gallery-end').hidden = !finished || filteredPhotos.length === 0;
  }

  function appendGallery() {
    const batch = filteredPhotos.slice(visibleCount, visibleCount + pageSize);
    const firstAdded = batch[0]?.id;
    galleryGrid.insertAdjacentHTML('beforeend', batch.map(photo => `
      <figure class="gallery-card">${photoButton(photo, photo.caption, 'gallery', true)}
        <figcaption><span class="mono">${dateLabel(photo.date)} · ${escapeHTML(photo.country)}</span><span>${escapeHTML(photo.caption)}</span></figcaption>
      </figure>`).join(''));
    visibleCount += batch.length;
    galleryStatus();
    return firstAdded;
  }

  function updateGallery() {
    rebuildDates();
    document.querySelectorAll('[data-country]').forEach(button => {
      const active = button.dataset.country === country;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    filteredPhotos = photos.filter(photo => (
      (country === '全部' || photo.country === country) &&
      (date === '全部' || photo.date === date)
    ));
    groups.set('gallery', filteredPhotos);
    visibleCount = 0;
    galleryGrid.replaceChildren();
    if (!filteredPhotos.length) {
      galleryGrid.innerHTML = '<p class="empty-gallery">这个日期暂时没有照片，可以换一个日期继续翻看。</p>';
      galleryStatus();
    } else appendGallery();
  }

  $('.country-filters').addEventListener('click', event => {
    const button = event.target.closest('[data-country]');
    if (!button) return;
    country = button.dataset.country;
    updateGallery();
  });
  $('#gallery-date').addEventListener('change', event => {
    date = event.target.value;
    updateGallery();
  });
  $('#reset-filters').addEventListener('click', () => {
    country = '全部';
    date = '全部';
    updateGallery();
    $('[data-country="全部"]').focus({ preventScroll: true });
  });
  $('#load-more').addEventListener('click', () => {
    const firstAdded = appendGallery();
    galleryGrid.querySelector(`[data-photo="${firstAdded}"]`)?.focus({ preventScroll: true });
  });
  updateGallery();

  const viewer = $('#photo-viewer');
  const viewerImage = $('#viewer-image');
  let viewerPhotos = [];
  let viewerIndex = 0;
  let returnFocus = null;

  function updateViewer() {
    const photo = viewerPhotos[viewerIndex];
    if (!photo) return;
    viewerImage.src = photo.src;
    viewerImage.alt = photo.caption;
    $('#viewer-caption').textContent = photo.caption;
    $('#viewer-meta').textContent = `${photo.date.replaceAll('-', '.')} · ${photo.country} · ${photo.place}`;
    $('#viewer-position').textContent = `${String(viewerIndex + 1).padStart(2, '0')} / ${viewerPhotos.length}`;
    $('#viewer-download').href = photo.src;
    $('#viewer-download').download = `${photo.date}-${photo.file.replace(/\.[^.]+$/, '')}.webp`;
    $('#viewer-prev').disabled = viewerIndex === 0;
    $('#viewer-next').disabled = viewerIndex === viewerPhotos.length - 1;
  }

  function openViewer(button) {
    const photo = photoById.get(button.dataset.photo);
    if (!photo) return;
    viewerPhotos = groups.get(button.dataset.group || 'cover') || [photo];
    viewerIndex = viewerPhotos.findIndex(item => item.id === photo.id);
    if (viewerIndex < 0) {
      viewerPhotos = [photo];
      viewerIndex = 0;
    }
    returnFocus = button;
    updateViewer();
    document.body.classList.add('viewer-open');
    viewer.showModal();
    $('#viewer-close').focus({ preventScroll: true });
  }

  function moveViewer(direction) {
    viewerIndex = Math.max(0, Math.min(viewerPhotos.length - 1, viewerIndex + direction));
    updateViewer();
  }
  document.addEventListener('click', event => {
    const button = event.target.closest('[data-photo]');
    if (button) openViewer(button);
  });
  $('#viewer-close').addEventListener('click', () => viewer.close());
  $('#viewer-prev').addEventListener('click', () => moveViewer(-1));
  $('#viewer-next').addEventListener('click', () => moveViewer(1));
  viewer.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      moveViewer(event.key === 'ArrowLeft' ? -1 : 1);
    }
  });
  viewer.addEventListener('close', () => {
    document.body.classList.remove('viewer-open');
    returnFocus?.focus({ preventScroll: true });
    viewerImage.removeAttribute('src');
  });
  let touchStart;
  viewerImage.addEventListener('touchstart', event => {
    if (event.touches.length !== 1) {
      touchStart = null;
      return;
    }
    touchStart = { x: event.touches[0].clientX, y: event.touches[0].clientY };
  }, { passive: true });
  viewerImage.addEventListener('touchend', event => {
    if (!touchStart || !event.changedTouches[0]) return;
    const deltaX = event.changedTouches[0].clientX - touchStart.x;
    const deltaY = event.changedTouches[0].clientY - touchStart.y;
    if (Math.abs(deltaX) > 60 && Math.abs(deltaX) > Math.abs(deltaY) * 1.4) moveViewer(deltaX < 0 ? 1 : -1);
    touchStart = null;
  }, { passive: true });

  if ('IntersectionObserver' in window) {
    const navLinks = [...document.querySelectorAll('.masthead nav a')];
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        navLinks.forEach(link => link.classList.toggle('current', link.hash === `#${entry.target.id}`));
      }
    }, { rootMargin: '-15% 0px -70% 0px', threshold: 0 });
    navLinks.forEach(link => {
      const section = $(link.hash);
      if (section) observer.observe(section);
    });
  }
})();
