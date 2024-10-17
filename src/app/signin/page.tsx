'use client';
import { Authenticator } from '@aws-amplify/ui-react';
import { fetchUserAttributes} from 'aws-amplify/auth';
import { Amplify } from 'aws-amplify';
import React, { useState, useEffect } from 'react';
import awsExports from './../../aws-exports';
import '@aws-amplify/ui-react/styles.css';
import { useRouter } from 'next/navigation';

Amplify.configure({ ...awsExports });

const formFields = {
  signUp: {
    email: {
      label: 'メールアドレス',
      order: 2,
    },
    password: {
      label: 'パスワード',
      order: 3,
    },
  },
};

export default function App() {
  const [locationGranted, setLocationGranted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [buttonClicked, setButtonClicked] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const router = useRouter();

  useEffect(() => {
    // ページに入ったときに位置情報を取得
    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (position) {
          // 位置情報が取得できたらフラグをtrueに
          setLocationGranted(true);
          console.log(position);
        }
      },
      (error) => {
        console.error(error);
        setErrorMessage('位置情報が取得できません。ログインできません。');
        setLocationGranted(false); // 取得失敗した場合はfalse
      }
    );
  }, []);

  const handleButtonClick = async () => {
    try {
      const currentUser =await fetchUserAttributes();
      console.log(currentUser);
      const username = currentUser.nickname|| '' 
      setDisplayName(username);
      setButtonClicked(true);
      setTimeout(() => {
        router.push('/home');
      }, 2000); // 2秒後にリダイレクト
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={styles.container}>
      {locationGranted ? (
        <Authenticator formFields={formFields}>
          {() => (
            <div>
              {!buttonClicked ? (
                <button style={styles.button} onClick={handleButtonClick}>
                  今井町について知る
                </button>
              ) : (
                <div>
                  <h1>ようこそ、{displayName} さん</h1>
                </div>
              )}
            </div>
          )}
        </Authenticator>
      ) : (
        <p style={styles.errorMessage}>{errorMessage || '位置情報を確認中です。'}</p>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f4f4f4',
  },
  errorMessage: {
    color: 'red',
    fontSize: '1.2rem',
  },
  button: {
    padding: '0.5rem 1rem',
    backgroundColor: '#ff6f61',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    borderRadius: '4px',
    fontSize: '1rem',
  },
};