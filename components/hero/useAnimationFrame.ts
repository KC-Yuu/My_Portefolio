'use client';
import { useEffect, useRef } from 'react';

// Single master rAF loop dispatching to all subscribers — saves N-1 rAF
// callback overheads per frame (each rAF has ~0.05ms fixed cost).
const subscribers = new Set<(now: number) => void>();
let raf: number | null = null;

function tick(now: number) {
  for (const fn of subscribers) {
    fn(now);
  }
  raf = requestAnimationFrame(tick);
}

function start() {
  if (raf == null) {
    raf = requestAnimationFrame(tick);
  }
}

function stop() {
  if (raf != null) {
    cancelAnimationFrame(raf);
    raf = null;
  }
}

export function useAnimationFrame(callback: (now: number) => void): void {
  const ref = useRef(callback);
  ref.current = callback;

  useEffect(() => {
    const fn = (now: number) => ref.current(now);
    subscribers.add(fn);
    start();
    return () => {
      subscribers.delete(fn);
      if (subscribers.size === 0) stop();
    };
  }, []);
}

// Imperative API for components that need rAF inside useEffect closures.
export function subscribeAnimationFrame(fn: (now: number) => void): () => void {
  subscribers.add(fn);
  start();
  return () => {
    subscribers.delete(fn);
    if (subscribers.size === 0) stop();
  };
}
