'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { SeasonContext } from './useSeason';
import { isSeason, type Season } from './season';

const STORAGE_KEY = 'season';

function readStored(): Season | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return isSeason(raw) ? raw : null;
  } catch {
    return null;
  }
}

export interface SeasonProviderProps {
  initial: Season;
  children: React.ReactNode;
}

export function SeasonProvider({ initial, children }: SeasonProviderProps) {
  // Server and client both render with `initial` first. A mount-only effect
  // reconciles to localStorage in a second commit, preventing hydration
  // mismatches on descendants (e.g. SeasonToggle aria-checked).
  const [season, setSeasonState] = useState<Season>(initial);

  useEffect(() => {
    const stored = readStored();
    // Two-phase mount: reconcile to localStorage after first render so
    // server-rendered descendants (e.g. SeasonToggle) hydrate without mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (stored && stored !== initial) setSeasonState(stored);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.documentElement.dataset.season = season;
    try {
      window.localStorage.setItem(STORAGE_KEY, season);
    } catch {
      /* storage unavailable; ignore */
    }
  }, [season]);

  const setSeason = useCallback((s: Season) => setSeasonState(s), []);
  const value = useMemo(() => ({ season, setSeason }), [season, setSeason]);

  return <SeasonContext.Provider value={value}>{children}</SeasonContext.Provider>;
}
