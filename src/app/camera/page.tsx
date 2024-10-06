
'use client'
import React from 'react';
import PostPage from '../../features/post/pages/postPage'; // postPageコンポーネントのインポート
import { withAuthenticator } from '@aws-amplify/ui-react';
import Header from '@/shared/components/header'; // Headerコンポーネントのインポート
import FooterNavBar from '@/shared/components/footer'; // FooterNavBarコンポーネントのインポート

const PostFormPage: React.FC = () => {
  return (
    <div>
      <Header />
      <PostPage />
      <FooterNavBar />
    </div>
  );
};

export default withAuthenticator(PostFormPage);
