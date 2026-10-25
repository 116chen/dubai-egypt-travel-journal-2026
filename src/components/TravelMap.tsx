import { Badge, Drawer, Group, SegmentedControl, Select, Text, Tooltip } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { ChevronDown, ChevronUp, MapPin } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { asset, mapData, photoById, photosFor, placeById, type Photo } from '../data';
import { useQueryState } from '../hooks';
import PlaceDetails from './PlaceDetails';
import { curvedMapPath, leaderPath } from './route-path';

type Props = {
  photoViewerOpened: boolean;
  onPhotos: (photos: Photo[], index?: number) => void;
  onHistory: (id: string) => void;
  onDay: (id: number) => void;
  onChapter: (id: string) => void;
};

const VIEW_ROUTES: Record<string, string[]> = {
  egypt: ['gem', 'aswan', 'abu', 'dam', 'philae', 'kom', 'edfu', 'luxor', 'balloon', 'valley', 'dendera', 'redsea', 'giza', 'cairo'],
  dubai: ['bluewaters', 'palm', 'jumeirah', 'old-dubai', 'future', 'downtown'],
  flights: ['shanghai', 'gem', 'bluewaters'],
};
const MOBILE_LABELS: Record<string, [number, number]> = {
  cairo: [65, 7], redsea: [-68, 5], dendera: [-68, 5], luxor: [-68, 5],
  edfu: [-68, 5], kom: [-68, 5], aswan: [65, 5], abu: [-68, 5],
};

export default function TravelMap({ photoViewerOpened, onPhotos, onHistory, onDay, onChapter }: Props) {
  const [viewId, setViewId] = useQueryState<string>('map', 'egypt', ['egypt', 'dubai', 'flights']);
  const [placeId, setPlaceId] = useQueryState<string>('place', 'gem', mapData.locations.map((place) => place.id));
  const [photoId, setPhotoId] = useQueryState<string>('mapPhoto', '', [...photoById.keys()]);
  const [sheetOpened, setSheetOpened] = useState(false);
  const isMobile = useMediaQuery('(max-width: 760px)', false, { getInitialValueInEffect: false });
  const sheetBody = useRef<HTMLDivElement>(null);
  const sheetOpener = useRef<HTMLElement | null>(null);
  const handingOff = useRef(false);
  const view = mapData.views.find((view) => view.id === viewId)!;
  const visibleGroups = view.groups.map((id) => mapData.groups.find((group) => group.id === id)!);
  const availableIds = [...new Set(visibleGroups.flatMap((group) => group.locations))];
  const activeId = availableIds.includes(placeId) ? placeId : view.default;
  const place = placeById.get(activeId)!;
  const group = visibleGroups.find((group) => group.locations.includes(activeId))!;
  const items = photosFor(place.photos);
  const coverIndex = Math.max(0, items.findIndex((photo) => photo.id === place.cover));
  const savedIndex = items.findIndex((photo) => photo.id === photoId);
  const index = savedIndex >= 0 ? savedIndex : coverIndex;
  const photo = items[index];
  const [width, height] = view.size;
  const route = VIEW_ROUTES[viewId].filter((id) => availableIds.includes(id));
  useEffect(() => {
    if (sheetOpened) sheetBody.current?.closest('.mantine-Drawer-content')?.scrollTo({ top: 0 });
  }, [activeId, sheetOpened]);
  useEffect(() => {
    if (!isMobile) setSheetOpened(false);
  }, [isMobile]);

  function openSheet() {
    if (!sheetOpened) sheetOpener.current = document.activeElement as HTMLElement | null;
    handingOff.current = false;
    setSheetOpened(true);
  }
  function openReader(action: () => void) {
    handingOff.current = true;
    setSheetOpened(false);
    action();
  }
  function selectPlace(id: string, expand = true) {
    setPlaceId(id);
    setPhotoId('');
    if (isMobile && expand) openSheet();
  }
  function changeView(id: string) {
    setViewId(id);
    selectPlace(mapData.views.find((view) => view.id === id)!.default, false);
  }
  const options = availableIds.map((id) => ({ value: id, label: placeById.get(id)!.name }));
  const details = (
    <PlaceDetails
      place={place} subplaces={group.locations} items={items} index={index} route={route}
      onSelect={selectPlace} onIndex={(index) => setPhotoId(items[index].id)} onPhotos={onPhotos}
      onHistory={(id) => openReader(() => onHistory(id))}
      onDay={(id) => openReader(() => onDay(id))}
      onChapter={(id) => openReader(() => onChapter(id))}
    />
  );

  return (
    <section id="map" className="section-block map-section">
      <div className="section-title-row">
        <div><p className="eyebrow">THE ROUTE, IN PHOTOGRAPHS</p><h2>沿着地图，重新出发。</h2></div>
        <Text size="sm" c="dimmed">12天 · 21组地点 · 195张精选</Text>
      </div>
      <div className="map-workspace">
        <div className="map-surface">
          <Group justify="space-between" gap="sm" className="map-toolbar">
            <SegmentedControl value={viewId} onChange={changeView} radius="xl" size="sm"
              data={[{ value: 'egypt', label: '埃及' }, { value: 'dubai', label: '迪拜' }, { value: 'flights', label: '航线' }]}
              aria-label="地图区域" />
            <Badge variant="light" color="gray" leftSection={<MapPin size={12} aria-hidden="true" />}>点地点，看照片</Badge>
          </Group>
          <div className={`geo-canvas geo-${viewId}`} data-testid="travel-map">
            <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" aria-label={`${view.name}地点与路线`} role="img">
              <rect width={width} height={height} className="geo-water" />
              {view.graticule.map((path, i) => <path key={`grid-${i}`} d={path} className="geo-grid" />)}
              {view.land.map((land) => <path key={land.name} d={land.path} className={`geo-land ${land.highlight ? 'highlight' : ''}`} />)}
              {view.lines.map((line, i) => <path key={`line-${i}`} d={curvedMapPath(line.path)} className={`geo-line geo-${line.type}`} />)}
              {view.labels.map((label) => {
                const point = isMobile && viewId === 'dubai' && label.text === '朱美拉海岸' ? [645, 420] : label.point;
                return <text key={label.text} x={point[0]} y={point[1]} className="geo-label" textAnchor="middle">{label.text}</text>;
              })}
              {view.markers.map((marker) => {
                const g = mapData.groups.find((group) => group.id === marker.group)!;
                const [x, y] = marker.point;
                const [gx, gy] = marker.geographic;
                const label = isMobile
                  ? MOBILE_LABELS[marker.group] ?? [
                    marker.label[0] === 0 ? 0 : Math.sign(marker.label[0]) * Math.max(65, Math.abs(marker.label[0])),
                    marker.label[0] === 0 ? Math.sign(marker.label[1]) * 65 : 5,
                  ]
                  : marker.label;
                const [dx, dy] = label;
                const relocated = gx !== x || gy !== y;
                const align = dx < -10 ? 'end' : dx > 10 ? 'start' : 'middle';
                return (
                  <g key={marker.group}>
                    <path d={relocated ? leaderPath({ x: gx, y: gy }, { x, y }) : leaderPath({ x, y }, { x: x + dx, y: y + dy - 5 })} className="geo-leader" />
                    {relocated && <circle cx={gx} cy={gy} r={3} className="geo-coordinate" />}
                    <text x={x + dx} y={y + dy} textAnchor={align} className="geo-pin-label">{g.name}</text>
                  </g>
                );
              })}
            </svg>
            {view.markers.map((marker) => {
              const g = mapData.groups.find((group) => group.id === marker.group)!;
              const selected = group.id === g.id;
              const defaultPlace = placeById.get(g.default)!;
              const image = selected && photo ? photo : photoById.get(defaultPlace.cover ?? '');
              return (
                <Tooltip key={g.id} label={g.name} withArrow>
                  <button className={`geo-pin ${selected ? 'selected' : ''}`} onClick={() => selectPlace(g.default)}
                    style={{ left: `${marker.point[0] / width * 100}%`, top: `${marker.point[1] / height * 100}%` }}
                    aria-label={`选择${g.name}`} aria-pressed={selected} data-map-group={g.id}>
                    {image ? <img src={asset(image.thumb)} alt="" width={42} height={42} loading="lazy" /> : <MapPin size={19} aria-hidden="true" />}
                  </button>
                </Tooltip>
              );
            })}
            <span className="compass" aria-hidden="true">N<br />↑</span>
          </div>
          <Group justify="space-between" className="map-bottom" gap="sm">
            <Text size="xs" c="dimmed">地点与连线为旅程示意</Text>
            <Select data={options} value={activeId} onChange={(id) => id && selectPlace(id)} searchable
              allowDeselect={false} aria-label="选择旅行地点" rightSection={<ChevronDown size={15} />} className="place-select" />
          </Group>
        </div>
        {!isMobile && <div className="map-inspector">{details}</div>}
      </div>
      {isMobile && (
        <>
          <button className="mobile-place-summary" onClick={openSheet} aria-label={`查看${place.name}的照片与行程`}>
            {photo ? <img src={asset(photo.thumb)} width={54} height={54} alt="" /> : <MapPin size={24} aria-hidden="true" />}
            <span><strong>{place.name}</strong><small>{place.date} · {items.length} 张照片</small></span>
            <ChevronUp size={18} aria-hidden="true" />
          </button>
          <Drawer opened={sheetOpened} onClose={() => setSheetOpened(false)} position="bottom"
            size="min(86dvh, 780px)" title="沿途照片" zIndex={150} returnFocus={false}
            closeOnEscape={!photoViewerOpened} trapFocus={!photoViewerOpened}
            onExitTransitionEnd={() => {
              if (isMobile && !handingOff.current) sheetOpener.current?.focus({ preventScroll: true });
            }}
            overlayProps={{ backgroundOpacity: 0.25, blur: 2 }}
            classNames={{ content: 'place-sheet-content', body: 'place-sheet-body', header: 'place-sheet-header' }}
            closeButtonProps={{ 'aria-label': '收起地点照片' }}>
            <div ref={sheetBody} className="map-inspector mobile-inspector">{details}</div>
          </Drawer>
        </>
      )}
      <div className="map-credit"><span>金字塔：10.08，开罗最后一天。</span><a href="https://www.naturalearthdata.com/about/terms-of-use/" target="_blank" rel="noopener noreferrer">Natural Earth 底图</a></div>
    </section>
  );
}
