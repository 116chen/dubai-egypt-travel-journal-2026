import { Badge, Button, Divider, Drawer, Group, List, Paper, Text, Timeline } from '@mantine/core';
import { ArrowRight, BedDouble, BookOpen, ExternalLink, Eye, MapPin, Plane, Utensils } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { chapterById, content, photosFor, readingById, shortDate, type Photo, type RichSegment } from '../data';
import JournalImage from './JournalImage';

export type ReaderState = { kind: 'history' | 'chapter'; id: string } | { kind: 'day'; id: number } | { kind: 'sources' };
type Props = {
  photoViewerOpened: boolean;
  state: ReaderState | null;
  onClose: () => void;
  onChange: (state: ReaderState) => void;
  onPhotos: (photos: Photo[], index?: number) => void;
};

export default function JournalDrawer({ state, photoViewerOpened, onClose, onChange, onPhotos }: Props) {
  const chapter = state?.kind === 'chapter' ? chapterById.get(state.id) : null;
  const reading = state?.kind === 'history' ? readingById.get(state.id) : null;
  const day = state?.kind === 'day' ? content.days.find((item) => item.id === state.id) : null;
  const label = chapter ? '旅行小记' : reading ? '风景里的历史' : day ? `DAY ${String(day.id).padStart(2, '0')} · ${shortDate(day.date)}` : '资料与出处';
  const body = useRef<HTMLDivElement>(null);
  const readerKey = state?.kind === 'sources' ? 'sources' : state ? `${state.kind}:${state.id}` : '';
  useEffect(() => {
    body.current?.closest('.mantine-Drawer-content')?.scrollTo({ top: 0 });
  }, [readerKey]);

  return (
    <Drawer opened={Boolean(state)} onClose={onClose} position="right" size="min(720px, 100vw)" title={<Text size="xs" c="dimmed">{label}</Text>}
      closeOnEscape={!photoViewerOpened} trapFocus={!photoViewerOpened}
      onExitTransitionEnd={() => {
        document.querySelector<HTMLButtonElement>('.mobile-place-summary')?.focus({ preventScroll: true });
      }}
      zIndex={200} overlayProps={{ backgroundOpacity: 0.35, blur: 3 }} classNames={{ body: 'reader-body', content: 'reader-content' }}
      closeButtonProps={{ 'aria-label': '关闭阅读侧栏' }} data-testid="journal-drawer">
      <div ref={body}>
      {chapter && (
        <article key={chapter.id}>
          <p className="eyebrow">{chapter.date} · {chapter.title}</p>
          <h2>{chapter.heading}</h2><Text size="sm" c="dimmed" mb="xl">{chapter.subtitle}</Text>
          <PhotoStrip photos={photosFor(chapter.photos)} onPhotos={onPhotos} large />
          <p className="reader-paragraph">{chapter.text}</p>
          {chapter.readings.length > 0 && <Paper withBorder radius="lg" p="lg" mt="xl">
            <Group gap="xs" mb="md"><BookOpen size={16} /><Text size="sm" fw={500}>把这一站读得更深一点</Text></Group>
            {chapter.readings.map((id) => <Button key={id} variant="subtle" fullWidth justify="space-between" rightSection={<ArrowRight size={15} />}
              onClick={() => onChange({ kind: 'history', id })}>{readingById.get(id)?.title}</Button>)}
          </Paper>}
        </article>
      )}
      {reading && (
        <article key={reading.id}>
          <Badge variant="light" color="clay" mb="md">{reading.era}</Badge>
          <h2>{reading.title}</h2><Text size="sm" c="dimmed" mb="md">{reading.period}</Text>
          <Text size="sm" mb="xl">{reading.summary}</Text>
          <PhotoStrip photos={photosFor(reading.photos)} onPhotos={onPhotos} />
          {reading.paragraphs.map((segments, index) => <p className="reader-paragraph" key={index}>
            {segments.map((segment, i) => <RichText segment={segment} key={i} />)}
          </p>)}
          <Paper p="lg" radius="lg" className="observation-box">
            <Group gap="xs" mb="sm"><Eye size={17} /><Text size="sm" fw={500}>照片里，可以这样看</Text></Group>
            <List size="sm" spacing="sm">{reading.observations.map((text) => <List.Item key={text}>{text}</List.Item>)}</List>
          </Paper>
          <Divider my="xl" />
          <Text size="xs" c="dimmed" mb="sm">本节资料</Text>
          <SourceList ids={[...new Set(reading.paragraphs.flatMap((p) => p.filter((s) => s.type === 'citation').map((s) => s.id!)))]} />
        </article>
      )}
      {day && (
        <article key={day.id}>
          <Badge variant="light" color="clay" mb="md">{day.tag}</Badge>
          <h2>{day.title}</h2><Group gap={6} mb="xl"><MapPin size={15} /><Text size="sm" c="dimmed">{day.route}</Text></Group>
          <PhotoStrip photos={photosFor(day.photos)} onPhotos={onPhotos} />
          <Paper p="lg" radius="lg" className="day-note" mt="lg"><Text size="sm">{day.note}</Text></Paper>
          <Timeline active={-1} bulletSize={10} lineWidth={1} mt="xl" className="schedule-timeline">
            {day.schedule.map((item, index) => <Timeline.Item key={index}
              title={<Text size="xs" fw={600} c={item.kind === 'actual' ? 'clay.7' : 'dimmed'}>{item.time}</Text>}>
              <Text size="sm" mt={5}>{item.text}</Text>
            </Timeline.Item>)}
          </Timeline>
          <div className="day-practical">
            <div><Plane size={17} /><span><strong>交通</strong><Text size="sm" c="dimmed">{day.transport}</Text></span></div>
            <div><Utensils size={17} /><span><strong>餐食</strong>{day.meals.map((meal) => <Text key={meal.label} size="sm" c="dimmed">{meal.label} · {meal.value}</Text>)}</span></div>
            <div><BedDouble size={17} /><span><strong>住宿</strong><Text size="sm" c="dimmed">{day.hotel}</Text></span></div>
          </div>
          <Group justify="space-between" mt="xl">
            <Button variant="default" size="xs" disabled={day.id === 1} onClick={() => onChange({ kind: 'day', id: day.id - 1 })}>前一天</Button>
            <Text size="xs" c="dimmed">{day.id} / 12</Text>
            <Button variant="light" size="xs" disabled={day.id === 12} onClick={() => onChange({ kind: 'day', id: day.id + 1 })}>后一天</Button>
          </Group>
        </article>
      )}
      {state?.kind === 'sources' && <article><p className="eyebrow">SOURCES & NOTES</p><h2>记忆有照片，历史有出处。</h2>
        <Text size="sm" c="dimmed" mb="xl">行程来自原出团通知书，实际到访结合照片和旅行补充记录。历史背景引用以下资料。</Text>
        <SourceList ids={content.sources.map((source) => source.id)} />
      </article>}
      </div>
    </Drawer>
  );
}

function RichText({ segment }: { segment: RichSegment }) {
  if (segment.type !== 'citation') return <>{segment.text}</>;
  const source = content.sources.find((item) => item.id === segment.id);
  return <sup className="citation"><a href={source?.url ?? `#source-${segment.id}`} title={source?.title}
    target={source?.url ? '_blank' : undefined} rel={source?.url ? 'noopener noreferrer' : undefined}>{segment.text}</a></sup>;
}

function SourceList({ ids }: { ids: string[] }) {
  return <ol className="source-list">{ids.map((id) => {
    const source = content.sources.find((item) => item.id === id);
    if (!source) return null;
    return <li key={id} id={`source-${id}`}><span className="source-id">[{id}]</span>{source.url
      ? <a href={source.url} target="_blank" rel="noopener noreferrer">{source.title}<ExternalLink size={12} /></a>
      : <span>{source.title}<small>原始出团资料</small></span>}</li>;
  })}</ol>;
}

function PhotoStrip({ photos, onPhotos, large = false }: { photos: Photo[]; onPhotos: Props['onPhotos']; large?: boolean }) {
  if (!photos.length) return null;
  return <div className={`reader-photos ${large ? 'large' : ''}`}>
    {photos.map((photo, index) => <button key={photo.id} onClick={() => onPhotos(photos, index)} aria-label={`放大查看：${photo.caption}`}>
      <JournalImage photo={photo} sizes={large && index === 0 ? '(max-width: 760px) calc(100vw - 46px), 640px' : '180px'} />
    </button>)}
  </div>;
}
