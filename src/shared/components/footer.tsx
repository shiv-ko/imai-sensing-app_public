'use client'
import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AiOutlineHome, AiOutlineCamera } from 'react-icons/ai';
import { FiMap } from 'react-icons/fi';
import { BiTimeFive  } from 'react-icons/bi';

const FooterNavBar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const navigateTo = (path: string) => {
    router.push(path);
  };

  const navItemStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
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
      left: 0,
      right: 0,
      height: '70px', // フッターの高さを明示的に設定
      borderTop: '1px solid #ddd',
      zIndex: 1000, // 他の要素より前面に表示
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
        <BiTimeFive style={getIconStyle('/timeline')} />
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
