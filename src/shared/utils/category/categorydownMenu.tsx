// import React from 'react';
// import Select from 'react-select';


// interface CategoryDropdownProps {
//   selectedCategory: string;
//   categories: string[];
//   onCategoryChange: (category: string) => void;
// }

// const CategoryDropdown: React.FC<CategoryDropdownProps> = ({ selectedCategory, categories, onCategoryChange }) => {
//   return (
//     <div>
//       <label htmlFor="category">Category: </label>
//       <select
//         id="category"
//         value={selectedCategory}
//         onChange={(e) => onCategoryChange(e.target.value)}
//       >
        
//         {categories.map((category) => (
//           <option key={category} value={category}>
//             {category}
//           </option>
//         ))}
//       </select>
//     </div>
//   );
// };

// export default CategoryDropdown;

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
      <label htmlFor="category" style={styles.label}>Category: </label>
      <Select
        id="category"
        value={selectedOption}
        options={options}
        onChange={(selectedOption) =>
          onCategoryChange(selectedOption ? selectedOption.value : '')
        }
        styles={customStyles}
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
export default CategoryDropdown;
