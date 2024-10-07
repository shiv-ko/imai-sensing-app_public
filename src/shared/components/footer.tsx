'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // useRouter の代わりに usePathname と useRouter をインポート
import { AiOutlineHome, AiOutlineCamera } from 'react-icons/ai';
import { FiMap } from 'react-icons/fi';
import { BiUser } from 'react-icons/bi';

const FooterNavBar: React.FC = () => {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter(); // ルーターの初期化

  // クライアントサイドでのみレンダリングする
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // サーバーサイドでは何もレンダリングしない
  }

  // ページ遷移のハンドラ
  const navigateTo = (path: string) => {
    router.push(path); // 指定されたパスにリダイレクト
  };

  const navItemStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    fontSize: '12px',
    color: '#555',
    cursor: 'pointer',
  };

  const iconStyle = {
    fontSize: '24px',
    marginBottom: '5px',
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      backgroundColor: '#f8f8f8',
      padding: '10px 0',
      position: 'fixed' as const,
      bottom: 0,
      width: '100%',
      borderTop: '1px solid #ddd',
    }}>
      <div style={navItemStyle} onClick={() => navigateTo('/home')}>
        <AiOutlineHome style={iconStyle} />
        <span>ホーム</span>
      </div>
      <div style={navItemStyle} onClick={() => navigateTo('/map')}>
        <FiMap style={iconStyle} />
        <span>マップ</span>
      </div>
      <div style={navItemStyle} onClick={() => navigateTo('/timeline')}>
        <BiUser style={iconStyle} />
        <span>タイムライン</span>
      </div>
      <div style={navItemStyle} onClick={() => navigateTo('/camera')}>
        <AiOutlineCamera style={iconStyle} />
        <span>カメラ</span>
      </div>
      
    </div>
  );
};

export default FooterNavBar;