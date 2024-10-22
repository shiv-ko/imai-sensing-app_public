// LikeButton.tsx

import React, { useState, useEffect } from 'react';
import Heart from "react-animated-heart";

import { createLike, deleteLike } from '../../../graphql/mutations'; // いいね作成と削除のクエリ
import { listLikes } from '../../../graphql/queries'; // いいねのリストを取得
import { generateClient } from 'aws-amplify/api';

const client = generateClient();

interface LikeButtonProps {
  postId: string;
  userId: string;
}

const LikeButton: React.FC<LikeButtonProps> = ({ postId, userId }) => {
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likesCount, setLikesCount] = useState<number>(0);

  useEffect(() => {
    checkIfLiked();
    fetchLikesCount();
  }, []);

  // いいねが既にされているか確認する関数
  const checkIfLiked = async () => {
    try {
      const response = await client.graphql({
        query: listLikes,
        variables: { filter: { postId: { eq: postId }, userId: { eq: userId } } },
      });
      setIsLiked(response.data.listLikes.items.length > 0);
    } catch (error) {
      console.error("Error checking like status:", error);
    }
  };

  // いいねの数を取得する関数
  const fetchLikesCount = async () => {
    try {
      const response = await client.graphql({
        query: listLikes,
        variables: { filter: { postId: { eq: postId } } },
      });
      setLikesCount(response.data.listLikes.items.length);
    } catch (error) {
      console.error("Error fetching likes count:", error);
    }
  };

  // いいねを作成する関数
  const handleLike = async () => {
    try {
      await client.graphql({
        query: createLike,
        variables: { input: { postId, userId } },
      });
      setIsLiked(true);
      setLikesCount(likesCount + 1);
    } catch (error) {
      console.error("Error liking the post:", error);
    }
  };

  // いいねを取り消す関数
  const handleUnlike = async () => {
    try {
      const response = await client.graphql({
        query: listLikes,
        variables: { filter: { postId: { eq: postId }, userId: { eq: userId } } },
      });

      if (response.data.listLikes.items.length > 0) {
        const likeId = response.data.listLikes.items[0].id;
        await client.graphql({
          query: deleteLike,
          variables: { input: { id: likeId } },
        });
        setIsLiked(false);
        setLikesCount(likesCount - 1);
      }
    } catch (error) {
      console.error("Error unliking the post:", error);
    }
  };

  return (
    <div style={styles.likeContainer}>
      <Heart
        isClick={isLiked}
        onClick={isLiked ? handleUnlike : handleLike}
      />
      {/* <p style={styles.likesCount}>{likesCount} いいね</p> */}
      <p style={styles.likesCount}>{likesCount}</p>
    </div>
  );
};

const styles = {
  likeContainer: {
    display: 'flex', // This will align the heart and the text horizontally
    alignItems: 'center', // Vertically center the heart and text
    justifyContent:'center',
    padding:'0px'
  },
  likesCount: {
    margin: 0, // Remove default margin from the <p> element
    fontSize: '14px', // Adjust the size of the likes count if needed
    fontWeight: 'bold'
  },
};
export default LikeButton;
