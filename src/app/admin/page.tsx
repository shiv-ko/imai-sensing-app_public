// pages/admin/index.tsx
import React from 'react';
import AdminPage from '@/features/admin/pages/adminPage';
import Header from '@/shared/components/header'; // Headerコンポーネントのインポート
import FooterNavBar from '@/shared/components/footer'; // FooterNavBarコンポーネントのインポート

const AdminWrapper: React.FC = () => {

    return (
        <>
            <Header></Header>
            <AdminPage />
            <FooterNavBar></FooterNavBar>
        </>  
    )
};

export default AdminWrapper;
