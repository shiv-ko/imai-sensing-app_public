// PostItem.tsx
import React from 'react';

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
  return (
    <li>
      <h3>{post.category}</h3>
      <p>{post.comment}</p>
      {post.imageUrl && (
        <img src={post.imageUrl} alt={post.category} style={{ maxWidth: '200px' }} />
      )}
      <p>
        Location: ({post.lat}, {post.lng})
      </p>
      <p>Reported: {post.reported ? 'Yes' : 'No'}</p>
      <p>Deleted: {post.deleted ? 'Yes' : 'No'}</p>
      <p>Visible: {post.visible ? 'Yes' : 'No'}</p>
      <p>Points: {post.point}</p>
      <p>Posted by: {post.userId}</p>
    </li>
  );
};

export default PostItem;
