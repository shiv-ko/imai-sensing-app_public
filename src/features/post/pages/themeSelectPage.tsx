// pages/themeSelectPage.tsx
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import ThemeSelector from '../components/themeSelector';
import { categoriesList } from '@/shared/utils/category/categoryList';

const ThemeSelectPage: React.FC = () => {
  const router = useRouter();
  const [selectedTheme, setSelectedTheme] = useState('');

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
    </div>
  );
};



// インラインスタイル
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    width: '100%',
    padding: '20px',
    backgroundColor: '#f5f5f5',
    position: 'fixed' as const,
    top: '60px',  // ヘッダーの高さ分を確保
    left: 0,
    height: 'calc(100vh - 120px)',  // ヘッダー(60px)とフッター(60px)の高さを引く
    zIndex: 1000,
    overflowY: 'auto' as const,  // コンテンツが長い場合にスクロール可能に
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
