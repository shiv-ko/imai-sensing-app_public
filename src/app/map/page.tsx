// PostMapPage.tsx
'use client';
import React from 'react';
import { withAuthenticator } from '@aws-amplify/ui-react';
// import PostMapPage from '@/features/map/pages/mapPage'; 
import Header from '@/shared/components/header'; // Headerコンポーネントのインポート
import FooterNavBar from '@/shared/components/footer'; // FooterNavBarコンポーネントのインポート

const MapPage: React.FC = () => {
  return (
    <div>
      <Header />

      <h1>ここはマップページです。</h1>
      <FooterNavBar />
    </div>
  );
};

export default withAuthenticator(MapPage);
