'use client'
import React from 'react';
import Header from '@/shared/components/header';
import FooterNavBar from '@/shared/components/footer';
import ThemeSelectPage from '@/features/post/pages/themeSelectPage';

const PostFormPage: React.FC = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      position: 'relative',
      backgroundColor: '#F5F5F5',
    }}>
      <Header />
      <main style={{
        flex: 1,
        marginTop: '60px',
        marginBottom: '60px',
      }}>
        <ThemeSelectPage />
      </main>
      <FooterNavBar />
    </div>
  );
};

export default PostFormPage;
