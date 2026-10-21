import React, { useState } from 'react';
import Header from './Header';

/**
 * LayoutFull — full-bleed layout without any padding wrapper.
 *
 * The app Sidebar is globally fixed (position: fixed, left-0, w-64, z-30).
 * The Header is globally fixed (position: fixed, h-16, left-0 lg:left-64, z-10).
 *
 * So this layout only needs to:
 *  1. Offset content RIGHT of sidebar  →  ml-64  (on lg+)
 *  2. Offset content BELOW header      →  pt-16
 *  3. Fill remaining height            →  h-screen overflow-hidden
 *
 * Children get the full remaining viewport — no extra padding, no gray background gaps.
 */
const LayoutFull = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      {/* Header is fixed globally — just render it so hamburger etc work */}
      <Header onMenuClick={() => setSidebarOpen(o => !o)} />

      {/*
        Content wrapper:
        - lg:ml-64  → pushed right past the fixed sidebar
        - pt-16     → pushed down past the fixed header
        - h-screen  → full viewport height (overflow hidden to prevent double scrollbars)
        - flex flex-col → children stack vertically and can use flex-1
      */}
      <div className="lg:ml-64 pt-16 h-screen overflow-hidden flex flex-col bg-white">
        {children}
      </div>
    </>
  );
};

export default LayoutFull;
