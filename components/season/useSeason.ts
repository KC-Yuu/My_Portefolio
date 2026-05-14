'use client';
import { createContext, useContext } from 'react';
import type { Season } from './season';

export interface SeasonContextValue {
  season: Season;
  setSeason: (s: Season) => void;
}

export const SeasonContext = createContext<SeasonContextValue | null>(null);

export function useSeason(): SeasonContextValue {
  const ctx = useContext(SeasonContext);
  if (!ctx) throw new Error('useSeason must be used inside <SeasonProvider>');
  return ctx;
}
