import { Badge, Button, Group, Pagination, SegmentedControl, Select, Text } from '@mantine/core';
import { Maximize2, RotateCcw } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { countryLabel, journal, shortDate, type Photo } from '../data';
import { scrollToContent, useQueryState } from '../hooks';
import JournalImage from './JournalImage';

const PAGE_SIZE = 24;
const PAGE_VALUES = Array.from({ length: Math.ceil(journal.photos.length / PAGE_SIZE) }, (_, index) => String(index + 1));

export default function Gallery({ onPhotos }: { onPhotos: (photos: Photo[], index?: number) => void }) {
  const [country, setCountry] = useQueryState<string>('country', '全部', ['全部', '埃及', '阿联酋', '在路上']);
  const dates = [...new Set(journal.photos.map((photo) => photo.date))].sort();
  const [date, setDate] = useQueryState<string>('date', 'all', ['all', ...dates]);
  const [page, setPage] = useQueryState<string>('page', '1', PAGE_VALUES);
  const items = useMemo(() => journal.photos.filter((photo) =>
    (country === '全部' || countryLabel(photo) === country) && (date === 'all' || photo.date === date)), [country, date]);
  const total = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const activePage = Math.min(Number(page), total);
  const start = (activePage - 1) * PAGE_SIZE;
  useEffect(() => {
    if (Number(page) > total) setPage(String(total));
  }, [page, total, setPage]);

  function resetFilters() {
    setCountry('全部');
    setDate('all');
    setPage('1');
  }

  return (
    <section className="section-block gallery-section">
      <div className="section-title-row"><div><p className="eyebrow">THE PHOTO ARCHIVE</p><h2>把这些瞬间，慢慢翻。</h2></div><Badge variant="light" color="gray">{journal.photos.length} 张精选</Badge></div>
      <Group justify="space-between" className="gallery-toolbar">
        <SegmentedControl radius="xl" size="sm" value={country} data={['全部', '埃及', '阿联酋', '在路上']}
          onChange={(value) => { setCountry(value); setPage('1'); }} aria-label="按国家筛选" />
        <Group gap="xs">
          <Select value={date} onChange={(value) => { setDate(value ?? 'all'); setPage('1'); }} allowDeselect={false}
            aria-label="按拍摄日期筛选" data={[{ value: 'all', label: '全部拍摄日期' }, ...dates.map((date) => ({ value: date, label: shortDate(date) }))]} />
          {(country !== '全部' || date !== 'all') && <Button variant="subtle" leftSection={<RotateCcw size={14} />}
            onClick={resetFilters}>重置</Button>}
        </Group>
      </Group>
      <Text size="xs" c="dimmed" my="md" aria-live="polite">{items.length} 张 · 第 {activePage} / {total} 页</Text>
      {items.length > 0 ? (
        <div className="gallery-masonry" data-testid="gallery-grid">
          {items.slice(start, start + PAGE_SIZE).map((photo, i) => (
            <figure key={photo.id} className="gallery-photo">
              <button onClick={() => onPhotos(items, start + i)} aria-label={`放大查看：${photo.caption}`} data-photo={photo.id}>
                <JournalImage photo={photo} sizes="(max-width: 760px) calc((100vw - 57px) / 2), (max-width: 1050px) 30vw, 280px" />
                <span className="zoom-affordance"><Maximize2 size={16} /></span>
              </button>
              <figcaption><span>{shortDate(photo.date)} · {countryLabel(photo)}</span>{photo.caption}</figcaption>
            </figure>
          ))}
        </div>
      ) : <div className="empty-gallery"><Text>这个日期与国家组合暂无照片。</Text><Button variant="light" mt="md" onClick={resetFilters}>查看全部照片</Button></div>}
      {total > 1 && <Group justify="center" mt="xl"><Pagination total={total} value={activePage} onChange={(next) => {
        setPage(String(next));
        scrollToContent('.gallery-toolbar', false);
      }} radius="xl" withEdges aria-label="相册分页" /></Group>}
    </section>
  );
}
