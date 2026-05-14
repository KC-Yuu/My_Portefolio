import {
  GrassBlade,
  GRASS_VARIANTS,
  type GrassVariant,
} from '@/components/sprites/GrassBlade';
import { Flower } from '@/components/sprites/Flower';
import { BladeShadow } from '@/components/sprites/BladeShadow';
import { Pond } from '@/components/sprites/Pond';
import { Tree, type TreeVariant } from '@/components/sprites/Tree';
import { FLOWER_FIELD } from '@/config/flowerField';
import { Tractor } from './Tractor';

interface BladeSpec {
  left: number;
  variant: GrassVariant;
  scale: number;
  tone: 'foliage' | 'shadow';
}

const BLADE_COUNT = 150;

const BLADES: ReadonlyArray<BladeSpec> = Array.from(
  { length: BLADE_COUNT },
  (_, i) => {
    const jitter = (((i * 37) % 23) - 11) / 4;
    return {
      left: (i / BLADE_COUNT) * 100 + jitter,
      variant: GRASS_VARIANTS[(i * 11) % GRASS_VARIANTS.length],
      scale: 0.7 + ((i * 17) % 9) / 10,
      tone: i % 3 === 0 ? 'shadow' : 'foliage',
    };
  }
);

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
      <svg
        aria-hidden="true"
        className="absolute pointer-events-none"
        style={{ top: 0, left: 0, width: '100%', height: '100%' }}
        preserveAspectRatio="none"
        shapeRendering="crispEdges"
      >
        <defs>
          <pattern
            id="grass-tex"
            width="16"
            height="16"
            patternUnits="userSpaceOnUse"
            patternTransform="scale(2)"
          >
            {[
              [1, 2], [6, 1], [11, 3], [3, 5], [8, 6], [13, 7], [5, 9],
              [10, 10], [2, 12], [14, 13], [7, 14], [12, 15], [4, 15],
              [9, 2], [15, 4], [0, 7], [6, 8], [11, 12],
            ].map(([x, y], i) => (
              <rect key={`d${i}`} x={x} y={y} width="1" height="1" fill="rgba(0,0,0,0.22)" />
            ))}
            {[
              [4, 3], [9, 5], [13, 11], [2, 8], [7, 10], [14, 1],
            ].map(([x, y], i) => (
              <rect key={`l${i}`} x={x} y={y} width="1" height="1" fill="rgba(255,255,255,0.18)" />
            ))}
            {[
              [3, 7], [10, 13], [6, 11],
            ].map(([x, y], i) => (
              <rect key={`t${i}`} x={x} y={y} width="2" height="1" fill="rgba(0,0,0,0.18)" />
            ))}
          </pattern>
        </defs>
        <rect x="0" y="0" width="100%" height="14%" fill="var(--field-far)" style={{ transition: 'fill 600ms ease' }} />
        <rect x="0" y="0" width="100%" height="14%" fill="url(#grass-tex)" />
        <rect x="0" y="14%" width="100%" height="20%" fill="var(--field-mid)" style={{ transition: 'fill 600ms ease' }} />
        <rect x="0" y="14%" width="100%" height="20%" fill="url(#grass-tex)" />
        <rect x="0" y="34%" width="100%" height="28%" fill="var(--field-near)" style={{ transition: 'fill 600ms ease' }} />
        <rect x="0" y="34%" width="100%" height="28%" fill="url(#grass-tex)" />
        <rect x="0" y="62%" width="100%" height="38%" fill="var(--field-very-near)" style={{ transition: 'fill 600ms ease' }} />
        <rect x="0" y="62%" width="100%" height="38%" fill="url(#grass-tex)" />
      </svg>
      <div
        data-pond
        className="pixel absolute pointer-events-none"
        style={{ top: '12%', right: '4%' }}
      >
        <Pond size={900} />
      </div>
      <CityLayer />
      <div
        aria-hidden="true"
        className="absolute pointer-events-none"
        style={{
          top: '-300px',
          left: 0,
          right: 0,
          width: '100%',
          height: '200px',
          zIndex: 0,
          perspective: '800px',
          perspectiveOrigin: '50% 100%',
          overflow: 'hidden',
        }}
      >
        <svg
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0,
            left: '-50%',
            width: '200%',
            height: '100%',
            transformOrigin: 'center bottom',
            transform: 'rotateX(50deg)',
          }}
          preserveAspectRatio="xMidYMid slice"
          shapeRendering="crispEdges"
        >
          <defs>
            <pattern
              id="forest-floor-tile"
              width="16"
              height="16"
              patternUnits="userSpaceOnUse"
              patternTransform="scale(2)"
            >
              {/* Mossy base — green-brown, not pure dirt */}
              <rect width="16" height="16" fill="#3d4a28" />
              {/* Dark moss/shadow pockets */}
              {[
                [1, 1], [5, 0], [11, 2], [3, 4], [9, 3], [14, 4], [2, 6],
                [7, 7], [12, 6], [4, 9], [10, 9], [15, 8], [1, 11],
                [6, 12], [13, 11], [8, 14], [11, 14],
              ].map(([x, y], i) => (
                <rect key={`d${i}`} x={x} y={y} width="1" height="1" fill="#2a3018" />
              ))}
              {/* Mid moss tones */}
              {[
                [2, 2], [8, 5], [13, 1], [5, 7], [10, 10], [3, 13],
                [14, 12], [6, 4], [11, 7], [0, 9],
              ].map(([x, y], i) => (
                <rect key={`m${i}`} x={x} y={y} width="1" height="1" fill="#4d6035" />
              ))}
              {/* Bright moss highlights (sun-touched grass) */}
              {[
                [4, 0], [11, 5], [7, 10], [13, 14], [1, 5], [9, 8],
              ].map(([x, y], i) => (
                <rect key={`bm${i}`} x={x} y={y} width="1" height="1" fill="#6d9a4a" />
              ))}
              {/* Dead leaves orange-red (autumn touches) */}
              {[
                [9, 1], [3, 8], [12, 13], [5, 14],
              ].map(([x, y], i) => (
                <rect key={`lf${i}`} x={x} y={y} width="1" height="1" fill="#a05a30" />
              ))}
              {/* Brown leaf-litter spots */}
              {[
                [7, 3], [13, 7], [2, 10], [4, 6], [10, 12],
              ].map(([x, y], i) => (
                <rect key={`ll${i}`} x={x} y={y} width="1" height="1" fill="#8b6b3a" />
              ))}
              {/* Twig fragments (dark thin lines) */}
              {[
                [6, 5], [14, 9], [3, 11],
              ].map(([x, y], i) => (
                <rect key={`tw${i}`} x={x} y={y} width="2" height="1" fill="#3a2a18" />
              ))}
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#forest-floor-tile)" />
        </svg>
      </div>
      <div
        aria-hidden="true"
        className="absolute pointer-events-none"
        style={{
          top: '-200px',
          left: 0,
          right: 0,
          width: '100%',
          height: '200px',
          zIndex: -1,
          perspective: '800px',
          perspectiveOrigin: '50% 100%',
          overflow: 'hidden',
        }}
      >
        <svg
          aria-hidden="true"
          className="pointer-events-none"
          style={{
            position: 'absolute',
            top: 0,
            left: '-50%',
            width: '200%',
            height: '100%',
            transformOrigin: 'center bottom',
            transform: 'rotateX(50deg)',
          }}
          preserveAspectRatio="xMidYMid slice"
          shapeRendering="crispEdges"
        >
          <defs>
            <pattern
              id="dirt-tile"
              width="16"
              height="16"
              patternUnits="userSpaceOnUse"
              patternTransform="scale(2)"
            >
              <rect width="16" height="16" fill="#6b4423" />
              {[
                [1, 0], [5, 0], [10, 1], [4, 2], [14, 2], [2, 3], [12, 3],
                [7, 4], [1, 5], [15, 5], [9, 6], [4, 7], [13, 8], [6, 9],
                [11, 10], [3, 11], [8, 12], [1, 13], [14, 14], [5, 15],
                [11, 4], [0, 8], [7, 11],
              ].map(([x, y], i) => (
                <rect key={`d${i}`} x={x} y={y} width="1" height="1" fill="#4a2e15" />
              ))}
              {[
                [7, 1], [3, 6], [12, 10], [2, 9], [10, 13], [6, 3], [14, 7],
              ].map(([x, y], i) => (
                <rect key={`l${i}`} x={x} y={y} width="1" height="1" fill="#8b5e30" />
              ))}
              {[
                [3, 14], [11, 2],
              ].map(([x, y], i) => (
                <rect key={`b${i}`} x={x} y={y} width="2" height="1" fill="#4a2e15" />
              ))}
            </pattern>
            <pattern
              id="dirt-rows"
              width="100"
              height="22"
              patternUnits="userSpaceOnUse"
            >
              <rect x="0" y="0" width="100" height="1" fill="rgba(58, 32, 14, 0.45)" />
              <rect x="0" y="11" width="100" height="1" fill="rgba(139, 94, 48, 0.35)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dirt-tile)" />
          <rect width="100%" height="100%" fill="url(#dirt-rows)" />
        </svg>
      </div>
      <Tractor />
      <div
        className="pixel absolute inset-x-0 pointer-events-none"
        style={{ top: 0, height: 1, overflow: 'visible', zIndex: 10 }}
      >
        <style>{`
          .blade-inner {
            display: block;
            line-height: 0;
            transform-origin: bottom center;
          }
          .blade-inner.is-anim {
            animation: blade-rot var(--blade-dur, 2.6s) ease-in-out infinite alternate;
            animation-delay: var(--blade-delay, 0s);
          }
          .blade-shadow {
            position: absolute;
            left: 50%;
            top: 100%;
            transform-origin: 100% 0%;
            transform: translate(-72%, -1px) rotate(-25deg);
            opacity: 0.22;
            pointer-events: none;
          }
          @keyframes blade-rot {
            from { transform: rotate(-9deg); }
            to   { transform: rotate(9deg); }
          }
        `}</style>
        {BLADES.map((b, i) => {
          const anim = i % 3 === 0;
          return (
            <div
              key={`b-${i}`}
              className="blade absolute"
              style={{
                left: `${b.left}%`,
                bottom: 0,
                color: b.tone === 'shadow' ? 'var(--ground-shadow)' : 'var(--foliage)',
                transform: `translateX(-50%) scale(${b.scale})`,
                transformOrigin: 'bottom center',
              }}
            >
              <div
                className={anim ? 'blade-inner is-anim' : 'blade-inner'}
                style={anim ? {
                  ['--blade-dur' as string]: `${1.4 + ((i * 13) % 11) * 0.12}s`,
                  ['--blade-delay' as string]: `${((i * 7) % 23) * 0.06}s`,
                } : undefined}
              >
                {i % 2 === 0 && (
                  <div className="blade-shadow" aria-hidden="true">
                    <BladeShadow size={20} />
                  </div>
                )}
                <GrassBlade variant={b.variant} size={20} />
              </div>
            </div>
          );
        })}
        {FLOWER_FIELD.map((f, i) => {
          const anim = i % 2 === 0;
          return (
            <div
              key={`f-${i}`}
              data-flower={i}
              className="blade absolute"
              style={{
                left: `${f.xVw}%`,
                bottom: 0,
                color: 'var(--foliage)',
                transform: `translateX(-50%) scale(${f.scale})`,
                transformOrigin: 'bottom center',
              }}
            >
              <div
                className={anim ? 'blade-inner is-anim' : 'blade-inner'}
                style={anim ? {
                  ['--blade-dur' as string]: `${1.6 + ((i * 11) % 9) * 0.15}s`,
                  ['--blade-delay' as string]: `${((i * 5) % 19) * 0.08}s`,
                } : undefined}
              >
                <div className="blade-shadow" aria-hidden="true">
                  <BladeShadow size={30} />
                </div>
                <Flower variant={f.variant} size={24} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface TreePlacement {
  v: TreeVariant;
  leftPct: number;
  size: number;
  layer: 'far' | 'midfar' | 'mid' | 'near' | 'floor';
}

type TreePlacementInput = readonly [TreeVariant, number, number, TreePlacement['layer']];

function build(specs: ReadonlyArray<TreePlacementInput>): TreePlacement[] {
  return specs.map(([v, leftPct, size, layer]) => ({ v, leftPct, size, layer }));
}

// Variant pool with weight via repetition (pine dominant, oak frequent, birch + bush sparse)
const VARIANT_POOL: TreeVariant[] = [
  'pine', 'pine', 'spruce', 'bush', 'maple', 'oak', 'spruce', 'birch', 'bushBerryRed', 'oak',
  'maple', 'oak', 'birch', 'spruce', 'bush', 'oak', 'willow', 'birch', 'bushBerryPurple', 'maple',
  'spruce', 'oak', 'pine', 'birch', 'willow', 'oak', 'bushBerryYellow', 'spruce', 'bush', 'maple',
];

function pickVariant(i: number, salt: number): TreeVariant {
  const idx = (i * 17 + salt * 31 + (i * i * 7)) % VARIANT_POOL.length;
  return VARIANT_POOL[idx];
}

function pickSize(i: number, salt: number, min: number, max: number): number {
  const range = max - min;
  const h = (i * 23 + salt * 41 + (i * 13)) % range;
  return min + h;
}

const MIDFAR_SPECS: ReadonlyArray<TreePlacementInput> = (() => {
  const arr: TreePlacementInput[] = [];
  const count = 70;
  for (let i = 0; i < count; i++) {
    const left = 0.4 + i * (99.2 / (count - 1));
    arr.push([pickVariant(i, 7), left, pickSize(i, 7, 34, 60), 'midfar']);
  }
  return arr;
})();

const FAR_SPECS: ReadonlyArray<TreePlacementInput> = (() => {
  const arr: TreePlacementInput[] = [];
  const count = 55;
  for (let i = 0; i < count; i++) {
    const left = 0.3 + i * (99.4 / (count - 1));
    arr.push([pickVariant(i, 3), left, pickSize(i, 3, 24, 52), 'far']);
  }
  return arr;
})();

const MID_SPECS: ReadonlyArray<TreePlacementInput> = (() => {
  const arr: TreePlacementInput[] = [];
  const count = 60;
  for (let i = 0; i < count; i++) {
    const left = 0.3 + i * (99.4 / (count - 1));
    arr.push([pickVariant(i, 11), left, pickSize(i, 11, 42, 74), 'mid']);
  }
  return arr;
})();

const NEAR_SPECS: ReadonlyArray<TreePlacementInput> = (() => {
  const arr: TreePlacementInput[] = [];
  const count = 42;
  for (let i = 0; i < count; i++) {
    const left = 0.5 + i * (99 / (count - 1));
    arr.push([pickVariant(i, 19), left, pickSize(i, 19, 68, 118), 'near']);
  }
  return arr;
})();

const FLOOR_BUSHES: ReadonlyArray<TreePlacement> = [
  // Undergrowth — mix of plain bush + berry variants for variety
  { v: 'bush', leftPct: 3, size: 28, layer: 'floor' },
  { v: 'bushBerryRed', leftPct: 7, size: 26, layer: 'floor' },
  { v: 'bush', leftPct: 14, size: 24, layer: 'floor' },
  { v: 'bushBerryPurple', leftPct: 19, size: 30, layer: 'floor' },
  { v: 'bush', leftPct: 23, size: 26, layer: 'floor' },
  { v: 'bushBerryYellow', leftPct: 28, size: 28, layer: 'floor' },
  { v: 'bush', leftPct: 33, size: 28, layer: 'floor' },
  { v: 'bushBerryRed', leftPct: 37, size: 24, layer: 'floor' },
  { v: 'bush', leftPct: 41, size: 26, layer: 'floor' },
  { v: 'bushBerryPurple', leftPct: 45, size: 28, layer: 'floor' },
  { v: 'bush', leftPct: 47, size: 30, layer: 'floor' },
  { v: 'bush', leftPct: 51, size: 24, layer: 'floor' },
  { v: 'bushBerryRed', leftPct: 56, size: 30, layer: 'floor' },
  { v: 'bush', leftPct: 60, size: 28, layer: 'floor' },
  { v: 'bushBerryYellow', leftPct: 63, size: 26, layer: 'floor' },
  { v: 'bush', leftPct: 65, size: 26, layer: 'floor' },
  { v: 'bushBerryPurple', leftPct: 70, size: 28, layer: 'floor' },
  { v: 'bush', leftPct: 75, size: 30, layer: 'floor' },
  { v: 'bushBerryRed', leftPct: 78, size: 26, layer: 'floor' },
  { v: 'bush', leftPct: 80, size: 24, layer: 'floor' },
  { v: 'bushBerryYellow', leftPct: 85, size: 28, layer: 'floor' },
  { v: 'bush', leftPct: 91, size: 28, layer: 'floor' },
  { v: 'bushBerryPurple', leftPct: 94, size: 26, layer: 'floor' },
  { v: 'bush', leftPct: 96, size: 26, layer: 'floor' },
];

const UNDERGROWTH_BUSHES: ReadonlyArray<TreePlacement> = [
  // Scattered bushes across near + floor layers — not a single row
  { v: 'bush', leftPct: 4, size: 56, layer: 'near' },
  { v: 'bushBerryRed', leftPct: 8, size: 48, layer: 'near' },
  { v: 'bush', leftPct: 12, size: 60, layer: 'near' },
  { v: 'bushBerryYellow', leftPct: 17, size: 52, layer: 'near' },
  { v: 'bush', leftPct: 22, size: 58, layer: 'near' },
  { v: 'bushBerryPurple', leftPct: 27, size: 50, layer: 'near' },
  { v: 'bush', leftPct: 33, size: 62, layer: 'near' },
  { v: 'bushBerryRed', leftPct: 38, size: 48, layer: 'near' },
  { v: 'bush', leftPct: 44, size: 56, layer: 'near' },
  { v: 'bushBerryYellow', leftPct: 49, size: 54, layer: 'near' },
  { v: 'bush', leftPct: 54, size: 60, layer: 'near' },
  { v: 'bushBerryPurple', leftPct: 59, size: 50, layer: 'near' },
  { v: 'bush', leftPct: 64, size: 58, layer: 'near' },
  { v: 'bushBerryRed', leftPct: 69, size: 52, layer: 'near' },
  { v: 'bush', leftPct: 74, size: 60, layer: 'near' },
  { v: 'bushBerryYellow', leftPct: 79, size: 48, layer: 'near' },
  { v: 'bush', leftPct: 84, size: 56, layer: 'near' },
  { v: 'bushBerryPurple', leftPct: 89, size: 52, layer: 'near' },
  { v: 'bush', leftPct: 94, size: 60, layer: 'near' },
  { v: 'bushBerryRed', leftPct: 98, size: 48, layer: 'near' },
];

const TREE_PLACEMENTS: ReadonlyArray<TreePlacement> = [
  ...build(MIDFAR_SPECS),
  ...build(MID_SPECS),
  ...build(NEAR_SPECS),
  ...UNDERGROWTH_BUSHES,
];

const LAYER_STYLE: Record<TreePlacement['layer'], React.CSSProperties> = {
  far: { opacity: 0.6, bottom: '50%' },
  midfar: { opacity: 0.75, bottom: '35%' },
  mid: { opacity: 0.88, bottom: '20%' },
  near: { opacity: 1, bottom: '0%' },
  floor: { opacity: 0.95, bottom: '-14px' },
};

const TREE_SWAY_STYLES = `
  .tree-wrap {
    transform: translateX(-50%);
    contain: layout paint;
  }
  .tree-sway {
    transform-origin: bottom center;
    animation: tree-sway var(--sway-dur, 4s) ease-in-out infinite alternate;
    animation-delay: var(--sway-delay, 0s);
  }
  @keyframes tree-sway {
    from { transform: translateX(-50%) rotate(-1.2deg); }
    to   { transform: translateX(-50%) rotate(1.2deg); }
  }
  @media (prefers-reduced-motion: reduce) {
    .tree-sway { animation: none; }
  }
`;


function CityLayer() {
  return (
    <div
      aria-hidden="true"
      className="absolute pointer-events-none"
      style={{
        top: '-308px',
        left: 0,
        right: 0,
        height: '200px',
        zIndex: 2,
        overflow: 'hidden',
      }}
    >
      <style>{TREE_SWAY_STYLES}</style>
      {TREE_PLACEMENTS.map((t, i) => {
        const layerStyle = LAYER_STYLE[t.layer];
        const shouldSway = t.layer === 'near';
        const swayDur =
          t.layer === 'mid' ? 4 + ((i * 7) % 5) * 0.3 :
          3.5 + ((i * 17) % 5) * 0.25;
        const swayDelay = ((i * 23) % 37) * 0.12;
        return (
          <div
            key={`${t.layer}-${i}`}
            className={`tree-wrap pixel absolute${shouldSway ? ' tree-sway' : ''}`}
            style={{
              left: `${t.leftPct}%`,
              bottom: layerStyle.bottom,
              filter: layerStyle.filter,
              opacity: layerStyle.opacity,
              ...(shouldSway
                ? {
                    ['--sway-dur' as string]: `${swayDur}s`,
                    ['--sway-delay' as string]: `${swayDelay}s`,
                  }
                : {}),
            }}
          >
            <Tree variant={t.v} size={t.size} />
          </div>
        );
      })}
    </div>
  );
}

