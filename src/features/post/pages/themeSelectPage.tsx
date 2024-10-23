// pages/themeSelectPage.tsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ThemeSelector from '../components/themeSelector';
import { categoriesList } from '@/shared/utils/category/categoryList';
import { getUserSession, getUserData } from '@/features/dashboard/utils/awsService';
import { UserSession } from '@/features/dashboard/utils/bingoTypes';
import { Bingo } from '@/features/post/components/bingoShow';

const ThemeSelectPage: React.FC = () => {
  const router = useRouter();
  const [selectedTheme, setSelectedTheme] = useState('');
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const [userScore, setUserScore] = useState<number>(0);

  useEffect(() => {
    const fetchUserData = async (): Promise<void> => {
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
        console.error('データ取得エラー:', err);
      }
    };
    fetchUserData();
  }, []);

  const filteredThemes = categoriesList.filter((theme) => theme !== 'すべて');

  const handleThemeChange = (theme: string) => {
    setSelectedTheme(theme);
  };

  const handleNext = () => {
    if (selectedTheme) {
      const params = new URLSearchParams({ theme: selectedTheme });
      router.push(`/camera/camera?${params.toString()}`);
    } else {
      alert('テーマを選択してください');
    }
  };

  const userId = userSession?.tokens?.idToken?.payload?.sub;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>お題を選択してください</h1>
      <ThemeSelector
        themes={filteredThemes}
        selectedTheme={selectedTheme}
        onThemeChange={handleThemeChange}
      />
      <button style={styles.button} onClick={handleNext}>
        次へ
      </button>
      {userId && <Bingo userId={userId} initialScore={userScore} />}
    </div>
  );
};



// インラインスタイルの修正
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 'calc(100vh - 120px)',
    padding: '20px',
    backgroundColor: '#f5f5f5',
    position: 'fixed' as const,
    top: '60px',
    left: 0,
    right: 0,
    boxSizing: 'border-box' as const,
  },
  title: {
    fontSize: '24px',
    marginBottom: '20px',
  },
  button: {
    backgroundColor: '#81c784',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    fontSize: '18px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    marginTop: '20px', // テーマセレクターとボタンの間に余白を作成
  },
};

export default ThemeSelectPage;
