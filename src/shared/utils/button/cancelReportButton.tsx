// components/DismissReportButton.tsx

import React, { useState } from 'react';
import { updatePostData } from '../../../graphql/mutations';
import { getPostData } from '../../../graphql/queries';
import { generateClient } from 'aws-amplify/api';
import { Amplify } from 'aws-amplify';
import awsExports from '../../../aws-exports';
import updateUserScore from '@/hooks/updatePoint';

Amplify.configure(awsExports);
const client = generateClient();

interface CancelReportButtonProps {
  postId: string;
}

const CancelReportButton: React.FC<CancelReportButtonProps> = ({ postId }) => {
  const [isDismissed, setIsDismissed] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleDismiss = async () => {
    const confirmed = window.confirm('本当にこの投稿の通報を解除しますか？');
    if (!confirmed) return;

    if (isDismissed || loading) return;

    setLoading(true);
    try {
      // 投稿の通報を解除
      await client.graphql({
        query: updatePostData,
        variables: {
          input: {
            id: postId,
            reported: false,
            postType: 'POST',
          },
        },
      });
      setIsDismissed(true);
    } catch (error) {
      console.error('Error updating post data:', error);
      setLoading(false);
    }

    try {
      // 投稿データを取得してユーザーIDを取得
      const postDataResult = await client.graphql({
        query: getPostData,
        variables: { id: postId },
      });

      const postData = postDataResult.data.getPostData;
      const posterUserId = postData?.userId;
      //console.log(postData);

      // ユーザーのスコアを +1 する
      if (posterUserId) {
        const updatedUser = await updateUserScore(posterUserId, 1);
        //console.log('ユーザーのスコアが更新されました:', updatedUser.score);
      }
    } catch (error) {
      console.error('Error fetching post data:', error);
    } finally {
      alert('通報が解除されました。');
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDismiss}
      disabled={isDismissed || loading}
      style={{
        padding: '8px 16px',
        fontSize: '14px',
        backgroundColor: isDismissed ? 'gray' : 'blue',
        color: 'white',
        border: 'none',
        borderRadius: '20px',
        cursor: isDismissed || loading ? 'not-allowed' : 'pointer',
        opacity: loading ? 0.7 : 1,
        transition: 'background-color 0.3s',
      }}
    >
      {isDismissed ? '通報解除済み' : '通報を解除する'}
    </button>
  );
};

export default CancelReportButton;
