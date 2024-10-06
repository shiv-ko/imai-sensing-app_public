// PostForm.tsx
import React from 'react';
import CategorySelector from './categorySelector';

interface PostFormProps {
  formData: {
    userId: string;
    lat: string;
    lng: string;
    category: string;
    comment: string;
    image: File | null;
    // ... その他のプロパティ
  };
  handleInputChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleCategoryChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  createPost: (event: React.FormEvent) => Promise<void>;
  categories: string[];
  newCategory: string;
  setNewCategory: React.Dispatch<React.SetStateAction<string>>;
  addCategory: () => void;
  loadingLocation: boolean;
  setImage: (file: File | null) => void;
}

const PostForm: React.FC<PostFormProps> = ({
  formData,
  handleInputChange,
  handleCategoryChange,
  createPost,
  categories,
  newCategory,
  setNewCategory,
  addCategory,
  loadingLocation,
  setImage,
}) => {
  return (
    <form onSubmit={createPost}>
      <input
        name="userId"
        placeholder="User ID"
        value={formData.userId}
        onChange={handleInputChange}
      />
      <div>
        {loadingLocation ? (
          <p>Loading location...</p>
        ) : (
          <>
            <input name="lat" placeholder="Latitude" value={formData.lat} readOnly />
            <input name="lng" placeholder="Longitude" value={formData.lng} readOnly />
          </>
        )}
      </div>
      <CategorySelector
        categories={categories}
        selectedCategory={formData.category}
        onCategoryChange={handleCategoryChange}
        newCategory={newCategory}
        onNewCategoryChange={(e) => setNewCategory(e.target.value)}
        addCategory={addCategory}
      />
      <textarea
        name="comment"
        placeholder="Comment"
        value={formData.comment}
        onChange={handleInputChange}
      />
      <input
        type="file"
        name="image"
        onChange={(e) => setImage(e.target.files?.[0] || null)}
      />
      <button type="submit">Create Post</button>
    </form>
  );
};

export default PostForm;
