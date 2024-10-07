
'use client'
import React from 'react';
import Header from '@/shared/components/header'; // Headerコンポーネントのインポート
import FooterNavBar from '@/shared/components/footer'; // FooterNavBarコンポーネントのインポート
import ThemeSelectPage from '@/features/post/pages/themeSelectPage';

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
