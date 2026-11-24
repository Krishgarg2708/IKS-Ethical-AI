import React from 'react';

interface MandalaPatternProps {
  className?: string;
  size?: number;
  interactive?: boolean;
}

export const MandalaPattern: React.FC<MandalaPatternProps> = ({
  className = '',
  size = 460,
  interactive = false
}) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 500 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto max-w-full select-none"
        aria-hidden="true"
      >
        {/* Outer Stepwell / Architectural Stepped Border */}
        <rect
          x="15"
          y="15"
          width="470"
          height="470"
          stroke="#DDD3C2"
          strokeWidth="1.5"
          strokeDasharray="6 6"
        />
        <rect
          x="28"
          y="28"
          width="444"
          height="444"
          stroke="#B49A61"
          strokeWidth="1"
          opacity="0.4"
        />

        {/* 4 Corner Traditional Architectural Jali Corner Brackets */}
        <g stroke="#B49A61" strokeWidth="1" opacity="0.6">
          {/* Top-left */}
          <path d="M 35 70 L 70 70 L 70 35 M 45 60 L 60 60 L 60 45" />
          {/* Top-right */}
          <path d="M 465 70 L 430 70 L 430 35 M 455 60 L 440 60 L 440 45" />
          {/* Bottom-left */}
          <path d="M 35 430 L 70 430 L 70 465 M 45 440 L 60 440 L 60 455" />
          {/* Bottom-right */}
          <path d="M 465 430 L 430 430 L 430 465 M 455 440 L 440 440 L 440 455" />
        </g>

        {/* Stepped Temple Arch / Diagonal diamond geometry */}
        <polygon
          points="250,50 450,250 250,450 50,250"
          stroke="#243B32"
          strokeWidth="1.5"
          opacity="0.5"
        />
        <polygon
          points="250,75 425,250 250,425 75,250"
          stroke="#A6533C"
          strokeWidth="1"
          strokeDasharray="4 4"
          opacity="0.4"
        />

        {/* Concentric Circles representing Vedic Epistemological Spheres */}
        <circle cx="250" cy="250" r="180" stroke="#DDD3C2" strokeWidth="1" />
        <circle cx="250" cy="250" r="150" stroke="#B49A61" strokeWidth="1.2" opacity="0.5" />
        <circle cx="250" cy="250" r="115" stroke="#243B32" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
        <circle cx="250" cy="250" r="80" stroke="#B49A61" strokeWidth="1.5" opacity="0.7" />
        <circle cx="250" cy="250" r="45" stroke="#A6533C" strokeWidth="1" opacity="0.8" fill="#F7F3EA" />

        {/* 12-Spoke Wheel of Dharma (Dharmachakra / Knowledge Harmonics) */}
        <g stroke="#243B32" strokeWidth="1" opacity="0.35">
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 30 * Math.PI) / 180;
            const x1 = 250 + 80 * Math.cos(angle);
            const y1 = 250 + 80 * Math.sin(angle);
            const x2 = 250 + 150 * Math.cos(angle);
            const y2 = 250 + 150 * Math.sin(angle);
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
          })}
        </g>

        {/* 8 Lotus Petal Symmetry Curves */}
        <g stroke="#B49A61" strokeWidth="1.2" fill="none" opacity="0.55">
          <path d="M 250 170 C 275 195 275 220 250 250 C 225 220 225 195 250 170 Z" />
          <path d="M 250 330 C 275 305 275 280 250 250 C 225 280 225 305 250 330 Z" />
          <path d="M 170 250 C 195 275 220 275 250 250 C 220 225 195 225 170 250 Z" />
          <path d="M 330 250 C 305 275 280 275 250 250 C 280 225 305 225 330 250 Z" />

          {/* Diagonals */}
          <path d="M 193 193 C 220 205 235 225 250 250 C 225 235 205 220 193 193 Z" />
          <path d="M 307 193 C 280 205 265 225 250 250 C 275 235 295 220 307 193 Z" />
          <path d="M 193 307 C 220 295 235 275 250 250 C 225 265 205 280 193 307 Z" />
          <path d="M 307 307 C 280 295 265 275 250 250 C 275 265 295 280 307 307 Z" />
        </g>

        {/* AI Computational Network Nodes & Neural Knowledge Connections */}
        <g>
          {/* Outer Ring Nodes */}
          {[
            { cx: 250, cy: 70, label: 'Dharma' },
            { cx: 377, cy: 123, label: 'Satya' },
            { cx: 430, cy: 250, label: 'Nyaya' },
            { cx: 377, cy: 377, label: 'Samata' },
            { cx: 250, cy: 430, label: 'Ahimsa' },
            { cx: 123, cy: 377, label: 'Sukha' },
            { cx: 70, cy: 250, label: 'Pramana' },
            { cx: 123, cy: 123, label: 'Karuna' },
          ].map((node, i) => (
            <g key={i}>
              <circle
                cx={node.cx}
                cy={node.cy}
                r="6.5"
                fill="#FFFDF8"
                stroke="#243B32"
                strokeWidth="2"
              />
              <circle
                cx={node.cx}
                cy={node.cy}
                r="2.5"
                fill="#A6533C"
              />
            </g>
          ))}

          {/* Inner Interconnected Network Lines */}
          <path
            d="M 250 70 L 377 123 L 430 250 L 377 377 L 250 430 L 123 377 L 70 250 L 123 123 Z"
            stroke="#B49A61"
            strokeWidth="0.8"
            strokeDasharray="2 4"
            opacity="0.6"
          />
          <path
            d="M 250 70 L 250 430 M 70 250 L 430 250"
            stroke="#243B32"
            strokeWidth="0.75"
            opacity="0.25"
          />

          {/* Central Sacred Knowledge Core (Bindu) */}
          <circle cx="250" cy="250" r="16" fill="#243B32" />
          <circle cx="250" cy="250" r="12" fill="#FFFDF8" />
          <circle cx="250" cy="250" r="5" fill="#A6533C" />
        </g>
      </svg>
    </div>
  );
};
