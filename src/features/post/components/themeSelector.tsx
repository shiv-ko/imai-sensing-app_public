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
      {themes.map((theme) => (
        <button
          key={theme}
          onClick={() => onThemeChange(theme)}
          style={{
            ...styles.button,
            backgroundColor: selectedTheme === theme ? '#00695c' : '#e0f7fa',
            color: selectedTheme === theme ? 'white' : '#333',
          }}
        >
          {theme}
        </button>
      ))}
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
  title: {
    fontSize: '24px',
    marginBottom: '20px',
  },
  button: {
    backgroundColor: '#81c784',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    fontSize: '18px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    marginTop: '20px', // テーマセレクターとボタンの間に余白を作成
  },
};


export default ThemeSelector;
