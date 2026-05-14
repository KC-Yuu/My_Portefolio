import { HeroCopy } from './HeroCopy';
import { SkyLayer } from './SkyLayer';
import { GroundLayer } from './GroundLayer';
import { ParallaxLayer } from './ParallaxLayer';
import { Particles } from './Particles';
import { WarmTint } from './WarmTint';
import { Clouds } from './Clouds';
import { Butterflies } from './Butterflies';
import { Bees } from './Bees';
import { Frogs } from './Frogs';
import { SpriteCanvas } from './SpriteCanvas';
import { FpsCounter } from './FpsCounter';
import { OcclusionTracker } from './OcclusionTracker';
import { GrassWind } from './GrassWind';
import { SeasonToggle } from '@/components/season/SeasonToggle';

export function Hero() {
  return (
    <header className="relative w-full overflow-hidden" style={{ height: '100svh' }}>
      <OcclusionTracker />
      {/* GrassWind disabled — needs rework with new blade structure */}
      {/* <GrassWind /> */}
      <SkyLayer />
      <Clouds />
      <ParallaxLayer />
      <GroundLayer />
      {/* <Particles /> */}
      <Butterflies />
      <SpriteCanvas />
      <Bees />
      <Frogs />
      <WarmTint />
      <div
        className="absolute inset-0 z-50 flex items-center px-6 md:px-16 pointer-events-none"
        style={{ paddingBottom: '18vh' }}
      >
        <HeroCopy />
      </div>
      <SeasonToggle />
      <FpsCounter />
    </header>
  );
}
