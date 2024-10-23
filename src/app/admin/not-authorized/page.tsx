// pages/not-authorized.tsx
'use client'
import React from 'react';
import { useRouter } from 'next/navigation';

const NotAuthorizedPage: React.FC = () => {
  const router = useRouter();

  const handleGoHome = () => {
    router.push('/home'); // ホームページへ遷移
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>帰れ</h1>
      <p>このページを表示する権限がありません。</p>
      <button 
        onClick={handleGoHome} 
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          fontSize: '16px',
          cursor: 'pointer',
        }}
      >
        ホームに戻る
      </button>
    </div>
  );
};

export default NotAuthorizedPage;
