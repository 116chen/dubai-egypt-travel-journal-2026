import { Button, Group, Modal, Text, Textarea } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { Download, PenLine } from 'lucide-react';
import { useEffect, useState } from 'react';
import { dateRange, type AtlasTrip } from '../atlas';

function read(key: string, fallback = '') {
  try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; }
}
function write(key: string, value: string) {
  try { localStorage.setItem(key, value); return true; } catch { return false; }
}

export default function TripNotes({ trip, prompts = [] }: { trip: AtlasTrip; prompts?: string[] }) {
  const key = `travel-atlas-${trip.id}-note`;
  const [saved, setSaved] = useState(() => read(key));
  const [draft, setDraft] = useState(() => read(`${key}-draft`, read(key)));
  const [opened, setOpened] = useState(false);
  const [stored, setStored] = useState(true);
  const hasDraft = draft !== saved;
  useEffect(() => {
    const guard = (event: BeforeUnloadEvent) => {
      if (hasDraft && !stored) { event.preventDefault(); event.returnValue = ''; }
    };
    window.addEventListener('beforeunload', guard);
    return () => window.removeEventListener('beforeunload', guard);
  }, [hasDraft, stored]);
  function update(value: string) {
    setDraft(value);
    setStored(write(`${key}-draft`, value));
  }
  function save() {
    if (!write(key, draft.trim())) {
      notifications.show({ title: '暂时无法保存', message: '浏览器存储不可用，请先导出小记留存。', color: 'orange' });
      return;
    }
    setSaved(draft.trim());
    setDraft(draft.trim());
    setStored(write(`${key}-draft`, draft.trim()));
    setOpened(false);
    notifications.show({ message: '小记已保存在这个浏览器。' });
  }
  function download() {
    const body = `# ${trip.country} · ${trip.title}\n\n${dateRange(trip.start, trip.end)}\n\n${saved || '尚未写下小记。'}${hasDraft ? `\n\n## 暂存草稿\n\n${draft}` : ''}\n`;
    const url = URL.createObjectURL(new Blob(['\uFEFF' + body], { type: 'text/markdown;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `${trip.country}-${trip.id}-旅行小记.md`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  }
  return (
    <section className="atlas-trip-notes" aria-labelledby="trip-notes-title">
      <div className="trip-notes-heading"><PenLine size={22} strokeWidth={1.3} /><div><p className="atlas-kicker">BETWEEN THE PHOTOGRAPHS</p><h2 id="trip-notes-title">照片之外，也记一点。</h2></div></div>
      <p className={saved ? 'trip-note-text' : 'trip-note-empty'}>{saved || '那天的风、路上的小事，或一顿记得很久的饭。留一点位置，写下属于你的旅程。'}</p>
      {!saved && <div className="trip-note-prompts">{prompts.map((prompt) => <p key={prompt}>{prompt}</p>)}</div>}
      <div className="trip-notes-actions"><div><Button variant="outline" color="dark" leftSection={<PenLine size={14} />} onClick={() => setOpened(true)}>{hasDraft ? '继续草稿' : saved ? '编辑小记' : '写一段小记'}</Button><Button variant="subtle" color="gray" leftSection={<Download size={14} />} onClick={download}>导出小记</Button></div><span>{hasDraft ? stored ? '草稿已暂存' : '草稿尚未存入浏览器' : '小记保存在这个浏览器'}</span></div>
      <Modal opened={opened} onClose={() => setOpened(false)} title={`${trip.country} · 旅行小记`} closeButtonProps={{ 'aria-label': '关闭小记编辑' }}>
        {prompts.length > 0 && <Text size="xs" c="dimmed" mb="md">{prompts[0]}</Text>}
        <Textarea label="写下照片之外的故事" placeholder="从一个还记得的瞬间开始……" value={draft} onChange={(event) => update(event.currentTarget.value)} maxLength={3000} autosize minRows={9} maxRows={18} />
        <Group justify="space-between" mt="md"><Text size="xs" c={stored ? 'dimmed' : 'orange'}>{stored ? '草稿自动暂存，关闭后可以继续。' : '存储不可用，请先导出小记。'} · {draft.length}/3000</Text><Button onClick={save}>保存小记</Button></Group>
      </Modal>
    </section>
  );
}
