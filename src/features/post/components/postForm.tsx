import React, { useState } from 'react';

interface PostFormProps {
  formData: {
    comment: string;
    image: File | null;
    category: string;
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null); // プレビュー用のステート

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (validImageTypes.includes(file.type)) {
        setErrorMessage(null);
        setImage(file);
        setImagePreview(URL.createObjectURL(file)); // 選択された画像のプレビューURLを設定
      } else {
        setErrorMessage('画像ファイルのみアップロードできます (jpeg, png, gif)');
        setImage(null);
        setImagePreview(null); // プレビューをクリア
      }
    }
  };

  return (
    <form onSubmit={createPost} style={styles.form}>
      <p style={styles.categoryText}>お題: {formData.category}</p>

      {/* 画像プレビュー表示 */}
      {imagePreview && <img src={imagePreview} alt="プレビュー" style={{ ...styles.imagePreview, objectFit: 'cover' as const }} />}

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={styles.fileInput}
      />
      {errorMessage && <p style={styles.errorMessage}>{errorMessage}</p>}

      <textarea
        name="comment"
        placeholder="コメントを記入してください"
        value={formData.comment}
        onChange={handleInputChange}
        style={styles.textarea}
      />

      <p style={styles.remainingCharacters}>残り文字数: {140 - formData.comment.length}</p>

      <div style={styles.buttonGroup}>
        <button type="submit" style={styles.submitButton}>
          投稿
        </button>
      </div>
    </form>
  );
};

// スタイルをインラインで記述
const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column' as const,  // 縦に並べる
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#f5f5f5',
    borderRadius: '10px',
    width: '90%',
    margin: 'auto',
  },
  categoryText: {
    fontWeight: 'bold',
    backgroundColor: '#ffeb3b',
    padding: '10px',
    borderRadius: '5px',
    width: '100%',
    textAlign: 'center' as const,  // 中央揃えにする
    marginBottom: '15px',
  },
  fileInput: {
    width: '100%',
    padding: '10px',
    marginBottom: '15px',
    border: '2px solid #80deea',
    borderRadius: '5px',
  },
  textarea: {
    width: '100%',
    height: '100px',
    padding: '10px',
    borderRadius: '5px',
    border: '2px solid #ccc',
    marginBottom: '10px',
  },
  remainingCharacters: {
    color: '#999',
    fontSize: '14px',
    marginBottom: '15px',
  },
  errorMessage: {
    color: 'red',
    marginBottom: '10px',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'center' as const,
    width: '100%',
  },
  submitButton: {
    backgroundColor: '#81c784',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  imagePreview: {
    width: '30%',
    maxHeight: '300px',  // プレビューの最大高さを設定
    objectFit: 'contain', // 画像が枠内に収まるよう調整
    marginBottom: '15px',
  },
};

export default PostForm;
