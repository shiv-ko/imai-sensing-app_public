// src/app/home/page.tsx
'use client';

import React from 'react';
import HomePage from '@/features/dashboard/pages/homePage';
import Header from '@/shared/components/header';
import FooterNavBar from '@/shared/components/footer';

const Home: React.FC = () => {
  return (
    <div>
      <Header />
      <HomePage />
      <FooterNavBar />
    </div>
  );
};

export default Home;
