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
