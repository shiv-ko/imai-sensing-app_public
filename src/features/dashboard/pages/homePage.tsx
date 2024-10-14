// src/pages/home.tsx

'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/shared/components/header';
import FooterNavBar from '@/shared/components/footer';
import { Bingo } from '@/features/dashboard/components/bingoUI';
import { getUserSession, getUserData } from '@/features/dashboard/utils/awsService';
import { User } from '../../../API'; // APIから生成された型をインポート
import { UserSession } from '../utils/bingoTypes'; 

// 現在使用されていないため、削除
// type UserData = Pick<User, 'id' | 'displayName' | 'score' | 'currentCategoryId' | 'currentCategory'>;

const HomePage: React.FC = () => {
  // useStateの型をUserSession | nullに変更
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const [userScore, setUserScore] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const session: UserSession = await getUserSession();
        setUserSession(session);

        const userId = session.tokens?.idToken?.payload?.sub;
        if (userId) {
          const fetchedUserData = await getUserData(userId);
          if (fetchedUserData) {
            setUserScore(fetchedUserData.score || 0);
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
