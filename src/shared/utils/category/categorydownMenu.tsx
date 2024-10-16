
import React from 'react';
import Select from 'react-select';

interface CategoryDropdownProps {
  selectedCategory: string;
  categories: string[];
  onCategoryChange: (category: string) => void;
}

const CategoryDropdown: React.FC<CategoryDropdownProps> = ({ selectedCategory, categories, onCategoryChange }) => {
  // Convert categories array into react-select options format
  const options = categories.map((category) => ({
    value: category,
    label: category,
  }));

  // Find the selected option
  const selectedOption = options.find(option => option.value === selectedCategory);

  return (
  <div style={styles.container}>
    <label htmlFor="category" style={styles.label}>お題: </label>
    <Select
      id="category"
      value={selectedOption}
      options={options}
      onChange={(selectedOption) =>
        onCategoryChange(selectedOption ? selectedOption.value : '')
      }
      styles={{
        control: (base) => ({ ...base, ...styles.selectControl }),
        menu: (base) => ({ ...base, ...styles.selectMenu }),
        valueContainer: (base) => ({ ...base, ...styles.valueContainer }),
        indicatorsContainer: (base) => ({ ...base, ...styles.indicatorsContainer }),
      }}
    />
  </div>
);
};

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  label: {
    fontSize: '16px',
  },
  selectControl: {
    minHeight: '40px', // セレクトボックスの高さ
    width: '300px', // セレクトボックスの幅
    fontSize: '16px',
  },
  selectMenu: {
    width: '300px', // セレクトボックスとメニューの幅を一致させる
  },
  valueContainer: {
    padding: '2px 8px', // 内側のコンテンツの余白調整
  },
  indicatorsContainer: {
    height: '40px', // セレクトボックスの高さに一致させる
  },
};
export default CategoryDropdown;
