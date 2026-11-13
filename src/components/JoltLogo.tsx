import React, { useId } from 'react';
import type { ColorPalette } from '../App';

interface JoltLogoProps {
  size?: 'md' | 'sm';
  palette?: ColorPalette;
  showTagline?: boolean;
  onClick?: () => void;
}

const PALETTE_HEX: Record<ColorPalette, { s1: string; s2: string; s3: string }> = {
  aurora: { s1: '#3730a3', s2: '#0284c7', s3: '#0d9488' },
  sapphire: { s1: '#1e3a8a', s2: '#0284c7', s3: '#d97706' },
  emerald: { s1: '#065f46', s2: '#059669', s3: '#0284c7' },
  orchid: { s1: '#6b21a8', s2: '#e11d48', s3: '#f59e0b' },
};

export const JoltLogo: React.FC<JoltLogoProps> = ({
  size = 'md',
  palette = 'aurora',
  showTagline = true,
  onClick,
}) => {
  const uid = useId().replace(/:/g, '');
  const colors = PALETTE_HEX[palette] || PALETTE_HEX.aurora;
  const isSmall = size === 'sm';

  const emblem = (
    <div
      className={`relative shrink-0 transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-hover:scale-[1.04] ${
        isSmall ? 'w-8 h-8' : 'w-11 h-11'
      }`}
    >
      {/* Soft breathing multi-shade ambient halo */}
      <div
        aria-hidden="true"
        className={`jolt-logo-halo absolute -inset-1 blur-md opacity-55 pointer-events-none ${
          isSmall ? 'rounded-xl' : 'rounded-2xl'
        }`}
      />

      {/* Rotating iridescent outer prism frame */}
      <div
        className={`relative w-full h-full p-[1.75px] overflow-hidden shadow-md ${
          isSmall ? 'rounded-[10px]' : 'rounded-[13px]'
        }`}
      >
        <div
          aria-hidden="true"
          className="jolt-logo-ring absolute -inset-[45%] pointer-events-none"
        />

        {/* Inner translucent crystal glass lens */}
        <div
          className={`relative w-full h-full flex items-center justify-center overflow-hidden bg-white/88 backdrop-blur-xl shadow-inner ${
            isSmall ? 'rounded-[8.5px]' : 'rounded-[11.5px]'
          }`}
        >
          {/* Specular diagonal sheen sweep */}
          <div
            aria-hidden="true"
            className="jolt-logo-sheen absolute inset-y-0 w-1/2 pointer-events-none"
          />

          {/* Custom Kinetic Prism Bolt + Ascending Market Signal SVG */}
          <svg
            viewBox="0 0 40 40"
            className={`relative z-10 transition-transform duration-300 group-hover:scale-105 ${
              isSmall ? 'w-5 h-5' : 'w-7 h-7'
            }`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id={`jolt-bolt-${uid}`} x1="6" y1="4" x2="34" y2="36" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor={colors.s1} />
                <stop offset="52%" stopColor={colors.s2} />
                <stop offset="100%" stopColor={colors.s3} />
              </linearGradient>
              <linearGradient id={`jolt-facet-${uid}`} x1="20" y1="5" x2="31" y2="34" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.65" />
                <stop offset="100%" stopColor={colors.s2} stopOpacity="0.18" />
              </linearGradient>
              <linearGradient id={`jolt-wave-${uid}`} x1="3" y1="29" x2="37" y2="11" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor={colors.s2} stopOpacity="0.25" />
                <stop offset="50%" stopColor={colors.s3} stopOpacity="0.95" />
                <stop offset="100%" stopColor={colors.s1} stopOpacity="0.4" />
              </linearGradient>
            </defs>

            {/* Subtle kinetic market wave pulsing behind prism */}
            <path
              d="M3.5 28.5 L11 23 L16 25.5 L25.5 14.5 L30.5 17 L36.5 10.5"
              stroke={`url(#jolt-wave-${uid})`}
              strokeWidth="2.1"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="jolt-signal-path"
            />

            {/* Primary sculpted lightning prism */}
            <path
              d="M23.5 4.2 L10.2 21.4 H19.2 L16.2 35.8 L30.2 17.6 H21.1 L23.5 4.2 Z"
              fill={`url(#jolt-bolt-${uid})`}
              stroke="#ffffff"
              strokeWidth="0.9"
              strokeLinejoin="round"
            />

            {/* Crystal bevel facet highlight */}
            <path
              d="M23.5 4.2 L19.2 21.4 H21.1 L30.2 17.6 H21.1 L23.5 4.2 Z"
              fill={`url(#jolt-facet-${uid})`}
            />

            {/* Apex kinetic node */}
            <circle cx="35.8" cy="10.8" r="1.9" fill={colors.s3} />
          </svg>
        </div>
      </div>
    </div>
  );

  const lockup = (
    <div className={`flex items-center ${isSmall ? 'gap-2.5' : 'gap-3.5'}`}>
      {emblem}
      <div className="text-left">
        <div className="flex items-baseline gap-2.5">
          <span
            className={`font-classic-title font-black font-shimmer-dynamic text-glow-primary leading-none transition-all duration-200 ${
              isSmall
                ? 'text-lg tracking-[0.18em]'
                : 'text-2xl sm:text-[26px] tracking-[0.2em] group-hover:tracking-[0.24em]'
            }`}
          >
            JoLT
          </span>
          {!isSmall && (
            <span className="text-[10px] font-classic-title font-bold tracking-widest uppercase border-l border-indigo-400/40 pl-2 font-shade-secondary whitespace-nowrap">
              Decision Support
            </span>
          )}
        </div>
        {showTagline && !isSmall && (
          <p className="font-serif-classic text-[11px] text-slate-600 italic hidden sm:block tracking-wide font-medium mt-0.5">
            Indian Stock Market Intelligence & Event Transmission Architecture
          </p>
        )}
      </div>
    </div>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="group inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60 rounded-xl cursor-pointer select-none"
        aria-label="JoLT — Return to Today's Morning Report"
      >
        {lockup}
      </button>
    );
  }

  return <div className="group inline-flex items-center select-none">{lockup}</div>;
};
