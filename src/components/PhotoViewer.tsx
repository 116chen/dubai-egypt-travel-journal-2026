import { ActionIcon, Button, Group, Loader, Modal, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { asset, countryLabel, shortDate, type Photo } from '../data';

export type ViewerState = { items: Photo[]; index: number };
type Props = { state: ViewerState | null; onClose: () => void };

export default function PhotoViewer({ state, onClose }: Props) {
  const isMobile = useMediaQuery('(max-width: 760px)', false, { getInitialValueInEffect: false });
  const [position, setPosition] = useState<{ owner: ViewerState | null; index: number }>({ owner: null, index: 0 });
  const [loadedId, setLoadedId] = useState('');
  const gesture = useRef<{ id: number; x: number; y: number } | null>(null);
  const index = position.owner === state ? position.index : state?.index ?? 0;
  const photo = state?.items[index];
  const move = useCallback((direction: number) => {
    if (!state || state.items.length < 2) return;
    setPosition((current) => ({
      owner: state,
      index: ((current.owner === state ? current.index : state.index) + direction + state.items.length) % state.items.length,
    }));
  }, [state]);

  useEffect(() => {
    if (!state) return;
    const keydown = (event: KeyboardEvent) => {
      if ((event.target as HTMLElement)?.closest('input, textarea, [contenteditable="true"]')) return;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        move(event.key === 'ArrowRight' ? 1 : -1);
      }
    };
    window.addEventListener('keydown', keydown);
    return () => window.removeEventListener('keydown', keydown);
  }, [state, move]);
  useEffect(() => {
    if (!state || state.items.length < 2) return;
    const next = new Image();
    next.src = asset(state.items[(index + 1) % state.items.length].src);
  }, [state, index]);

  return (
    <Modal
      opened={Boolean(state)} onClose={onClose} size="min(1150px, 95vw)"
      zIndex={300} fullScreen={isMobile}
      title={<Text size="sm">{index + 1} / {state?.items.length ?? 0} · 旅行照片</Text>}
      classNames={{ body: 'viewer-body', content: 'viewer-content', header: 'viewer-header' }} data-testid="photo-viewer"
      closeButtonProps={{ 'aria-label': '关闭照片' }}
    >
      {photo && (
        <>
          <div className="viewer-stage"
            onPointerDown={(event) => {
              if (event.pointerType !== 'touch') return;
              if (!event.isPrimary || (window.visualViewport?.scale ?? 1) > 1) {
                gesture.current = null;
                return;
              }
              gesture.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
              event.currentTarget.setPointerCapture(event.pointerId);
            }}
            onPointerCancel={() => { gesture.current = null; }}
            onPointerUp={(event) => {
              const start = gesture.current;
              gesture.current = null;
              if (!start || start.id !== event.pointerId || (window.visualViewport?.scale ?? 1) > 1) return;
              const dx = event.clientX - start.x;
              const dy = event.clientY - start.y;
              if (Math.abs(dx) >= 56 && Math.abs(dy) < Math.abs(dx) * 0.65) move(dx < 0 ? 1 : -1);
            }}>
            {loadedId !== photo.id && <Loader size="sm" color="gray" className="viewer-loading" aria-label="正在加载照片" />}
            <ActionIcon variant="light" disabled={state!.items.length < 2} aria-label="上一张照片"
              onClick={() => move(-1)}><ArrowLeft size={19} aria-hidden="true" /></ActionIcon>
            <img src={asset(photo.src)} alt={photo.caption} width={photo.width} height={photo.height}
              onLoad={() => setLoadedId(photo.id)} onError={() => setLoadedId(photo.id)} data-testid="viewer-image" />
            <ActionIcon variant="light" disabled={state!.items.length < 2} aria-label="下一张照片"
              onClick={() => move(1)}><ArrowRight size={19} aria-hidden="true" /></ActionIcon>
          </div>
          <Group justify="space-between" mt="lg" align="flex-start" className="viewer-caption">
            <div><Text fw={500} aria-live="polite">{photo.caption}</Text><Text size="xs" c="dimmed" mt={5}>{shortDate(photo.date)} · {countryLabel(photo)} · {photo.place}</Text></div>
            <Button component="a" href={asset(photo.src)} target="_blank" rel="noopener noreferrer" variant="subtle"
              rightSection={<ExternalLink size={14} aria-hidden="true" />}>高清照片</Button>
          </Group>
          {isMobile && state!.items.length > 1 && <Text className="swipe-hint" size="xs">左右滑动翻照片，也可以点箭头。</Text>}
        </>
      )}
    </Modal>
  );
}
