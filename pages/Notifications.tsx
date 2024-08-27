import React, { useEffect } from 'react';
import NotificationItem from '../components/notificatiom/NotificationItem';
import Footer from '../components/Footer';
import MobileContainer from '../components/MobileContainer';
import NotificationHeader from '@/components/notificatiom/NotificationHeader';

const NotificationsPage: React.FC = () => {

    return (
        <MobileContainer>
            <main>
                <NotificationHeader searchTerm={''} setSearchTerm={function (term: string): void {
                    throw new Error('Function not implemented.');
                }} filterCategory={null} setFilterCategory={function (category: string | null): void {
                    throw new Error('Function not implemented.');
                }} filterStatus={null} setFilterStatus={function (status: string | null): void {
                    throw new Error('Function not implemented.');
                }} filterStartDate={null} setFilterStartDate={function (date: string | null): void {
                    throw new Error('Function not implemented.');
                }} filterEndDate={null} setFilterEndDate={function (date: string | null): void {
                    throw new Error('Function not implemented.');
                }} />
                <div className="mb-20 p-4 ">
                    <NotificationItem />
                </div>
            </main>
            <Footer />
        </MobileContainer>
    );
};

export default NotificationsPage;
