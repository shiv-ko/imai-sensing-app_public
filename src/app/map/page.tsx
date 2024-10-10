
'use client';
import React from 'react';
import PostMapPage from '@/features/map/pages/mapPage'; 
import Header from '@/shared/components/header'; // Headerコンポーネントのインポート
import FooterNavBar from '@/shared/components/footer'; // FooterNavBarコンポーネントのインポート

const MapPage: React.FC = () => {
  return (
    <div>
      <Header />
      <PostMapPage></PostMapPage>
      
      <FooterNavBar />
    </div>
  );
};

export default MapPage;
