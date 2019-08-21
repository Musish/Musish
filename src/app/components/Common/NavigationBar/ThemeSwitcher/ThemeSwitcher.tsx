import React from 'react';
import { SupportedThemes, useTheme } from '../../../Providers/ThemeProvider';

const ThemeSwitcher: React.FC<{}> = () => {
  const { theme, setTheme } = useTheme();

  function handleChange(e: React.ChangeEvent) {
    const newTheme = (e.target as HTMLSelectElement).value as SupportedThemes;

    setTheme(newTheme);
  }

  return (
    <div>
      <select onChange={handleChange} value={theme}>
        <option value='light'>Light</option>
        <option value='dark'>Dark</option>
      </select>
    </div>
  );
};

export default ThemeSwitcher;
