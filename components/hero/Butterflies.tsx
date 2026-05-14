'use client';
import { useSeason } from '@/components/season/useSeason';
import {
  Butterfly,
  type ButterflyVariant,
} from '@/components/sprites/Butterfly';

interface BfInstance {
  variant: ButterflyVariant;
  path: 1 | 2 | 3;
  size: number;
  duration: number;
  delay: number;
}

const BUTTERFLIES: ReadonlyArray<BfInstance> = [
  { variant: 'monarch', path: 1, size: 22, duration: 18, delay:   0 },
  { variant: 'azure',   path: 2, size: 18, duration: 22, delay:  -7 },
  { variant: 'monarch', path: 3, size: 20, duration: 16, delay:  -3 },
  { variant: 'azure',   path: 1, size: 16, duration: 26, delay: -12 },
];

const SHADOW_Y = '79vh';

const STYLES = `
.bf-wander {
  position: absolute;
  top: 0;
  left: 0;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
}
.bf-path-1 { animation-name: bf-path-1; }
.bf-path-2 { animation-name: bf-path-2; }
.bf-path-3 { animation-name: bf-path-3; }

.bf-shadow {
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 50%;
  background: radial-gradient(ellipse, rgba(0,0,0,0.32) 0%, rgba(0,0,0,0.16) 50%, transparent 80%);
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
}
.bf-shadow-path-1 { animation-name: bf-shadow-1; }
.bf-shadow-path-2 { animation-name: bf-shadow-2; }
.bf-shadow-path-3 { animation-name: bf-shadow-3; }

@keyframes bf-path-1 {
  0%   { transform: translate(10vw, 55vh) rotate(8deg); }
  20%  { transform: translate(28vw, 38vh) rotate(-6deg); }
  40%  { transform: translate(48vw, 60vh) rotate(12deg); }
  60%  { transform: translate(35vw, 72vh) rotate(-10deg); }
  80%  { transform: translate(18vw, 65vh) rotate(4deg); }
  100% { transform: translate(10vw, 55vh) rotate(8deg); }
}
@keyframes bf-path-2 {
  0%   { transform: translate(70vw, 45vh) rotate(-8deg) scaleX(-1); }
  25%  { transform: translate(55vw, 60vh) rotate(6deg) scaleX(-1); }
  50%  { transform: translate(72vw, 70vh) rotate(-12deg) scaleX(1); }
  75%  { transform: translate(85vw, 55vh) rotate(8deg) scaleX(1); }
  100% { transform: translate(70vw, 45vh) rotate(-8deg) scaleX(-1); }
}
@keyframes bf-path-3 {
  0%   { transform: translate(40vw, 75vh) rotate(0deg); }
  20%  { transform: translate(55vw, 62vh) rotate(-8deg); }
  40%  { transform: translate(70vw, 78vh) rotate(10deg) scaleX(-1); }
  60%  { transform: translate(58vw, 80vh) rotate(-6deg) scaleX(-1); }
  80%  { transform: translate(45vw, 68vh) rotate(8deg); }
  100% { transform: translate(40vw, 75vh) rotate(0deg); }
}

@keyframes bf-shadow-1 {
  0%   { transform: translate(10vw, ${SHADOW_Y}) scale(1.0); opacity: 0.55; }
  20%  { transform: translate(28vw, ${SHADOW_Y}) scale(1.3); opacity: 0.15; }
  40%  { transform: translate(48vw, ${SHADOW_Y}) scale(0.85); opacity: 0.5; }
  60%  { transform: translate(35vw, ${SHADOW_Y}) scale(0.4);  opacity: 0.1; }
  80%  { transform: translate(18vw, ${SHADOW_Y}) scale(0.7);  opacity: 0.35; }
  100% { transform: translate(10vw, ${SHADOW_Y}) scale(1.0); opacity: 0.55; }
}
@keyframes bf-shadow-2 {
  0%   { transform: translate(70vw, ${SHADOW_Y}) scale(1.2); opacity: 0.25; }
  25%  { transform: translate(55vw, ${SHADOW_Y}) scale(0.85); opacity: 0.5; }
  50%  { transform: translate(72vw, ${SHADOW_Y}) scale(0.5); opacity: 0.15; }
  75%  { transform: translate(85vw, ${SHADOW_Y}) scale(1.0); opacity: 0.45; }
  100% { transform: translate(70vw, ${SHADOW_Y}) scale(1.2); opacity: 0.25; }
}
@keyframes bf-shadow-3 {
  0%   { transform: translate(40vw, ${SHADOW_Y}) scale(0.45); opacity: 0.12; }
  20%  { transform: translate(55vw, ${SHADOW_Y}) scale(0.85); opacity: 0.5; }
  40%  { transform: translate(70vw, ${SHADOW_Y}) scale(0.3); opacity: 0.08; }
  60%  { transform: translate(58vw, ${SHADOW_Y}) scale(0.2); opacity: 0.0; }
  80%  { transform: translate(45vw, ${SHADOW_Y}) scale(0.65); opacity: 0.3; }
  100% { transform: translate(40vw, ${SHADOW_Y}) scale(0.45); opacity: 0.12; }
}
@media (prefers-reduced-motion: reduce) {
  .bf-wander, .bf-shadow { animation: none; }
}
`;

export function Butterflies() {
  const { season } = useSeason();
  if (season !== 'summer') return null;
  return (
    <>
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{ zIndex: 36 }}
      >
        <style>{STYLES}</style>
        {BUTTERFLIES.map((b, i) => {
          const w = b.size * 1.1;
          const h = Math.max(4, b.size * 0.22);
          return (
            <div
              key={`s-${i}`}
              className={`bf-shadow bf-shadow-path-${b.path}`}
              style={{
                width: w,
                height: h,
                marginLeft: -w / 2,
                marginTop: -h / 2,
                animationDuration: `${b.duration}s`,
                animationDelay: `${b.delay}s`,
              }}
            />
          );
        })}
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{ zIndex: 37 }}
      >
        {BUTTERFLIES.map((b, i) => (
          <div
            key={`b-${i}`}
            className={`bf-wander bf-path-${b.path}`}
            style={{
              animationDuration: `${b.duration}s`,
              animationDelay: `${b.delay}s`,
            }}
          >
            <Butterfly variant={b.variant} size={b.size} />
          </div>
        ))}
      </div>
    </>
  );
}
