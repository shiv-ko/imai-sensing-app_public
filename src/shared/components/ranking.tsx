'use client'
import React, { useEffect, useState } from 'react';
import { fetchUsersForRanking } from '../../hooks/useUsers';

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

  useEffect(() => {
    async function loadUsers() {
      try {
        const usersData = await fetchUsersForRanking();
        setUsers(usersData);
      } catch (error) {
        console.error('ランキングデータの読み込み中にエラーが発生しました:', error);
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, []);

  if (loading) {
    return <p className="loading-message">ランキングを読み込んでいます...</p>;
  }

  return (
    <div className="container">
      <style>{`
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }

        .ranking-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 16px;
        }

        .ranking-table th,
        .ranking-table td {
          padding: 12px;
          text-align: center;
          border-bottom: 1px solid #ddd;
        }

        .ranking-table th {
          background-color: #4CAF50;
          color: white;
        }

        .ranking-table tr:hover {
          background-color: #f1f1f1;
        }

        .loading-message {
          text-align: center;
          font-size: 18px;
        }

        @media screen and (max-width: 600px) {
          .ranking-table {
            font-size: 14px;
          }

          .ranking-table th,
          .ranking-table td {
            padding: 8px;
          }
        }
      `}</style>
      <table className="ranking-table">
        <thead>
          <tr>
            <th>順位</th>
            <th>ユーザー名</th>
            <th>スコア</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.id}>
              <td>{index + 1}</td>
              <td>{user.displayName}</td>
              <td>{user.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserRanking;
