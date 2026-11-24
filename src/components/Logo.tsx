import React from 'react';

// Gram to Graph logo: a village hut (gram) on the left whose field rows
// become the edges of a rising data graph (graph) on the right, inside a
// mandala ring. Heritage palette only.
interface LogoProps {
  size?: number;
  animated?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 40, animated = false, className = '' }) => {
  const a = animated ? 'logo-anim' : '';
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      className={`${a} ${className}`}
      role="img"
      aria-label="Gram to Graph logo"
    >
      {/* Outer mandala ring */}
      <circle className="lg-ring" cx="60" cy="60" r="56" fill="none" stroke="#B49A61" strokeWidth="2" />
      <circle className="lg-ring2" cx="60" cy="60" r="49" fill="none" stroke="#B49A61" strokeWidth="0.8" strokeDasharray="2 3" opacity="0.7" />

      {/* Petals (8-fold) */}
      <g className="lg-petals" opacity="0.35">
        {Array.from({ length: 8 }).map((_, i) => (
          <ellipse key={i} cx="60" cy="16" rx="3" ry="6" fill="#B49A61" transform={`rotate(${i * 45} 60 60)`} />
        ))}
      </g>

      {/* Inner disc */}
      <circle cx="60" cy="60" r="42" fill="#243B32" className="lg-disc" />

      {/* Hut (gram) */}
      <g className="lg-hut">
        <path d="M30 70 L42 58 L54 70" fill="none" stroke="#E8DDCA" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" className="lg-draw" />
        <path d="M34 69 V80 H50 V69" fill="none" stroke="#E8DDCA" strokeWidth="3" strokeLinejoin="round" className="lg-draw" />
        <rect x="39.5" y="73" width="5" height="7" fill="#A6533C" className="lg-door" />
      </g>

      {/* Field rows turning into graph edges */}
      <g fill="none" strokeLinecap="round">
        <path d="M30 86 Q50 84 62 74" stroke="#B49A61" strokeWidth="2" className="lg-draw lg-d2" />
        <path d="M34 91 Q56 90 74 64" stroke="#B49A61" strokeWidth="2" className="lg-draw lg-d3" />
        <path d="M62 74 L74 64 L86 46" stroke="#E8DDCA" strokeWidth="2.5" className="lg-draw lg-d4" />
      </g>

      {/* Graph nodes */}
      <circle cx="62" cy="74" r="3.5" fill="#E8DDCA" className="lg-node lg-n1" />
      <circle cx="74" cy="64" r="3.5" fill="#E8DDCA" className="lg-node lg-n2" />
      <circle cx="86" cy="46" r="5" fill="#A6533C" stroke="#E8DDCA" strokeWidth="1.5" className="lg-node lg-n3" />

      {/* Diya flame above the top node: knowledge */}
      <path d="M86 32 C83 36 83 39 86 40 C89 39 89 36 86 32 Z" fill="#B49A61" className="lg-flame" />
    </svg>
  );
};
