import React, { ReactNode, useContext, useState } from 'react';

export type SupportedThemes = 'light' | 'dark';

interface ThemeValue {
  theme: SupportedThemes;
  setTheme: (theme: SupportedThemes) => void;
}

const STORAGE_KEY = 'theme';

function getDefaultTheme() {
  const theme = localStorage.getItem(STORAGE_KEY);

  if (theme) {
    return theme as SupportedThemes;
  }

  return 'light';
}

export const ThemeContext = React.createContext<ThemeValue>({
  theme: getDefaultTheme(),
  setTheme: () => undefined,
});

function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<SupportedThemes>(getDefaultTheme);

  function setTheme(newTheme: SupportedThemes) {
    localStorage.setItem(STORAGE_KEY, newTheme);
    setThemeState(newTheme);
  }

  const state: ThemeValue = {
    theme,
    setTheme,
  };

  return <ThemeContext.Provider value={state}>{children}</ThemeContext.Provider>;
}

export default ThemeProvider;

export function useTheme() {
  return useContext(ThemeContext);
}
