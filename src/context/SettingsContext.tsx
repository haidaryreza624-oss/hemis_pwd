import React, { createContext, useContext, useState, useEffect } from 'react';

export type Theme = 'light' | 'dark';
export type Color = 'indigo' | 'emerald' | 'rose' | 'amber' | 'blue' | 'violet';
export type Font = 'وزیر' | 'شبنم' | 'نازنین';

interface SettingsContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  color: Color;
  setColor: (color: Color) => void;
  font: Font;
  setFont: (font: Font) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('theme') as Theme) || 'light');
  const [color, setColor] = useState<Color>(() => (localStorage.getItem('color') as Color) || 'indigo');
  const [font, setFont] = useState<Font>(() => (localStorage.getItem('font') as Font) || 'وزیر');

  useEffect(() => {
    localStorage.setItem('theme', theme);
    const root = window.document.documentElement;
    console.log('Theme changed to:', theme);
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('color', color);
  }, [color]);

  useEffect(() => {
    localStorage.setItem('font', font);
    // Map Persian font identifiers to font-family fallbacks. Ensure fonts are loaded separately if needed.
    let fontFamily = '"وزیر", sans-serif';
    if (font === 'شبنم') fontFamily = '"شبنم", sans-serif';
    if (font === 'نازنین') fontFamily = '"نازنین", serif';
    document.documentElement.style.setProperty('--font-sans', fontFamily);
  }, [font]);

  return (
    <SettingsContext.Provider value={{ theme, setTheme, color, setColor, font, setFont }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const getColorClass = (color: Color, shade: number = 600) => {
  const colors: Record<Color, string> = {
    indigo: `bg-indigo-${shade} text-indigo-${shade} border-indigo-${shade}`,
    emerald: `bg-emerald-${shade} text-emerald-${shade} border-emerald-${shade}`,
    rose: `bg-rose-${shade} text-rose-${shade} border-rose-${shade}`,
    amber: `bg-amber-${shade} text-amber-${shade} border-amber-${shade}`,
    blue: `bg-blue-${shade} text-blue-${shade} border-blue-${shade}`,
    violet: `bg-violet-${shade} text-violet-${shade} border-violet-${shade}`,
  };
  // This is a simplification. Tailwind dynamic classes need to be safelisted or full strings.
  // Better approach: return the specific class name needed.
  return colors[color];
};

// Helper for specific properties to avoid dynamic class issues in Tailwind
export const getPrimaryColor = (color: Color) => {
  switch (color) {
    case 'indigo': return 'text-indigo-600';
    case 'emerald': return 'text-emerald-600';
    case 'rose': return 'text-rose-600';
    case 'amber': return 'text-amber-600';
    case 'blue': return 'text-blue-600';
    case 'violet': return 'text-violet-600';
    default: return 'text-indigo-600';
  }
};

export const getPrimaryBg = (color: Color) => {
  switch (color) {
    case 'indigo': return 'bg-indigo-600';
    case 'emerald': return 'bg-emerald-600';
    case 'rose': return 'bg-rose-600';
    case 'amber': return 'bg-amber-600';
    case 'blue': return 'bg-blue-600';
    case 'violet': return 'bg-violet-600';
    default: return 'bg-indigo-600';
  }
};

export const getPrimaryBorder = (color: Color) => {
  switch (color) {
    case 'indigo': return 'border-indigo-600';
    case 'emerald': return 'border-emerald-600';
    case 'rose': return 'border-rose-600';
    case 'amber': return 'border-amber-600';
    case 'blue': return 'border-blue-600';
    case 'violet': return 'border-violet-600';
    default: return 'border-indigo-600';
  }
};

export const getLightBg = (color: Color) => {
  switch (color) {
    case 'indigo': return 'bg-indigo-50';
    case 'emerald': return 'bg-emerald-50';
    case 'rose': return 'bg-rose-50';
    case 'amber': return 'bg-amber-50';
    case 'blue': return 'bg-blue-50';
    case 'violet': return 'bg-violet-50';
    default: return 'bg-indigo-50';
  }
};
