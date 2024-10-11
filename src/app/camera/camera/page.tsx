
'use client'
import React from 'react';
import CameraPage from '@/features/post/pages/cameraPage';
import Header from '@/shared/components/header'; // Headerコンポーネントのインポート
import FooterNavBar from '@/shared/components/footer'; // FooterNavBarコンポーネントのインポート


const PostFormPage: React.FC = () => {
  return (
    <div>
      <Header />
        <CameraPage></CameraPage>
      <FooterNavBar />
    </div>
  );
};

export default PostFormPage;
