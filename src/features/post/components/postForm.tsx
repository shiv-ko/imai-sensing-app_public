import React, { useState, useEffect } from 'react';

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
}

const PostForm: React.FC<PostFormProps> = ({
  formData,
  handleInputChange,
  createPost,
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [commentError, setCommentError] = useState<string | null>(null); // コメントのエラーメッセージ用のステートを追加

  useEffect(() => {
    if (formData.image) {
      const url = URL.createObjectURL(formData.image);
      setImagePreview(url);

      // クリーンアップ
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [formData.image]);

  // フォームの送信時にバリデーションを行う関数を追加
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    let valid = true;

    // コメントのバリデーション
    if (!formData.comment.trim()) {
      setCommentError('コメントを入力してください');
      valid = false;
    } else {
      setCommentError(null);
    }

    if (valid) {
      createPost(event); // バリデーションが通った場合のみ投稿処理を実行
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <p style={styles.categoryText}>お題: {formData.category}</p>

      {/* 画像プレビュー表示 */}
      {imagePreview && (
        <img
          src={imagePreview}
          alt="プレビュー"
          style={{ ...styles.imagePreview, objectFit: 'cover' as const }}
        />
      )}

      <textarea
        name="comment"
        placeholder="コメントを記入してください"
        value={formData.comment}
        onChange={handleInputChange}
        style={styles.textarea}
        maxLength={140}
      />

      {/* コメントのエラーメッセージを表示 */}
      {commentError && <p style={styles.errorMessage}>{commentError}</p>}

      <p style={styles.remainingCharacters}>
        残り文字数: {140 - formData.comment.length}
      </p>

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
    flexDirection: 'column' as const, // 縦に並べる
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
    textAlign: 'center' as const, // 中央揃えにする
    marginBottom: '15px',
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
    maxHeight: '300px', // プレビューの最大高さを設定
    objectFit: 'contain' as const, // 画像が枠内に収まるよう調整
    marginBottom: '15px',
  },
};

export default PostForm;
