type Rect = readonly [x: number, y: number, w: number, h: number];

interface Layer {
  fill: string;
  rects: ReadonlyArray<Rect>;
  part?: 'trunk';
}

interface TreeShape {
  vb: readonly [number, number];
  layers: ReadonlyArray<Layer>;
}

const SHAPES = {
  pine: {
    vb: [24, 36],
    layers: [
      // Foliage body — cascading tiers
      { fill: '#2c5d2e', rects: [
        [11, 0, 2, 3],
        [10, 3, 4, 1],
        [9, 4, 6, 3],
        [8, 7, 8, 1],
        [7, 8, 10, 4],
        [6, 12, 12, 1],
        [5, 13, 14, 5],
        [4, 18, 16, 1],
        [3, 19, 18, 6],
        [2, 25, 20, 1],
        [0, 26, 24, 3],
      ]},
      // Highlight — left edge of each tier
      { fill: '#4a8a3a', rects: [
        [11, 0, 1, 3],
        [10, 3, 1, 1],
        [9, 4, 1, 3],
        [8, 7, 1, 1],
        [7, 8, 1, 4],
        [6, 12, 1, 1],
        [5, 13, 1, 5],
        [4, 18, 1, 1],
        [3, 19, 1, 6],
        [2, 25, 1, 1],
        [0, 26, 1, 3],
        // Inner highlight spots
        [12, 5, 1, 1],
        [10, 10, 1, 1],
        [8, 15, 1, 1],
        [6, 21, 1, 1],
        [4, 27, 2, 1],
      ]},
      // Shadow — right edge of each tier + a few inner cells
      { fill: '#1a4220', rects: [
        [12, 0, 1, 3],
        [13, 3, 1, 1],
        [14, 4, 1, 3],
        [15, 7, 1, 1],
        [16, 8, 1, 4],
        [17, 12, 1, 1],
        [18, 13, 1, 5],
        [19, 18, 1, 1],
        [20, 19, 1, 6],
        [21, 25, 1, 1],
        [23, 26, 1, 3],
        // Inner shadow detail
        [13, 6, 1, 1],
        [15, 11, 1, 1],
        [17, 16, 1, 1],
        [19, 22, 1, 1],
        [21, 28, 2, 1],
      ]},
      // Trunk main
      { fill: '#5a3a20', part: 'trunk', rects: [
        [11, 29, 2, 7],
      ]},
      // Trunk highlight (left) + subtle bark accents
      { fill: '#704a28', part: 'trunk', rects: [
        [11, 29, 1, 7],
        // Knot highlight
        [11, 32, 1, 1],
        // Small bark accent
        [12, 30, 1, 1],
      ]},
      // Mid-tone bark line
      { fill: '#4a3018', part: 'trunk', rects: [
        [11, 31, 2, 1],
      ]},
      // Trunk shadow (right) + bark detail
      { fill: '#3d2515', part: 'trunk', rects: [
        [12, 29, 1, 7],
        // Knot pixel
        [11, 33, 1, 1],
        // Bark cracks
        [12, 34, 1, 1],
      ]},
    ],
  },
  oak: {
    vb: [28, 30],
    layers: [
      // Canopy body — rounded mass
      { fill: '#3a7034', rects: [
        [10, 0, 8, 1],
        [8, 1, 12, 1],
        [6, 2, 16, 1],
        [5, 3, 18, 1],
        [4, 4, 20, 1],
        [3, 5, 22, 1],
        [3, 6, 22, 1],
        [2, 7, 24, 1],
        [2, 8, 24, 1],
        [3, 9, 22, 1],
        [3, 10, 22, 1],
        [4, 11, 20, 1],
        [5, 12, 18, 1],
        [6, 13, 16, 1],
        [8, 14, 12, 1],
        [10, 15, 8, 1],
      ]},
      // Highlight — upper-left cluster
      { fill: '#5da050', rects: [
        [10, 0, 2, 1],
        [8, 1, 3, 1],
        [6, 2, 3, 1],
        [5, 3, 2, 1],
        [4, 4, 2, 1],
        [3, 5, 2, 1],
        [2, 7, 2, 1],
        [3, 6, 1, 1],
        // Inner texture dots
        [10, 4, 1, 1],
        [8, 6, 1, 1],
        [12, 7, 1, 1],
        [6, 9, 1, 1],
        [9, 10, 1, 1],
      ]},
      // Shadow — lower-right cluster
      { fill: '#1f4a20', rects: [
        [16, 0, 2, 1],
        [17, 1, 3, 1],
        [19, 2, 3, 1],
        [21, 3, 2, 1],
        [22, 4, 2, 1],
        [23, 5, 2, 1],
        [24, 6, 2, 1],
        [24, 7, 2, 1],
        [24, 8, 2, 1],
        [23, 9, 2, 1],
        [22, 10, 2, 1],
        [22, 11, 2, 1],
        [20, 12, 2, 1],
        [19, 13, 2, 1],
        [17, 14, 2, 1],
        [15, 15, 2, 1],
        // Inner shadow dots
        [18, 5, 1, 1],
        [16, 8, 1, 1],
        [20, 9, 1, 1],
        [14, 11, 1, 1],
      ]},
      // Trunk main
      { fill: '#5a3a20', part: 'trunk', rects: [
        [12, 16, 4, 14],
      ]},
      // Trunk highlight (left)
      { fill: '#704a28', part: 'trunk', rects: [
        [12, 16, 1, 14],
        // Knot highlight
        [13, 20, 1, 1],
        // Bark spot
        [14, 25, 1, 1],
      ]},
      // Trunk shadow (right)
      { fill: '#3d2515', part: 'trunk', rects: [
        [15, 16, 1, 14],
        // Knot dark
        [13, 19, 1, 1],
        [14, 19, 1, 1],
        // Vertical bark line
        [14, 22, 1, 1],
        [14, 26, 1, 1],
        // Crack detail
        [13, 24, 1, 2],
      ]},
      // Roots/base
      { fill: '#3d2515', part: 'trunk', rects: [
        [11, 28, 1, 1],
        [16, 28, 1, 1],
        [10, 29, 1, 1],
        [17, 29, 1, 1],
      ]},
    ],
  },
  spruce: {
    vb: [14, 34],
    layers: [
      // Slim tall conifer — darker than pine
      { fill: '#1a4220', rects: [
        [6, 0, 2, 2],
        [5, 2, 4, 1],
        [5, 3, 4, 1],
        [4, 4, 6, 2],
        [3, 6, 8, 1],
        [3, 7, 8, 2],
        [2, 9, 10, 1],
        [2, 10, 10, 2],
        [1, 12, 12, 1],
        [1, 13, 12, 3],
        [0, 16, 14, 1],
        [0, 17, 14, 4],
        [1, 21, 12, 2],
        [2, 23, 10, 2],
      ]},
      // Highlight left
      { fill: '#3a6f30', rects: [
        [6, 0, 1, 2],
        [5, 2, 1, 2],
        [4, 4, 1, 2],
        [3, 6, 1, 3],
        [2, 9, 1, 3],
        [1, 12, 1, 4],
        [0, 16, 1, 5],
        [1, 21, 1, 2],
        [2, 23, 1, 2],
      ]},
      // Shadow right
      { fill: '#0d3015', rects: [
        [7, 0, 1, 2],
        [8, 2, 1, 2],
        [9, 4, 1, 2],
        [10, 6, 1, 3],
        [11, 9, 1, 3],
        [12, 12, 1, 4],
        [13, 16, 1, 5],
        [12, 21, 1, 2],
        [11, 23, 1, 2],
      ]},
      // Trunk
      { fill: '#4a3018', part: 'trunk', rects: [[6, 25, 2, 9]] },
      { fill: '#5e3d20', part: 'trunk', rects: [[6, 25, 1, 9], [7, 28, 1, 1]] },
      { fill: '#3a2515', part: 'trunk', rects: [[7, 25, 1, 9], [6, 31, 1, 1]] },
      { fill: '#2a1a0e', part: 'trunk', rects: [[6, 27, 2, 1]] },
    ],
  },
  maple: {
    vb: [30, 32],
    layers: [
      // Wide rounded canopy, warm green
      { fill: '#5d8a30', rects: [
        [11, 0, 8, 1],
        [9, 1, 12, 1],
        [7, 2, 16, 1],
        [5, 3, 20, 1],
        [4, 4, 22, 1],
        [3, 5, 24, 1],
        [3, 6, 24, 1],
        [2, 7, 26, 1],
        [2, 8, 26, 1],
        [2, 9, 26, 1],
        [3, 10, 24, 1],
        [3, 11, 24, 1],
        [4, 12, 22, 1],
        [5, 13, 20, 1],
        [7, 14, 16, 1],
        [9, 15, 12, 1],
        [11, 16, 8, 1],
      ]},
      // Bright sun-touched highlights
      { fill: '#8db84a', rects: [
        [11, 0, 2, 1],
        [9, 1, 3, 1],
        [7, 2, 3, 1],
        [5, 3, 2, 1],
        [4, 4, 2, 1],
        [3, 5, 2, 1],
        [2, 7, 2, 1],
        [3, 6, 1, 1],
        [11, 4, 1, 1],
        [9, 6, 1, 1],
        [13, 7, 1, 1],
        [7, 9, 1, 1],
        [10, 10, 1, 1],
      ]},
      // Shadow
      { fill: '#3a5d20', rects: [
        [17, 0, 2, 1],
        [18, 1, 3, 1],
        [20, 2, 3, 1],
        [23, 3, 2, 1],
        [24, 4, 2, 1],
        [25, 5, 2, 1],
        [26, 6, 1, 1],
        [26, 7, 2, 1],
        [26, 8, 2, 1],
        [25, 9, 2, 1],
        [24, 10, 2, 1],
        [22, 11, 2, 1],
        [21, 12, 2, 1],
        [19, 13, 2, 1],
        [16, 14, 2, 1],
        [13, 15, 2, 1],
        // Inner shadow
        [19, 5, 1, 1],
        [17, 8, 1, 1],
        [21, 9, 1, 1],
        [15, 11, 1, 1],
      ]},
      // Trunk
      { fill: '#5a3a20', part: 'trunk', rects: [[13, 17, 4, 11]] },
      { fill: '#704a28', part: 'trunk', rects: [[13, 17, 1, 11], [14, 22, 1, 1]] },
      { fill: '#4a3018', part: 'trunk', rects: [[13, 20, 4, 1]] },
      { fill: '#3d2515', part: 'trunk', rects: [[16, 17, 1, 11], [15, 24, 1, 1]] },
      // Roots
      { fill: '#3d2515', part: 'trunk', rects: [
        [12, 27, 1, 1], [17, 27, 1, 1], [11, 28, 1, 1], [18, 28, 1, 1],
      ]},
    ],
  },
  willow: {
    vb: [22, 34],
    layers: [
      // Drooping rounded canopy
      { fill: '#7da848', rects: [
        [8, 0, 6, 1],
        [6, 1, 10, 1],
        [4, 2, 14, 1],
        [3, 3, 16, 1],
        [2, 4, 18, 1],
        [1, 5, 20, 1],
        [1, 6, 20, 1],
        [1, 7, 20, 1],
        [0, 8, 22, 1],
        [0, 9, 22, 1],
        [1, 10, 20, 1],
        [1, 11, 20, 1],
        [2, 12, 18, 1],
        // Drooping tendrils (left)
        [3, 13, 1, 2],
        [2, 13, 1, 4],
        [4, 13, 1, 3],
        [5, 13, 1, 4],
        // Drooping tendrils (right)
        [17, 13, 1, 3],
        [18, 13, 1, 4],
        [16, 13, 1, 2],
        [19, 13, 1, 4],
        // Middle hangs
        [7, 13, 1, 2],
        [9, 13, 1, 3],
        [12, 13, 1, 2],
        [14, 13, 1, 3],
      ]},
      // Highlight bright yellow-green
      { fill: '#a5c860', rects: [
        [8, 0, 2, 1],
        [6, 1, 2, 1],
        [4, 2, 2, 1],
        [3, 3, 2, 1],
        [2, 4, 2, 1],
        [1, 5, 2, 1],
        [0, 8, 2, 1],
        [1, 6, 1, 1],
        // Inner sparkles
        [8, 3, 1, 1],
        [11, 5, 1, 1],
        [6, 7, 1, 1],
        [13, 8, 1, 1],
        [4, 10, 1, 1],
      ]},
      // Shadow darker
      { fill: '#4a7028', rects: [
        [13, 0, 1, 1],
        [14, 1, 2, 1],
        [16, 2, 2, 1],
        [18, 3, 1, 1],
        [19, 4, 1, 1],
        [20, 5, 1, 1],
        [21, 6, 1, 1],
        [21, 7, 1, 1],
        [20, 8, 2, 1],
        [20, 10, 1, 1],
        [19, 11, 1, 1],
        [17, 12, 2, 1],
        // Inner dark
        [15, 5, 1, 1],
        [17, 9, 1, 1],
      ]},
      // Slender trunk
      { fill: '#5a3a20', part: 'trunk', rects: [[10, 17, 2, 14]] },
      { fill: '#704a28', part: 'trunk', rects: [[10, 17, 1, 14], [11, 21, 1, 1]] },
      { fill: '#4a3018', part: 'trunk', rects: [[10, 22, 2, 1]] },
      { fill: '#3d2515', part: 'trunk', rects: [[11, 17, 1, 14], [10, 26, 1, 1]] },
    ],
  },
  birch: {
    vb: [16, 30],
    layers: [
      // Canopy body
      { fill: '#5a9a45', rects: [
        [6, 0, 4, 1],
        [4, 1, 8, 1],
        [3, 2, 10, 1],
        [2, 3, 12, 1],
        [2, 4, 12, 1],
        [2, 5, 12, 1],
        [2, 6, 12, 1],
        [3, 7, 10, 1],
        [4, 8, 8, 1],
        [5, 9, 6, 1],
      ]},
      // Highlight (left side of canopy)
      { fill: '#7ec55f', rects: [
        [6, 0, 1, 1],
        [4, 1, 2, 1],
        [3, 2, 2, 1],
        [2, 3, 2, 1],
        [2, 4, 1, 1],
        [3, 7, 1, 1],
        // Inner sparkle
        [7, 2, 1, 1],
        [5, 4, 1, 1],
        [9, 5, 1, 1],
      ]},
      // Shadow (right side)
      { fill: '#3a7030', rects: [
        [9, 0, 1, 1],
        [10, 1, 2, 1],
        [11, 2, 2, 1],
        [12, 3, 2, 1],
        [13, 4, 1, 1],
        [13, 5, 1, 1],
        [13, 6, 1, 1],
        [11, 7, 2, 1],
        [10, 8, 2, 1],
        // Inner shadow
        [10, 4, 1, 1],
        [11, 6, 1, 1],
      ]},
      // Birch trunk — white with cream
      { fill: '#e0d8c0', part: 'trunk', rects: [
        [7, 10, 2, 20],
      ]},
      // Trunk highlight
      { fill: '#f5efdc', part: 'trunk', rects: [
        [7, 10, 1, 20],
      ]},
      // Trunk shadow
      { fill: '#a8a088', part: 'trunk', rects: [
        [8, 10, 1, 20],
      ]},
      // Characteristic black bark marks + extra detail
      { fill: '#2a2218', part: 'trunk', rects: [
        [7, 12, 1, 1],
        [8, 14, 1, 1],
        [7, 17, 1, 1],
        [8, 20, 1, 1],
        [7, 23, 1, 1],
        [8, 26, 1, 1],
        [7, 11, 2, 1],
        [7, 19, 2, 1],
        // Extra small marks
        [8, 13, 1, 1],
        [7, 16, 1, 1],
        [8, 22, 1, 1],
        [7, 25, 1, 1],
        [7, 28, 2, 1],
      ]},
    ],
  },
  bush: {
    vb: [16, 14],
    layers: [
      // Foliage body
      { fill: '#3a7530', rects: [
        [6, 0, 4, 1],
        [4, 1, 8, 1],
        [3, 2, 10, 1],
        [2, 3, 12, 1],
        [2, 4, 12, 1],
        [2, 5, 12, 1],
        [3, 6, 10, 1],
        [3, 7, 10, 1],
        [4, 8, 8, 1],
        [5, 9, 6, 1],
      ]},
      // Highlight (left)
      { fill: '#5da045', rects: [
        [6, 0, 1, 1],
        [4, 1, 2, 1],
        [3, 2, 2, 1],
        [2, 3, 2, 1],
        [2, 4, 1, 1],
        [3, 6, 1, 1],
        [4, 8, 1, 1],
        // Inner texture
        [7, 2, 1, 1],
        [5, 4, 1, 1],
        [8, 5, 1, 1],
        [6, 6, 1, 1],
      ]},
      // Shadow (right)
      { fill: '#1f4520', rects: [
        [9, 0, 1, 1],
        [10, 1, 2, 1],
        [11, 2, 2, 1],
        [12, 3, 2, 1],
        [13, 4, 1, 1],
        [13, 5, 1, 1],
        [12, 6, 1, 1],
        [12, 7, 1, 1],
        [11, 8, 1, 1],
        [10, 9, 1, 1],
        // Inner shadow
        [11, 4, 1, 1],
        [10, 6, 1, 1],
      ]},
      // Trunk main
      { fill: '#5a3a20', part: 'trunk', rects: [
        [7, 10, 2, 4],
      ]},
      // Trunk highlight + small accents
      { fill: '#704a28', part: 'trunk', rects: [
        [7, 10, 1, 4],
        [8, 12, 1, 1],
      ]},
      // Mid bark line
      { fill: '#4a3018', part: 'trunk', rects: [
        [7, 11, 2, 1],
      ]},
      // Trunk shadow + base detail
      { fill: '#3d2515', part: 'trunk', rects: [
        [8, 10, 1, 4],
        [7, 13, 1, 1],
      ]},
    ],
  },
  bushBerryRed: {
    vb: [16, 14],
    layers: [
      // Foliage body
      { fill: '#3a7530', rects: [
        [6, 0, 4, 1], [4, 1, 8, 1], [3, 2, 10, 1], [2, 3, 12, 1],
        [2, 4, 12, 1], [2, 5, 12, 1], [3, 6, 10, 1], [3, 7, 10, 1],
        [4, 8, 8, 1], [5, 9, 6, 1],
      ]},
      { fill: '#5da045', rects: [
        [6, 0, 1, 1], [4, 1, 2, 1], [3, 2, 2, 1], [2, 3, 2, 1],
        [2, 4, 1, 1], [3, 6, 1, 1], [4, 8, 1, 1],
        [7, 2, 1, 1], [5, 4, 1, 1], [8, 5, 1, 1], [6, 6, 1, 1],
      ]},
      { fill: '#1f4520', rects: [
        [9, 0, 1, 1], [10, 1, 2, 1], [11, 2, 2, 1], [12, 3, 2, 1],
        [13, 4, 1, 1], [13, 5, 1, 1], [12, 6, 1, 1], [12, 7, 1, 1],
        [11, 8, 1, 1], [10, 9, 1, 1],
        [11, 4, 1, 1], [10, 6, 1, 1],
      ]},
      // Red berries scattered
      { fill: '#c43030', rects: [
        [5, 2, 1, 1], [9, 3, 1, 1], [4, 5, 1, 1], [11, 5, 1, 1],
        [7, 7, 1, 1], [10, 8, 1, 1],
      ]},
      // Berry highlight (lighter red)
      { fill: '#f06060', rects: [
        [5, 2, 1, 1],
        [11, 5, 1, 1],
        [7, 7, 1, 1],
      ]},
      // Trunk
      { fill: '#5a3a20', part: 'trunk', rects: [[7, 10, 2, 4]] },
      { fill: '#704a28', part: 'trunk', rects: [[7, 10, 1, 4], [8, 12, 1, 1]] },
      { fill: '#4a3018', part: 'trunk', rects: [[7, 11, 2, 1]] },
      { fill: '#3d2515', part: 'trunk', rects: [[8, 10, 1, 4], [7, 13, 1, 1]] },
    ],
  },
  bushBerryPurple: {
    vb: [16, 14],
    layers: [
      { fill: '#3a7530', rects: [
        [6, 0, 4, 1], [4, 1, 8, 1], [3, 2, 10, 1], [2, 3, 12, 1],
        [2, 4, 12, 1], [2, 5, 12, 1], [3, 6, 10, 1], [3, 7, 10, 1],
        [4, 8, 8, 1], [5, 9, 6, 1],
      ]},
      { fill: '#5da045', rects: [
        [6, 0, 1, 1], [4, 1, 2, 1], [3, 2, 2, 1], [2, 3, 2, 1],
        [2, 4, 1, 1], [3, 6, 1, 1], [4, 8, 1, 1],
        [7, 2, 1, 1], [5, 4, 1, 1], [8, 5, 1, 1], [6, 6, 1, 1],
      ]},
      { fill: '#1f4520', rects: [
        [9, 0, 1, 1], [10, 1, 2, 1], [11, 2, 2, 1], [12, 3, 2, 1],
        [13, 4, 1, 1], [13, 5, 1, 1], [12, 6, 1, 1], [12, 7, 1, 1],
        [11, 8, 1, 1], [10, 9, 1, 1],
        [11, 4, 1, 1], [10, 6, 1, 1],
      ]},
      // Purple berries
      { fill: '#6a2080', rects: [
        [7, 2, 1, 1], [4, 4, 1, 1], [10, 4, 1, 1], [6, 6, 1, 1],
        [9, 7, 1, 1], [5, 8, 1, 1],
      ]},
      // Berry highlight
      { fill: '#a050c0', rects: [
        [7, 2, 1, 1],
        [10, 4, 1, 1],
        [9, 7, 1, 1],
      ]},
      // Trunk
      { fill: '#5a3a20', part: 'trunk', rects: [[7, 10, 2, 4]] },
      { fill: '#704a28', part: 'trunk', rects: [[7, 10, 1, 4], [8, 12, 1, 1]] },
      { fill: '#4a3018', part: 'trunk', rects: [[7, 11, 2, 1]] },
      { fill: '#3d2515', part: 'trunk', rects: [[8, 10, 1, 4], [7, 13, 1, 1]] },
    ],
  },
  bushBerryYellow: {
    vb: [16, 14],
    layers: [
      { fill: '#3a7530', rects: [
        [6, 0, 4, 1], [4, 1, 8, 1], [3, 2, 10, 1], [2, 3, 12, 1],
        [2, 4, 12, 1], [2, 5, 12, 1], [3, 6, 10, 1], [3, 7, 10, 1],
        [4, 8, 8, 1], [5, 9, 6, 1],
      ]},
      { fill: '#5da045', rects: [
        [6, 0, 1, 1], [4, 1, 2, 1], [3, 2, 2, 1], [2, 3, 2, 1],
        [2, 4, 1, 1], [3, 6, 1, 1], [4, 8, 1, 1],
        [7, 2, 1, 1], [5, 4, 1, 1], [8, 5, 1, 1], [6, 6, 1, 1],
      ]},
      { fill: '#1f4520', rects: [
        [9, 0, 1, 1], [10, 1, 2, 1], [11, 2, 2, 1], [12, 3, 2, 1],
        [13, 4, 1, 1], [13, 5, 1, 1], [12, 6, 1, 1], [12, 7, 1, 1],
        [11, 8, 1, 1], [10, 9, 1, 1],
        [11, 4, 1, 1], [10, 6, 1, 1],
      ]},
      // Yellow-orange berries
      { fill: '#d68a20', rects: [
        [5, 3, 1, 1], [8, 2, 1, 1], [11, 4, 1, 1], [4, 6, 1, 1],
        [9, 6, 1, 1], [7, 8, 1, 1],
      ]},
      // Berry highlight
      { fill: '#f5c460', rects: [
        [5, 3, 1, 1],
        [11, 4, 1, 1],
        [7, 8, 1, 1],
      ]},
      // Trunk
      { fill: '#5a3a20', part: 'trunk', rects: [[7, 10, 2, 4]] },
      { fill: '#704a28', part: 'trunk', rects: [[7, 10, 1, 4], [8, 12, 1, 1]] },
      { fill: '#4a3018', part: 'trunk', rects: [[7, 11, 2, 1]] },
      { fill: '#3d2515', part: 'trunk', rects: [[8, 10, 1, 4], [7, 13, 1, 1]] },
    ],
  },
} as const satisfies Record<string, TreeShape>;

export type TreeVariant = keyof typeof SHAPES;
export const TREE_VARIANTS = Object.keys(SHAPES) as TreeVariant[];

// Pre-build data URL per variant once — single rasterized image cached & shared
// across all <Tree> instances. Drops 50+ <rect> nodes per tree from the DOM.
function buildSvgString(shape: TreeShape): string {
  const [w, h] = shape.vb;
  const body = shape.layers
    .map((l) =>
      l.rects
        .map(
          ([x, y, rw, rh]) =>
            `<rect x="${x}" y="${y}" width="${rw}" height="${rh}" fill="${l.fill}"/>`
        )
        .join('')
    )
    .join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" shape-rendering="crispEdges">${body}</svg>`;
}

const VARIANT_SRC = Object.fromEntries(
  (Object.keys(SHAPES) as TreeVariant[]).map((v) => [
    v,
    `data:image/svg+xml;utf8,${encodeURIComponent(buildSvgString(SHAPES[v]))}`,
  ])
) as Record<TreeVariant, string>;

const VARIANT_VB = Object.fromEntries(
  (Object.keys(SHAPES) as TreeVariant[]).map((v) => [v, SHAPES[v].vb])
) as Record<TreeVariant, readonly [number, number]>;

interface TreeProps {
  variant: TreeVariant;
  size?: number;
  className?: string;
}

export function Tree({ variant, size = 96, className }: TreeProps) {
  const [w, h] = VARIANT_VB[variant];
  return (
    <img
      aria-hidden="true"
      src={VARIANT_SRC[variant]}
      alt=""
      decoding="async"
      className={className}
      style={{
        display: 'block',
        width: (size * w) / h,
        height: size,
        maxWidth: 'none',
        imageRendering: 'pixelated',
      }}
    />
  );
}
