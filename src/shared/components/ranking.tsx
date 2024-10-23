'use client'
import React, { useEffect, useState } from 'react';
import { fetchUsersForRanking } from '../../hooks/useUsers';
import { getUserSession } from '@/features/dashboard/utils/awsService';
import { UserSession } from '@/features/dashboard/utils/bingoTypes';

interface User {
  id: string;
  displayName: string;
  score: number;
  createdAt: string;
  updatedAt: string;
  currentCategoryId?: string;
  owner?: string;
}

const UserRanking: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userSession, setUserSession] = useState<UserSession | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const session = await getUserSession();
        setUserSession(session);
        const usersData = await fetchUsersForRanking();
        setUsers(usersData);
      } catch (error) {
        console.error('データの読み込み中にエラーが発生しました:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return <p className="loading-message">ランキングを読み込んでいます...</p>;
  }

  return (
    <div className="ranking-container">
      <style>{`
        .ranking-container {
          width: 85vw;  /* 固定幅から85vwに戻す */
          height: auto;
          padding: 20px;
          background-color: white;
          margin: 20px auto;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        /* レスポンシブ対応 */
        @media (max-width: 840px) {
          .ranking-container {
            width: 95%;  /* 小さい画面では余白を残して表示 */
          }
        }

        .ranking-title {
          font-size: 1.25rem;
          font-weight: bold;
          margin-bottom: 1rem;
          text-align: center;
        }

        .ranking-list-container {
          width: 100%;
          overflow-y: auto;
          max-height: 300px;
        }

        .ranking-list {
          list-style: none;
          padding: 0;
          margin: 0;
          width: 100%;
        }

        .ranking-item {
          display: flex;
          justify-content: space-between;
          padding: 8px 16px;
          margin-bottom: 4px;
          border-radius: 6px;
        }

        .ranking-item:nth-child(odd) {
          background-color: #fef3c7;
        }

        .ranking-item:nth-child(even) {
          background-color: #fcd34d;
        }

        .user-info {
          display: flex;
          align-items: center;
          color: #374151;
        }

        .rank-number {
          font-weight: bold;
          font-size: 1.25rem;
          margin-right: 8px;
        }

        .user-name {
          display: flex;
          align-items: center;
        }

        .score {
          display: flex;
          align-items: center;
          color: #374151;
        }

        .loading-message {
          text-align: center;
          font-size: 1.125rem;
        }

        .medal-icon {
          width: 28px;
          height: 28px;
          margin-right: 8px;
        }

        .ranking-item.current-user .rank-number,
        .ranking-item.current-user .user-name,
        .ranking-item.current-user .score {
          color: #ff0000;
          font-weight: bold;
        }

        .current-user-fixed {
          position: sticky;
          bottom: 0;
          background-color: #f0f9ff;  /* 薄い青色の背景 */
          border-top: 2px solid #bae6fd;
          padding: 12px 16px;
          margin-top: 8px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .current-user-fixed .user-info,
        .current-user-fixed .score {
          color: #0369a1;  /* 青色のテキスト */
          font-weight: bold;
        }
      `}</style>
      <div className="ranking-title">ランキング</div>
      <div className="ranking-list-container">
        <ul className="ranking-list">
          {users.map((user, index) => (
            <li 
              key={user.id} 
              className={`ranking-item ${
                user.id === userSession?.tokens?.idToken?.payload?.sub ? 'current-user' : ''
              }`}
            >
              <span className="user-info">
                <svg
                  className="medal-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="2 2 20 22"
                >
                  <g
                    fill={
                      index + 1 === 1
                        ? "#E2A314"
                        : index + 1 === 2
                        ? "#827B7B"
                        : index + 1 === 3
                        ? "#D06110"
                        : "none"
                    }
                  >
                    <circle cx="12" cy="9" r="7" opacity=".5" />
                    <path d="m7.546 14.4l-.195.6l-.637 2.323c-.628 2.292-.942 3.438-.523 4.065c.147.22.344.396.573.513c.652.332 1.66-.193 3.675-1.243c.67-.35 1.006-.524 1.362-.562c.133-.014.265-.014.398 0c.356.038.691.212 1.362.562c2.015 1.05 3.023 1.575 3.675 1.243c.229-.117.426-.293.573-.513c.42-.627.105-1.773-.523-4.065L16.649 15l-.195-.6c-1.21 1-2.762 1.6-4.454 1.6c-1.692 0-3.244-.6-4.454-1.6Z" />
                  </g>
                </svg>
                <span className="rank-number">{index + 1}</span>
                <span className="user-name">{user.displayName}</span>
              </span>
              <span className="score">{user.score}pt</span>
            </li>
          ))}
        </ul>
        {userSession && (
          <div className="current-user-fixed">
            <span className="user-info">
              <span className="rank-number">
                {users.findIndex(u => u.id === userSession?.tokens?.idToken?.payload?.sub) + 1}
              </span>
              <span className="user-name">
                {users.find(u => u.id === userSession?.tokens?.idToken?.payload?.sub)?.displayName}
              </span>
            </span>
            <span className="score">
              {users.find(u => u.id === userSession?.tokens?.idToken?.payload?.sub)?.score}pt
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserRanking;
