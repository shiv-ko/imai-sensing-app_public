import React from 'react';
import Select from 'react-select';

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
  // Prepare options for react-select
  const options = themes.map((theme) => ({
    value: theme,
    label: theme,
  }));

  const selectedOption = options.find((option) => option.value === selectedTheme);

  return (
    <div style={styles.container}>
      <Select
        value={selectedOption}
        options={options}
        onChange={(selectedOption) => onThemeChange(selectedOption ? selectedOption.value : '')}
        placeholder="テーマを選んでください" // Default placeholder
        styles={customStyles} // Apply custom styles
        isClearable // Optional: allows clearing the selection
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
    // height:'100%',
    width: '100%',
  },
};

const customStyles = {
  control: (base: any) => ({
    ...base,
    minHeight: '40px', // Adjust height here
    width: '300px', // Adjust width here
    fontSize: '16px',
  }),
  menu: (base: any) => ({
    ...base,
    width: '300px', // Ensure the menu width matches the select box
  }),
  valueContainer: (base: any) => ({
    ...base,
    padding: '2px 8px', // Adjust padding for the inner content
  }),
  indicatorsContainer: (base: any) => ({
    ...base,
    height: '40px', // Match height of the select box
  }),
};

export default ThemeSelector;