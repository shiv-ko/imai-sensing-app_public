// components/ThemeSelector.tsx
import React from 'react';

interface ThemeSelectorProps {
  themes: string[];
  selectedTheme: string;
  onThemeChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  themes,
  selectedTheme,
  onThemeChange,
}) => {
  return (
    <div>
      <select value={selectedTheme} onChange={onThemeChange}>
        <option value="" disabled>
          テーマを選択してください
        </option>
        {themes.map((theme) => (
          <option key={theme} value={theme}>
            {theme}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ThemeSelector;
