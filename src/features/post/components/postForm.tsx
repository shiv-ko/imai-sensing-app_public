// components/PostForm.tsx
import React from 'react';

interface PostFormProps {
  formData: {
    comment: string;
    image: File | null;
    category: string;
    // ... その他のプロパティ
  };
  handleInputChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  createPost: (event: React.FormEvent) => Promise<void>;
  setImage: (file: File | null) => void;
}

const PostForm: React.FC<PostFormProps> = ({
  formData,
  handleInputChange,
  createPost,
  setImage,
}) => {
  return (
    <form onSubmit={createPost}>
      <p>選択されたテーマ: {formData.category}</p>
      <textarea
        name="comment"
        placeholder="コメント"
        value={formData.comment}
        onChange={handleInputChange}
      />
      <input
        type="file"
        name="image"
        onChange={(e) => setImage(e.target.files?.[0] || null)}
      />
      <button type="submit">投稿する</button>
    </form>
  );
};

export default PostForm;
