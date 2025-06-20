'use client'

import React from 'react';

/**
 * A customizable loading spinner component
 * 
 * @param {Object} props - Component props
 * @param {string} [props.className] - Additional CSS classes
 * @param {string} [props.color='#ff4d4f'] - Main spinner color
 * @param {string} [props.bgColor='#ff4d5033'] - Background spinner color
 * @param {number} [props.size=64] - Width of the spinner (height will be 75% of width)
 * @param {string} [props.ariaLabel='Loading'] - Accessibility label
 * 
 * @returns {JSX.Element} Spinner component
 */
export default function Spinner({
  className = '',
  color = '#ff4d4f',
  bgColor = '#ff4d5033',
  size = 64,
  ariaLabel = 'Loading'
}: {
  className?: string;
  color?: string;
  bgColor?: string;
  size?: number;
  ariaLabel?: string;
}) {
  const height = size * 0.75;

  return (
    <div className='w-full text-center'>
      <div
        className={`loading ${className}`}
        role="status"
        aria-label={ariaLabel}
        style={{
          width: `${size}px`,
          height: `${height}px`,
          display: 'inline-block',
        }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 64 48"
          preserveAspectRatio="xMidYMid meet"
        >
          <polyline
            points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24"
            id="back"
            fill="none"
            stroke={bgColor}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <polyline
            points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24"
            id="front"
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="48, 144"
            strokeDashoffset="192"
            style={{
              animation: 'dash_682 1.4s linear infinite'
            }}
          />
        </svg>

        <style jsx>{`
        @keyframes dash_682 {
          72.5% {
            opacity: 0;
            }
            to {
              stroke-dashoffset: 0;
              }
              }
              `}</style>
      </div>
    </div>
  );
};