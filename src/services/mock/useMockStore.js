import { useMemo, useSyncExternalStore } from 'react';
import { getSnapshot, subscribe } from './mockStore.js';

export function useMockStore(selector = (s) => s) {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  return useMemo(() => selector(raw), [raw, selector]);
}

