import { Button, Group, Modal, Text, Textarea } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { Check, Download, Pencil } from 'lucide-react';
import { useEffect, useState } from 'react';
import { journal, photoById, type Photo, type Story } from '../data';
import { scrollToContent } from '../hooks';
import { NOTE_LIMIT, useStoryNotes } from '../story-notes';
import JournalImage from './JournalImage';

export default function Stories({ onPhotos }: { onPhotos: (photos: Photo[], index?: number) => void }) {
  const notes = useStoryNotes();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const memories = journal.stories.filter((story) => story.kind !== 'online-joke');
  const jokes = journal.stories.filter((story) => story.kind === 'online-joke');
  useEffect(() => {
    if (location.hash === '#stories') {
      const frame = requestAnimationFrame(() => scrollToContent('#stories', false));
      return () => cancelAnimationFrame(frame);
    }
  }, []);

  function save() {
    const saved = notes.save();
    if (saved === null) return;
    notifications.show({
      title: saved ? '小记已保存' : '本次已更新',
      message: saved ? '草稿已经收入小记，下次打开仍在。' : '浏览器未能保存，请导出小记留存。',
      color: saved ? 'clay' : 'orange',
    });
  }

  function storyCards(stories: Story[], offset = 0) {
    return <div className="stories-grid">
        {stories.map((story, i) => {
          const photo = story.photo ? photoById.get(story.photo) : null;
          const body = story.authored ? story.text : notes.text(story);
          const supplement = story.authored ? notes.supplement(story) : '';
          const isLong = body.length > 240 || supplement.length > 240;
          return (
            <article key={story.id} id={`story-${story.id}`} data-story-kind={story.kind} className={`story-note story-note-${story.theme} ${photo ? 'has-photo' : 'text-only'}`}>
              <div className="story-note-top"><span>{String(i + offset + 1).padStart(2, '0')}</span><Text size="xs" c="dimmed">{story.dateLabel}</Text></div>
              {photo && <button className="story-image" onClick={() => onPhotos([photo])} aria-label={`放大查看：${photo.caption}`}>
                <JournalImage photo={photo} framed sizes="180px" />
              </button>}
              <div className="story-copy">
                <h3>{story.title}</h3>
                <p className={`story-text ${isLong && !expanded[story.id] ? 'clamped' : ''}`} data-story={story.id}>{body}</p>
                {story.sources?.length && <div className="story-source-links" aria-label="历史资料">{story.sources.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.title} ↗</a>)}</div>}
                {supplement && <div className="story-supplement"><span>我的补写</span><p className={`story-text ${isLong && !expanded[story.id] ? 'clamped' : ''}`}>{supplement}</p></div>}
                {isLong && <button className="story-expand" onClick={() => setExpanded({ ...expanded, [story.id]: !expanded[story.id] })}
                  aria-expanded={Boolean(expanded[story.id])}>{expanded[story.id] ? '收起全文' : '展开全文'}</button>}
                <Group gap={8} className="story-note-actions">
                  <Button variant="subtle" size="compact-sm" leftSection={<Pencil size={13} aria-hidden="true" />}
                    onClick={() => notes.edit(story)} className="edit-note">
                    {notes.drafts[story.id] !== undefined ? '继续补写' : '补写小记'}
                  </Button>
                  {notes.drafts[story.id] !== undefined && <span className="draft-indicator">有暂存草稿</span>}
                </Group>
              </div>
            </article>
          );
        })}
      </div>;
  }

  return (
    <section id="stories" className="section-block stories-section">
      <div className="section-title-row"><div><p className="eyebrow">THE UNEXPECTED BITS</p><h2>风景之外，都是小记。</h2></div><Button variant="subtle" leftSection={<Download size={15} aria-hidden="true" />} onClick={notes.exportNotes}>导出小记</Button></div>
      <div className="stories-group-heading"><h3>亲历、见闻和吐槽</h3><span>{memories.length} 段小记</span></div>
      {storyCards(memories)}
      <div className="stories-group-heading stories-jokes-heading"><h3>网上看到的两个段子</h3><span>看过，记在这里。</span></div>
      {storyCards(jokes, memories.length)}
      <Modal opened={Boolean(notes.editing)} onClose={notes.close} title="补写旅行小记" size="md" closeButtonProps={{ 'aria-label': '关闭小记编辑' }}>
        <Text size="sm" mb="md">{notes.editing?.title}</Text>
        <Textarea label="你记得的细节" name="story-note" autoComplete="off"
          value={notes.draft} onChange={(event) => notes.updateDraft(event.currentTarget.value)}
          minRows={6} maxRows={14} maxLength={NOTE_LIMIT} autosize />
        <Group justify="space-between" gap="xs" mt="sm" className="draft-status">
          <Text size="xs" c="dimmed" aria-live="polite">
            {notes.draftStored ? <><Check size={13} aria-hidden="true" /> 草稿自动暂存，关闭后可以继续。</> : '草稿保留在本次页面，请保存或导出留存。'}
          </Text>
          <Text size="xs" c="dimmed">{notes.draft.length} / {NOTE_LIMIT}</Text>
        </Group>
        <Group justify="flex-end" mt="lg"><Button variant="default" onClick={notes.close}>暂时收起</Button><Button onClick={save} disabled={!notes.draft.trim()}>保存小记</Button></Group>
      </Modal>
    </section>
  );
}
