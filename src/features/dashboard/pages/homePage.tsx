'use client';

import React, { useEffect, useState } from "react";
import { fetchAuthSession } from 'aws-amplify/auth';
import { generateClient } from 'aws-amplify/api';
import { getUser } from '../../../graphql/queries';  // GraphQL クエリをインポート
import Header from '@/shared/components/header';
import FooterNavBar from '@/shared/components/footer';
import { Bingo } from '@/features/dashboard/components/bingo';

type UserSessionType = Awaited<ReturnType<typeof fetchAuthSession>>;

const client = generateClient();

const HomePage: React.FC = () => {
  const [userSession, setUserSession] = useState<UserSessionType | null>(null);
  const [userScore, setUserScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const session = await fetchAuthSession();
        setUserSession(session);

        const userId = session.tokens?.idToken?.payload?.sub;
        if (userId) {
          // ユーザーのスコアを取得
          const userData = await client.graphql({
            query: getUser,
            variables: { id: userId }
          });
          const userScore = userData.data.getUser?.score || 0;
          setUserScore(userScore);
        }
      } catch (err) {
        console.error("データ取得エラー", err);
        setError("認証エラーが発生しました。");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const userId = userSession?.tokens?.idToken?.payload?.sub;
  const nickname = userSession?.tokens?.idToken?.payload?.nickname;
  const displayName = typeof nickname === "string" ? nickname : "ユーザー";

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
        <Bingo userId={userId} initialScore={userScore} />
      ) : (
        <p>ユーザーIDを取得できませんでした。</p>
      )}
      <FooterNavBar />
    </div>
  );
};

export default HomePage;