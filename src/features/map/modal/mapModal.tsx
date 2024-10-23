'use client';
import React, { useEffect, useRef } from 'react';
import LikeButton from '@/shared/utils/button/likeButton'; // いいねボタンをインポート
import ReportButton from '@/shared/utils/button/reportButton'; // 通報ボタンをインポート

interface ModalProps {
  post: {
    id: string;
    category: string;
    comment: string;
    imageUrl?: string | null;
    postedby?: string | null;
  };
  isOpen: boolean;
  onClose: () => void;
  userId: string; // ユーザーIDを追加
}

const MapModal: React.FC<ModalProps> = ({ post, isOpen, onClose, userId }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // フォーカスをモーダルに移動
      modalRef.current?.focus();
    } else {
      document.removeEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // オーバーレイをクリックしたときにモーダルを閉じる
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="modalOverlay"
      onClick={handleOverlayClick}
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <div className="modalContent" ref={modalRef} tabIndex={-1}>
        <button className="closeButton" onClick={onClose} aria-label="閉じる">
          &times;
        </button>
        <h3 id="modal-title" className="modalTitle">{post.category}</h3>
        <p id="modal-description" className="modalComment">{post.comment}</p>
        {post.imageUrl && (
          <div className="imageContainer">
            <img
              src={post.imageUrl}
              alt={post.category}
              className="modalImage"
            />
          </div>
        )}
        <p className="modalPostedBy">投稿者: {post.postedby}</p>

        <div className="buttonContainer">
          {/* いいねボタンを表示 */}
          <LikeButton postId={post.id} userId={userId} />

          {/* 通報ボタンを表示 */}
          <ReportButton postId={post.id} />
        </div>
      </div>
      <style jsx>{`
        .modalOverlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.6);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 2000; // ここをzレイヤー2000に変更
          padding: 10px;
          box-sizing: border-box;
        }

        .modalContent {
          background-color: #ffffff;
          padding: 20px 30px;
          border-radius: 10px;
          width: 100%;
          max-width: 400px;
          max-height: 80vh; /* モーダルの最大高さを設定 */
          position: relative;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          animation: fadeIn 0.3s ease-in-out;
          outline: none;
          display: flex;
          flex-direction: column;
          overflow: hidden; /* 内部のスクロールを防止 */
          z-index: 2001; // モーダルコンテンツのz-indexも2001に設定
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .closeButton {
          position: absolute;
          top: 10px;
          right: 10px;
          background-color: transparent;
          border: none;
          font-size: 24px;
          cursor: pointer;
          width: 40px;
          height: 40px;
          display: flex;
          justify-content: center;
          align-items: center;
          transition: color 0.3s ease;
        }

        .closeButton:hover {
          color: #ff1744;
        }

        .modalTitle {
          font-size: 1.5rem;
          margin-bottom: 10px;
          color: #333333;
          text-align: center;
        }

        .modalComment {
          font-size: 1rem;
          margin-bottom: 15px;
          color: #555555;
          flex-grow: 1;
          overflow-y: auto;
        }

        .imageContainer {
          width: 100%;
          height: 200px; /* 固定高さを設定 */
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 15px;
          overflow: hidden; /* 画像がコンテナを超えないように */
          border-radius: 8px;
        }

        .modalImage {
          width: 100%;
          height: 100%;
          object-fit: cover; /* 画像をコンテナにフィットさせる */
          border-radius: 8px;
        }

        .modalPostedBy {
          font-size: 0.9rem;
          font-style: italic;
          color: #777777;
          margin-bottom: 20px;
          text-align: center;
        }

        .buttonContainer {
          display: flex;
          flex-direction: column; /* ボタンを縦に並べる */
          align-items: stretch; /* ボタンを幅いっぱいに広げる */
          gap: 10px; /* ボタン間のスペースを設定 */
        }

        .buttonContainer button {
          width: 100%;
          padding: 10px;
          font-size: 1rem;
          border-radius: 5px;
          border: none;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .buttonContainer button:hover {
          background-color: #66bb6a;
        }

        @media (max-width: 480px) {
          .modalContent {
            padding: 15px 20px;
            max-width: 90%;
          }

          .modalTitle {
            font-size: 1.25rem;
          }

          .modalComment {
            font-size: 0.95rem;
          }

          .imageContainer {
            height: 150px;
          }

          .buttonContainer {
            gap: 8px;
          }

          .buttonContainer button {
            padding: 8px;
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
};


export default MapModal;
