'use client'
import { useRouter } from 'next/navigation';
import { signOut } from 'aws-amplify/auth';


const Header = () => {
  const router = useRouter();


  // 説明ページにルーティング
  const handleGuide = () => {
    router.push('/guide'); // 使い方説明ページにリダイレクト
  };
  


  return (
  <header style={styles.header}>
    <div style={styles.logo}>
      <img src="/logo.png" alt="Logo" style={styles.logoImage} />
      <h1 style={styles.title}>i-MYGO</h1>
    </div>
    <div style={styles.buttons}>
      {/* 使い方ページに移動するボタン */}
      <button style={styles.button} onClick={handleGuide}>使い方</button>

      <button
        style={styles.button}
        onClick={() => {
          if (signOut && router) { // signOut と router が定義されているか確認
            signOut(); // サインアウト
            router.push('/signin'); // サインアウト後に /signin にリダイレクト
          }
        }}
      >
        サインアウト
      </button>
    </div>
  </header>
);

};

// CSS-in-JSスタイル
const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#fff',
    borderBottom: '1px solid #ccc',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
  },
  logoImage: {
    height: '40px',
    marginRight: '10px',
  },
  title: {
    fontSize: '1.5rem',
    color: '#333',
  },
  buttons: {
    display: 'flex',
    gap: '10px',
  },
  button: {
    padding: '10px',
    fontSize: '1rem',
    backgroundColor: '#006400', // 緑色のボタン
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default Header;