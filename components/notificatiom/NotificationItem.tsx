// components/NotificationsComponent.tsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications } from '../../store/slices/notificationSlice';
import { RootState, AppDispatch } from '../../store/store';
import Image from 'next/image';


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
        <div className="space-y-4">
            {notifications.map(notification => (
                <div key={notification.id} className="bg-white p-4 rounded-lg shadow-md flex flex-col space-y-2">
                    {/* Status */}
                    <div className="flex items-center">
                        {/* Ikon status */}
                        <div className="mr-2">
                            {notification.status === 'approved' && (
                                <div className="bg-green-200 p-2 rounded-full">
                                    <Image src="/icons/clipboardTick.png" alt="Approved" width={20} height={20} />
                                </div>
                            )}
                            {notification.status === 'waiting' && (
                                <div className="bg-gray-200 p-2 rounded-full">
                                    <Image src="/icons/clipboardDefault.png" alt="Waiting" width={20} height={20} />
                                </div>
                            )}
                            {notification.status === 'rejected' && (
                                <div className="bg-red-200 p-2 rounded-full">
                                    <Image src="/icons/clipboardClose.png" alt="Rejected" width={20} height={20} />
                                </div>
                            )}
                            {!notification.status && (
                                <div className="bg-blue-200 p-2 rounded-full">
                                    <Image src="/icons/clipboardText.png" alt="Absensi" width={20} height={20} />
                                </div>
                            )}
                        </div>
                        <span className={`text-sm ${notification.status ? (notification.status === 'waiting' ? 'text-gray-500' : notification.status === 'approved' ? 'text-gray-500' : 'text-gray-500') : 'text-gray-500'}`}>
                            {notification.status || 'Absensi'}
                        </span>
                        <span className="text-gray-400 text-xs ml-auto">
                            {new Date(notification.created_at).toLocaleDateString('id-ID', {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric',
                            })}{' '}
                            {new Date(notification.created_at).toLocaleTimeString('id-ID')}
                        </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-lg font-semibold text-gray-800">
                        {notification.title}
                    </h2>

                    {/* Description */}
                    <p className="text-sm text-gray-600">
                        {notification.description}
                    </p>

                    {/* Dates or Check-in Time */}
                    {notification.dates && (
                        <p className="text-sm text-gray-500">
                            {new Date(notification.dates).toLocaleDateString('id-ID', {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric',
                            })}{' '}
                            {new Date(notification.dates).toLocaleTimeString('id-ID')}
                        </p>
                    )}

                    {notification.checkintime && (
                        <p className="text-sm text-gray-500">
                            Check-in Time: {new Date(notification.checkintime).toLocaleTimeString('id-ID')}
                        </p>
                    )}

                    {/* Footer Icon */}
                    <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-xs">Jenis: {notification.title}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default NotificationsComponent;
