import { useEffect, useState } from 'react';
import { journal, type Story } from './data';

const NOTES_KEY = 'nile-gulf-journal-v3-notes';
const DRAFTS_KEY = `${NOTES_KEY}-drafts`;
export const NOTE_LIMIT = 3000;
type Notes = Record<string, string>;

function readNotes(key: string): Notes {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || '{}');
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    return Object.fromEntries(journal.stories
      .filter((story) => typeof parsed[story.id] === 'string')
      .map((story) => [story.id, parsed[story.id]]));
  } catch {
    return {};
  }
}

function writeNotes(key: string, notes: Notes) {
  try {
    localStorage.setItem(key, JSON.stringify(notes));
    return true;
  } catch {
    return false;
  }
}

export function useStoryNotes() {
  const [notes, setNotes] = useState<Notes>(() => readNotes(NOTES_KEY));
  const [drafts, setDrafts] = useState<Notes>(() => readNotes(DRAFTS_KEY));
  const [editing, setEditing] = useState<Story | null>(null);
  const [draft, setDraft] = useState('');
  const [draftStored, setDraftStored] = useState(true);
  const text = (story: Story) => typeof notes[story.id] === 'string' ? notes[story.id] : story.text;

  useEffect(() => {
    const guard = (event: BeforeUnloadEvent) => {
      if (!draftStored && Object.keys(drafts).length > 0) {
        event.preventDefault();
        event.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', guard);
    return () => window.removeEventListener('beforeunload', guard);
  }, [draftStored, drafts]);

  function edit(story: Story) {
    setEditing(story);
    setDraft(drafts[story.id] ?? text(story));
  }

  function updateDraft(value: string) {
    if (!editing) return;
    const updated = { ...drafts };
    if (value === text(editing)) delete updated[editing.id];
    else updated[editing.id] = value;
    setDraft(value);
    setDrafts(updated);
    setDraftStored(writeNotes(DRAFTS_KEY, updated));
  }

  function save() {
    if (!editing || !draft.trim()) return null;
    const updated = { ...notes, [editing.id]: draft.trim() };
    const persisted = writeNotes(NOTES_KEY, updated);
    setNotes(updated);
    if (persisted) {
      const remaining = { ...drafts };
      delete remaining[editing.id];
      setDrafts(remaining);
      setDraftStored(writeNotes(DRAFTS_KEY, remaining));
    }
    setEditing(null);
    return persisted;
  }

  function exportNotes() {
    const body = ['# 埃及与迪拜 · 旅途小记', '', ...journal.stories.flatMap((story) => [
      `## ${story.title}`, '', story.dateLabel, '', text(story), '',
      ...(drafts[story.id] !== undefined ? ['### 暂存草稿', '', drafts[story.id], ''] : []),
    ])].join('\n');
    const url = URL.createObjectURL(new Blob(['\uFEFF' + body], { type: 'text/markdown;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = '埃及迪拜-旅途小记.md';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  }

  return {
    drafts, editing, draft, draftStored, text, edit, updateDraft, save, exportNotes,
    close: () => setEditing(null),
  };
}
