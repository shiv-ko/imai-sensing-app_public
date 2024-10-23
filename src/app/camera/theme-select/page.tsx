
'use client'
import React from 'react';
import ThemeSelectPage from '@/features/post/pages/themeSelectPage';
import Header from '@/shared/components/header'; // Headerコンポーネントのインポート
import FooterNavBar from '@/shared/components/footer'; // FooterNavBarコンポーネントのインポート


const PostFormPage: React.FC = () => {
  return (
    <div>
      <Header />
        <ThemeSelectPage></ThemeSelectPage>
      <FooterNavBar />
    </div>
  );
};

export default PostFormPage;
