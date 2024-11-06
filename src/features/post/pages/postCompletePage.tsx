'use client'
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchUserAttributes } from 'aws-amplify/auth';
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
        const userId = userAttributes.sub;

        // スコアを更新
        const updatedUser = await updateUserScore(userId || '', 1);
        //console.log('ユーザーのスコアが更新されました:', updatedUser.score);
        setUpdatedScore(updatedUser.score);
      } catch (err) {
        console.error('スコアの更新中にエラーが発生しました:', err);
        setError('スコアの更新に成功しました。');
      } finally {
        setLoading(false);
      }
    }

    updateScore();
  }, []);

  return (
    <div className="container">
      <div className="content">
        <div className="icon">🎉</div>
        <h1 className="title">投稿が完了しました！</h1>
        <p className="message">ご投稿ありがとうございます。</p>
        {loading && <p className="loading">スコアを更新中...</p>}
        {error && <p className="error">{error}</p>}
        {updatedScore !== null && (
          <p className="score">あなたの新しいスコア: {updatedScore}</p>
        )}
        <Link href="/home">
          <button className="button">ホームに戻る</button>
        </Link>
      </div>
      <style jsx>{`
        .container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          padding: 20px;
          min-height: 100vh;
          box-sizing: border-box;
          background-color: #f5f5f5; /* 背景色を変更しない指定ですが、必要に応じて追加 */
        }

        .content {
          max-width: 600px;
          width: 100%;
          padding: 20px;
          box-sizing: border-box;
          background-color: transparent; /* 背景色を変更しない */
        }

        .icon {
          font-size: 3rem;
          margin-bottom: 20px;
        }

        .title {
          font-size: 2rem;
          margin-bottom: 20px;
          color: #333333;
        }

        .message {
          font-size: 1.125rem;
          margin-bottom: 30px;
          color: #555555;
        }

        .loading {
          font-size: 1rem;
          color: #757575;
          margin-bottom: 20px;
        }

        .error {
          font-size: 1rem;
          color: red;
          margin-bottom: 20px;
        }

        .score {
          font-size: 1.25rem;
          font-weight: bold;
          margin-bottom: 30px;
          color: #2e7d32;
        }

        .button {
          background-color: #81c784;
          color: white;
          border: none;
          padding: 15px 30px;
          border-radius: 5px;
          cursor: pointer;
          font-size: 1rem;
          transition: background-color 0.3s ease;
        }

        .button:hover {
          background-color: #66bb6a;
        }

        /* レスポンシブデザイン */
        @media (max-width: 768px) {
          .icon {
            font-size: 2.5rem;
          }
          .title {
            font-size: 1.75rem;
          }
          .message {
            font-size: 1rem;
          }
          .score {
            font-size: 1.125rem;
          }
          .button {
            padding: 12px 25px;
            font-size: 0.9rem;
          }
        }

        @media (max-width: 480px) {
          .icon {
            font-size: 2rem;
          }
          .title {
            font-size: 1.5rem;
          }
          .message {
            font-size: 0.95rem;
          }
          .score {
            font-size: 1rem;
          }
          .button {
            padding: 10px 20px;
            font-size: 0.85rem;
          }
        }
      `}</style>
    </div>
  );
};

export default PostCompletionPage;
