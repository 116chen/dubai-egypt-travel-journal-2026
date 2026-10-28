import { Button, Pagination, Select, Tabs, TextInput } from '@mantine/core';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, Camera, Map, MapPin, PenLine, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { allPhotos, dateRange, type AtlasTrip as Trip } from '../atlas';
import { shortDate, type Photo } from '../data';
import { scrollToContent, useQueryState } from '../hooks';
import { tripEditorial } from '../trip-editorial';
import { tripMemories } from '../trip-memories';
import JournalImage from './JournalImage';
import PhotoViewer, { type ViewerState } from './PhotoViewer';
import TripNotes from './TripNotes';
import TripStory from './TripStory';
import TripDayReader from './TripDayReader';
import { leaderPath, routePath } from './route-path';

const PAGE_SIZE = 24;
const mapLabels: Record<string, Record<string, [number, number]>> = {
  'new-zealand': {
    christchurch: [391, 305], tekapo: [330, 285], pukaki: [360, 338],
    'mount-cook': [268, 282], wanaka: [209, 334], arrowtown: [197, 390],
    queenstown: [215, 447], dunedin: [310, 447], oamaru: [356, 395],
    akaroa: [419, 360], kaikoura: [423, 255],
  },
  xinjiang: {
    altay: [483, 128], hemu: [465, 63], jiadengyu: [426, 115],
    kanas: [377, 56], burqin: [374, 135], road: [391, 180],
    yili: [251, 357], nalati: [283, 411], tianshan: [328, 351],
  },
  hulunbuir: { erguna: [443, 250], heishantou: [369, 260] },
  yunnan: { lijiang: [307, 148], road: [253, 177] },
};
type Props = { trip: Trip };
export default function AtlasTrip({ trip }: Props) {
  const editorial = tripEditorial[trip.id];
  const memories = tripMemories[trip.id];
  const [view, setView] = useQueryState<string>('tripView', 'story', ['story', 'route', 'photos']);
  const coverPlace = trip.photos.find((photo) => photo.id === trip.coverId)?.placeId ?? trip.places[0].id;
  const [place, setPlace] = useQueryState<string>('stop', coverPlace, trip.places.map((item) => item.id));
  const dates = [...new Set(trip.photos.map((photo) => photo.date))].sort();
  const [readerDate, setReaderDate] = useQueryState<string>('tripRead', '', dates);
  const [date, setDate] = useQueryState<string>('tripDate', 'all', ['all', ...dates]);
  const [galleryPlace, setGalleryPlace] = useQueryState<string>('tripPlace', 'all', ['all', ...trip.places.map((item) => item.id)]);
  const [pageValue, setPage] = useQueryState<string>('tripPage', '1', Array.from({ length: Math.ceil(trip.photos.length / PAGE_SIZE) }, (_, index) => String(index + 1)));
  const [search, setSearch] = useState('');
  const [viewer, setViewer] = useState<ViewerState | null>(null);
  const current = trip.places.find((item) => item.id === place) ?? trip.places[0];
  const placeStory = editorial.places[current.id];
  const placeIndex = trip.places.indexOf(current);
  const placePhotos = trip.photos.filter((photo) => photo.placeId === current.id);
  const placePreviews = placeStory.photoIds.map((id) => placePhotos.find((photo) => photo.id === id)!).filter(Boolean);
  const placeDates = [...new Set(placePhotos.map((photo) => photo.date))].sort();
  const filtered = useMemo(() => trip.photos.filter((photo) => (
    (date === 'all' || photo.date === date) &&
    (galleryPlace === 'all' || photo.placeId === galleryPlace) &&
    `${photo.caption} ${photo.place} ${photo.file}`.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase())
  )), [trip, date, galleryPlace, search]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page = Math.min(Number(pageValue), pageCount);
  const shown = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function openPhotos(photos: Photo[], index = 0) { setViewer({ items: photos, index }); }
  function navigate(next: string) {
    setView(next);
    requestAnimationFrame(() => scrollToContent('#trip-explore'));
  }
  function selectPlace(id: string) {
    setPlace(id);
    if (window.matchMedia('(max-width: 760px)').matches) requestAnimationFrame(() => scrollToContent('#trip-place-detail'));
  }
  function storyPlace(id: string) {
    setPlace(id);
    setView('route');
    requestAnimationFrame(() => scrollToContent(window.matchMedia('(max-width: 760px)').matches ? '#trip-place-detail' : '#trip-explore'));
  }
  function dayGallery(date: string) {
    setReaderDate('');
    setDate(date);
    setGalleryPlace('all');
    setSearch('');
    setPage('1');
    navigate('photos');
  }
  return (
    <main className={`atlas-page trip-page trip-${trip.countryCode}`}>
      <section className="atlas-trip-hero" aria-labelledby="trip-title">
        <div className="trip-intro-copy">
          <p className="atlas-kicker">{trip.english} · {trip.start.slice(0, 4)}</p>
          <h1 id="trip-title">{trip.title}</h1>
          <p className="trip-intro-subtitle">{trip.subtitle}</p>
          <p className="trip-intro-date">{dateRange(trip.start, trip.end)}</p>
          <div className="trip-intro-stats"><span><strong>{trip.days}</strong> 天</span><span><strong>{trip.photos.length}</strong> 张照片</span><span><strong>{trip.places.length}</strong> 处地点</span></div>
          <div className="trip-intro-links"><button className="atlas-text-link" onClick={() => scrollToContent('#trip-explore')}>沿着照片旅行 <ArrowDown size={15} /></button>{memories && <button className="trip-memory-link" onClick={() => scrollToContent('#trip-notes')}><PenLine size={14} />读我的小记<small>{memories.entries.length}</small></button>}</div>
        </div>
        <div className="trip-intro-images">
          <button className="trip-intro-main" onClick={() => openPhotos(trip.photos, trip.photos.findIndex((photo) => photo.id === trip.coverId))} aria-label={`放大封面：${allPhotos.get(trip.coverId)!.caption}`}>
            <JournalImage photo={allPhotos.get(trip.coverId)!} framed loading="eager" fetchPriority="high" sizes="(max-width: 760px) 68vw, 550px" />
            <span>{allPhotos.get(trip.coverId)!.place}</span>
          </button>
          <button className="trip-intro-secondary" onClick={() => openPhotos(trip.photos, trip.photos.findIndex((photo) => photo.id === trip.secondaryId))} aria-label={`放大照片：${allPhotos.get(trip.secondaryId)!.caption}`}>
            <JournalImage photo={allPhotos.get(trip.secondaryId)!} framed loading="eager" sizes="(max-width: 760px) 30vw, 240px" />
          </button>
        </div>
      </section>
      <Tabs value={view} onChange={(next) => next && navigate(next)} keepMounted={false} className="trip-explore-tabs" id="trip-explore">
        <div className="trip-tabs-bar"><Tabs.List aria-label="探索这段旅行"><Tabs.Tab value="story" leftSection={<BookOpen size={16} />}>旅行手记</Tabs.Tab><Tabs.Tab value="route" leftSection={<Map size={16} />}>地图与地点</Tabs.Tab><Tabs.Tab value="photos" leftSection={<Camera size={16} />}>全部照片 <span className="atlas-tab-count">{trip.photos.length}</span></Tabs.Tab></Tabs.List><span>{trip.tags.join(' · ')}</span></div>
        <Tabs.Panel value="story"><TripStory trip={trip} editorial={editorial} onPhotos={openPhotos} onPlace={storyPlace} onDay={setReaderDate} /></Tabs.Panel>
        <Tabs.Panel value="route">
          <div className="trip-route-layout">
            <div className="trip-route-map">
              <div className="route-map-heading"><span><MapPin size={14} /> {trip.country} · 照片足迹</span><small>{trip.places.length} 处地点</small></div>
              <svg viewBox="0 0 700 490" aria-label={`${trip.country}照片地点地图`} role="group">
                {trip.map.paths.map((path, index) => <path key={index} d={path} className="trip-land" />)}
                <path d={routePath(trip.map.points)} className="trip-route-line" />
                {trip.map.points.map((point, index) => {
                  const [x, y] = mapLabels[trip.id]?.[point.id] ?? [point.x, point.y];
                  return <g key={point.id} className={`trip-map-marker ${place === point.id ? 'active' : ''}`} role="button" tabIndex={0} aria-label={`选择${trip.places[index].name}`} aria-pressed={place === point.id} onClick={() => selectPlace(point.id)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); selectPlace(point.id); } }}>
                    {(x !== point.x || y !== point.y) && <><path d={leaderPath(point, { x, y })} className="trip-marker-leader" /><circle cx={point.x} cy={point.y} r="2.5" className="trip-marker-anchor" /></>}
                    <g transform={`translate(${x} ${y})`}><circle r="23" className="trip-marker-hit" /><circle r="13" className="trip-marker-dot" /><text y="4.5" textAnchor="middle">{index + 1}</text></g>
                  </g>;
                })}
              </svg>
              <p className="route-map-note">{trip.map.note ?? '地点依据照片定位整理。连线为浏览顺序示意。'}</p>
              <div className="trip-place-pills" aria-label="选择照片地点">{trip.places.map((item, index) => <button key={item.id} className={place === item.id ? 'active' : ''} aria-pressed={place === item.id} onClick={() => selectPlace(item.id)}><span>{String(index + 1).padStart(2, '0')}</span>{item.name}</button>)}</div>
            </div>
            <section className="trip-place-detail" id="trip-place-detail" aria-labelledby="trip-place-title">
              <p className="atlas-kicker">STOP {String(trip.places.indexOf(current) + 1).padStart(2, '0')}</p>
              <h2 id="trip-place-title">{current.name}</h2>
              <p>{placeStory.text}</p>
              <div className="place-story-details">{placeStory.details.map((detail) => <span key={detail}>{detail}</span>)}</div>
              <p className="place-story-meta">{placeDates.map((date) => shortDate(date)).join(' / ')} · {placePhotos.length} 张照片</p>
              <div className="trip-place-photo-grid">{placePreviews.map((photo) => <button key={photo.id} onClick={() => openPhotos(placePhotos, placePhotos.indexOf(photo))} aria-label={`放大：${photo.caption}`}><JournalImage photo={photo} framed sizes="(max-width: 760px) 45vw, 215px" /></button>)}</div>
              <Button variant="subtle" color="dark" px={0} rightSection={<ArrowUpRight size={15} />} onClick={() => { setGalleryPlace(current.id); setDate('all'); setSearch(''); setPage('1'); navigate('photos'); }}>翻看这里的 {placePhotos.length} 张照片</Button>
              <div className="trip-place-navigation"><Button variant="subtle" size="xs" leftSection={<ArrowLeft size={13} />} disabled={placeIndex === 0} onClick={() => selectPlace(trip.places[placeIndex - 1].id)}>上一站</Button><span>{placeIndex + 1} / {trip.places.length}</span><Button variant="subtle" size="xs" rightSection={<ArrowRight size={13} />} disabled={placeIndex === trip.places.length - 1} onClick={() => selectPlace(trip.places[placeIndex + 1].id)}>下一站</Button></div>
            </section>
          </div>
          <section className="trip-days" aria-labelledby="trip-days-title"><div><p className="atlas-kicker">DAY BY DAY</p><h2 id="trip-days-title">把日子，一页页翻开。</h2></div><div className="trip-day-list">{dates.map((item) => {
            const photos = trip.photos.filter((photo) => photo.date === item);
            const places = [...new Set(photos.map((photo) => photo.place))];
            const day = Math.round((Date.parse(item) - Date.parse(trip.start)) / 86400000) + 1;
            const entry = editorial.days.find((day) => day.date === item)!;
            return <button key={item} onClick={() => setReaderDate(item)}><span className="trip-day-number">DAY {String(day).padStart(2, '0')}</span><span className="trip-day-date">{shortDate(item)}</span><span className="trip-day-places"><strong>{entry.title}</strong><small>{places.join(' · ')}</small></span><span className="trip-day-count">{photos.length} 张 <ArrowUpRight size={15} /></span></button>;
          })}</div></section>
        </Tabs.Panel>
        <Tabs.Panel value="photos">
          <section className="atlas-gallery" aria-labelledby="trip-gallery-title">
            <div className="atlas-section-heading"><div><p className="atlas-kicker">THE PHOTOGRAPHS</p><h2 id="trip-gallery-title">这一路的风景。</h2></div><p aria-live="polite">{filtered.length} 张照片</p></div>
            <div className="atlas-gallery-filter">
              <Select label="拍摄日期" value={date} onChange={(next) => { setDate(next ?? 'all'); setPage('1'); }} data={[{ value: 'all', label: '全部日期' }, ...dates.map((item) => ({ value: item, label: item.replaceAll('-', '.') }))]} allowDeselect={false} />
              <Select label="照片地点" value={galleryPlace} onChange={(next) => { setGalleryPlace(next ?? 'all'); setPage('1'); }} data={[{ value: 'all', label: '全部地点' }, ...trip.places.map((item) => ({ value: item.id, label: item.name }))]} allowDeselect={false} />
              <TextInput label="找一张照片" placeholder="地点、照片描述…" value={search} leftSection={<Search size={15} />} onChange={(event) => { setSearch(event.currentTarget.value); setPage('1'); }} />
              {(date !== 'all' || galleryPlace !== 'all' || search) && <Button variant="subtle" color="gray" onClick={() => { setDate('all'); setGalleryPlace('all'); setSearch(''); setPage('1'); }}>重置筛选</Button>}
            </div>
            {shown.length ? <div className="atlas-photo-grid">{shown.map((photo) => <button key={photo.id} className="atlas-gallery-photo" onClick={() => openPhotos(filtered, filtered.indexOf(photo))} aria-label={`放大：${photo.caption}`}><div><JournalImage photo={photo} sizes="(max-width: 600px) calc(50vw - 26px), (max-width: 1000px) 30vw, 280px" /></div><span className="gallery-photo-caption">{photo.caption}</span><span className="gallery-photo-meta">{shortDate(photo.date)} · {photo.place}</span></button>)}</div> : <div className="atlas-gallery-empty"><Search size={26} /><p>没有找到符合筛选的照片。</p><Button variant="subtle" onClick={() => { setDate('all'); setGalleryPlace('all'); setSearch(''); }}>查看全部照片</Button></div>}
            {pageCount > 1 && <Pagination value={page} total={pageCount} onChange={(next) => { setPage(String(next)); requestAnimationFrame(() => scrollToContent('#trip-gallery-title')); }} className="atlas-pagination" getItemProps={(page) => ({ 'aria-label': `第 ${page} 页` })} getControlProps={(control) => ({ 'aria-label': control === 'previous' ? '上一页' : control === 'next' ? '下一页' : control === 'first' ? '第一页' : '最后一页' })} />}
          </section>
        </Tabs.Panel>
      </Tabs>
      <TripNotes trip={trip} prompts={editorial.notePrompts} memories={memories} />
      <footer className="atlas-footer"><span>{trip.country} · 旅行手记</span><p>{dateRange(trip.start, trip.end)}</p><span>留住风景，也留住日常。</span></footer>
      <TripDayReader trip={trip} days={editorial.days} date={readerDate} photoViewerOpened={Boolean(viewer)} onDate={setReaderDate} onPhotos={openPhotos} onGallery={dayGallery} />
      <PhotoViewer state={viewer} onClose={() => setViewer(null)} />
    </main>
  );
}
