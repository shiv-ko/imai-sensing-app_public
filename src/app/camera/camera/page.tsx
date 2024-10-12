
'use client'
import React from 'react';
import { Suspense } from 'react';
import CameraPage from '@/features/post/pages/cameraPage';
import Header from '@/shared/components/header'; // Headerコンポーネントのインポート
import FooterNavBar from '@/shared/components/footer'; // FooterNavBarコンポーネントのインポート


const PostFormPage: React.FC = () => {
  return (
    <Suspense>
      <Header />
        <CameraPage></CameraPage>
      <FooterNavBar />
    </Suspense>
  );
};

export default PostFormPage;
