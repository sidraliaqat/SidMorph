import React from 'react';

export const CurvedLines: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden opacity-35 ${className}`} aria-hidden="true">
      <svg
        className="w-full h-full"
        viewBox="0 0 1440 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Elegant thin curved lines reflecting editorial technology */}
        <path
          d="M-100 200 C 300 120, 600 480, 1100 280 C 1350 180, 1500 350, 1600 320"
          stroke="#D9E48A"
          strokeWidth="1"
          strokeOpacity="0.35"
        />
        <path
          d="M-50 350 C 350 250, 700 600, 1200 400 C 1450 300, 1550 480, 1650 450"
          stroke="#7A431D"
          strokeWidth="1.2"
          strokeOpacity="0.4"
        />
        <path
          d="M100 650 C 450 500, 800 750, 1300 550 C 1500 470, 1600 600, 1700 580"
          stroke="#D9E48A"
          strokeWidth="0.8"
          strokeDasharray="4 8"
          strokeOpacity="0.25"
        />
        {/* Subtle geometric circle / arc */}
        <circle cx="1150" cy="220" r="180" stroke="#7A431D" strokeWidth="0.75" strokeOpacity="0.2" />
        <circle cx="280" cy="580" r="120" stroke="#D9E48A" strokeWidth="0.5" strokeOpacity="0.15" />
      </svg>
    </div>
  );
};
