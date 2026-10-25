import { useCallback, useSyncExternalStore, type SetStateAction } from 'react';

const QUERY_CHANGE_EVENT = 'journal-query-change';

function subscribe(callback: () => void) {
  window.addEventListener('popstate', callback);
  window.addEventListener(QUERY_CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener('popstate', callback);
    window.removeEventListener(QUERY_CHANGE_EVENT, callback);
  };
}

function querySnapshot() {
  return location.search;
}

export function useQueryState<T extends string>(
  key: string,
  initial: T,
  valid?: readonly string[],
) {
  const search = useSyncExternalStore(subscribe, querySnapshot, () => '');
  const read = (params: URLSearchParams) => {
    const saved = params.get(key);
    return saved && (!valid || valid.includes(saved)) ? saved as T : initial;
  };
  const value = read(new URLSearchParams(search));
  const setValue = useCallback((next: SetStateAction<T>) => {
    const url = new URL(location.href);
    const current = read(url.searchParams);
    const updated = typeof next === 'function' ? next(current) : next;
    if (updated === initial) url.searchParams.delete(key);
    else url.searchParams.set(key, updated);
    if (url.href === location.href) return;
    history.replaceState(null, '', url);
    window.dispatchEvent(new Event(QUERY_CHANGE_EVENT));
  }, [key, initial, valid]);

  return [value, setValue] as const;
}

export function scrollToContent(selector: string, smooth = true) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelector(selector)?.scrollIntoView({
    behavior: smooth && !reducedMotion ? 'smooth' : 'instant',
    block: 'start',
  });
}
