import { ActionIcon, Button, Group, Text } from '@mantine/core';
import { ArrowLeft, ArrowRight, BookOpen, CalendarDays, MapPin, Maximize2 } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { asset, placeById, type Photo, type Place } from '../data';
import JournalImage from './JournalImage';

type Props = {
  place: Place;
  subplaces: string[];
  items: Photo[];
  index: number;
  route: string[];
  onSelect: (id: string) => void;
  onIndex: (index: number) => void;
  onPhotos: (photos: Photo[], index?: number) => void;
  onHistory: (id: string) => void;
  onDay: (id: number) => void;
  onChapter: (id: string) => void;
};

export default function PlaceDetails({
  place, subplaces, items, index, route, onSelect, onIndex, onPhotos, onHistory, onDay, onChapter,
}: Props) {
  const photo = items[index];
  const step = route.indexOf(place.id);
  const thumbnails = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const active = thumbnails.current?.querySelector<HTMLButtonElement>('[aria-pressed="true"]');
    if (!active || !thumbnails.current) return;
    const rail = thumbnails.current;
    if (active.offsetLeft < rail.scrollLeft || active.offsetLeft + active.offsetWidth > rail.scrollLeft + rail.clientWidth) {
      rail.scrollLeft = active.offsetLeft - (rail.clientWidth - active.offsetWidth) / 2;
    }
  }, [index, place.id]);

  return (
    <>
      <Group justify="space-between" gap="xs">
        <Text size="xs" c="clay.7" fw={500} data-testid="place-date">{place.date}</Text>
        <Text size="xs" c="dimmed">{items.length ? `${items.length} 张照片` : '航行途经'}</Text>
      </Group>
      <h3 data-testid="place-title">{place.name}</h3>
      <Text size="sm" c="dimmed" className="place-note">{place.note}</Text>
      {subplaces.length > 1 && (
        <Group gap={6} className="subplaces">
          {subplaces.map((id) => (
            <Button key={id} variant={id === place.id ? 'light' : 'subtle'} size="compact-sm"
              onClick={() => onSelect(id)} data-place={id} aria-pressed={id === place.id}>
              {placeById.get(id)!.name}
            </Button>
          ))}
        </Group>
      )}
      {photo ? (
        <>
          <button className={`map-featured-photo ${photo.height > photo.width ? 'portrait' : 'landscape'}`}
            onClick={() => onPhotos(items, index)} aria-label={`放大查看：${photo.caption}`}>
            <JournalImage photo={photo} sizes={photo.height > photo.width
              ? '(max-width: 760px) 70vw, 300px'
              : '(max-width: 760px) calc(100vw - 48px), 420px'} />
            <span className="zoom-affordance" aria-hidden="true"><Maximize2 size={17} /></span>
          </button>
          <Group justify="space-between" className="map-image-caption">
            <Text size="xs" c="dimmed" lineClamp={2} aria-live="polite">{photo.caption}</Text>
            <Group gap={4} wrap="nowrap">
              <ActionIcon variant="subtle" color="dark" aria-label="上一张地点照片" disabled={items.length < 2}
                onClick={() => onIndex((index - 1 + items.length) % items.length)}>
                <ArrowLeft size={17} aria-hidden="true" />
              </ActionIcon>
              <Text size="xs" c="dimmed" className="photo-counter">{index + 1} / {items.length}</Text>
              <ActionIcon variant="subtle" color="dark" aria-label="下一张地点照片" disabled={items.length < 2}
                onClick={() => onIndex((index + 1) % items.length)}>
                <ArrowRight size={17} aria-hidden="true" />
              </ActionIcon>
            </Group>
          </Group>
          <div className="map-thumbnails" ref={thumbnails} aria-label="本站照片">
            {items.map((item, i) => (
              <button key={item.id} className={i === index ? 'active' : ''} aria-label={`查看地点照片${i + 1}`}
                aria-pressed={i === index} onClick={() => onIndex(i)}>
                <img src={asset(item.thumb)} width={52} height={52} alt="" loading="lazy" />
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="map-no-photo">
          <MapPin size={25} aria-hidden="true" />
          <Text size="sm">行程保留了这一站，暂无可确认的照片。</Text>
        </div>
      )}
      <Group gap={8} className="map-actions">
        {place.chapter && <Button variant="light" size="xs" onClick={() => onChapter(place.chapter!)}>旅行小记</Button>}
        {place.history && <Button variant="subtle" size="xs" leftSection={<BookOpen size={15} aria-hidden="true" />}
          onClick={() => onHistory(place.history!)}>历史</Button>}
        <Button variant="subtle" size="xs" leftSection={<CalendarDays size={15} aria-hidden="true" />}
          onClick={() => onDay(place.day)}>行程</Button>
      </Group>
      <div className="place-route-nav">
        <Button variant="subtle" color="dark" size="xs" leftSection={<ArrowLeft size={15} aria-hidden="true" />}
          disabled={step <= 0} onClick={() => onSelect(route[step - 1])}>上一站</Button>
        <Text size="xs" c="dimmed" aria-live="polite">{step + 1} / {route.length} 站</Text>
        <Button variant="subtle" color="dark" size="xs" rightSection={<ArrowRight size={15} aria-hidden="true" />}
          disabled={step >= route.length - 1} onClick={() => onSelect(route[step + 1])}>下一站</Button>
      </div>
    </>
  );
}
