import React from 'react';

interface ThemeSelectorProps {
  themes: string[];
  selectedTheme: string;
  onThemeChange: (theme: string) => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  themes,
  selectedTheme,
  onThemeChange,
}) => {
  return (
    <div style={styles.container}>
      <select
        id="theme-select"
        value={selectedTheme}
        onChange={(e) => onThemeChange(e.target.value)}
        style={styles.select}
      >
        <option value="">テーマを選んでください</option> {/* Default placeholder */}
        {themes.map((theme) => (
          <option key={theme} value={theme}>
            {theme}
          </option>
        ))}
      </select>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#f5f5f5',
    borderRadius: '10px',
    width: '100%',
  },
  label: {
    fontSize: '24px',
    marginBottom: '10px',
  },
  select: {
    fontSize: '18px',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    width: '50%',
  },
};

export default ThemeSelector;
