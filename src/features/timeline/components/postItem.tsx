// PostItem.tsx

import React, { useState } from 'react';
import LocationModal from '../modal/locationModal';
import ImageModal from '../modal/imageModal';
import LikeButton from '../../../shared/utils/button/likeButton';
import ReportButton from '../../../shared/utils/button/reportButton'; // 通報ボタンをインポート

interface Post {
  id: string;
  imageUrl?: string | null;
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
  postedby?: string | null;
}

interface PostItemProps {
  post: Post;
  currentUserId: string;
}

const PostItem: React.FC<PostItemProps> = ({ post, currentUserId }) => {
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

      <div style={styles.textContainer}>
        <h3 style={styles.category}>{post.category}</h3>
        <p style={styles.postedby}>投稿者: {post.postedby}</p>
        <p style={styles.comment}>コメント: {post.comment}</p>

        {/* いいねボタン */}
        <LikeButton postId={post.id} userId={currentUserId} />

        {/* 通報ボタン */}
        <ReportButton postId={post.id} />

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
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
};

export default PostItem;
