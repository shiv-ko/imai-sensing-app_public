
'use client'
import { Authenticator } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import React, { useState, useEffect } from 'react';
import awsExports from './../../aws-exports';
import Header from '@/shared/components/header'; // Headerコンポーネントのインポート
import FooterNavBar from '@/shared/components/footer'; // FooterNavBarコンポーネントのインポート
import '@aws-amplify/ui-react/styles.css';
Amplify.configure({ ...awsExports });

const formFields = {
  signUp: {
    email: {
      label: 'メールアドレス',
      order: 2
    },
    password: {
      label: 'パスワード',
      order: 3
    }
  }
};


export default function App() {

  const [locationGranted, setLocationGranted] = useState(false);
  const [position, setPosition] = useState({ latitude: 0, longitude: 0 }); 
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // ページに入ったときに位置情報を取得
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationGranted(true); // 位置情報が取得できたらフラグをtrueに
        setPosition({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }); // 緯度と経度を保存

      },
      (error) => {
        console.error(error);
        setErrorMessage('位置情報が取得できません。ログインできません。');
        setLocationGranted(false); // 取得失敗した場合はfalse
      }
    );
  }, []);
  
  
  return (
    <div>
      {locationGranted ? (
        <>
        <Authenticator formFields={formFields} socialProviders={['amazon', 'apple', 'facebook', 'google']}>
          {({ signOut, user }) => (
            <main>
              <Header></Header>
              <h1>こんにちは、{user?.username} さん</h1>
              <button onClick={signOut}>サインアウト</button>
              <FooterNavBar></FooterNavBar>
            </main>
          )}
        </Authenticator>
        {/* 取得した位置情報を表示 */}
          <div>
            <h2>現在の位置情報</h2>
            <p>緯度: {position.latitude}</p>
            <p>経度: {position.longitude}</p>
          </div>
        </>
      ) : (
        <p>{errorMessage || '位置情報を確認中です。'}</p>
      )}

    </div>
  );
};