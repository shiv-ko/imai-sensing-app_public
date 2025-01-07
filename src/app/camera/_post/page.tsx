
'use client'
import React from 'react';
import PostPage from '@/features/post/pages/postPage';
import Header from '@/shared/components/header'; // Headerコンポーネントのインポート
import FooterNavBar from '@/shared/components/footer'; // FooterNavBarコンポーネントのインポート


const PostFormPage: React.FC = () => {
  return (
    <div>
      <Header />
      <PostPage></PostPage>
      <FooterNavBar />
    </div>
  );
};

export default PostFormPage;
