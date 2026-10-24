(function () {
  "use strict";
  const data = window.TRAVEL_MAP_DATA;
  const photos = new Map(window.JOURNAL_DATA.photos.map(photo => [photo.id, photo]));
  const locations = new Map(data.locations.map(location => [location.id, location]));
  const groups = new Map(data.groups.map(group => [group.id, group]));
  const views = new Map(data.views.map(view => [view.id, view]));
  const section = document.getElementById("route-map");
  const canvas = document.getElementById("map-canvas");
  const select = document.getElementById("map-location-select");
  const escape = value => String(value).replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[c]);
  let activeView = "egypt";
  let activeLocation = "gem";
  let photoIndex = 0;

  function groupForLocation(id, viewId = activeView) {
    return views.get(viewId).groups.map(groupId => groups.get(groupId))
      .find(group => group.locations.includes(id));
  }

  function saveSelection() {
    const url = new URL(location.href);
    if (activeLocation === "gem") url.searchParams.delete("place");
    else url.searchParams.set("place", activeLocation);
    if (activeView === "egypt") url.searchParams.delete("map");
    else url.searchParams.set("map", activeView);
    try { history.replaceState(null, "", url); } catch {}
  }

  function renderMap() {
    const view = views.get(activeView);
    const [width, height] = view.size;
    const bounds = view.bounds;
    const grid = view.graticule.map(path => `<path d="${path}" class="map-graticule"/>`).join("");
    const land = view.land.map(country =>
      `<path d="${country.path}" class="map-land${country.highlight ? " highlight" : ""}"><title>${escape(country.name)}</title></path>`
    ).join("");
    const lines = view.lines.map(line => `<path class="map-${line.type}" d="${line.path}"/>`).join("");
    const labels = view.labels.map(label => `<text x="${label.point[0]}" y="${label.point[1]}" class="map-geo-label" text-anchor="middle">${escape(label.text)}</text>`).join("");
    const markerLabels = view.markers.map(marker => {
      const group = groups.get(marker.group);
      const [x, y] = marker.point;
      const [dx, dy] = marker.label;
      const align = dx < -10 ? "end" : dx > 10 ? "start" : "middle";
      const labelX = x + dx;
      const labelY = y + dy;
      const leaderEndX = labelX + (align === "end" ? 8 : align === "start" ? -8 : 0);
      const [geoX, geoY] = marker.geographic;
      const relocated = geoX !== x || geoY !== y;
      const leader = relocated
        ? `<path class="map-leader" d="M${geoX},${geoY}L${x},${y}"/><circle cx="${geoX}" cy="${geoY}" r="3" fill="#97472f"/>`
        : `<path class="map-leader" d="M${x},${y}L${leaderEndX},${labelY - 5}"/>`;
      return `${leader}<text x="${labelX}" y="${labelY}" text-anchor="${align}" class="map-pin-label">${escape(group.name)}</text>`;
    }).join("");
    const markers = view.markers.map(marker => {
      const group = groups.get(marker.group);
      const place = locations.get(group.default);
      const cover = photos.get(place.cover);
      const content = cover
        ? `<img src="${cover.thumb}" width="48" height="48" alt="" loading="lazy">`
        : '<span class="map-transit" aria-hidden="true">↗</span>';
      return `<button class="map-marker" type="button" data-map-group="${group.id}" aria-label="查看${escape(group.name)}的照片" aria-pressed="false" style="left:${marker.point[0] / width * 100}%;top:${marker.point[1] / height * 100}%">${content}</button>`;
    }).join("");
    canvas.className = "map-canvas map-view-" + activeView;
    canvas.innerHTML = `<svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" role="img" aria-label="${escape(view.name)}：旅行地点与路线"><rect width="${width}" height="${height}" class="map-water"/>${grid}${land}${lines}${labels}${markerLabels}</svg>${markers}<span class="map-compass" aria-hidden="true">N<span>↑</span></span><span class="map-region-label" aria-hidden="true">${activeView === "egypt" ? "ALONG THE NILE & RED SEA" : activeView === "dubai" ? "DUBAI / THE GULF COAST" : "SHANGHAI · DUBAI · CAIRO"}</span>`;
    document.querySelectorAll("[data-map-view]").forEach(button =>
      button.setAttribute("aria-pressed", String(button.dataset.mapView === activeView))
    );
    const locationIds = [...new Set(view.groups.flatMap(id => groups.get(id).locations))];
    select.innerHTML = locationIds.map(id => `<option value="${id}">${escape(locations.get(id).name)}</option>`).join("");
    document.getElementById("map-legend").innerHTML = activeView === "flights"
      ? '<span><i class="legend-flight"></i>经迪拜往返</span>'
      : activeView === "dubai"
        ? '<span><i></i>海岸与城市地标</span>'
        : '<span><i class="legend-river"></i>尼罗河</span><span><i></i>沿线游览</span><span><i class="legend-flight"></i>内陆航班</span><span><i class="legend-return"></i>返回开罗</span>';
  }

  function updatePhoto() {
    const place = locations.get(activeLocation);
    const photo = photos.get(place.photos[photoIndex]);
    if (!photo) return;
    const image = document.getElementById("map-photo-image");
    image.src = photo.src;
    image.width = photo.width;
    image.height = photo.height;
    image.alt = photo.caption;
    const button = document.getElementById("map-photo-open");
    button.dataset.photo = photo.id;
    button.dataset.context = "map-" + place.id;
    button.setAttribute("aria-label", "放大查看：" + photo.caption);
    document.getElementById("map-photo-caption").textContent = photo.caption;
    document.getElementById("map-photo-position").textContent =
      `${photoIndex + 1} / ${place.photos.length} 张`;
    document.getElementById("map-photo-prev").disabled = place.photos.length < 2;
    document.getElementById("map-photo-next").disabled = place.photos.length < 2;
    document.querySelectorAll("[data-map-photo-index]").forEach(button =>
      button.setAttribute("aria-pressed", String(Number(button.dataset.mapPhotoIndex) === photoIndex))
    );
    const group = groupForLocation(place.id);
    const pinImage = group && canvas.querySelector(`[data-map-group="${group.id}"] img`);
    if (pinImage) pinImage.src = photo.thumb;
  }

  function selectLocation(id, persist = true) {
    const place = locations.get(id);
    if (!place) return;
    let group = groupForLocation(id);
    if (!group) {
      activeView = data.views.find(view => groupForLocation(id, view.id))?.id || "egypt";
      renderMap();
      group = groupForLocation(id);
    }
    activeLocation = id;
    photoIndex = Math.max(0, place.photos.indexOf(place.cover));
    select.value = id;
    document.getElementById("map-place-date").textContent = place.date;
    document.getElementById("map-place-title").textContent = place.name;
    document.getElementById("map-place-description").textContent = place.note;
    document.getElementById("map-site-options").innerHTML = group.locations.length > 1
      ? group.locations.map(locationId => `<button class="map-site-option" type="button" data-map-location="${locationId}" aria-pressed="${locationId === id}">${escape(locations.get(locationId).name)}</button>`).join("")
      : "";
    canvas.querySelectorAll("[data-map-group]").forEach(button =>
      button.setAttribute("aria-pressed", String(button.dataset.mapGroup === group.id))
    );
    document.querySelectorAll(".map-itinerary-stop").forEach(button =>
      button.setAttribute("aria-pressed", String(button.dataset.mapLocation === id))
    );
    const hasPhotos = place.photos.length > 0;
    document.getElementById("map-photo-area").hidden = !hasPhotos;
    document.getElementById("map-empty").hidden = hasPhotos;
    document.getElementById("map-photo-thumbs").innerHTML = hasPhotos
      ? place.photos.map((photoId, index) => {
        const photo = photos.get(photoId);
        return `<button class="map-photo-thumb" type="button" data-map-photo-index="${index}" aria-pressed="false" aria-label="查看第${index + 1}张：${escape(photo.caption)}"><img src="${photo.thumb}" width="64" height="64" loading="lazy" alt=""></button>`;
      }).join("")
      : "";
    const chapter = place.chapter ? `<a class="reading-link" href="#${place.chapter}">旅行小记 ↗</a>` : "";
    const historyLink = place.history ? `<button class="reading-link" data-history="${place.history}">历史 ↗</button>` : "";
    document.getElementById("map-detail-actions").innerHTML = `${chapter}${historyLink}<a class="reading-link" href="#day-${place.day}" data-jump-day="${place.day}">行程 ↗</a>`;
    if (hasPhotos) updatePhoto();
    if (persist) saveSelection();
  }

  section.addEventListener("click", event => {
    const button = event.target.closest("button");
    if (!button) return;
    if (button.dataset.mapView) {
      const nextView = button.dataset.mapView;
      if (nextView === activeView) return;
      activeView = nextView;
      renderMap();
      selectLocation(views.get(activeView).default);
    }
    if (button.dataset.mapGroup) selectLocation(groups.get(button.dataset.mapGroup).default);
    if (button.dataset.mapLocation) selectLocation(button.dataset.mapLocation);
    if (button.dataset.mapPhotoIndex !== undefined) {
      photoIndex = Number(button.dataset.mapPhotoIndex);
      updatePhoto();
    }
    if (button.id === "map-photo-prev" || button.id === "map-photo-next") {
      const length = locations.get(activeLocation).photos.length;
      photoIndex = (photoIndex + (button.id === "map-photo-next" ? 1 : -1) + length) % length;
      updatePhoto();
    }
  });
  select.addEventListener("change", () => selectLocation(select.value));
  const query = new URLSearchParams(location.search);
  if (views.has(query.get("map"))) activeView = query.get("map");
  renderMap();
  selectLocation(locations.has(query.get("place")) ? query.get("place") : views.get(activeView).default, false);
})();
