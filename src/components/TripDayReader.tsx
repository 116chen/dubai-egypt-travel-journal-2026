import { Button, Drawer, Group, Text } from '@mantine/core';
import { ArrowLeft, ArrowRight, Camera, MapPin } from 'lucide-react';
import { useEffect, useRef } from 'react';
import type { AtlasTrip } from '../atlas';
import { shortDate, type Photo } from '../data';
import type { DayStory } from '../trip-editorial';
import JournalImage from './JournalImage';

type Props = {
  trip: AtlasTrip;
  days: DayStory[];
  date: string;
  photoViewerOpened: boolean;
  onDate: (date: string) => void;
  onPhotos: (photos: Photo[], index?: number) => void;
  onGallery: (date: string) => void;
};

export default function TripDayReader({ trip, days, date, photoViewerOpened, onDate, onPhotos, onGallery }: Props) {
  const day = days.find((day) => day.date === date);
  const photos = trip.photos.filter((photo) => photo.date === date);
  const cover = photos.find((photo) => photo.id === day?.coverId);
  const places = [...new Set(photos.map((photo) => photo.place))];
  const position = days.findIndex((day) => day.date === date);
  const body = useRef<HTMLDivElement>(null);
  useEffect(() => {
    body.current?.closest('.mantine-Drawer-content')?.scrollTo({ top: 0 });
  }, [date]);
  return (
    <Drawer opened={Boolean(day)} onClose={() => onDate('')} size="min(660px, 100vw)" position="right"
      title={`${trip.country} · 逐日手记`} zIndex={200} closeOnEscape={!photoViewerOpened} trapFocus={!photoViewerOpened}
      overlayProps={{ backgroundOpacity: .35, blur: 3 }} classNames={{ content: 'trip-day-reader', body: 'trip-day-reader-body' }}
      closeButtonProps={{ 'aria-label': '关闭逐日手记' }}>
      {day && cover && <article ref={body} aria-labelledby="day-reader-title">
        <p className="atlas-kicker">DAY {String(position + 1).padStart(2, '0')} · {day.date.replaceAll('-', '.')}</p>
        <h2 id="day-reader-title">{day.title}</h2>
        <p className="day-reader-route"><MapPin size={13} />{places.join(' · ')}</p>
        <button className="day-reader-cover" aria-label={`放大当天封面：${cover.caption}`} onClick={() => onPhotos(photos, photos.indexOf(cover))}><JournalImage photo={cover} sizes="(max-width: 760px) calc(100vw - 48px), 596px" /></button>
        <p className="day-reader-text">{day.text}</p>
        <div className="day-reader-photo-heading"><span>这一天的照片</span><span>{photos.length} 张</span></div>
        <div className="day-reader-photos">{photos.map((photo, index) => <button key={photo.id} onClick={() => onPhotos(photos, index)} aria-label={`放大当天照片：${photo.caption}`}><JournalImage photo={photo} framed sizes="(max-width: 760px) 28vw, 190px" /><span>{photo.caption}</span></button>)}</div>
        <Button variant="light" leftSection={<Camera size={14} />} onClick={() => onGallery(day.date)} mt="lg">在相册中查看这一天</Button>
        <Group justify="space-between" className="day-reader-navigation" mt="xl">
          <Button variant="subtle" size="xs" leftSection={<ArrowLeft size={13} />} disabled={position <= 0} onClick={() => onDate(days[position - 1].date)}>前一天</Button>
          <Text size="xs" c="dimmed">{shortDate(day.date)} · {position + 1} / {days.length}</Text>
          <Button variant="subtle" size="xs" rightSection={<ArrowRight size={13} />} disabled={position >= days.length - 1} onClick={() => onDate(days[position + 1].date)}>后一天</Button>
        </Group>
      </article>}
    </Drawer>
  );
}
