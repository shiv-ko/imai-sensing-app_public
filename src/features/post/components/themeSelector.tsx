/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect } from 'react';
import Select from 'react-select';
import { usePost } from '@/shared/contexts/PostContext';

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
  const { selectedCategory, setSelectedCategory } = usePost();

  useEffect(() => {
    if (selectedCategory && themes.includes(selectedCategory)) {
      onThemeChange(selectedCategory);
    }
  }, [selectedCategory, themes, onThemeChange]);

  const options = themes.map((theme) => ({
    value: theme,
    label: theme,
  }));

  const selectedOption = options.find((option) => option.value === selectedTheme);

  const handleChange = (selectedOption: any) => {
    const newValue = selectedOption ? selectedOption.value : '';
    onThemeChange(newValue);
    setSelectedCategory(newValue);
  };

  return (
    <div style={styles.container}>
      <Select
        value={selectedOption}
        options={options}
        onChange={handleChange}
        placeholder="お題を選んでください"
        styles={customStyles}
        isSearchable={false}
        isClearable
      />
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
};

const customStyles = {
  control: (base: any) => ({
    ...base,
    minHeight: '40px',
    width: '300px',
    fontSize: '16px',
  }),
  menu: (base: any) => ({
    ...base,
    width: '300px',
  }),
  valueContainer: (base: any) => ({
    ...base,
    padding: '2px 8px',
  }),
  indicatorsContainer: (base: any) => ({
    ...base,
    height: '40px',
  }),
};

export default ThemeSelector;