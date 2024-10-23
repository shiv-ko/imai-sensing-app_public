'use client';
import { Authenticator } from '@aws-amplify/ui-react';
import { fetchUserAttributes} from 'aws-amplify/auth';
import { Amplify } from 'aws-amplify';
import { I18n } from '@aws-amplify/core';
import React, { useState, useEffect } from 'react';
import awsExports from './../../aws-exports';
import '@aws-amplify/ui-react/styles.css';
import { useRouter } from 'next/navigation';
import { createUserIfNotExists } from '../../features/dashboard/utils/awsService'; // 適切なパスに変更してください
import { motion } from 'framer-motion';

Amplify.configure({ ...awsExports });

// I18nの設定
I18n.setLanguage('ja');
I18n.putVocabularies({
  ja: {
    'Sign In': 'サインイン',
    'Create Account': 'アカウント作成',
    'Sign Up': 'サインアップ',
    'Sign in': 'サインイン',
    'Forgot your password?': 'パスワードをお忘れですか？',
    'Reset Password': 'パスワードをリセット',
    'Enter your email': 'メールアドレスを入力してください',
    'Please confirm your Password': 'パスワードを確認してください',
    'Send code': 'コードを送信',
    'Confirm': '確認',
    'Back to Sign In': 'サインインに戻る',
    'Submit': '送信',
    'Confirm Sign Up': 'サインアップを確認',
    'Confirmation Code': '確認コード',
    'Resend Code': 'コードを再送信',
    'Create a new account': '新しいアカウントを作成',
    'Have an account? Sign in': 'アカウントをお持ちですか？サインイン',
    'No account? Create account': 'アカウントをお持ちでない方はこちら',
    'Forgot Password': 'パスワードをお忘れの方',
    'Reset your password': 'パスワードをリセット',
    'Enter your username': 'ユーザー名を入力してください',
    'Send Reset Link': 'リセッリンクを送信',
  }
});

const formFields = {
  signIn: {
    username: {
      label: 'メールアドレス',
      placeholder: 'メールアドレスを入力してください',
    },
    password: {
      label: 'パスワード',
      placeholder: 'パスワードを入力してください',
    },
  },
  signUp: {
    username: {
      label: 'ユーザー名',
      placeholder: 'ユーザー名を入力してください',
    },
    nickname: {
      label: 'ニックネーム',
      placeholder: 'ニックネームを入力してください',
    },
    email: {
      label: 'メールアドレス',
      placeholder: 'メールアドレスを入力してください',
    },
    password: {
      label: 'パスワード',
      placeholder: 'パスワードを入力してください',
    },
    confirm_password: {
      label: 'パスワード（確認）',
      placeholder: 'パスワードを再入力してください',
    },
  },
  forgetPassword: {
    username: {
      label: 'メールアドレス',
      placeholder: 'メールアドレスを入力してください',
    },
  },
  resetPassword: {
    password: {
      label: '新しいパスワード',
      placeholder: '新しいパスワードを入力してください',
    },
    confirm_password: {
      label: '新しいパスワード（確認）',
      placeholder: '新しいパスワードを再入力してください',
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
      const currentUser = await fetchUserAttributes();
      console.log(currentUser);
      const username = currentUser.nickname || '';
      setDisplayName(username);
      setButtonClicked(true);
      
      // ユーザーのデータを取得し、存在しない場合は新規作成する関数を呼び出す
      await createUserIfNotExists(currentUser.sub || ''); // currentUser.subがundefinedの場合は空文字を渡す

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
                <motion.button 
                  style={styles.button} 
                  onClick={handleButtonClick}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  今井町の魅力を探る
                </motion.button>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  style={styles.welcomeContainer}
                >
                  <motion.h1
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    style={styles.welcomeText}
                  >
                    ようこそ
                  </motion.h1>
                  <motion.h2
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    style={styles.displayName}
                  >
                    {displayName} さん
                  </motion.h2>
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    style={styles.separator}
                  />
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    style={styles.message}
                  >
                    今井町の歴史と文化をお楽しみください
                  </motion.p>
                </motion.div>
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
    backgroundColor: '#f8f9fa',
  },
  errorMessage: {
    color: 'red',
    fontSize: '1.2rem',
  },
  button: {
    padding: '15px 30px',
    fontSize: '1.2rem',
    color: '#ffffff',
    backgroundColor: '#1a1a1a',
    border: 'none',
    borderRadius: '50px',
    cursor: 'pointer',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
  },
  welcomeContainer: {
    backgroundColor: '#ffffff',
    padding: '3rem 4rem',
    borderRadius: '10px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    textAlign: 'center' as const,
    maxWidth: '500px',
    width: '90%',
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
  welcomeText: {
    fontSize: '2.5rem',
    color: '#1a1a1a',
    marginBottom: '0.5rem',
    fontWeight: '300',
  },
  displayName: {
    fontSize: '2rem',
    color: '#4a4a4a',
    fontWeight: '600',
    marginBottom: '1.5rem',
  },
  separator: {
    height: '2px',
    backgroundColor: '#e0e0e0',
    width: '50%',
    margin: '0 auto 1.5rem',
  },
  message: {
    fontSize: '1.2rem',
    color: '#666666',
    lineHeight: '1.6',
  },
};
