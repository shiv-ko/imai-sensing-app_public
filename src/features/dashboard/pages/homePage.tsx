// src/features/dashboard/pages/homePage.tsx
'use client'; // クライアントコンポーネントとしてマーク

import React from "react";

import Header from '@/shared/components/header'; // Headerコンポーネントのインポート
import FooterNavBar from '@/shared/components/footer'; // FooterNavBarコンポーネントのインポート
import BingoGame from '@/features/dashboard/components/bingoGame'; // BingoGameコンポーネントのインポート

const HomePage: React.FC = () => {
  return (
    <div>
      <Header />
      <h1>ここでビンゴする。</h1>
      <BingoGame />  {/* ビンゴボードを表示 */}
      <FooterNavBar />
    </div>
  );
};

export default HomePage;
