import React from 'react';

/**
 * SchoolLogo3D Component for Driver Portal
 * Features:
 * - 100% Vector SVG with zero background box artifacts (fully transparent)
 * - 3D Mortarboard Graduation Cap with dynamic depth, bevel, and golden tassel
 * - 3D Layered Open Book with vibrant golden-yellow pages and white cover border
 * - Perfectly matches the School ERP Driver Portal brand palette
 */
export const SchoolLogo3D = ({ className = "w-[52px] h-[42px]", variant = "default" }) => {
  return (
    <svg 
      viewBox="0 0 100 85" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={`${className} drop-shadow-md select-none pointer-events-none transition-transform hover:scale-105 overflow-visible`}
    >
      <defs>
        {/* Cap Top Diamond Gradient (White / Platinum 3D) */}
        <linearGradient id="driverCapGrad" x1="50" y1="5" x2="50" y2="34" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="60%" stopColor="#f8fafc" />
          <stop offset="100%" stopColor="#e2e8f0" />
        </linearGradient>

        {/* Cap Rim / 3D Bevel Gradient */}
        <linearGradient id="driverCapRim" x1="14" y1="20" x2="86" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#cbd5e1" />
          <stop offset="50%" stopColor="#94a3b8" />
          <stop offset="100%" stopColor="#64748b" />
        </linearGradient>

        {/* Skullcap Base */}
        <linearGradient id="driverSkullBase" x1="50" y1="26" x2="50" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>

        {/* Left Book Page Gradient (Warm Golden Yellow) */}
        <linearGradient id="driverPageLeftGrad" x1="16" y1="46" x2="48" y2="72" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="45%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>

        {/* Right Book Page Gradient (Warm Golden Yellow) */}
        <linearGradient id="driverPageRightGrad" x1="52" y1="46" x2="84" y2="72" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="55%" stopColor="#d97706" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>

        {/* Tassel Gradient (Golden Yellow) */}
        <linearGradient id="driverTasselGrad" x1="70" y1="20" x2="78" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>

        {/* Soft Ambient Shadow */}
        <filter id="driverLogoShadow" x="-15%" y="-15%" width="130%" height="135%" filterUnits="userSpaceOnUse">
          <feDropShadow 
            dx="0" 
            dy="2.5" 
            stdDeviation="2.5" 
            floodColor="#f59e0b" 
            floodOpacity="0.35" 
          />
        </filter>
      </defs>

      <g filter="url(#driverLogoShadow)">
        {/* ========================================================
            1. 3D OPEN BOOK (Bottom Section)
            ======================================================== */}
        {/* Outer Spine & White Book Cover */}
        <path 
          d="M50 56 C38 47.5 23 49.5 13 55 L13 73.5 C25 67.5 39 66.5 50 74.5 C61 66.5 75 67.5 87 73.5 L87 55 C77 49.5 62 47.5 50 56 Z" 
          fill="#ffffff" 
          stroke="#ffffff" 
          strokeWidth="2.5" 
          strokeLinejoin="round" 
        />

        {/* Left Book Page (Curved 3D Golden Gradient) */}
        <path 
          d="M49 54.5 C37.5 46.5 24 48.5 15 53.5 L15 71 C25 65.5 38.5 64.5 49 72.5 Z" 
          fill="url(#driverPageLeftGrad)" 
        />
        {/* Left Page Elegant Foil Lines */}
        <path d="M21 57.5 C29 54.5 39 54.5 44 58.5" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
        <path d="M21 62.5 C29 59.5 39 59.5 44 63.5" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
        <path d="M21 67.5 C29 64.5 39 64.5 44 68.5" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />

        {/* Right Book Page (Curved 3D Golden Gradient) */}
        <path 
          d="M51 54.5 C62.5 46.5 76 48.5 85 53.5 L85 71 C75 65.5 61.5 64.5 51 72.5 Z" 
          fill="url(#driverPageRightGrad)" 
        />
        {/* Right Page Elegant Foil Lines */}
        <path d="M56 58.5 C61 54.5 71 54.5 79 57.5" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
        <path d="M56 63.5 C61 59.5 71 59.5 79 62.5" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
        <path d="M56 68.5 C61 64.5 71 64.5 79 67.5" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />

        {/* Central Book Spine Valley */}
        <path d="M50 54.5 L50 73.5" stroke="#b45309" strokeWidth="1.8" strokeLinecap="round" />

        {/* ========================================================
            2. 3D GRADUATION CAP (Top Section)
            ======================================================== */}
        {/* Skullcap Base Arch */}
        <path 
          d="M34 24 Q50 35 66 24 L66 31 Q50 42 34 31 Z" 
          fill="url(#driverSkullBase)" 
          stroke="#ffffff" 
          strokeWidth="1.6" 
        />

        {/* 3D Under-Rim Bevel for Diamond */}
        <path 
          d="M50 10 L87 21 L87 24 L50 35.5 L13 24 L13 21 Z" 
          fill="url(#driverCapRim)" 
        />

        {/* Diamond Top Cap Plane */}
        <polygon 
          points="50,9 87,21 50,32.5 13,21" 
          fill="url(#driverCapGrad)" 
          stroke="#ffffff" 
          strokeWidth="1.6" 
          strokeLinejoin="round" 
        />

        {/* Cap Top Center Button */}
        <ellipse cx="50" cy="20.7" rx="3.5" ry="2.2" fill="#f59e0b" />

        {/* Hanging Tassel with Golden Bob */}
        <path 
          d="M50 20.7 Q68 18 73 28 L75.5 40" 
          stroke="url(#driverTasselGrad)" 
          strokeWidth="2.2" 
          strokeLinecap="round" 
          fill="none" 
        />
        <ellipse cx="75.5" cy="42" rx="2.5" ry="3.5" fill="#f59e0b" />
      </g>
    </svg>
  );
};

export default SchoolLogo3D;

