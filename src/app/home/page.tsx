'use client'
import React from "react";
import { withAuthenticator } from "@aws-amplify/ui-react";
import Header from '@/shared/components/header'; // Headerコンポーネントのインポート
import FooterNavBar from '@/shared/components/footer'; // FooterNavBarコンポーネントのインポート
const HomePage: React.FC = () => {
  return (
    <div>
        <Header></Header>
      <h1>ここでビンゴする。</h1>
      <FooterNavBar></FooterNavBar>
    </div>
  );
};

export default withAuthenticator(HomePage);
