import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const themes = [
  { id: 'theme-enterprise', name: 'Classic Enterprise', desc: 'Square edges, dark sidebar' },
  { id: 'theme-modern', name: 'Modern Light', desc: 'Rounded corners, white interface' },
  { id: 'theme-dark', name: 'Night Mode', desc: 'Eye-friendly dark interface' },
  { id: 'theme-neo', name: 'Neo Brutalism', desc: 'Bold borders, solid shadows' },
  { id: 'theme-glass', name: 'Glassmorphism', desc: 'Blurry, vibrant translucent' },
  { id: 'theme-nature', name: 'Nature Green', desc: 'Earthy tones, soft beige' },
  { id: 'theme-ocean', name: 'Deep Ocean', desc: 'Calming blues and teals' },
  { id: 'theme-sunset', name: 'Sunset Vibe', desc: 'Warm reds and oranges' },
  { id: 'theme-monochrome', name: 'Monochrome', desc: 'Pure black & white contrast' },
  { id: 'theme-playful', name: 'Playful Kids', desc: 'Bubbly shapes, softer feel' }
];

export const layouts = [
  { id: 'layout-default', name: 'Standard Layout', desc: 'Top stats, Hub left, Activity right' },
  { id: 'layout-analytics', name: 'Analytics Centric', desc: 'Hub top, Stats in middle' },
  { id: 'layout-compact', name: 'Compact Dense', desc: 'Reduced spacing for pro users' },
  { id: 'layout-focus', name: 'Focus Mode', desc: 'Single column, large widgets' },
  { id: 'layout-reversed', name: 'Reversed Block', desc: 'Activity left, Hub right, bottom stats' }
];

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('theme-enterprise');
  const [currentLayout, setCurrentLayout] = useState('layout-default');

  useEffect(() => {
    const savedTheme = localStorage.getItem('erp-theme');
    const savedLayout = localStorage.getItem('erp-layout');
    if (savedTheme) setCurrentTheme(savedTheme);
    if (savedLayout) setCurrentLayout(savedLayout);
  }, []);

  const changeTheme = (themeId) => {
    setCurrentTheme(themeId);
    localStorage.setItem('erp-theme', themeId);
  };
  
  const changeLayout = (layoutId) => {
    setCurrentLayout(layoutId);
    localStorage.setItem('erp-layout', layoutId);
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, changeTheme, themes, currentLayout, changeLayout, layouts }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
