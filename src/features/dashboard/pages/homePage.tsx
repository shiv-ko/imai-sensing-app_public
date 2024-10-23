// src/pages/homePage.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { Bingo } from '@/features/dashboard/components/bingoUI';
import { getUserSession, getUserData } from '@/features/dashboard/utils/awsService';
import { UserSession } from '../utils/bingoTypes'; 

const HomePage: React.FC = () => {
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

  if (loading) {
    return <div>読み込み中...</div>;
  }

  if (error) {
    return <div>エラー: {error}</div>;
  }

  return (
    <div>
      {userId ? (
        <Bingo userId={userId} initialScore={userScore} />
      ) : (
        <p>ユーザーIDを取得できませんでした。</p>
      )}
    </div>
  );
};

export default HomePage;
