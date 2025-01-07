
'use client'
import React from 'react';
import { Suspense } from 'react';

import ThemeSelectPage from '@/features/post/pages/themeSelectPage'
import Header from '@/shared/components/header'; // Headerコンポーネントのインポート
import FooterNavBar from '@/shared/components/footer'; // FooterNavBarコンポーネントのインポート


const PostFormPage: React.FC = () => {
  return (
    <Suspense>
      <Header />
        <ThemeSelectPage></ThemeSelectPage>
      <FooterNavBar />
    </Suspense>
  );
};

export default PostFormPage;
