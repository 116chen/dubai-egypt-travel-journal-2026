import { Accordion, Badge, Button, Group, SegmentedControl, Table, Text } from '@mantine/core';
import { ArrowUpRight, BedDouble, MapPin, Plane, Tickets } from 'lucide-react';
import { content, shortDate } from '../data';
import { useQueryState } from '../hooks';

export default function Itinerary({ onDay }: { onDay: (id: number) => void }) {
  const [view, setView] = useQueryState<string>('schedule', 'days', ['days', 'details', 'options']);

  return (
    <section className="section-block itinerary-section">
      <div className="section-title-row">
        <div><p className="eyebrow">THE PRACTICAL PAGES</p><h2>十二天，留一份清楚的记录。</h2></div>
        <SegmentedControl value={view} onChange={setView} radius="xl" size="sm" aria-label="行程内容"
          data={[{ value: 'days', label: '逐日行程' }, { value: 'details', label: '航班与住宿' }, { value: 'options', label: '可选项目' }]} />
      </div>
      {view === 'days' && (
        <div className="day-list">
          {content.days.map((day) => (
            <button key={day.id} className="day-row" onClick={() => onDay(day.id)} data-day={day.id}>
              <span className="day-number">DAY {String(day.id).padStart(2, '0')}</span>
              <span className="day-date">{shortDate(day.date)}</span>
              <span className="day-description"><strong>{day.title}</strong><small>{day.route}</small></span>
              <Badge variant="light" color={day.id === 9 ? 'clay' : 'gray'} size="sm" className="day-tag">{day.tag}</Badge>
              <ArrowUpRight size={17} />
            </button>
          ))}
        </div>
      )}
      {view === 'details' && (
        <Accordion variant="separated" radius="lg" defaultValue="flights" className="details-accordion">
          {content.tables.slice(0, 2).map((table) => (
            <Accordion.Item key={table.id} value={table.id}>
              <Accordion.Control icon={table.id === 'flights' ? <Plane size={19} /> : <BedDouble size={19} />}>
                <Group justify="space-between"><Text size="sm" fw={500}>{table.title}</Text><Text size="xs" c="dimmed">{table.rows.length} 段</Text></Group>
              </Accordion.Control>
              <Accordion.Panel><TravelTable table={table} /></Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
      )}
      {view === 'options' && (
        <>
          <Text size="sm" c="dimmed" mb="lg">26项原出团单参考项目，价格与起订条件依原单记录。实际到访说明保留在各项目中。</Text>
          <Accordion variant="separated" radius="lg" className="details-accordion">
            {content.tables.slice(2).map((table) => (
              <Accordion.Item key={table.id} value={table.id}>
                <Accordion.Control icon={<Tickets size={18} />}>
                  <Group justify="space-between"><Text size="sm" fw={500}>{table.title.split(' · ')[0]}</Text><Text size="xs" c="dimmed">{table.rows.length} 项</Text></Group>
                </Accordion.Control>
                <Accordion.Panel><TravelTable table={table} /></Accordion.Panel>
              </Accordion.Item>
            ))}
          </Accordion>
        </>
      )}
      <div className="itinerary-footnote"><MapPin size={15} /><Text size="xs" c="dimmed">金字塔实际到访为10月8日；原计划与照片记录的差异已在逐日行程中标明。</Text></div>
      <Group justify="flex-end" mt="lg"><Button variant="subtle" size="xs" onClick={() => onDay(9)}>查看开罗最后一天 <ArrowUpRight size={14} /></Button></Group>
    </section>
  );
}

function TravelTable({ table }: { table: (typeof content.tables)[number] }) {
  return (
    <Table.ScrollContainer minWidth={640}>
      <Table verticalSpacing="md" horizontalSpacing="md" highlightOnHover className="travel-table">
        <Table.Thead><Table.Tr>{table.headers.map((header) => <Table.Th key={header}>{header}</Table.Th>)}</Table.Tr></Table.Thead>
        <Table.Tbody>{table.rows.map((row, index) => <Table.Tr key={index}>{row.map((cell, i) => <Table.Td key={i}>{cell}</Table.Td>)}</Table.Tr>)}</Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
}
