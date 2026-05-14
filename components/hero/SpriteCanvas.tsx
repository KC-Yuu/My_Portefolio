'use client';
import { useEffect, useRef } from 'react';
import { subscribeAnimationFrame } from './useAnimationFrame';
import { dispatchSpriteDraw, setSpriteCanvas } from './spriteCanvas';

// Single shared canvas for Frogs + Bees. Both register draw fns via
// subscribeSpriteDraw; this component owns the element + rAF dispatch.
export function SpriteCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    setSpriteCanvas(c);

    function resize() {
      if (!c) return;
      c.width = window.innerWidth;
      c.height = window.innerHeight;
      const ctx = c.getContext('2d');
      if (ctx) ctx.imageSmoothingEnabled = false;
    }
    resize();
    window.addEventListener('resize', resize);
    const unsub = subscribeAnimationFrame((now) => dispatchSpriteDraw(now));

    return () => {
      window.removeEventListener('resize', resize);
      unsub();
      setSpriteCanvas(null);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="absolute pointer-events-none"
      style={{ top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 32 }}
    />
  );
}
