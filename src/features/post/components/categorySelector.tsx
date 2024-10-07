// CategorySelector.tsx
import React from 'react';

interface CategorySelectorProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  newCategory: string;
  onNewCategoryChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  addCategory: () => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  newCategory,
  onNewCategoryChange,
  addCategory,
}) => {
  return (
    <div>
      <select name="category" value={selectedCategory} onChange={onCategoryChange}>
        <option value="" disabled>
          Select Category
        </option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
      <div>
        <input
          name="newCategory"
          placeholder="Add a new category"
          value={newCategory}
          onChange={onNewCategoryChange}
        />
        <button type="button" onClick={addCategory}>
          Add Category
        </button>
      </div>
    </div>
  );
};

export default CategorySelector;
