import React from 'react';
import Select, { components, OptionProps } from 'react-select';

interface CategoryDropdownProps {
  selectedCategory: string;
  categories: string[];
  onCategoryChange: (category: string) => void;
}

// オプションの型を定義
interface Option {
  value: string;
  label: string;
  icon: string;
}

// カテゴリに対応するアイコンマッピング
const categoryIconMapping: { [key: string]: string } = {
  '防災器具の場所': 'output/pin_variation_1.png',  // 消火器／消火栓
  '道の名前': 'output/pin_variation_2.png',  // 路地の名称
  '道幅のせまい場所': 'output/pin_variation_3.png',
  '避難できる場所': 'output/pin_variation_4.png',
  '避難しやすい道': 'output/pin_variation_5.png',
  '懐かしい場所': 'output/pin_variation_6.png',
  '守りたい場所': 'output/pin_variation_7.png',
  '思い出の場所': 'output/pin_variation_8.png',
  '大切な場所': 'output/pin_variation_9.png',
  '観光地になるような場所': 'output/pin_variation_10.png',
  '友達に教えてあげたいこと': 'output/pin_variation_11.png',
  'おすすめスポット': 'output/pin_variation_12.png',
  '写真映えするスポット': 'output/pin_variation_13.png',
  '珍しいもの': 'output/pin_variation_14.png',
  '面白いもの': 'output/pin_variation_15.png',
  '危険な場所': 'output/pin_variation_16.png',
  '注意が必要な場所': 'output/pin_variation_17.png',
  '景観が綺麗な場所': 'output/pin_variation_18.png',
  '緑を増やしたい場所': 'output/pin_variation_19.png',
  '誇りに思う場所': 'output/pin_variation_20.png',
  // '自治会に伝えたいこと' は非表示投稿なのでマッピングしない
};

const CategoryDropdown: React.FC<CategoryDropdownProps> = ({ selectedCategory, categories, onCategoryChange }) => {
  // Filter out '自治会に伝えたいこと' and convert categories array into react-select options format
  const options = categories
    .filter((category) => category !== '自治会に伝えたいこと')  // フィルター処理で非表示にする
    .map((category) => ({
      value: category,
      label: category,
      icon: category !== 'すべて' ? categoryIconMapping[category] || '' : '',  // 'すべて' にはアイコンを設定しない
    }));

  // Find the selected option
  const selectedOption = options.find(option => option.value === selectedCategory);

  const handleChange = (option: Option | null) => {
    if (option) {
      onCategoryChange(option.value);
    }
  };

  // カスタムオプションコンポーネント
  const CustomOption: React.FC<OptionProps<Option, false>> = (props) => (
    <components.Option {...props}>
      {props.data.icon && (
        <img
          src={props.data.icon}
          alt={props.data.label}
          style={{ width: 20, height: 20, marginRight: 10 }}
        />
      )}
      {props.data.label}
    </components.Option>
  );

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
        components={{ Option: CustomOption }}
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
