// src/features/dashboard/pages/homePage.tsx
'use client';
import React from "react";

import Header from '@/shared/components/header'; // Headerコンポーネントのインポート
import FooterNavBar from '@/shared/components/footer'; // FooterNavBarコンポーネントのインポート
import { Bingo } from '@/features/dashboard/components/bingo'; // Bingoコンポーネントのインポート

const HomePage: React.FC = () => {
  return (
    <div>
      <Header />
      <h1>ここでビンゴする。</h1>
      <Bingo />  {/* ビンゴボードを表示 */}
      <FooterNavBar />
    </div>
  );
};

export default HomePage;
