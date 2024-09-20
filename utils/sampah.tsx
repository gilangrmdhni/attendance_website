import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { fetchTimer, setElapsedTime, fetchCheckinStatus } from '../store/slices/attendanceSlice';
import { checkoutWFO, checkoutWFAWFH } from '../store/slices/checkoutSlice';
import { ClockIcon } from '@heroicons/react/24/outline';
import { fetchUser } from '../store/slices/userSlice';

const Header = () => {
    const dispatch: AppDispatch = useDispatch();
    const checkinAt = useSelector((state: RootState) => state.attendance.checkinAt);
    const elapsedTime = useSelector((state: RootState) => state.attendance.elapsedTime);
    const isWFO = useSelector((state: RootState) => state.attendance.isWFO);
    const checkoutStatus = useSelector((state: RootState) => state.checkout.status);
    const user = useSelector((state: RootState) => state.user.user); 
    const token = useSelector((state: RootState) => state.auth.token); 

    useEffect(() => {
        if (token) {
            dispatch(fetchUser());
        }
    }, [dispatch, token]);

    useEffect(() => {
        dispatch(fetchTimer());
        dispatch(fetchCheckinStatus());
    }, [dispatch]);

    useEffect(() => {
        if (checkinAt) {
            const checkinDate = new Date(checkinAt);

            const interval = setInterval(() => {
                const now = new Date();
                const diff = now.getTime() - checkinDate.getTime();
                dispatch(setElapsedTime(Math.floor(diff / 1000)));
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [checkinAt, dispatch]);

    const handleCheckout = () => {
        if (checkinAt) {
            const payload = {
                checkout_at: new Date().toISOString(),
                message: "Saya Pamit",
                elapsed_time: elapsedTime
            };
            if (isWFO) {
                dispatch(checkoutWFO(payload));
            } else {
                dispatch(checkoutWFAWFH(payload));
            }
        }
    };

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    return (
        <header className="bg-primary-blue text-white p-8 pb-20 relative rounded-b-lg">
            <div className="flex flex-col items-start">
                <h1 className="text-xl font-semibold">Good Morning 🙌</h1>
                <p className="text-lg font-medium">{token ? user?.full_name : 'Silahkan login'}</p>
            </div>
            <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-[-70px] w-full max-w-80">
                <div className="bg-white text-black p-4 rounded-lg shadow-md text-center">
                    <p className="text-md text-gray-600 mb-2">
                        {new Date().toLocaleDateString('id-ID', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                        })}
                    </p>
                    <div className="flex justify-center items-center space-x-1 mb-2">
                        {checkinAt ? (
                            <div className="flex space-x-1">
                                {formatTime(elapsedTime).split(':').map((part, index) => (
                                    <React.Fragment key={index}>
                                        <span className="bg-gray-100 px-2 py-1 rounded-md">{part}</span>
                                        {index < 2 && <span className="px-2 py-1 rounded-md">:</span>}
                                    </React.Fragment>
                                ))}
                            </div>
                        ) : (
                            <div className="flex space-x-1">
                                <span className="bg-gray-100 px-2 py-1 rounded-md">00</span>
                                <span>:</span>
                                <span className="bg-gray-100 px-2 py-1 rounded-md">00</span>
                                <span>:</span>
                                <span className="bg-gray-100 px-2 py-1 rounded-md">00</span>
                            </div>
                        )}
                    </div>
                    <div className="flex justify-center items-center space-x-1 text-gray-400 text-sm">
                        <div className="flex justify-center items-center space-x-1 text-gray-400 text-sm">
                            <ClockIcon className="w-4 h-4" />
                        </div>
                        <span className='text-gray-400'>Work hour time</span>
                    </div>
                    <button
                        onClick={handleCheckout}
                        disabled={!checkinAt || checkoutStatus === 'loading'}
                        className={`mt-4 px-4 py-2 rounded-lg ${checkinAt ? (checkoutStatus === 'loading' ? 'bg-gray-400 text-gray-600 cursor-not-allowed' : 'bg-blue-600 text-white') : 'bg-gray-400 text-gray-600 cursor-not-allowed'}`}
                    >
                        {checkinAt ? (checkoutStatus === 'loading' ? 'Processing...' : 'Checkout') : 'Check-in dulu'}
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
