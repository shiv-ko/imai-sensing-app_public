'use client'
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchUserAttributes} from 'aws-amplify/auth';
import updateUserScore from '@/hooks/updatePoint'; // パスを調整してください

const PostCompletionPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatedScore, setUpdatedScore] = useState<number | null>(null);

  useEffect(() => {
    async function updateScore() {
      try {
        // 現在のユーザーを取得
        const userAttributes = await fetchUserAttributes();
        const userId = userAttributes.sub ;

        // スコアを更新
        const updatedUser = await updateUserScore(userId || '', 1);
        console.log('ユーザーのスコアが更新されました:', updatedUser.score);
        setUpdatedScore(updatedUser.score);
      } catch (err) {
        console.error('スコアの更新中にエラーが発生しました:', err);
        setError('スコアの更新に成功しました.');
      } finally {
        setLoading(false);
      }
    }

    updateScore();
  }, []);
  

  return (
    <div style={styles.container}>
      <h1>投稿が完了しました！</h1>
      <p>ご投稿ありがとうございます。</p>
      {loading && <p>スコアを更新中...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {updatedScore !== null && <p>あなたの新しいスコア: {updatedScore}</p>}
      <Link href="/home">
        <button style={styles.button}>ホームに戻る</button>
      </Link>
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center' as const,
    padding: '50px',
  },
  button: {
    backgroundColor: '#81c784',
    color: 'white',
    border: 'none',
    padding: '15px 30px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    marginTop: '20px',
  },
};

export default PostCompletionPage;
