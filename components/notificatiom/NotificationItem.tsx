// components/NotificationsComponent.tsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications } from '../../store/slices/notificationSlice';
import { RootState, AppDispatch } from '../../store/store';

const NotificationsComponent: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const notifications = useSelector((state: RootState) => state.notifications.notifications);
    const status = useSelector((state: RootState) => state.notifications.status);
    const error = useSelector((state: RootState) => state.notifications.error);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchNotifications());
        }
    }, [status, dispatch]);

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    if (status === 'failed') {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <div className="space-y-4">
                {notifications.map(notification => (
                    <div key={notification.id} className="bg-white p-4 rounded-lg shadow-md">
                        <h2 className="text-lg font-semibold">{notification.title}</h2>
                        <p className="text-gray-600">{notification.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NotificationsComponent;
