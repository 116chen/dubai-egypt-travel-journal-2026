(function () {
  "use strict";
  const data = window.JOURNAL_DATA;
  const photos = new Map(data.photos.map(p => [p.id, p]));
  const galleryPhotos = data.galleryIds.map(id => photos.get(id));
  const pageSize = 24;
  const state = { country: "全部", date: "all", page: 1, items: galleryPhotos };
  const reader = document.getElementById("reader-dialog");
  const viewer = document.getElementById("viewer-dialog");
  const toast = document.getElementById("toast");
  const notesKey = "nile-gulf-journal-v3-notes";
  let toastTimer;
  let viewerItems = [];
  let viewerIndex = 0;
  let readerFocus;
  let viewerFocus;
  let notes = {};
  let eraFilter = "全部";

  const escape = value => String(value).replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[c]);
  const country = photo => photo.country === "迪拜" ? "阿联酋" : photo.country;
  const dateFormatter = new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit", day: "2-digit", timeZone: "UTC"
  });
  const shortDate = date => dateFormatter.format(new Date(date + "T00:00:00Z")).replace("/", ".");

  function synchronizeURL() {
    const url = new URL(location.href);
    const values = { country: state.country, date: state.date, page: String(state.page), era: eraFilter };
    const defaults = { country: "全部", date: "all", page: "1", era: "全部" };
    Object.entries(values).forEach(([key, value]) => {
      if (value === defaults[key]) url.searchParams.delete(key);
      else url.searchParams.set(key, value);
    });
    if (url.href !== location.href) {
      try { history.replaceState(null, "", url); } catch {}
    }
  }

  function applyEra(era) {
    eraFilter = era;
    document.querySelectorAll("[data-era-filter]").forEach(tab => {
      const selected = tab.dataset.eraFilter === era;
      tab.classList.toggle("active", selected);
      tab.setAttribute("aria-pressed", String(selected));
    });
    document.querySelectorAll(".history-card").forEach(card => {
      card.hidden = era !== "全部" && card.dataset.era !== era;
    });
    synchronizeURL();
  }

  function notify(message) {
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.hidden = false;
    toastTimer = setTimeout(() => { toast.hidden = true; }, 4000);
  }

  function updateLock() {
    document.body.classList.toggle("locked", reader.open || viewer.open);
  }

  function openReader(id, trigger) {
    const template = document.getElementById("history-template-" + id);
    if (!template) return;
    readerFocus = trigger || document.activeElement;
    const container = document.getElementById("reader-content");
    container.replaceChildren(template.content.cloneNode(true));
    reader.showModal();
    reader.scrollTop = 0;
    updateLock();
    reader.querySelector(".close-dialog").focus({ preventScroll: true });
  }

  function setViewerImage() {
    const photo = viewerItems[viewerIndex];
    if (!photo) return;
    const img = document.getElementById("viewer-image");
    img.src = photo.src;
    img.alt = photo.caption;
    img.width = photo.width;
    img.height = photo.height;
    document.getElementById("viewer-caption").textContent = photo.caption;
    document.getElementById("viewer-meta").textContent =
      photo.date.replaceAll("-", ".") + " · " + country(photo) + " · " + photo.place;
    document.getElementById("viewer-position").textContent =
      String(viewerIndex + 1).padStart(2, "0") + " / " + viewerItems.length + " · 精选照片";
    document.getElementById("viewer-original").href = photo.src;
    const isSingle = viewerItems.length < 2;
    document.getElementById("viewer-prev").disabled = isSingle;
    document.getElementById("viewer-next").disabled = isSingle;
  }

  function contextPhotos(context) {
    if (context === "gallery") return state.items;
    if (context === "cover") return data.coverIds.map(id => photos.get(id));
    if (context === "stories") return data.storyIds.map(id => photos.get(id));
    if (context?.startsWith("map-")) {
      const place = window.TRAVEL_MAP_DATA?.locations.find(place => place.id === context.slice(4));
      return (place?.photos || []).map(id => photos.get(id));
    }
    if (data.chapterPhotos[context]) return data.chapterPhotos[context].map(id => photos.get(id));
    if (context?.startsWith("history-")) {
      return (data.historyPhotos[context.slice(8)] || []).map(id => photos.get(id));
    }
    return data.photos;
  }

  function openViewer(id, items, trigger) {
    viewerItems = items.filter(Boolean);
    viewerIndex = viewerItems.findIndex(p => p.id === id);
    if (viewerIndex < 0 || !viewerItems.length) return;
    viewerFocus = trigger || document.activeElement;
    setViewerImage();
    viewer.showModal();
    updateLock();
    viewer.querySelector(".close-dialog").focus({ preventScroll: true });
  }

  function changePhoto(direction) {
    if (viewerItems.length < 2) return;
    viewerIndex = (viewerIndex + direction + viewerItems.length) % viewerItems.length;
    setViewerImage();
  }

  reader.addEventListener("close", () => {
    updateLock();
    if (readerFocus?.isConnected) readerFocus.focus({ preventScroll: true });
  });
  viewer.addEventListener("close", () => {
    updateLock();
    document.getElementById("viewer-image").removeAttribute("src");
    if (viewerFocus?.isConnected) viewerFocus.focus({ preventScroll: true });
  });
  [reader, viewer].forEach(dialog => {
    dialog.addEventListener("click", event => {
      if (event.target !== dialog) return;
      const r = dialog.getBoundingClientRect();
      if (event.clientX < r.left || event.clientX > r.right ||
          event.clientY < r.top || event.clientY > r.bottom) dialog.close();
    });
  });
  document.getElementById("viewer-prev").addEventListener("click", () => changePhoto(-1));
  document.getElementById("viewer-next").addEventListener("click", () => changePhoto(1));
  document.addEventListener("keydown", event => {
    if (!viewer.open) return;
    if (event.key === "ArrowLeft") { event.preventDefault(); changePhoto(-1); }
    if (event.key === "ArrowRight") { event.preventDefault(); changePhoto(1); }
    if (event.key === "Home") { event.preventDefault(); viewerIndex = 0; setViewerImage(); }
    if (event.key === "End") { event.preventDefault(); viewerIndex = viewerItems.length - 1; setViewerImage(); }
  });

  function filterGallery() {
    state.items = galleryPhotos.filter(p =>
      (state.country === "全部" || country(p) === state.country) &&
      (state.date === "all" || p.date === state.date)
    );
    state.page = 1;
    renderGallery();
  }

  function renderGallery() {
    const totalPages = Math.max(1, Math.ceil(state.items.length / pageSize));
    state.page = Math.min(state.page, totalPages);
    const start = (state.page - 1) * pageSize;
    const items = state.items.slice(start, start + pageSize);
    document.getElementById("gallery-grid").innerHTML = items.length
      ? items.map(p => `<figure class="gallery-item">
        <button class="photo-button" data-photo="${p.id}" data-context="gallery" aria-label="放大查看：${escape(p.caption)}">
          <img src="${p.thumb}" width="480" height="${Math.round(480 * p.height / p.width)}" alt="${escape(p.caption)}" loading="lazy" decoding="async">
        </button><figcaption><div class="photo-meta"><span>${shortDate(p.date)}</span><span>${country(p)}</span></div>${escape(p.caption)}</figcaption>
      </figure>`).join("")
      : '<p class="empty-state">这个国家与日期组合没有余下照片。请选择其他日期，或在逐日行程中查看当日全部精选。</p>';
    document.getElementById("gallery-count").textContent =
      `${state.items.length} 张 · 第${state.page} / ${totalPages}页`;
    const numbers = Array.from({ length: totalPages }, (_, i) => i + 1);
    document.getElementById("pagination").innerHTML =
      `<button data-page="${state.page - 1}" ${state.page === 1 ? "disabled" : ""} aria-label="上一页照片">←</button>` +
      numbers.map(n => `<button data-page="${n}" ${n === state.page ? 'aria-current="page"' : ""} aria-label="第${n}页照片">${n}</button>`).join("") +
      `<button data-page="${state.page + 1}" ${state.page === totalPages ? "disabled" : ""} aria-label="下一页照片">→</button>`;
    synchronizeURL();
  }

  document.getElementById("gallery-date").addEventListener("change", event => {
    state.date = event.target.value;
    filterGallery();
  });
  document.getElementById("pagination").addEventListener("click", event => {
    const button = event.target.closest("[data-page]");
    if (!button || button.disabled) return;
    state.page = Number(button.dataset.page);
    renderGallery();
    document.getElementById("gallery-count").scrollIntoView({
      block: "start", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth"
    });
    document.querySelector(`#pagination [aria-current="page"]`)?.focus({ preventScroll: true });
  });

  const allDays = Array.from(document.querySelectorAll(".day"));
  const toggleDays = document.getElementById("toggle-days");
  function updateDaysToggle() {
    const open = allDays.every(day => day.open);
    toggleDays.textContent = open ? "全部收起 −" : "全部展开 +";
    toggleDays.setAttribute("aria-expanded", String(open));
  }
  toggleDays.addEventListener("click", () => {
    const open = !allDays.every(day => day.open);
    allDays.forEach(day => { day.open = open; });
    updateDaysToggle();
  });
  allDays.forEach(day => day.addEventListener("toggle", updateDaysToggle));

  function openSources() {
    document.getElementById("source-details").open = true;
  }
  function revealTarget(id) {
    const element = document.getElementById(id);
    if (!element) return;
    let ancestor = element;
    while (ancestor) {
      if (ancestor.tagName === "DETAILS") ancestor.open = true;
      ancestor = ancestor.parentElement;
    }
    const fold = element.querySelector(".content-disclosure");
    if (fold) fold.open = true;
  }
  document.addEventListener("click", event => {
    const target = event.target.closest("button, a");
    if (!target) return;
    if (target.dataset.history) openReader(target.dataset.history, target);
    if (target.dataset.photo) openViewer(
      target.dataset.photo, contextPhotos(target.dataset.context), target
    );
    if (target.dataset.close === "reader") reader.close();
    if (target.dataset.close === "viewer") viewer.close();
    if (target.dataset.dayAlbum) {
      const items = data.photos.filter(p => p.date === target.dataset.dayAlbum);
      if (items.length) openViewer(items[0].id, items, target);
    }
    if (target.dataset.mapAlbum) {
      const items = contextPhotos("map-" + target.dataset.mapAlbum);
      if (items.length) openViewer(items[0].id, items, target);
    }
    if (target.dataset.jumpDay) {
      const day = document.getElementById("day-" + target.dataset.jumpDay);
      if (day) day.open = true;
    }
    const anchor = target.getAttribute("href");
    if (anchor?.startsWith("#")) revealTarget(anchor.slice(1));
    if (target.dataset.eraFilter) {
      applyEra(target.dataset.eraFilter);
    }
    if (target.dataset.countryFilter) {
      state.country = target.dataset.countryFilter;
      document.querySelectorAll("[data-country-filter]").forEach(tab => {
        tab.classList.toggle("active", tab === target);
        tab.setAttribute("aria-pressed", String(tab === target));
      });
      filterGallery();
    }
    if (target.getAttribute("href")?.startsWith("#cite-")) {
      openSources();
      if (reader.open) reader.close();
    }
    if (target.dataset.edit) editNote(target.dataset.edit);
    if (target.dataset.save) saveNote(target.dataset.save);
    if (target.dataset.cancel) cancelNote(target.dataset.cancel);
  });

  try {
    const parsed = JSON.parse(localStorage.getItem(notesKey) || "{}");
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) notes = parsed;
  } catch { notes = {}; }
  function noteText(id) {
    const original = data.stories.find(story => story.id === id)?.text || "";
    return typeof notes[id] === "string" ? notes[id] : original;
  }
  data.stories.forEach(story => {
    const text = noteText(story.id);
    document.getElementById("story-text-" + story.id).textContent = text;
    document.getElementById("note-" + story.id).value = text;
    if (typeof notes[story.id] === "string") {
      document.getElementById("note-state-" + story.id).textContent = "已保存";
    }
  });
  function editNote(id) {
    const editor = document.getElementById("editor-" + id);
    editor.hidden = false;
    document.getElementById("note-" + id).value = noteText(id);
    document.getElementById("note-" + id).focus();
  }
  function cancelNote(id) {
    document.getElementById("editor-" + id).hidden = true;
    document.querySelector(`[data-edit="${id}"]`).focus();
  }
  function saveNote(id) {
    const text = document.getElementById("note-" + id).value.trim();
    notes[id] = text;
    document.getElementById("story-text-" + id).textContent = text;
    let stored = false;
    try { localStorage.setItem(notesKey, JSON.stringify(notes)); stored = true; } catch {}
    document.getElementById("note-state-" + id).textContent = stored ? "已保存" : "本次已更新";
    cancelNote(id);
    notify(stored ? "小记已保存在当前浏览器" : "小记已更新；当前浏览器不能保存，请导出留存");
  }
  addEventListener("beforeunload", event => {
    const unsaved = data.stories.some(story => {
      const editor = document.getElementById("editor-" + story.id);
      return !editor.hidden && document.getElementById("note-" + story.id).value.trim() !== noteText(story.id);
    });
    if (unsaved) {
      event.preventDefault();
      event.returnValue = "";
    }
  });
  document.getElementById("export-notes").addEventListener("click", () => {
    const lines = ["# 从尼罗河，到波斯湾。", "", "埃及与迪拜 · 2026.09.30—10.11 · 旅途小记", ""];
    data.stories.forEach(story => lines.push(
      "## " + story.title, "", story.dateLabel || "", "",
      noteText(story.id), ""
    ));
    const blob = new Blob(["\uFEFF" + lines.join("\n")], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "埃及迪拜-旅途小记.md";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
    notify("小记已导出");
  });

  const progress = document.querySelector(".scroll-progress");
  let scrollPending = false;
  function updateProgress() {
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.width = (max > 0 ? scrollY / max * 100 : 0) + "%";
    scrollPending = false;
  }
  addEventListener("scroll", () => {
    if (!scrollPending) { scrollPending = true; requestAnimationFrame(updateProgress); }
  }, { passive: true });
  addEventListener("resize", updateProgress);
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      const entry = entries.filter(e => e.isIntersecting).sort((a, b) =>
        a.boundingClientRect.top - b.boundingClientRect.top
      )[0];
      if (!entry) return;
      document.querySelectorAll(".nav-links a").forEach(a =>
        a.classList.toggle("active", a.hash === "#" + entry.target.id)
      );
    }, { rootMargin: "-60px 0px -60% 0px", threshold: 0 });
    ["route-map", "chapters", "history", "itinerary", "stories", "gallery", "sources"].forEach(id =>
      observer.observe(document.getElementById(id))
    );
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const reveal = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("revealed");
          reveal.unobserve(entry.target);
        });
      }, { threshold: 0, rootMargin: "0px 0px 30px 0px" });
      document.querySelectorAll(".chapter-grid, .story, .section-heading").forEach(element => {
        element.classList.add("reveal");
        reveal.observe(element);
      });
      document.body.classList.add("js-reveal");
    }
  }

  if (location.hash.startsWith("#cite-")) openSources();
  if (location.hash.startsWith("#day-")) {
    const day = document.getElementById(location.hash.slice(1));
    if (day) day.open = true;
  }
  if (location.hash) revealTarget(location.hash.slice(1));
  const query = new URLSearchParams(location.search);
  const savedCountry = query.get("country");
  const countryTabs = Array.from(document.querySelectorAll("[data-country-filter]"));
  if (countryTabs.some(tab => tab.dataset.countryFilter === savedCountry)) state.country = savedCountry;
  const dateSelect = document.getElementById("gallery-date");
  if (Array.from(dateSelect.options).some(option => option.value === query.get("date"))) {
    state.date = query.get("date");
    dateSelect.value = state.date;
  }
  countryTabs.forEach(tab => {
    const selected = tab.dataset.countryFilter === state.country;
    tab.classList.toggle("active", selected);
    tab.setAttribute("aria-pressed", String(selected));
  });
  state.items = galleryPhotos.filter(p =>
    (state.country === "全部" || country(p) === state.country) &&
    (state.date === "all" || p.date === state.date)
  );
  const savedPage = Number(query.get("page"));
  if (Number.isInteger(savedPage) && savedPage > 0) state.page = savedPage;
  const savedEra = query.get("era");
  if (Array.from(document.querySelectorAll("[data-era-filter]")).some(tab => tab.dataset.eraFilter === savedEra)) {
    applyEra(savedEra);
    revealTarget("history");
  }
  if (query.has("country") || query.has("date") || query.has("page")) revealTarget("gallery");
  renderGallery();
  updateDaysToggle();
  updateProgress();
})();
