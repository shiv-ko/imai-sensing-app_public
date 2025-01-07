// pages/themeSelectPage.tsx
import React from 'react';


const ThemeSelectPage: React.FC = () => {



  return (
    <div style={styles.container}>
      <h1 style={styles.title}>データ収集期間は終了しました。</h1>
      
      
    </div>
  );
};

// インラインスタイルの修正
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    padding: '20px',
    backgroundColor: '#f5f5f5',
    boxSizing: 'border-box' as const,
  },
  title: {
    fontSize: '24px',
    marginBottom: '20px',
  },
  button: {
    backgroundColor: '#81c784',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    fontSize: '18px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    marginTop: '20px', // テーマセレクターとボタンの間に余白を作成
  },
  warning: {
    marginBottom: '10px',
    padding: '5px',
    backgroundColor: '#ffe4e1',
    border: '1px solid #ff0000',
    color: '#ff0000',
    fontWeight: 'bold',
    borderRadius: '3px',
    textAlign: 'center' as const,
  },
};

export default ThemeSelectPage;
