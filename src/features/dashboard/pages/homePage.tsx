// src/pages/home.tsx

'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/shared/components/header';
import FooterNavBar from '@/shared/components/footer';
import { Bingo } from '@/features/dashboard/components/bingoUI';
import { getUserSession, getUserData } from '@/features/dashboard/utils/awsService';
import { User } from '../../../API'; // APIから生成された型をインポート

// UserData型を定義（必要に応じて調整してください）
type UserData = Pick<User, 'id' | 'displayName' | 'score' | 'currentCategoryId' | 'currentCategory'>;

const HomePage: React.FC = () => {
  const [userSession, setUserSession] = useState<any | null>(null);
  const [userScore, setUserScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const session = await getUserSession();
        setUserSession(session);

        const userId = session.tokens?.idToken?.payload?.sub;
        if (userId) {
          const fetchedUserData = await getUserData(userId);
          if (fetchedUserData) {
            setUserScore(fetchedUserData.score || 0);
            // 必要なプロパティのみを抽出してUserData型に変換
            const userDataToSet: UserData = {
              id: fetchedUserData.id,
              displayName: fetchedUserData.displayName,
              score: fetchedUserData.score,
              currentCategoryId: fetchedUserData.currentCategoryId,
              currentCategory: fetchedUserData.currentCategory,
            };
            setUserData(userDataToSet);
          }
        }
      } catch (err) {
        console.error('データ取得エラー', err);
        setError('エラーが発生しました。');
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const userId = userSession?.tokens?.idToken?.payload?.sub;
  const nickname = userSession?.tokens?.idToken?.payload?.nickname;
  const displayName = typeof nickname === 'string' ? nickname : 'ユーザー';

  if (loading) {
    return <div>読み込み中...</div>;
  }

  if (error) {
    return <div>エラー: {error}</div>;
  }

  return (
    <div>
      <Header />
      <h1>ようこそ、{displayName}さん！</h1>
      {userId ? (
        // Bingo コンポーネントを表示
        <Bingo userId={userId} initialScore={userScore} />
      ) : (
        <p>ユーザーIDを取得できませんでした。</p>
      )}
      <FooterNavBar />
    </div>
  );
};

export default HomePage;
