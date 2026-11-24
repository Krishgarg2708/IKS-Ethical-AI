import React from 'react';

// Subtle "Gram to Graph" background: drifting village-field contour waves at the bottom,
// a slowly breathing data-graph of nodes and links, and a few floating diyas (lamp dots).
// Uses only the heritage palette, with low opacity, no glow and no neon.
// Respects prefers-reduced-motion (see index.css).

const NODES = [
  [8, 18], [22, 10], [35, 24], [50, 14], [64, 22], [78, 12], [92, 20],
  [15, 42], [30, 52], [46, 40], [60, 50], [74, 42], [88, 54],
  [10, 70], [26, 78], [42, 66], [58, 76], [72, 68], [90, 80],
];
const LINKS: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6],
  [0, 7], [2, 8], [3, 9], [4, 10], [5, 11], [6, 12],
  [7, 8], [8, 9], [9, 10], [10, 11], [11, 12],
  [7, 13], [8, 14], [9, 15], [10, 16], [11, 17], [12, 18],
  [13, 14], [14, 15], [15, 16], [16, 17], [17, 18],
];

export const BackgroundAnimation: React.FC = () => (
  <div className="bg-anim fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
    {/* Data graph */}
    <svg className="absolute inset-0 w-full h-full bg-graph" viewBox="0 0 100 100" preserveAspectRatio="none">
      {LINKS.map(([a, b], i) => (
        <line
          key={i}
          x1={NODES[a][0]} y1={NODES[a][1]} x2={NODES[b][0]} y2={NODES[b][1]}
          stroke="#B49A61" strokeWidth="1" strokeOpacity="0.3"
          className="bg-link" style={{ animationDelay: `${(i % 7) * 1.3}s` }}
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
    {NODES.map(([x, y], i) => (
      <span
        key={i}
        className="bg-node absolute rounded-full"
        style={{
          left: `${x}%`, top: `${y}%`,
          width: i % 4 === 0 ? 7 : 5, height: i % 4 === 0 ? 7 : 5,
          background: i % 5 === 0 ? '#A6533C' : '#B49A61',
          animationDelay: `${(i % 6) * 0.9}s`,
        }}
      />
    ))}

    {/* Data packets travelling along a few links, village to graph */}
    {[[13, 14, 0], [8, 9, 3], [2, 3, 6], [16, 17, 9], [10, 11, 12]].map(([a, b, d], i) => (
      <span
        key={`p${i}`}
        className="bg-packet absolute rounded-full"
        style={{
          ['--x1' as string]: `${NODES[a][0]}vw`, ['--y1' as string]: `${NODES[a][1]}vh`,
          ['--x2' as string]: `${NODES[b][0]}vw`, ['--y2' as string]: `${NODES[b][1]}vh`,
          animationDelay: `${d}s`,
        }}
      />
    ))}

    {/* Field / terrain contour waves */}
    <svg className="absolute bottom-0 left-0 w-[200%] h-48 bg-waves" viewBox="0 0 1200 120" preserveAspectRatio="none">
      <path d="M0 80 Q150 50 300 80 T600 80 T900 80 T1200 80" fill="none" stroke="#243B32" strokeOpacity="0.10" strokeWidth="1.5" />
      <path d="M0 95 Q150 70 300 95 T600 95 T900 95 T1200 95" fill="none" stroke="#B49A61" strokeOpacity="0.18" strokeWidth="1.2" />
      <path d="M0 108 Q150 90 300 108 T600 108 T900 108 T1200 108" fill="none" stroke="#A6533C" strokeOpacity="0.10" strokeWidth="1" />
    </svg>

    {/* Floating diyas */}
    {[12, 33, 57, 81].map((x, i) => (
      <span key={`d${i}`} className="bg-diya absolute" style={{ left: `${x}%`, animationDelay: `${i * 4.5}s` }} />
    ))}

    {/* Slow mandala rings (kept from original design) */}
    <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full border border-[#DDD3C2]/40 opacity-40 lattice-pattern bg-spin" />
    <div className="absolute top-1/2 -left-48 w-[500px] h-[500px] rounded-full border border-[#B49A61]/20 opacity-30 manuscript-pattern bg-spin-rev" />
  </div>
);
