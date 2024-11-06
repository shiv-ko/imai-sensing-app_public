import React from 'react';
import Select from 'react-select';

interface CategoryDropdownProps {
  selectedCategory: string;
  categories: string[];
  onCategoryChange: (category: string) => void;
}

// オプションの型を定義
interface Option {
  value: string;
  label: string;
}

const CategoryDropdown: React.FC<CategoryDropdownProps> = ({ selectedCategory, categories, onCategoryChange }) => {
  // Filter out '自治会に伝えたいこと' and convert categories array into react-select options format
  const options = categories
    .filter((category) => category !== '自治会に伝えたいこと')  // フィルター処理で非表示にする
    .map((category) => ({
      value: category,
      label: category,
    }));

  // Find the selected option
  const selectedOption = options.find(option => option.value === selectedCategory);

  const handleChange = (option: Option | null) => {
    if (option) {
      onCategoryChange(option.value);
    }
  };

  return (
    <div style={styles.container}>
      <label htmlFor="category" style={styles.label}>お題: </label>
      <Select
        id="category"
        value={selectedOption}
        options={options}
        onChange={handleChange}
        isSearchable={false}
        isClearable={false}
        isDisabled={false}
        styles={{
          control: (base) => ({ 
            ...base, 
            ...styles.selectControl,
            cursor: 'pointer',
          }),
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
    width: '260px', // セレクトボックスの幅
    fontSize: '16px',
  },
  selectMenu: {
    width: '260px', // セレクトボックスとメニューの幅を一致させる
  },
  valueContainer: {
    padding: '2px 8px', // 内側のコンテンツの余白調整
  },
  indicatorsContainer: {
    height: '40px', // セレクトボックスの高さに一致させる
  },
};

export default CategoryDropdown;
