'use client';

// Shared sprite-canvas registry. Frogs + Bees (and future sprite drawers)
// register draw functions here; SpriteCanvas component owns the single
// <canvas> element and the dispatch loop.

export type SpriteDraw = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  now: number,
) => void;

const subscribers = new Set<SpriteDraw>();
let currentCtx: CanvasRenderingContext2D | null = null;
let currentCanvas: HTMLCanvasElement | null = null;

export function setSpriteCanvas(canvas: HTMLCanvasElement | null): void {
  currentCanvas = canvas;
  currentCtx = canvas ? canvas.getContext('2d') : null;
}

export function getSpriteCanvas(): {
  ctx: CanvasRenderingContext2D | null;
  canvas: HTMLCanvasElement | null;
} {
  return { ctx: currentCtx, canvas: currentCanvas };
}

export function subscribeSpriteDraw(fn: SpriteDraw): () => void {
  subscribers.add(fn);
  return () => {
    subscribers.delete(fn);
  };
}

export function dispatchSpriteDraw(now: number): void {
  if (!currentCtx || !currentCanvas) return;
  for (const fn of subscribers) fn(currentCtx, currentCanvas, now);
}
