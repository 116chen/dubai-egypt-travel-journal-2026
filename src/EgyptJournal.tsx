import { Button, Group, Loader, Tabs, Text } from '@mantine/core';
import { ArrowDown, BookOpen, Camera, CalendarDays, Map } from 'lucide-react';
import { lazy, Suspense, useState } from 'react';
import { content, journal, photoById, type Photo } from './data';
import { scrollToContent, useQueryState } from './hooks';
import TravelMap from './components/TravelMap';
import Stories from './components/Stories';
import JournalDrawer, { type ReaderState } from './components/JournalDrawer';
import PhotoViewer, { type ViewerState } from './components/PhotoViewer';
import JournalImage from './components/JournalImage';

const Gallery = lazy(() => import('./components/Gallery'));
const Readings = lazy(() => import('./components/Readings'));
const Itinerary = lazy(() => import('./components/Itinerary'));
const panels = ['map', 'photos', 'history', 'itinerary'] as const;
type Panel = (typeof panels)[number];
const readerValues = [
  ...content.chapters.map((chapter) => `chapter:${chapter.id}`),
  ...content.readings.map((reading) => `history:${reading.id}`),
  ...content.days.map((day) => `day:${day.id}`),
  'sources',
];

function parseReader(value: string): ReaderState | null {
  if (value === 'sources') return { kind: 'sources' };
  const [kind, id] = value.split(':');
  if (kind === 'day') return { kind, id: Number(id) };
  if (kind === 'history' || kind === 'chapter') return { kind, id };
  return null;
}

export default function EgyptJournal() {
  const [panel, setPanel] = useQueryState<Panel>('tab', 'map', panels);
  const [readerQuery, setReaderQuery] = useQueryState<string>('read', '', readerValues);
  const reader = parseReader(readerQuery);
  const [viewer, setViewer] = useState<ViewerState | null>(null);
  const pyramid = photoById.get('p-0478')!;
  const dubai = photoById.get('p-0578')!;

  function openPhotos(items: Photo[], index = 0) {
    if (items.length) setViewer({ items, index: Math.max(0, Math.min(index, items.length - 1)) });
  }
  function navigate(next: Panel) {
    setPanel(next);
    requestAnimationFrame(() => scrollToContent('#explore'));
  }
  const setReader = (state: ReaderState | null) => setReaderQuery(state
    ? state.kind === 'sources' ? 'sources' : `${state.kind}:${state.id}`
    : '');
  const onHistory = (id: string) => setReader({ kind: 'history', id });
  const onChapter = (id: string) => setReader({ kind: 'chapter', id });
  const onDay = (id: number) => setReader({ kind: 'day', id });

  return (
    <>
      <main className="page-container">
        <section className="journal-intro" aria-labelledby="journal-title">
          <div className="intro-copy">
            <p className="eyebrow">EGYPT & DUBAI · TRAVEL JOURNAL</p>
            <h1 id="journal-title">从尼罗河，<br />到另一片海。</h1>
            <p className="intro-description">十二天的风景、历史，与那些小意外。</p>
            <div className="intro-meta">
              <div className="intro-stats">
                <span><strong>12</strong> 天旅程</span><span><strong>{journal.photos.length}</strong> 张照片</span><span><strong>2</strong> 个国家</span>
              </div>
              <Button className="intro-start" component="a" href="#explore" variant="subtle" color="dark"
                rightSection={<ArrowDown size={14} aria-hidden="true" />}>沿地图重走</Button>
            </div>
          </div>
          <div className="intro-photographs">
            <button className="intro-photo intro-egypt" onClick={() => openPhotos([pyramid, dubai])} aria-label={`放大查看：${pyramid.caption}`}>
              <JournalImage photo={pyramid} framed sizes="(max-width: 760px) 54vw, 350px" loading="eager" fetchPriority="high" />
              <span><small>EGYPT</small>吉萨，10月8日。</span>
            </button>
            <button className="intro-photo intro-dubai" onClick={() => openPhotos([pyramid, dubai], 1)} aria-label={`放大查看：${dubai.caption}`}>
              <JournalImage photo={dubai} framed sizes="(max-width: 760px) 35vw, 240px" loading="eager" />
              <span><small>DUBAI</small>城市的另一面。</span>
            </button>
          </div>
        </section>

        <Tabs value={panel} onChange={(value) => value && navigate(value as Panel)} keepMounted={false} className="explore-tabs" id="explore">
          <div className="tabs-bar">
            <Tabs.List aria-label="探索旅行手记">
              <Tabs.Tab value="map" leftSection={<Map size={16} aria-hidden="true" />}>地图</Tabs.Tab>
              <Tabs.Tab value="photos" leftSection={<Camera size={16} aria-hidden="true" />}>相册 <span className="tab-count">195</span></Tabs.Tab>
              <Tabs.Tab value="history" leftSection={<BookOpen size={16} aria-hidden="true" />}>历史</Tabs.Tab>
              <Tabs.Tab value="itinerary" leftSection={<CalendarDays size={16} aria-hidden="true" />}>行程</Tabs.Tab>
            </Tabs.List>
            <Text size="xs" c="dimmed" className="tabs-aside">照片里的旅程，慢慢看。</Text>
          </div>
          <Tabs.Panel value="map"><TravelMap photoViewerOpened={Boolean(viewer)} onPhotos={openPhotos} onHistory={onHistory} onDay={onDay} onChapter={onChapter} /></Tabs.Panel>
          <Suspense fallback={<Group justify="center" py={80}><Loader size="sm" aria-label="正在打开旅程内容" /></Group>}>
            <Tabs.Panel value="photos"><Gallery onPhotos={openPhotos} /></Tabs.Panel>
            <Tabs.Panel value="history"><Readings onHistory={onHistory} onChapter={onChapter} /></Tabs.Panel>
            <Tabs.Panel value="itinerary"><Itinerary onDay={onDay} /></Tabs.Panel>
          </Suspense>
        </Tabs>

        <Stories onPhotos={openPhotos} />
        <footer className="site-footer">
          <div><span className="footer-title">埃及与迪拜 · 旅行手记</span><Text size="xs" c="dimmed" mt={5}>2026.09.30 — 10.11 · 留下风景，也留下真实的旅行。</Text></div>
          <Button variant="subtle" color="gray" size="xs" leftSection={<BookOpen size={14} />} onClick={() => setReader({ kind: 'sources' })}>资料与出处</Button>
        </footer>
      </main>
      <JournalDrawer state={reader} photoViewerOpened={Boolean(viewer)} onClose={() => setReader(null)} onChange={setReader} onPhotos={openPhotos} />
      <PhotoViewer state={viewer} onClose={() => setViewer(null)} />
    </>
  );
}
