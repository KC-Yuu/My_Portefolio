'use client';
import { useState, type PointerEvent as ReactPointerEvent } from 'react';
import { useSeason } from '@/components/season/useSeason';
import { Cloud, type CloudVariant } from '@/components/sprites/Cloud';

interface CloudInstance {
  variant: CloudVariant;
  top: string;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

const CLOUDS: ReadonlyArray<CloudInstance> = [
  { variant: 'C', top: '6%',  size: 72, duration: 110, delay:  -5,  opacity: 1 },
  { variant: 'A', top: '16%', size: 40, duration: 80,  delay: -25,  opacity: 1 },
  { variant: 'B', top: '22%', size: 54, duration: 130, delay: -50,  opacity: 1 },
  { variant: 'A', top: '11%', size: 46, duration: 95,  delay: -70,  opacity: 1 },
  { variant: 'B', top: '30%', size: 60, duration: 120, delay: -95,  opacity: 1 },
  { variant: 'C', top: '20%', size: 84, duration: 150, delay: -120, opacity: 1 },
];

const ASPECT: Record<CloudVariant, number> = { A: 16 / 8, B: 24 / 10, C: 32 / 12 };

const SHADOW_TOP = '76%';

const DRIFT_START_VW = -30;
const DRIFT_END_VW = 130;
const DRIFT_SPAN_VW = DRIFT_END_VW - DRIFT_START_VW;

interface Override {
  delayS: number;
  topPx: number;
}

interface ActiveDrag {
  index: number;
  pointerId: number;
  offsetX: number;
  offsetY: number;
  x: number;
  y: number;
}

export function Clouds() {
  const { season } = useSeason();
  const [overrides, setOverrides] = useState<Record<number, Override>>({});
  const [drag, setDrag] = useState<ActiveDrag | null>(null);

  if (season !== 'summer') return null;

  function onPointerDown(i: number, e: ReactPointerEvent<HTMLDivElement>) {
    const target = e.currentTarget;
    target.setPointerCapture(e.pointerId);
    const rect = target.getBoundingClientRect();
    setDrag({
      index: i,
      pointerId: e.pointerId,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
      x: rect.left,
      y: rect.top,
    });
  }

  function onPointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (!drag || drag.pointerId !== e.pointerId) return;
    setDrag({ ...drag, x: e.clientX - drag.offsetX, y: e.clientY - drag.offsetY });
  }

  function onPointerUp(e: ReactPointerEvent<HTMLDivElement>) {
    if (!drag || drag.pointerId !== e.pointerId) return;
    const i = drag.index;
    const c = CLOUDS[i];
    const vw = window.innerWidth / 100;
    const startPx = DRIFT_START_VW * vw;
    const spanPx = DRIFT_SPAN_VW * vw;
    const progress = Math.max(0, Math.min(1, (drag.x - startPx) / spanPx));
    const newDelay = -progress * c.duration;
    setOverrides((prev) => ({
      ...prev,
      [i]: { delayS: newDelay, topPx: drag.y },
    }));
    setDrag(null);
  }

  const sharedStyles = `
    .cloud {
      position: absolute;
      left: 0;
      pointer-events: auto;
      touch-action: none;
      cursor: grab;
      animation-name: cloud-drift;
      animation-timing-function: linear;
      animation-iteration-count: infinite;
      will-change: transform;
    }
    .cloud.dragging {
      cursor: grabbing;
      animation: none;
      z-index: 5;
    }
    .cloud-shadow {
      position: absolute;
      left: 0;
      pointer-events: none;
      animation-name: cloud-drift;
      animation-timing-function: linear;
      animation-iteration-count: infinite;
    }
    @keyframes cloud-drift {
      from { transform: translateX(-30vw); }
      to   { transform: translateX(130vw); }
    }
    @media (prefers-reduced-motion: reduce) {
      .cloud, .cloud-shadow { animation: none; }
    }
  `;

  return (
    <>
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{ zIndex: 35 }}
      >
        {CLOUDS.map((c, i) => {
          const isDragging = drag?.index === i;
          const ov = overrides[i];
          const w = c.size * ASPECT[c.variant];
          const shadowW = w * 0.95;
          const shadowH = Math.max(8, w * 0.16);

          const baseStyle: React.CSSProperties = {
            width: shadowW,
            height: shadowH,
            top: SHADOW_TOP,
            background:
              'radial-gradient(ellipse, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0.18) 40%, transparent 75%)',
            borderRadius: '50%',
          };

          const style: React.CSSProperties = isDragging
            ? { ...baseStyle, left: drag!.x, animation: 'none' }
            : {
                ...baseStyle,
                animationDuration: `${c.duration}s`,
                animationDelay: `${ov ? ov.delayS : c.delay}s`,
              };

          return <div key={`s-${i}`} className="cloud-shadow" style={style} />;
        })}
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{ zIndex: 10 }}
      >
        <style>{sharedStyles}</style>
        {CLOUDS.map((c, i) => {
          const isDragging = drag?.index === i;
          const ov = overrides[i];

          const style: React.CSSProperties = isDragging
            ? { top: drag!.y, left: drag!.x, opacity: c.opacity }
            : {
                top: ov ? `${ov.topPx}px` : c.top,
                opacity: c.opacity,
                animationDuration: `${c.duration}s`,
                animationDelay: `${ov ? ov.delayS : c.delay}s`,
              };

          return (
            <div
              key={`c-${i}`}
              data-cloud
              className={isDragging ? 'cloud dragging' : 'cloud'}
              style={style}
              onPointerDown={(e) => onPointerDown(i, e)}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
            >
              <Cloud variant={c.variant} size={c.size} />
            </div>
          );
        })}
      </div>
    </>
  );
}
