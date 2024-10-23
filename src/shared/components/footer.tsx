'use client'
import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AiOutlineHome, AiOutlineCamera } from 'react-icons/ai';
import { FiMap } from 'react-icons/fi';
import { BiUser } from 'react-icons/bi';

const FooterNavBar: React.FC = () => {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

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
    justifyContent: 'center',
    fontSize: '12px',
    color: '#555',
    cursor: 'pointer',
    width: '25%',
    height: '60px',
    borderRadius: '8px',
  };

  const iconStyle = {
    fontSize: '24px',
    marginBottom: '5px',
  };

  const getNavItemStyle = (path: string) => {
    const isActive = pathname === path;
    return {
      ...navItemStyle,
      backgroundColor: isActive ? '#006400' : 'transparent',
      color: isActive ? '#fff' : '#555',
    };
  };

  const getIconStyle = (path: string) => {
    const isActive = pathname === path;
    return {
      ...iconStyle,
      color: isActive ? '#fff' : '#555',
    };
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      backgroundColor: '#f8f8f8',
      padding: '5px 0',
      position: 'fixed' as const,
      bottom: 0,
      width: '100%',
      borderTop: '1px solid #ddd',
    }}>
      <div style={getNavItemStyle('/home')} onClick={() => navigateTo('/home')}>
        <AiOutlineHome style={getIconStyle('/home')} />
        <span>ホーム</span>
      </div>
      <div style={getNavItemStyle('/map')} onClick={() => navigateTo('/map')}>
        <FiMap style={getIconStyle('/map')} />
        <span>マップ</span>
      </div>
      <div style={getNavItemStyle('/timeline')} onClick={() => navigateTo('/timeline')}>
        <BiUser style={getIconStyle('/timeline')} />
        <span>タイムライン</span>
      </div>
      <div style={getNavItemStyle('/camera')} onClick={() => navigateTo('/camera')}>
        <AiOutlineCamera style={getIconStyle('/camera')} />
        <span>カメラ</span>
      </div>
    </div>
  );
};

export default FooterNavBar;
