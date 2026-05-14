'use client';
import { useRef } from 'react';
import { SEASONS, type Season } from './season';
import { useSeason } from './useSeason';
import { SEASON_META } from '@/config/seasons';

export function SeasonToggle() {
  const { season, setSeason } = useSeason();
  const refs = useRef<Record<Season, HTMLButtonElement | null>>({
    spring: null, summer: null, autumn: null, winter: null,
  });

  function activate(next: Season) {
    setSeason(next);
    refs.current[next]?.focus();
  }

  function onKey(current: Season, e: React.KeyboardEvent<HTMLButtonElement>) {
    const i = SEASONS.indexOf(current);
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      activate(SEASONS[(i + 1) % SEASONS.length]);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      activate(SEASONS[(i - 1 + SEASONS.length) % SEASONS.length]);
    } else if (e.key === 'Home') {
      e.preventDefault();
      activate(SEASONS[0]);
    } else if (e.key === 'End') {
      e.preventDefault();
      activate(SEASONS[SEASONS.length - 1]);
    }
  }

  return (
    <div
      role="radiogroup"
      aria-label="Change season"
      className="fixed bottom-4 right-4 z-50 flex gap-2 rounded-lg bg-[var(--paper)] p-2 shadow-md"
      style={{ borderColor: 'var(--ink)', borderWidth: 2, borderStyle: 'solid' }}
    >
      {SEASONS.map((s) => {
        const active = s === season;
        return (
          <button
            key={s}
            ref={(el) => { refs.current[s] = el; }}
            type="button"
            role="radio"
            aria-label={s}
            aria-checked={active}
            tabIndex={active ? 0 : -1}
            onClick={() => activate(s)}
            onKeyDown={(e) => onKey(s, e)}
            className="pixel w-10 h-10 flex items-center justify-center text-lg"
            style={{
              color: 'var(--ink)',
              background: active ? 'var(--accent)' : 'transparent',
              outline: active ? '2px solid var(--ink)' : 'none',
            }}
          >
            <span aria-hidden="true">{SEASON_META[s].icon}</span>
          </button>
        );
      })}
    </div>
  );
}
