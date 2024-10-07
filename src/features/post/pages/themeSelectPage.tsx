// pages/themeSelectionPage.tsx
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import ThemeSelector from '../components/themeSelector';

const ThemeSelectPage: React.FC = () => {
  const router = useRouter();
  const [selectedTheme, setSelectedTheme] = useState('');

  const themes = [
    'Nature',
    'Technology',
    'Art',
    'Science',
    'History',
    'うんこ',
  ];

  const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTheme(event.target.value);
  };

  const handleNext = () => {
    if (selectedTheme) {
      // URLSearchParamsでクエリパラメータを構築
      const params = new URLSearchParams({ theme: selectedTheme });
      // クエリパラメータ付きでページ遷移
      router.push(`/camera/post?${params.toString()}`);
    } else {
      alert('テーマを選択してください');
    }
  };

  return (
    <div>
      <h1>テーマを選択してください</h1>
      <ThemeSelector
        themes={themes}
        selectedTheme={selectedTheme}
        onThemeChange={handleThemeChange}
      />
      <button onClick={handleNext}>次へ</button>
    </div>
  );
};

export default ThemeSelectPage;
