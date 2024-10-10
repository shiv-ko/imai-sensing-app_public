// components/PostCompletionPage.tsx
import React from 'react';
import Link from 'next/link';

const PostCompletionPage: React.FC = () => {
  return (
    <div style={styles.container}>
      <h1>投稿が完了しました！</h1>
      <p>ご投稿ありがとうございます。</p>
      <Link href="/home">
        <button style={styles.button}>ホームに戻る</button>
      </Link>
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center' as const,
    padding: '50px',
  },
  button: {
    backgroundColor: '#81c784',
    color: 'white',
    border: 'none',
    padding: '15px 30px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    marginTop: '20px',
  },
};

export default PostCompletionPage;
