import React from 'react';

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: 'hsl(var(--accent))', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <g className="transform transition-transform duration-300 group-hover:rotate-[15deg]">
        <path
          fill="url(#grad1)"
          d="M50 0 L85.35 14.65 L100 50 L85.35 85.35 L50 100 L14.65 85.35 L0 50 L14.65 14.65 Z"
        />
        <path
          fill="hsl(var(--background))"
          d="M50 20 L72.45 32.23 L82.45 59.55 L62.45 79.55 L37.55 79.55 L17.55 59.55 L27.55 32.23 Z"
            transform="rotate(10 50 50)"
        />
         <path
          fill="hsl(var(--primary-foreground))"
          d="M50 25 L69.02 35.98 L77.7 59.77 L59.36 76.23 L40.64 76.23 L22.3 59.77 L30.98 35.98 Z"
           transform="rotate(10 50 50)"
           opacity="0.2"
        />
      </g>
    </svg>
  );
}
