'use client';
import React, { useState} from 'react';
import { updatePostData } from '../../../graphql/mutations';
import { getPostData } from '../../../graphql/queries';
import { generateClient } from 'aws-amplify/api';
import { Amplify } from 'aws-amplify';
import awsExports from '../../../aws-exports';
import updateUserScore from '@/hooks/updatePoint';

Amplify.configure(awsExports);
const client = generateClient();

interface ReportButtonProps {
  postId: string;
}

const ReportButton: React.FC<ReportButtonProps> = ({ postId }) => {
  const [isReported, setIsReported] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  

  const handleReport = async () => {
    const confirmed = window.confirm('本当にこの投稿を通報しますか？');
    if (!confirmed) return;

    if (isReported || loading) return;

    setLoading(true);
    try {
      await client.graphql({
        query: updatePostData,
        variables: {
          input: {
            id: postId,
            reported: true,
            postType: 'REPORTED',
          },
        },
      });
      setIsReported(true);
    } catch (error) {
      console.error('Error reporting post:', error);
    } finally {
      alert('投稿が通報されました。');
      setLoading(false);
    }


    // updateUserScoreを別で実行
    try {
      // 投稿データを取得してuserIdを取得
      const postDataResult = await client.graphql({
        query: getPostData,
        variables: { id: postId },
      });

      const postData = postDataResult.data.getPostData;
      const posterUserId = postData?.userId;
      //console.log(posterUserId)
      const updatedUser = await updateUserScore(posterUserId  || '', -1);
      //console.log('ユーザーのスコアが更新されました:', updatedUser.score);
    } catch (error) {
      console.error('Error updating user score:', error);
    }
  };

  return (
    <button
      onClick={handleReport}
      disabled={isReported || loading}
      style={{
        padding: '8px 16px',
        fontSize: '14px',
        backgroundColor: isReported ? 'gray' : '#ff4c4c',
        color: 'white',
        border: 'none',
        borderRadius: '20px',
        cursor: isReported || loading ? 'not-allowed' : 'pointer',
        opacity: loading ? 0.7 : 1,
        transition: 'background-color 0.3s',
      }}
    >
      {isReported ? '通報済み' : '通報する'}
    </button>
  );
};

export default ReportButton;
