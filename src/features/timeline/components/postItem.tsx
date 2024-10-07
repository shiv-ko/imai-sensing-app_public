import React, { useState } from 'react';

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
}

interface PostItemProps {
  post: Post;
}

const PostItem: React.FC<PostItemProps> = ({ post }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
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
            onClick={toggleModal}
          />
        </div>
      )}

      {/* 右側：テキスト部分 */}
      <div style={styles.infoContainer}>
        <h3 style={styles.category}>{post.category}</h3>
        <p style={styles.comment}>{post.comment}</p>
        <div style={styles.meta}>
          <p>Location: ({post.lat}, {post.lng})</p>
          <p>Points: {post.point}</p>
          <p style={styles.user}>Posted by: {post.userId}</p>
        </div>
        <div style={styles.status}>
          {post.reported && <span style={styles.reportedBadge}>Reported</span>}
          {post.deleted && <span style={styles.deletedBadge}>Deleted</span>}
          {!post.visible && <span style={styles.invisibleBadge}>Invisible</span>}
        </div>
      </div>

      {/* モーダル */}
      {isModalOpen && (
        <div style={styles.modalOverlay} onClick={toggleModal}>
          <div style={styles.modalContent}>
            <img src={post.imageUrl} alt={post.category} style={styles.modalImage} />
          </div>
        </div>
      )}
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
  },
  imageContainer: {
    marginRight: '20px',
    cursor: 'pointer',
  },
  image: {
    maxWidth: '150px',
    borderRadius: '8px',
  },
  infoContainer: {
    flex: 1,
  },
  category: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333',
  },
  comment: {
    fontSize: '16px',
    marginBottom: '12px',
    color: '#555',
  },
  meta: {
    fontSize: '14px',
    color: '#777',
  },
  user: {
    fontStyle: 'italic',
  },
  status: {
    marginTop: '10px',
  },
  reportedBadge: {
    color: 'red',
    fontWeight: 'bold',
  },
  deletedBadge: {
    color: 'gray',
  },
  invisibleBadge: {
    color: 'orange',
  },
  modalOverlay: {
    position: 'fixed' as const,
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    position: 'relative' as const,
  },
  modalImage: {
    maxWidth: '90%',
    maxHeight: '90%',
    borderRadius: '8px',
  },
};

export default PostItem;
