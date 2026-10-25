import { Badge, Button, Card, Group, Select, Text } from '@mantine/core';
import { ArrowUpRight, BookOpen } from 'lucide-react';
import { content, photoById } from '../data';
import { useQueryState } from '../hooks';
import JournalImage from './JournalImage';

type Props = { onHistory: (id: string) => void; onChapter: (id: string) => void };

export default function Readings({ onHistory, onChapter }: Props) {
  const eras = [...new Set(content.readings.map((reading) => reading.era))];
  const [era, setEra] = useQueryState<string>('era', 'all', ['all', ...eras]);
  const readings = content.readings.filter((reading) => era === 'all' || reading.era === era);

  return (
    <section className="section-block readings-section">
      <div className="section-title-row">
        <div><p className="eyebrow">A LITTLE CONTEXT</p><h2>看过风景，再读一点历史。</h2></div>
        <Select aria-label="按历史时期筛选" value={era} onChange={(value) => setEra(value ?? 'all')}
          allowDeselect={false} data={[{ value: 'all', label: '全部历史时期' }, ...eras.map((value) => ({ value, label: value }))]} />
      </div>
      <div className="reading-grid">
        {readings.map((reading) => {
          const photo = photoById.get(reading.photos[0]);
          return (
            <Card key={reading.id} className="reading-card" padding="lg" radius="lg" withBorder>
              {photo && <Card.Section><JournalImage photo={photo} framed className="reading-cover"
                sizes="(max-width: 760px) calc(100vw - 44px), 400px" /></Card.Section>}
              <Badge variant="light" color="gray" mt="md" size="sm">{reading.era}</Badge>
              <h3>{reading.title}</h3>
              <Text size="sm" c="dimmed">{reading.summary}</Text>
              <Button variant="subtle" size="compact-sm" rightSection={<ArrowUpRight size={14} />}
                onClick={() => onHistory(reading.id)} className="reading-link">读这段历史</Button>
            </Card>
          );
        })}
      </div>
      <div className="chapter-index">
        <Group gap="sm" mb="md"><BookOpen size={17} /><Text size="sm" fw={500}>七段旅行小记</Text></Group>
        <div className="chapter-index-grid">
          {content.chapters.map((chapter, index) => <button key={chapter.id} onClick={() => onChapter(chapter.id)}>
            <span className="chapter-number">{String(index + 1).padStart(2, '0')}</span>
            <span><strong>{chapter.title}</strong><small>{chapter.date} · {chapter.subtitle}</small></span>
            <ArrowUpRight size={16} />
          </button>)}
        </div>
      </div>
    </section>
  );
}
