// PostItem.tsx

import React, { useState } from 'react';
import LocationModal from '../modal/locationModal'; // 地図モーダルをインポート
import ImageModal from '../modal/imageModal'; // 画像モーダルをインポート

interface Post {
  id: string;
  imageUrl?: string;
  userId: string;
  lat: number;
  lng: number;
  category: string;
  comment: string;
  reported: boolean;
  deleted: boolean;
  visible: boolean;
  point: number;
  postType: string;
  postedby: string;
}

interface PostItemProps {
  post: Post;
}

const PostItem: React.FC<PostItemProps> = ({ post }) => {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  const toggleImageModal = () => {
    setIsImageModalOpen(!isImageModalOpen);
  };

  const toggleLocationModal = () => {
    setIsLocationModalOpen(!isLocationModalOpen);
  };

  return (
    <li style={styles.container}>
      {/* 左側：画像部分 */}
      {post.imageUrl && (
        <div style={styles.imageContainer}>
          <img
            src={post.imageUrl}
            alt={post.category}
            style={styles.image}
            onClick={toggleImageModal}
          />
          <p style={styles.clickToEnlarge}>画像をクリックで拡大</p>
        </div>
      )}

      {/* 右側：テキスト部分 */}
      <div style={styles.textContainer}>
        <h3 style={styles.category}>{post.category}</h3>
        <p style={styles.postedby}>投稿者: {post.postedby}</p>
        <p style={styles.comment}>コメント: {post.comment}</p>

        {/* 場所を確認するボタン */}
        <button onClick={toggleLocationModal} style={styles.locationButton}>
          場所を確認する
        </button>
      </div>

      {/* 画像モーダル */}
      <ImageModal
        isOpen={isImageModalOpen}
        onClose={toggleImageModal}
        imageUrl={post.imageUrl || ''}
        altText={post.category}
      />

      {/* 位置情報モーダル */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={toggleLocationModal}
        lat={post.lat}
        lng={post.lng}
      />
    </li>
  );
};

const styles = {
  container: {
    display: 'flex',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '16px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    alignItems: 'flex-start',
  },
  imageContainer: {
    marginRight: '20px',
    textAlign: 'center' as const,
    cursor: 'pointer',
  },
  image: {
    maxWidth: '150px',
    borderRadius: '8px',
  },
  clickToEnlarge: {
    fontSize: '12px',
    color: '#888',
    marginTop: '8px',
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  category: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333',
  },
  postedby: {
    fontStyle: 'italic',
    color: '#333',
    marginTop: '5px',
  },
  comment: {
    fontSize: '16px',
    marginTop: '12px',
    color: '#555',
  },
  locationButton: {
    marginTop: '12px',
    padding: '6px 12px',
    fontSize: '14px',
    backgroundColor: '#4CAF50', // ボタンの背景色
    color: 'white', // ボタンのテキスト色
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
};

export default PostItem;
