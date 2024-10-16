import React, { useState } from 'react';
import { updatePostData } from '../../../graphql/mutations'; // 投稿の更新ミューテーション
import { generateClient } from 'aws-amplify/api';
import { Amplify } from 'aws-amplify';
import awsExports from '../../../aws-exports';


Amplify.configure(awsExports);
const client = generateClient();

interface ReportButtonProps {
  postId: string;
}

const ReportButton: React.FC<ReportButtonProps> = ({ postId }) => {
  const [isReported, setIsReported] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleReport = async () => {
    // 確認ダイアログを表示
    const confirmed = window.confirm('本当にこの投稿を通報しますか？');
    if (!confirmed) return;

    if (isReported || loading) return;

    setLoading(true);
    try {
      // reported フィールドを true に更新
      await client.graphql({
        query: updatePostData,
        variables: {
          input: {
            id: postId,
            reported: true, // reportedをtrueに変更
          },
        },
      });
      setIsReported(true);
      alert('投稿が通報されました。');
    } catch (error) {
      console.error('Error reporting post:', error);
      alert('通報に失敗しました。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleReport}
      disabled={isReported || loading}
      style={{
        marginTop: '12px',
        padding: '6px 12px',
        fontSize: '14px',
        backgroundColor: isReported ? 'gray' : '#ff4c4c',
        color: 'white',
        border: 'none',
        borderRadius: '4px', 
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
