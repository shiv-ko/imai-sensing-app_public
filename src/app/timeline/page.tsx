'use client'
import React from 'react';
import TimelinePage from '../../features/timeline/pages/timelinePage';
import Header from '@/shared/components/header'; // Headerコンポーネントのインポート
import FooterNavBar from '@/shared/components/footer'; // FooterNavBarコンポーネントのインポート

const TimelinePageComponent: React.FC = () => {
  return (
    <div>
      <Header />
      <TimelinePage />
      <FooterNavBar />
    </div>
  );
};

export default TimelinePageComponent;
