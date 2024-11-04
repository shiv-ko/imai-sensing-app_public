'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { handleFetchUserAttributes } from '@/shared/utils/auth/GetUserid';
import { adminUserIds } from '@/shared/utils/auth/adminUserId';
import { Amplify } from 'aws-amplify';
import ReportedDeletedPostsPage from '../../admin/pages/adminTimelinePage'
import awsExports from '../../../aws-exports';

Amplify.configure(awsExports);


const AdminPage: React.FC = () => {
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function checkAdminAccess() {
      const { userId } = await handleFetchUserAttributes();
      console.log(userId);
      if (userId && adminUserIds.includes(userId)) {
        setAuthorized(true);
      } else {
        setAuthorized(false);
        // アクセスが許可されていない場合、リダイレクトまたはエラーページへ
        router.replace('/admin/not-authorized');
      }
    }

    checkAdminAccess();
  }, [router]);

  if (authorized === null) {
    // 認証状態をチェック中
    return <p>認証情報を確認しています...</p>;
  }

  if (!authorized) {
    // アクセスが許可されていない場合、何も表示しない（リダイレクトされるため）
    return null;
  }

  return (
    <div>
      {/* 管理者向けのコンテンツ */}
      <ReportedDeletedPostsPage></ReportedDeletedPostsPage>
    </div>
  );
};

export default AdminPage;
