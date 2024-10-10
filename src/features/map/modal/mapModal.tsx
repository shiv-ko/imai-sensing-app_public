import React from 'react';

interface ModalProps {
  post: {
    category: string;
    comment: string;
    imageUrl?: string;
    postedby?: string | null;
  };
  isOpen: boolean;
  onClose: () => void;
}

const MapModal: React.FC<ModalProps> = ({ post, isOpen, onClose }) => {
  if (!isOpen) return null;

  // オーバーレイをクリックしたときにモーダルを閉じる
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // モーダルの内容をクリックしたときは閉じないようにする
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div style={modalOverlayStyle} onClick={handleOverlayClick}>
      <div style={modalContentStyle}>
        <button style={closeButtonStyle} onClick={onClose}>
          &times;
        </button>
        <h3>{post.category}</h3>
        <p>{post.comment}</p>
        {post.imageUrl && (
          <img
            src={post.imageUrl}
            alt={post.category}
            style={{ maxWidth: '200px', borderRadius: '10px', marginTop: '10px' }}
          />
        )}
        <p style={{ fontStyle: 'italic', marginTop: '10px' }}>投稿者: {post.postedby}</p>
      </div>
    </div>
  );
};

// スタイルを定義
const modalOverlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const modalContentStyle: React.CSSProperties = {
  backgroundColor: '#fff',
  padding: '20px',
  borderRadius: '8px',
  width: '300px',
  maxHeight: '80%',
  overflowY: 'auto',
  position: 'relative',
};

const closeButtonStyle: React.CSSProperties = {
  position: 'absolute',
  top: '10px',
  right: '10px',
  backgroundColor: 'transparent',
  border: 'none',
  fontSize: '24px', // フォントサイズを大きくしてクリック判定を広げる
  cursor: 'pointer',
  width: '40px',  // ボタンのサイズを拡大
  height: '40px',
};

export default MapModal;
