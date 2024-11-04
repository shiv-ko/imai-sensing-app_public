import React, { useState } from 'react';
import LocationModal from '../../../shared/utils/modal/locationModal';
import ImageModal from '../../../shared/utils/modal/imageModal';
import { updatePostData } from '../../../graphql/mutations';
import { generateClient } from 'aws-amplify/api';
import CancelReportButton from '@/shared/utils/button/cancelReportButton';

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
}

const client = generateClient();

const PostItem: React.FC<PostItemProps> = ({ post }) => {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  const toggleImageModal = () => {
    setIsImageModalOpen(!isImageModalOpen);
  };

  const toggleLocationModal = () => {
    setIsLocationModalOpen(!isLocationModalOpen);
  };

  // 投稿を削除する関数
  const deletePost = async () => {
    try {
      await client.graphql({
        query: updatePostData,
        variables: {
          input: {
            id: post.id,
            postType: 'DELETED', // 通常の投稿状態に戻す
            reported: false,
          },
        },
      });
      alert('投稿を削除しました');
      // 必要に応じて、リストから投稿を削除する処理を追加
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('投稿を削除しました');
    }
  };


  // 投稿を削除する際の確認処理を含む関数
  const handleDeleteClick = () => {
    const confirmed = window.confirm('本当にこの投稿を削除しますか？');
    if (confirmed) {
      deletePost();
    }
  };


  return (
    <li style={styles.container}>
      {post.imageUrl && (
        <div style={styles.imageContainer} onClick={toggleImageModal}>
          <img src={post.imageUrl} alt={post.category} style={styles.image} />
          <p style={styles.clickToEnlarge}>画像をクリックで拡大</p>
        </div>
      )}

      <div style={styles.contentContainer}>
        <h3 style={styles.category}>{post.category}</h3>
        <p style={styles.postedby}>投稿者: {post.postedby}</p>
        <p style={styles.comment}>{post.comment}</p>

        <div style={styles.buttonContainer}>
          {post.postType === 'REPORTED' && (
            <>
              <button onClick={handleDeleteClick} style={styles.actionButton}>
                投稿を削除する
              </button>
              <CancelReportButton postId={post.id} />

            </>
          )}
          {post.postType !== 'DELETED' && (
            <button onClick={toggleLocationModal} style={styles.locationButton}>
              場所を確認する
            </button>
          )}
        </div>
      </div>

      <ImageModal
        isOpen={isImageModalOpen}
        onClose={toggleImageModal}
        imageUrl={post.imageUrl || ''}
        altText={post.category}
      />

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
    listStyleType: 'none',
    margin: '0 auto',
    padding: '16px',
    maxWidth: '600px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    marginBottom: '16px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff',
    textAlign: 'center' as const,
  },
  imageContainer: {
    cursor: 'pointer',
    marginBottom: '16px',
  },
  image: {
    width: '100%',
    maxWidth: '300px',
    height: 'auto',
    borderRadius: '8px',
    objectFit: 'cover' as const,
  },
  clickToEnlarge: {
    fontSize: '12px',
    color: '#888',
    marginTop: '8px',
  },
  contentContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
  },
  category: {
    fontSize: '22px',
    fontWeight: 'bold' as const,
    color: '#333',
    marginBottom: '8px',
    whiteSpace: 'nowrap' as const,
  },
  postedby: {
    fontStyle: 'italic',
    color: '#555',
    marginBottom: '12px',
  },
  comment: {
    fontSize: '16px',
    color: '#555',
    marginBottom: '16px',
    wordBreak: 'break-word' as const,
  },
  buttonContainer: {
    display: 'flex',
    gap: '12px',
    marginBottom: '8px',
    flexWrap: 'wrap' as const,
    justifyContent: 'center',
  },
  actionButton: {
    padding: '8px 16px',
    fontSize: '14px',
    backgroundColor: '#f44336', // 赤色
    color: 'white',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  locationButton: {
    padding: '8px 16px',
    fontSize: '14px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
};

export default PostItem;
