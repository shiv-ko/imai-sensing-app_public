'use client'
import { useRouter } from 'next/navigation';
import { signOut } from 'aws-amplify/auth';

const Header = () => {
  const router = useRouter();

  return (
    <header style={styles.header}>
      <div style={styles.logo}>
        <img src="/logo.png" alt="Logo" style={styles.logoImage} />
        <h1 style={styles.title}>i-MYGO</h1>
      </div>
      <div style={styles.buttons}>
        {/* 利用規約ボタン */}
        <button
          style={styles.linkButton}
          onClick={() => {
            window.open('/運用ポリシー.pdf', '_blank');
          }}
        >
          利用規約
        </button>

        {/* 使い方ボタン */}
        <button
          style={styles.linkButton}
          onClick={() => {
            window.open('http://watery-literature-3ab.notion.site', '_blank'); // 外部リンクに遷移
          }}
        >
          使い方
        </button>

        {/* サインアウトボタン */}
        <button
          style={styles.button}
          onClick={() => {
            if (signOut && router) {
              signOut();
              router.push('/signin');
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
    fontSize: '1.3rem',
    color: '#333',
  },
  buttons: {
    display: 'flex',
    gap: '5px',
  },
  linkButton: {
    padding: '2px 4px', // 余白を小さくする
    fontSize: '0.8rem', // フォントサイズを小さくする
    backgroundColor: 'transparent',
    color: '#333',
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'underline',
    lineHeight: '1', // ボタン内のテキストの高さを調整
  },
  button: {
    padding: '3px',
    fontSize: '1rem',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default Header;
