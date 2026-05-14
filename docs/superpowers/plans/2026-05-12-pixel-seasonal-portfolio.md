# Pixel Art Seasonal Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an MVP Next.js 16 portfolio with a pixel art Hero + Projects sections, a manual 4-season theme toggle that persists, ambient particles per season, and cozy/Stardew-inspired aesthetics.

**Architecture:** CSS custom properties driven by a `data-season` attribute on `<html>`, written by a React Context provider with localStorage persistence. Server components for static structure (Hero shell, copy, Projects, cards); client components only where interactivity is required (SeasonProvider, SeasonToggle, ParallaxLayer, Particles). Sprites are tileable PNGs (placeholder CSS box-shadow art at scaffold time), and particles run in a single requestAnimationFrame loop on a full-viewport canvas.

**Tech Stack:** Next.js 16.2.6 (App Router), React 19.2.4, TypeScript (strict), Tailwind CSS 4, Vitest + @testing-library/react (unit/component), Playwright (E2E + visual diffs).

**Spec:** `docs/superpowers/specs/2026-05-12-pixel-seasonal-portfolio-design.md`

---

## Pre-flight

Before Task 1, run `npm install` in the project root. The repo has a `package.json` but no `node_modules/`. Per AGENTS.md, after install, skim `node_modules/next/dist/docs/` for any Next 16 breaking-change notes that affect server/client boundaries, font loading, or `<Image>`. Stop and update the plan if a documented change invalidates an assumption.

---

## Phase 1 — Foundation: tooling & types

### Task 1: Install test tooling

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`
- Create: `playwright.config.ts`
- Create: `vitest.setup.ts`

- [ ] **Step 1: Install dev dependencies**

Run:
```bash
npm install -D vitest @vitest/ui @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @playwright/test
npx playwright install --with-deps chromium
```

Expected: dependencies added, Playwright Chromium installed.

- [ ] **Step 2: Add test scripts to `package.json`**

In the `scripts` object, add:
```json
"test": "vitest",
"test:run": "vitest run",
"test:ui": "vitest --ui",
"test:e2e": "playwright test",
"test:e2e:ui": "playwright test --ui"
```

- [ ] **Step 3: Create `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['**/*.test.{ts,tsx}'],
    exclude: ['node_modules', '.next', 'e2e/**'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});
```

- [ ] **Step 4: Create `vitest.setup.ts`**

```ts
import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
  localStorage.clear();
  document.documentElement.removeAttribute('data-season');
});
```

- [ ] **Step 5: Create `playwright.config.ts`**

```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
```

- [ ] **Step 6: Update `tsconfig.json` to include test files**

Ensure `include` covers `**/*.test.ts`, `**/*.test.tsx`, `vitest.setup.ts`, `vitest.config.ts`, `playwright.config.ts`, `e2e/**/*`. If `include` doesn't exist, add:
```json
"include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"]
```

- [ ] **Step 7: Verify the test runners boot**

Run: `npm run test:run`
Expected: "No test files found" (exit 0 or 1 from vitest with that message — both acceptable; goal is "config loads").

Run: `npx playwright test --list`
Expected: "no tests found" (config loads).

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json vitest.config.ts vitest.setup.ts playwright.config.ts tsconfig.json
git commit -m "chore: add vitest + playwright test tooling"
```

---

### Task 2: Season type + `currentRealSeason` helper

**Files:**
- Create: `components/season/season.ts`
- Test: `components/season/season.test.ts`

- [ ] **Step 1: Write the failing test**

`components/season/season.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { currentRealSeason, isSeason, SEASONS } from './season';

describe('SEASONS', () => {
  it('lists the four seasons in display order', () => {
    expect(SEASONS).toEqual(['spring', 'summer', 'autumn', 'winter']);
  });
});

describe('isSeason', () => {
  it('returns true for valid season strings', () => {
    expect(isSeason('spring')).toBe(true);
    expect(isSeason('winter')).toBe(true);
  });
  it('returns false for anything else', () => {
    expect(isSeason('fall')).toBe(false);
    expect(isSeason('')).toBe(false);
    expect(isSeason(null)).toBe(false);
    expect(isSeason(42)).toBe(false);
  });
});

describe('currentRealSeason', () => {
  // Northern Hemisphere meteorological seasons:
  //   spring: Mar 1 – May 31
  //   summer: Jun 1 – Aug 31
  //   autumn: Sep 1 – Nov 30
  //   winter: Dec 1 – Feb 28/29
  it.each([
    ['2026-03-01', 'spring'],
    ['2026-04-15', 'spring'],
    ['2026-05-31', 'spring'],
    ['2026-06-01', 'summer'],
    ['2026-07-04', 'summer'],
    ['2026-08-31', 'summer'],
    ['2026-09-01', 'autumn'],
    ['2026-10-15', 'autumn'],
    ['2026-11-30', 'autumn'],
    ['2026-12-01', 'winter'],
    ['2026-01-15', 'winter'],
    ['2026-02-28', 'winter'],
  ])('maps %s -> %s', (iso, expected) => {
    expect(currentRealSeason(new Date(iso + 'T12:00:00Z'))).toBe(expected);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:run -- components/season/season.test.ts`
Expected: FAIL, "Cannot find module './season'".

- [ ] **Step 3: Write minimal implementation**

`components/season/season.ts`:
```ts
export const SEASONS = ['spring', 'summer', 'autumn', 'winter'] as const;
export type Season = (typeof SEASONS)[number];

export function isSeason(value: unknown): value is Season {
  return typeof value === 'string' && (SEASONS as readonly string[]).includes(value);
}

export function currentRealSeason(date: Date = new Date()): Season {
  const month = date.getUTCMonth(); // 0-11
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'autumn';
  return 'winter';
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test:run -- components/season/season.test.ts`
Expected: PASS (all cases green).

- [ ] **Step 5: Commit**

```bash
git add components/season/season.ts components/season/season.test.ts
git commit -m "feat(season): add Season type, isSeason guard, currentRealSeason helper"
```

---

### Task 3: SeasonProvider context + `useSeason` hook

**Files:**
- Create: `components/season/SeasonProvider.tsx`
- Create: `components/season/useSeason.ts`
- Test: `components/season/SeasonProvider.test.tsx`

- [ ] **Step 1: Write the failing test**

`components/season/SeasonProvider.test.tsx`:
```tsx
import { describe, it, expect, beforeEach } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SeasonProvider } from './SeasonProvider';
import { useSeason } from './useSeason';

function Probe() {
  const { season, setSeason } = useSeason();
  return (
    <div>
      <span data-testid="value">{season}</span>
      <button onClick={() => setSeason('winter')}>winter</button>
    </div>
  );
}

beforeEach(() => {
  localStorage.clear();
  document.documentElement.removeAttribute('data-season');
});

describe('SeasonProvider', () => {
  it('writes data-season on <html> on mount', () => {
    render(<SeasonProvider initial="autumn"><Probe /></SeasonProvider>);
    expect(document.documentElement.dataset.season).toBe('autumn');
    expect(screen.getByTestId('value')).toHaveTextContent('autumn');
  });

  it('prefers localStorage value over initial prop when valid', () => {
    localStorage.setItem('season', 'summer');
    render(<SeasonProvider initial="spring"><Probe /></SeasonProvider>);
    expect(screen.getByTestId('value')).toHaveTextContent('summer');
    expect(document.documentElement.dataset.season).toBe('summer');
  });

  it('ignores invalid localStorage value and falls back to initial', () => {
    localStorage.setItem('season', 'fall');
    render(<SeasonProvider initial="spring"><Probe /></SeasonProvider>);
    expect(screen.getByTestId('value')).toHaveTextContent('spring');
  });

  it('setSeason updates the attribute and persists', async () => {
    const user = userEvent.setup();
    render(<SeasonProvider initial="spring"><Probe /></SeasonProvider>);
    await act(async () => { await user.click(screen.getByText('winter')); });
    expect(document.documentElement.dataset.season).toBe('winter');
    expect(localStorage.getItem('season')).toBe('winter');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:run -- components/season/SeasonProvider.test.tsx`
Expected: FAIL, "Cannot find module './SeasonProvider'".

- [ ] **Step 3: Implement `useSeason` hook**

`components/season/useSeason.ts`:
```ts
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
```

- [ ] **Step 4: Implement `SeasonProvider`**

`components/season/SeasonProvider.tsx`:
```tsx
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
  const [season, setSeasonState] = useState<Season>(() => readStored() ?? initial);

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
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm run test:run -- components/season/SeasonProvider.test.tsx`
Expected: PASS (4 cases).

- [ ] **Step 6: Commit**

```bash
git add components/season/SeasonProvider.tsx components/season/useSeason.ts components/season/SeasonProvider.test.tsx
git commit -m "feat(season): add SeasonProvider context with localStorage persist"
```

---

### Task 4: Root layout + FOUC script + global CSS variables

**Files:**
- Modify: `app/layout.tsx`
- Modify: `app/globals.css`
- Create: `components/season/no-fouc-script.ts`

- [ ] **Step 1: Create the inline FOUC script source**

`components/season/no-fouc-script.ts`:
```ts
// Stringified function injected via dangerouslySetInnerHTML into <head>.
// Runs synchronously before React hydrates, sets data-season on <html>
// using localStorage value (if valid) or computed real season.
export const noFoucScript = `(function(){
  try {
    var SEASONS = ['spring','summer','autumn','winter'];
    var stored = localStorage.getItem('season');
    var season = SEASONS.indexOf(stored) >= 0 ? stored : null;
    if (!season) {
      var m = new Date().getUTCMonth();
      season = m>=2&&m<=4 ? 'spring' : m>=5&&m<=7 ? 'summer' : m>=8&&m<=10 ? 'autumn' : 'winter';
    }
    document.documentElement.setAttribute('data-season', season);
  } catch(e) {}
})();`;
```

- [ ] **Step 2: Replace `app/globals.css` with theme variables**

`app/globals.css`:
```css
@import "tailwindcss";

:root, [data-season="spring"] {
  --sky-top: #cfe9f1;  --sky-bot: #ffd5b8;
  --ground: #6ab04c;   --ground-shadow: #3d8b40;
  --accent: #e76f51;   --foliage: #2a9d8f;
  --ink: #264653;      --paper: #fff8ec;
  --particle-color: #ffb7d5;
}
[data-season="summer"] {
  --sky-top: #7ec8e3;  --sky-bot: #ffe6a0;
  --ground: #3aa64a;   --ground-shadow: #1f7a2e;
  --accent: #f4a261;   --foliage: #1d8348;
  --ink: #264653;      --paper: #fff8ec;
  --particle-color: #fff5a8;
}
[data-season="autumn"] {
  --sky-top: #e8a87c;  --sky-bot: #c38d5e;
  --ground: #a0522d;   --ground-shadow: #6e3b1f;
  --accent: #d62828;   --foliage: #b85c2b;
  --ink: #3b2a1d;      --paper: #fdf3e3;
  --particle-color: #e76f51;
}
[data-season="winter"] {
  --sky-top: #b8d4e3;  --sky-bot: #e8eef2;
  --ground: #dde6ed;   --ground-shadow: #b3c4d1;
  --accent: #5a7d9a;   --foliage: #6f8ba0;
  --ink: #1a2b3a;      --paper: #f5f8fb;
  --particle-color: #ffffff;
}

html, body {
  background-color: var(--paper);
  color: var(--ink);
  transition: background-color 600ms ease, color 600ms ease;
}

.pixel, img.pixel { image-rendering: pixelated; image-rendering: crisp-edges; }

:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    transition-duration: 0ms !important;
    animation-duration: 0ms !important;
  }
}
```

- [ ] **Step 3: Rewrite `app/layout.tsx`**

`app/layout.tsx`:
```tsx
import type { Metadata } from 'next';
import { SeasonProvider } from '@/components/season/SeasonProvider';
import { currentRealSeason } from '@/components/season/season';
import { noFoucScript } from '@/components/season/no-fouc-script';
import './globals.css';

export const metadata: Metadata = {
  title: 'Portfolio',
  description: 'Pixel art seasonal portfolio.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const initial = currentRealSeason();
  return (
    <html lang="en" data-season={initial}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: noFoucScript }} />
      </head>
      <body>
        <SeasonProvider initial={initial}>{children}</SeasonProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Verify the dev server boots**

Run: `npm run dev` (in background, then curl).
```bash
npm run dev &
sleep 5
curl -s http://localhost:3000 | head -40
kill %1
```
Expected: HTML response includes `data-season="<current season>"` on the `<html>` tag and the inline `noFoucScript` in the head.

- [ ] **Step 5: Run unit tests**

Run: `npm run test:run`
Expected: all prior tests still pass.

- [ ] **Step 6: Commit**

```bash
git add app/layout.tsx app/globals.css components/season/no-fouc-script.ts
git commit -m "feat(theme): wire SeasonProvider, FOUC script, and season CSS variables"
```

---

### Task 5: SeasonToggle component

**Files:**
- Create: `components/season/SeasonToggle.tsx`
- Test: `components/season/SeasonToggle.test.tsx`

- [ ] **Step 1: Write the failing test**

`components/season/SeasonToggle.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SeasonProvider } from './SeasonProvider';
import { SeasonToggle } from './SeasonToggle';

function setup(initial: 'spring' | 'summer' | 'autumn' | 'winter' = 'spring') {
  return render(
    <SeasonProvider initial={initial}>
      <SeasonToggle />
    </SeasonProvider>
  );
}

describe('SeasonToggle', () => {
  it('renders one button per season with aria-pressed reflecting active state', () => {
    setup('autumn');
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(4);
    const autumnBtn = screen.getByRole('button', { name: /autumn/i });
    expect(autumnBtn).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: /spring/i }))
      .toHaveAttribute('aria-pressed', 'false');
  });

  it('clicking a button updates active state and html data-season', async () => {
    const user = userEvent.setup();
    setup('spring');
    await user.click(screen.getByRole('button', { name: /winter/i }));
    expect(document.documentElement.dataset.season).toBe('winter');
    expect(screen.getByRole('button', { name: /winter/i }))
      .toHaveAttribute('aria-pressed', 'true');
  });

  it('arrow keys cycle through the group', async () => {
    const user = userEvent.setup();
    setup('spring');
    const spring = screen.getByRole('button', { name: /spring/i });
    spring.focus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('button', { name: /summer/i })).toHaveFocus();
    await user.keyboard('{ArrowLeft}{ArrowLeft}');
    expect(screen.getByRole('button', { name: /winter/i })).toHaveFocus();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:run -- components/season/SeasonToggle.test.tsx`
Expected: FAIL, "Cannot find module './SeasonToggle'".

- [ ] **Step 3: Implement `SeasonToggle`**

`components/season/SeasonToggle.tsx`:
```tsx
'use client';
import { useRef } from 'react';
import { SEASONS, type Season } from './season';
import { useSeason } from './useSeason';

const ICON: Record<Season, string> = {
  spring: '✿',
  summer: '☀',
  autumn: '♣',
  winter: '❄',
};

export function SeasonToggle() {
  const { season, setSeason } = useSeason();
  const refs = useRef<Record<Season, HTMLButtonElement | null>>({
    spring: null, summer: null, autumn: null, winter: null,
  });

  function onKey(current: Season, e: React.KeyboardEvent<HTMLButtonElement>) {
    const i = SEASONS.indexOf(current);
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      refs.current[SEASONS[(i + 1) % SEASONS.length]]?.focus();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      refs.current[SEASONS[(i - 1 + SEASONS.length) % SEASONS.length]]?.focus();
    }
  }

  return (
    <div
      role="group"
      aria-label="Change season"
      className="fixed bottom-4 right-4 z-50 flex gap-2 rounded-lg bg-[var(--paper)] p-2 shadow-md"
      style={{ borderColor: 'var(--ink)', borderWidth: 2 }}
    >
      {SEASONS.map((s) => {
        const active = s === season;
        return (
          <button
            key={s}
            ref={(el) => { refs.current[s] = el; }}
            type="button"
            aria-label={s}
            aria-pressed={active}
            onClick={() => setSeason(s)}
            onKeyDown={(e) => onKey(s, e)}
            className="pixel w-10 h-10 flex items-center justify-center text-lg"
            style={{
              color: 'var(--ink)',
              background: active ? 'var(--accent)' : 'transparent',
              outline: active ? '2px solid var(--ink)' : 'none',
            }}
          >
            <span aria-hidden="true">{ICON[s]}</span>
          </button>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test:run -- components/season/SeasonToggle.test.tsx`
Expected: PASS (3 cases).

- [ ] **Step 5: Commit**

```bash
git add components/season/SeasonToggle.tsx components/season/SeasonToggle.test.tsx
git commit -m "feat(season): add SeasonToggle UI with keyboard navigation"
```

---

## Phase 2 — Hero scene

### Task 6: Site config + Hero shell + HeroCopy

**Files:**
- Create: `config/site.ts`
- Create: `components/hero/HeroCopy.tsx`
- Create: `components/hero/Hero.tsx`

- [ ] **Step 1: Create `config/site.ts`**

```ts
export const site = {
  name: 'YOUR_NAME',
  title: 'Software Architect',
  tagline: 'Crafting systems that scale and stories that ship.',
  socials: {
    github: '',
    linkedin: '',
    email: '',
  },
} as const;

export type Site = typeof site;
```

- [ ] **Step 2: Implement `HeroCopy`**

`components/hero/HeroCopy.tsx`:
```tsx
import { site } from '@/config/site';

export function HeroCopy() {
  return (
    <div className="relative z-50 flex flex-col items-start gap-3 max-w-2xl">
      <p className="pixel text-sm uppercase tracking-widest" style={{ color: 'var(--accent)' }}>
        {site.title}
      </p>
      <h1
        className="pixel text-5xl md:text-7xl leading-tight"
        style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)' }}
      >
        {site.name}
      </h1>
      <p className="text-base md:text-lg" style={{ color: 'var(--ink)' }}>
        {site.tagline}
      </p>
    </div>
  );
}
```

- [ ] **Step 3: Implement `Hero` shell**

`components/hero/Hero.tsx`:
```tsx
import { HeroCopy } from './HeroCopy';
import { SkyLayer } from './SkyLayer';
import { GroundLayer } from './GroundLayer';
import { ParallaxLayer } from './ParallaxLayer';
import { Particles } from './Particles';
import { SeasonToggle } from '@/components/season/SeasonToggle';

export function Hero() {
  return (
    <header className="relative w-full overflow-hidden" style={{ height: '100svh' }}>
      <SkyLayer />
      <ParallaxLayer />
      <GroundLayer />
      <Particles />
      <div className="absolute inset-0 z-50 flex items-center px-6 md:px-16">
        <HeroCopy />
      </div>
      <SeasonToggle />
    </header>
  );
}
```

> Note: this task references `SkyLayer`, `ParallaxLayer`, `GroundLayer`, and `Particles` which are created in tasks 7-10. The build will be broken until those exist — that's intentional; we'll restore green at task 10. Do not run `npm run build` yet.

- [ ] **Step 4: Run unit tests (existing ones must still pass)**

Run: `npm run test:run`
Expected: all prior tests pass; no new tests added in this task.

- [ ] **Step 5: Commit**

```bash
git add config/site.ts components/hero/HeroCopy.tsx components/hero/Hero.tsx
git commit -m "feat(hero): scaffold Hero shell + HeroCopy + site config"
```

---

### Task 7: SkyLayer

**Files:**
- Create: `components/hero/SkyLayer.tsx`

- [ ] **Step 1: Implement `SkyLayer`**

```tsx
export function SkyLayer() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 z-0"
      style={{
        background:
          'linear-gradient(180deg, var(--sky-top) 0%, var(--sky-bot) 100%)',
        transition: 'background 600ms ease',
      }}
    >
      <SunOrMoon />
    </div>
  );
}

function SunOrMoon() {
  return (
    <svg
      aria-hidden="true"
      className="pixel absolute"
      style={{
        top: '12%',
        right: '15%',
        width: 64,
        height: 64,
        color: 'var(--accent)',
      }}
      viewBox="0 0 16 16"
      shapeRendering="crispEdges"
    >
      <rect x="4" y="4" width="8" height="8" fill="currentColor" />
      <rect x="3" y="5" width="1" height="6" fill="currentColor" />
      <rect x="12" y="5" width="1" height="6" fill="currentColor" />
      <rect x="5" y="3" width="6" height="1" fill="currentColor" />
      <rect x="5" y="12" width="6" height="1" fill="currentColor" />
    </svg>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/hero/SkyLayer.tsx
git commit -m "feat(hero): add SkyLayer with gradient sky + pixel sun"
```

---

### Task 8: GroundLayer

**Files:**
- Create: `components/hero/GroundLayer.tsx`

- [ ] **Step 1: Implement `GroundLayer`**

```tsx
export function GroundLayer() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-x-0 bottom-0 z-30"
      style={{
        height: '30%',
        background:
          'linear-gradient(180deg, var(--ground) 0%, var(--ground-shadow) 100%)',
        boxShadow: 'inset 0 4px 0 0 var(--ground-shadow)',
        transition: 'background 600ms ease',
      }}
    >
      <div
        className="pixel absolute inset-x-0 top-0"
        style={{
          height: 8,
          backgroundImage:
            'repeating-linear-gradient(90deg, var(--ground-shadow) 0 4px, transparent 4px 8px)',
        }}
      />
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/hero/GroundLayer.tsx
git commit -m "feat(hero): add GroundLayer with tileable pixel grass edge"
```

---

### Task 9: ParallaxLayer

**Files:**
- Create: `components/hero/ParallaxLayer.tsx`

- [ ] **Step 1: Implement `ParallaxLayer`**

```tsx
'use client';
import { useEffect, useRef } from 'react';
import { useSeason } from '@/components/season/useSeason';

const FACTOR = 0.3;

export function ParallaxLayer() {
  const { season } = useSeason();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const y = window.scrollY * FACTOR;
        el.style.transform = `translate3d(0, ${y}px, 0)`;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="absolute inset-x-0 z-20"
      style={{
        bottom: '28%',
        height: '20%',
        transition: 'background 600ms ease',
        backgroundImage: `linear-gradient(180deg, transparent 0%, var(--foliage) 100%)`,
        opacity: 0.85,
      }}
      data-season-debug={season}
    >
      <div
        className="pixel absolute inset-x-0 bottom-0"
        style={{
          height: 32,
          backgroundColor: 'var(--foliage)',
          maskImage:
            'radial-gradient(circle at 10% 100%, black 18px, transparent 19px), radial-gradient(circle at 30% 100%, black 26px, transparent 27px), radial-gradient(circle at 55% 100%, black 22px, transparent 23px), radial-gradient(circle at 80% 100%, black 30px, transparent 31px)',
          WebkitMaskImage:
            'radial-gradient(circle at 10% 100%, black 18px, transparent 19px), radial-gradient(circle at 30% 100%, black 26px, transparent 27px), radial-gradient(circle at 55% 100%, black 22px, transparent 23px), radial-gradient(circle at 80% 100%, black 30px, transparent 31px)',
          maskComposite: 'add',
          WebkitMaskComposite: 'source-over',
        }}
      />
    </div>
  );
}
```

> The mid-layer here is a CSS-only stand-in (gradient + masked silhouette). When real sprite PNGs are added, swap this implementation to render an `<img>` with `image-rendering: pixelated`. The component contract (full-width parallax band at z-20 with `bottom: 28%`) stays the same.

- [ ] **Step 2: Commit**

```bash
git add components/hero/ParallaxLayer.tsx
git commit -m "feat(hero): add ParallaxLayer (CSS placeholder silhouette)"
```

---

### Task 10: Particles canvas

**Files:**
- Create: `components/hero/Particles.tsx`

- [ ] **Step 1: Implement `Particles`**

```tsx
'use client';
import { useEffect, useRef } from 'react';
import { useSeason } from '@/components/season/useSeason';
import type { Season } from '@/components/season/season';

interface Config {
  count: number;
  velY: [number, number];
  velX: [number, number];
  size: [number, number];
  rotate: boolean;
  upward: boolean;
}

const CONFIG: Record<Season, Config> = {
  spring: { count: 50, velY: [0.3, 0.7], velX: [-0.4, 0.4], size: [3, 5], rotate: true,  upward: false },
  summer: { count: 40, velY: [-0.3, -0.6], velX: [-0.2, 0.2], size: [2, 3], rotate: false, upward: true  },
  autumn: { count: 50, velY: [0.4, 0.9], velX: [-0.5, 0.5], size: [4, 7], rotate: true,  upward: false },
  winter: { count: 60, velY: [0.4, 0.8], velX: [-0.3, 0.3], size: [3, 6], rotate: false, upward: false },
};

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  size: number;
  rot: number; vrot: number;
}

function rand([a, b]: [number, number]) { return a + Math.random() * (b - a); }

export function Particles() {
  const { season } = useSeason();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      if (!canvas) return;
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const cfg = CONFIG[season];
    const color = getComputedStyle(document.documentElement)
      .getPropertyValue('--particle-color').trim() || '#fff';
    const particles: Particle[] = Array.from({ length: cfg.count }, () => makeParticle(cfg, canvas.clientWidth, canvas.clientHeight));

    let raf = 0;
    let running = !reduced;

    function step() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (cfg.rotate) p.rot += p.vrot;

        const off = (p.y > canvas.clientHeight + 10) || (p.y < -10) || (p.x < -10) || (p.x > canvas.clientWidth + 10);
        if (off) Object.assign(p, makeParticle(cfg, canvas.clientWidth, canvas.clientHeight, true));

        ctx.save();
        ctx.translate(p.x, p.y);
        if (cfg.rotate) ctx.rotate(p.rot);
        ctx.fillStyle = color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      }
      if (running) raf = requestAnimationFrame(step);
    }

    if (running) raf = requestAnimationFrame(step);

    function onVisibility() {
      running = document.visibilityState === 'visible' && !reduced;
      if (running && !raf) raf = requestAnimationFrame(step);
    }
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [season]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 z-10 pointer-events-none"
      style={{ width: '100%', height: '100%' }}
    />
  );
}

function makeParticle(cfg: Config, w: number, h: number, recycle = false): Particle {
  const upward = cfg.upward;
  return {
    x: Math.random() * w,
    y: recycle ? (upward ? h + 5 : -5) : Math.random() * h,
    vx: rand(cfg.velX),
    vy: rand(cfg.velY),
    size: rand(cfg.size),
    rot: Math.random() * Math.PI * 2,
    vrot: cfg.rotate ? (Math.random() - 0.5) * 0.05 : 0,
  };
}
```

- [ ] **Step 2: Wire Hero into `app/page.tsx`**

`app/page.tsx`:
```tsx
import { Hero } from '@/components/hero/Hero';

export default function Home() {
  return (
    <main>
      <Hero />
    </main>
  );
}
```

- [ ] **Step 3: Smoke-test in the browser**

Run:
```bash
npm run dev &
sleep 5
curl -s http://localhost:3000 -o /tmp/home.html
grep -q 'data-season=' /tmp/home.html && echo OK-data-season || echo MISSING-data-season
kill %1
```
Expected: prints `OK-data-season`. Open `http://localhost:3000` in browser manually — confirm sky gradient, ground, parallax silhouette, particles, headline, and four-button toggle. Click each toggle → palette + particles change.

- [ ] **Step 4: Run all unit tests**

Run: `npm run test:run`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/hero/Particles.tsx app/page.tsx
git commit -m "feat(hero): add seasonal particle canvas and wire Hero into home page"
```

---

## Phase 3 — Projects section

### Task 11: PixelFrame shared component

**Files:**
- Create: `components/shared/PixelFrame.tsx`
- Test: `components/shared/PixelFrame.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PixelFrame } from './PixelFrame';

describe('PixelFrame', () => {
  it('renders children inside a wrapper with role="presentation"', () => {
    render(<PixelFrame data-testid="frame"><span>inside</span></PixelFrame>);
    expect(screen.getByTestId('frame')).toBeInTheDocument();
    expect(screen.getByText('inside')).toBeInTheDocument();
  });

  it('passes through className', () => {
    render(<PixelFrame data-testid="frame" className="extra-class"><span /></PixelFrame>);
    expect(screen.getByTestId('frame').className).toMatch(/extra-class/);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:run -- components/shared/PixelFrame.test.tsx`
Expected: FAIL, "Cannot find module './PixelFrame'".

- [ ] **Step 3: Implement `PixelFrame`**

```tsx
import type { HTMLAttributes, ReactNode } from 'react';

export interface PixelFrameProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function PixelFrame({ children, className = '', style, ...rest }: PixelFrameProps) {
  return (
    <div
      {...rest}
      className={`relative ${className}`}
      style={{
        boxShadow: [
          '0 -4px 0 0 var(--ink)',
          '0 4px 0 0 var(--ink)',
          '-4px 0 0 0 var(--ink)',
          '4px 0 0 0 var(--ink)',
          'inset 0 0 0 4px var(--paper)',
        ].join(','),
        background: 'var(--paper)',
        ...style,
      }}
    >
      <span aria-hidden className="pixel absolute -top-1 -left-1 w-2 h-2" style={{ background: 'var(--accent)' }} />
      <span aria-hidden className="pixel absolute -top-1 -right-1 w-2 h-2" style={{ background: 'var(--accent)' }} />
      <span aria-hidden className="pixel absolute -bottom-1 -left-1 w-2 h-2" style={{ background: 'var(--accent)' }} />
      <span aria-hidden className="pixel absolute -bottom-1 -right-1 w-2 h-2" style={{ background: 'var(--accent)' }} />
      {children}
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test:run -- components/shared/PixelFrame.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/shared/PixelFrame.tsx components/shared/PixelFrame.test.tsx
git commit -m "feat(shared): add PixelFrame wrapper with corner accents"
```

---

### Task 12: Projects config

**Files:**
- Create: `config/projects.ts`

- [ ] **Step 1: Create `config/projects.ts`**

```ts
export interface Project {
  slug: string;
  title: string;
  description: string;
  stack: string[];
  image?: string;
  href?: string;
}

export const projects: Project[] = [
  {
    slug: 'p1',
    title: 'Project One',
    description: 'Placeholder description for the first featured project. Replace with a concise outcome-focused summary.',
    stack: ['TypeScript', 'AWS', 'Kafka'],
  },
  {
    slug: 'p2',
    title: 'Project Two',
    description: 'Placeholder description for the second featured project. Replace with a concise outcome-focused summary.',
    stack: ['Go', 'Kubernetes', 'gRPC'],
  },
  {
    slug: 'p3',
    title: 'Project Three',
    description: 'Placeholder description for the third featured project. Replace with a concise outcome-focused summary.',
    stack: ['Rust', 'Postgres', 'DDD'],
  },
];
```

- [ ] **Step 2: Commit**

```bash
git add config/projects.ts
git commit -m "feat(projects): add placeholder Project data"
```

---

### Task 13: ProjectCard component

**Files:**
- Create: `components/projects/ProjectCard.tsx`
- Test: `components/projects/ProjectCard.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProjectCard } from './ProjectCard';
import type { Project } from '@/config/projects';

const project: Project = {
  slug: 's',
  title: 'Sample',
  description: 'Description here',
  stack: ['TS', 'AWS'],
  href: 'https://example.com',
};

describe('ProjectCard', () => {
  it('renders title, description and stack tags', () => {
    render(<ProjectCard project={project} />);
    expect(screen.getByRole('heading', { name: 'Sample' })).toBeInTheDocument();
    expect(screen.getByText('Description here')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('renders an anchor with the href when provided', () => {
    render(<ProjectCard project={project} />);
    expect(screen.getByRole('link', { name: /view case study/i }))
      .toHaveAttribute('href', 'https://example.com');
  });

  it('omits the link when href is missing', () => {
    render(<ProjectCard project={{ ...project, href: undefined }} />);
    expect(screen.queryByRole('link')).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:run -- components/projects/ProjectCard.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement `ProjectCard`**

```tsx
import { PixelFrame } from '@/components/shared/PixelFrame';
import type { Project } from '@/config/projects';

export interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <PixelFrame className="p-6 flex flex-col gap-4 transition-transform hover:-translate-y-1">
      <div
        className="pixel w-full aspect-video flex items-center justify-center"
        style={{
          background:
            'linear-gradient(180deg, var(--sky-top) 0%, var(--ground) 100%)',
          color: 'var(--paper)',
        }}
        aria-hidden="true"
      >
        <span className="text-2xl">★</span>
      </div>
      <h3 className="pixel text-xl" style={{ color: 'var(--ink)' }}>
        {project.title}
      </h3>
      <p className="text-sm leading-relaxed" style={{ color: 'var(--ink)' }}>
        {project.description}
      </p>
      <ul className="flex flex-wrap gap-2">
        {project.stack.map((tag) => (
          <li
            key={tag}
            className="pixel text-xs px-2 py-1"
            style={{ background: 'var(--foliage)', color: 'var(--paper)' }}
          >
            {tag}
          </li>
        ))}
      </ul>
      {project.href && (
        <a
          href={project.href}
          className="text-sm underline-offset-4 hover:underline"
          style={{ color: 'var(--accent)' }}
        >
          View case study →
        </a>
      )}
    </PixelFrame>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test:run -- components/projects/ProjectCard.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/projects/ProjectCard.tsx components/projects/ProjectCard.test.tsx
git commit -m "feat(projects): add ProjectCard with PixelFrame and stack tags"
```

---

### Task 14: Projects section + wire into home page

**Files:**
- Create: `components/projects/Projects.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Implement `Projects`**

```tsx
import { ProjectCard } from './ProjectCard';
import { projects } from '@/config/projects';

export function Projects() {
  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="py-24 px-6 md:px-16"
      style={{ background: 'var(--paper)', color: 'var(--ink)' }}
    >
      <header className="flex items-center gap-3 mb-10">
        <span className="pixel text-2xl" aria-hidden style={{ color: 'var(--accent)' }}>★</span>
        <h2
          id="projects-heading"
          className="pixel text-3xl md:text-4xl"
          style={{ color: 'var(--ink)' }}
        >
          Featured Projects
        </h2>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Update `app/page.tsx`**

```tsx
import { Hero } from '@/components/hero/Hero';
import { Projects } from '@/components/projects/Projects';

export default function Home() {
  return (
    <main>
      <Hero />
      <Projects />
    </main>
  );
}
```

- [ ] **Step 3: Smoke-test the page**

Run:
```bash
npm run dev &
sleep 5
curl -s http://localhost:3000 -o /tmp/home.html
grep -c 'projects-heading' /tmp/home.html
kill %1
```
Expected: prints `1`. Open browser, confirm 3 cards in a responsive grid; resize window to verify 1/2/3-col breakpoints.

- [ ] **Step 4: Run all unit tests**

Run: `npm run test:run`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/projects/Projects.tsx app/page.tsx
git commit -m "feat(projects): add Projects section and wire into home page"
```

---

## Phase 4 — Polish: fonts, E2E, accessibility

### Task 15: Pixel display font via `next/font`

**Files:**
- Modify: `app/layout.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: Import a pixel display font in `app/layout.tsx`**

Add at the top (after existing imports):
```tsx
import { VT323 } from 'next/font/google';
import { Inter } from 'next/font/google';

const display = VT323({ subsets: ['latin'], weight: '400', variable: '--font-display' });
const body = Inter({ subsets: ['latin'], variable: '--font-body' });
```

Update the `<html>` element to include the font variables:
```tsx
<html lang="en" data-season={initial} className={`${display.variable} ${body.variable}`}>
```

- [ ] **Step 2: Wire the body font in CSS**

In `app/globals.css`, append after the season blocks:
```css
body { font-family: var(--font-body), system-ui, sans-serif; }
.pixel-font { font-family: var(--font-display), monospace; }
```

Then update components that currently use `font-family: 'var(--font-display)'` inline (HeroCopy h1) to use the `pixel-font` class. Example for HeroCopy h1:
```tsx
<h1 className="pixel-font text-5xl md:text-7xl leading-tight" style={{ color: 'var(--ink)' }}>
```

Repeat the swap for any other element that should use the display font (section headings in Projects, project card titles, toggle icons — apply the class, drop the inline `fontFamily`).

- [ ] **Step 3: Smoke-test**

Run `npm run dev` and open the home page. Confirm Hero name renders in the pixel font; body text renders in Inter.

- [ ] **Step 4: Commit**

```bash
git add app/layout.tsx app/globals.css components/hero/HeroCopy.tsx components/projects/Projects.tsx components/projects/ProjectCard.tsx components/season/SeasonToggle.tsx
git commit -m "feat(typography): wire VT323 display font + Inter body font via next/font"
```

---

### Task 16: Playwright E2E — season switching & persistence

**Files:**
- Create: `e2e/season.spec.ts`

- [ ] **Step 1: Write the E2E spec**

```ts
import { test, expect } from '@playwright/test';

const SEASONS = ['spring', 'summer', 'autumn', 'winter'] as const;

test.describe('season toggle', () => {
  test('clicking each season updates data-season', async ({ page }) => {
    await page.goto('/');
    for (const s of SEASONS) {
      await page.getByRole('button', { name: s }).click();
      await expect(page.locator('html')).toHaveAttribute('data-season', s);
      await expect(page.getByRole('button', { name: s })).toHaveAttribute('aria-pressed', 'true');
    }
  });

  test('selection persists across reload', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'winter' }).click();
    await expect(page.locator('html')).toHaveAttribute('data-season', 'winter');
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-season', 'winter');
  });

  test('Hero and Projects are visible on home', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /featured projects/i })).toBeVisible();
    await expect(page.locator('header').first()).toBeVisible();
    await expect(page.locator('section#projects')).toBeVisible();
  });

  test('reduced motion keeps particle canvas static', async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    await page.goto('/');
    const a = await page.locator('canvas').screenshot();
    await page.waitForTimeout(500);
    const b = await page.locator('canvas').screenshot();
    expect(Buffer.compare(a, b)).toBe(0);
    await ctx.close();
  });
});
```

- [ ] **Step 2: Run the E2E suite**

Run: `npm run test:e2e`
Expected: 4 tests pass. If reduced-motion test flickers because the canvas occasionally renders one frame before the rAF loop is short-circuited, increase the initial wait before the first screenshot to 200ms.

- [ ] **Step 3: Commit**

```bash
git add e2e/season.spec.ts
git commit -m "test(e2e): cover season switching, persistence, reduced-motion"
```

---

### Task 17: Manual accessibility & contrast audit

**Files:**
- Modify (if needed): `app/globals.css` (palette tweaks)

- [ ] **Step 1: Run an axe-core audit via Playwright (one-off)**

Install temporarily and run:
```bash
npm install -D @axe-core/playwright
```

Create `e2e/a11y.spec.ts`:
```ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const SEASONS = ['spring', 'summer', 'autumn', 'winter'] as const;

for (const s of SEASONS) {
  test(`no critical axe violations on ${s}`, async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: s }).click();
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    const critical = results.violations.filter(v => v.impact === 'critical' || v.impact === 'serious');
    expect(critical, JSON.stringify(critical, null, 2)).toEqual([]);
  });
}
```

- [ ] **Step 2: Run it**

Run: `npm run test:e2e -- e2e/a11y.spec.ts`
Expected: 4 passes. If any season fails on contrast, adjust the affected variable in `app/globals.css` (typically `--ink` against `--paper`) until contrast clears AA.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json e2e/a11y.spec.ts app/globals.css
git commit -m "test(a11y): add axe-core audit across all four seasons"
```

---

### Task 18: Final verification + cleanup

**Files:**
- Modify: `package.json` (optional convenience script)

- [ ] **Step 1: Add a `verify` script**

In `package.json` scripts:
```json
"verify": "npm run lint && npm run test:run && npm run test:e2e"
```

- [ ] **Step 2: Run full verification**

Run: `npm run verify`
Expected: lint clean, all unit tests pass, all E2E tests pass.

- [ ] **Step 3: Manual smoke checklist**

Open `http://localhost:3000` and confirm:
- [ ] `<html data-season>` matches the current real season on first load (in a fresh incognito session).
- [ ] Each season button changes palette + particles smoothly.
- [ ] Refresh preserves selection.
- [ ] Projects grid is 1 col on narrow viewport (e.g. iPhone SE), 2 cols at md (~768px), 3 cols at lg (~1024px+).
- [ ] Tab key reaches the toggle group; arrow keys cycle; Enter/Space activates.
- [ ] Lighthouse mobile: Performance ≥ 90, Accessibility ≥ 95.

- [ ] **Step 4: Commit**

```bash
git add package.json
git commit -m "chore: add verify script (lint + unit + e2e)"
```

---

## Self-Review (already executed)

1. **Spec coverage:** All spec sections traced to tasks — theme system (Tasks 2-4), Hero scene incl. layers + particles (Tasks 6-10), Projects (Tasks 11-14), typography (Task 15), tests + a11y + perf (Tasks 16-18). The deferred About/Skills/Experience/Contact sections from spec §12 are intentionally out of scope for this plan.
2. **Placeholder scan:** No TBDs. Placeholder *content* is intentional (project copy, name) and lives in `config/`; spec §13 calls this out.
3. **Type consistency:** `Season`, `SEASONS`, `currentRealSeason`, `isSeason`, `SeasonContextValue`, `SeasonProviderProps`, `Project`, `Site`, `PixelFrameProps`, `ProjectCardProps` defined once and reused consistently.

## Notes for the executor

- Per CLAUDE.md / AGENTS.md: Next.js 16 has breaking changes; after `npm install`, browse `node_modules/next/dist/docs/` for anything that affects `next/font`, App Router, or `<Image>`. Update the affected task in place if you find a breaking change.
- The visual companion server may still be running from brainstorming (`scripts/start-server.sh` under `.superpowers/brainstorm/`). It is **not** required for execution and can be ignored or stopped.
- Commit messages above use Conventional Commits; the user may want them squashed before merge.
- The user explicitly declined the spec commit during brainstorming. They have not declined commits for *implementation* — confirm the commit policy with them before running the commit step of Task 1.
