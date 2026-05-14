'use client';
import { useEffect, useState } from 'react';

export function FpsCounter() {
  const [fps, setFps] = useState(0);
  const [min, setMin] = useState(999);
  const [max, setMax] = useState(0);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    let raf = 0;
    let frames = 0;
    let lastSample = performance.now();
    let runningMin = 999;
    let runningMax = 0;

    function tick(now: number) {
      raf = requestAnimationFrame(tick);
      frames++;
      const elapsed = now - lastSample;
      if (elapsed >= 500) {
        const current = Math.round((frames * 1000) / elapsed);
        setFps(current);
        if (current < runningMin) {
          runningMin = current;
          setMin(current);
        }
        if (current > runningMax) {
          runningMax = current;
          setMax(current);
        }
        frames = 0;
        lastSample = now;
      }
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  if (process.env.NODE_ENV !== 'development') return null;

  const color = fps >= 55 ? '#5ee85e' : fps >= 30 ? '#ffd93d' : '#ff5e5e';

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 8,
        left: 8,
        zIndex: 9999,
        padding: '4px 8px',
        background: 'rgba(0, 0, 0, 0.7)',
        color,
        font: '12px/1.2 ui-monospace, SFMono-Regular, Menlo, monospace',
        borderRadius: 4,
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    >
      <div>FPS: {fps}</div>
      <div style={{ fontSize: 10, opacity: 0.7 }}>
        min {min === 999 ? '—' : min} / max {max || '—'}
      </div>
    </div>
  );
}
