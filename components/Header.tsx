import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import axiosInstance from '../utils/axiosInstance';
import Snackbar from './Snackbar';
import { fetchUser } from '@/store/slices/userSlice';
import { ClockIcon } from '@heroicons/react/24/solid';

const Header = () => {
    const [checkinAt, setCheckinAt] = useState<string | null>(null);
    const [elapsedTime, setElapsedTime] = useState<number>(0);
    const [checkinType, setCheckinType] = useState<'WFO' | 'WFA/WFH'>('WFO');
    const [checkoutLatitude, setCheckoutLatitude] = useState<number | null>(null);
    const [checkoutLongitude, setCheckoutLongitude] = useState<number | null>(null);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarType, setSnackbarType] = useState<'success' | 'error' | 'warning'>('success');
    const [warningMessage, setWarningMessage] = useState<string | null>(null);
    const [buttonDisabled, setButtonDisabled] = useState<boolean>(true); // State to manage button disabling
    const [checkoutSuccessful, setCheckoutSuccessful] = useState<boolean>(false); // State to manage checkout success
    const { user, loading } = useSelector((state: RootState) => state.user);
    const { token } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        const fetchTimer = async () => {
            try {
                const response = await axiosInstance.get('/attendance/timer');
                const { checkin_at, checkin_type } = response.data.body;
                setCheckinAt(checkin_at);
                setCheckinType(checkin_type === 'work from office' ? 'WFO' : 'WFA/WFH');

                // Load from localStorage
                const storedCheckoutSuccessful = localStorage.getItem('checkoutSuccessful') === 'true';
                setCheckoutSuccessful(storedCheckoutSuccessful);

                if (!storedCheckoutSuccessful) {
                    setButtonDisabled(false); // Enable button after check-in
                }
            } catch (error) {
                console.error("Error fetching timer:", error);
            }
        };

        fetchTimer();
    }, []);

    useEffect(() => {
        if (token) {
            dispatch(fetchUser());
        }
    }, [dispatch, token]);

    useEffect(() => {
        let interval: NodeJS.Timeout | undefined;

        if (checkinAt && !checkoutSuccessful) {
            const checkinDate = new Date(checkinAt);

            interval = setInterval(() => {
                const now = new Date();
                const diff = now.getTime() - checkinDate.getTime();
                setElapsedTime(Math.floor(diff / 1000));
            }, 1000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [checkinAt, checkoutSuccessful]); // Stop timer if checkout is successful

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCheckoutLatitude(position.coords.latitude);
                    setCheckoutLongitude(position.coords.longitude);
                },
                (error) => {
                    console.error("Error getting location:", error);
                }
            );
        }
    }, []);

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    const handleCheckout = async () => {
        if (checkoutLatitude === null || checkoutLongitude === null) {
            setSnackbarMessage("Checkout location is not available.");
            setSnackbarType('error');
            setSnackbarVisible(true);
            return;
        }

        const workHours = 8 * 3600; // 8 jam dalam detik
        if (elapsedTime < workHours) {
            setWarningMessage("Anda belum mencapai 8 jam kerja. Checkout mungkin akan mempengaruhi laporan Anda.");
        } else {
            setWarningMessage(null);
        }

        const checkoutAt = new Date().toISOString();
        const message = "Saya Pamit";

        try {
            if (checkinType === 'WFO') {
                await checkoutWFO(checkoutAt, message);
            } else {
                await checkoutWFAWFH(checkoutAt, message);
            }
            setSnackbarMessage("Checkout successful!");
            setSnackbarType('success');
            setSnackbarVisible(true);
            setCheckoutSuccessful(true); // Set checkout successful state
            setButtonDisabled(true); // Disable button after checkout
            setElapsedTime(0); // Reset timer to zero
            setCheckinAt(null); // Clear check-in time

            // Save to localStorage
            localStorage.setItem('checkoutSuccessful', 'true');
            localStorage.removeItem('checkinAt');
        } catch (error) {
            console.error("Error during checkout:", error);
            setSnackbarMessage("Error during checkout. Please try again.");
            setSnackbarType('error');
            setSnackbarVisible(true);
        }
    };

    const checkoutWFO = async (checkoutAt: string, message: string) => {
        try {
            const payload = {
                checkout_at: checkoutAt,
                message: message,
                elapsed_time: elapsedTime,
                checkout_latitude: checkoutLatitude,
                checkout_longitude: checkoutLongitude,
            };

            await axiosInstance.put('/attendance/wfo/out', payload);
        } catch (error) {
            console.error("Error during WFO checkout:", error);
            throw error;
        }
    };

    const checkoutWFAWFH = async (checkoutAt: string, message: string) => {
        try {
            const payload = {
                checkout_at: checkoutAt,
                message: message,
                elapsed_time: elapsedTime,
                checkout_latitude: checkoutLatitude,
                checkout_longitude: checkoutLongitude,
            };

            await axiosInstance.put('/attendance/wfa/out', payload);
        } catch (error) {
            console.error("Error during WFA/WFH checkout:", error);
            throw error;
        }
    };

    return (
        <>
            {/* Snackbar */}
            <Snackbar
                message={warningMessage || snackbarMessage}
                type={warningMessage ? 'warning' : snackbarType}
                visible={snackbarVisible}
                onClose={() => setSnackbarVisible(false)}
            />

            <header className="bg-primary-blue text-white p-8 pb-20 relative rounded-b-lg">
                <div className="flex flex-col items-start">
                    <h1 className="text-xl font-semibold">Good Morning 🙌</h1>
                    <p className="text-lg font-semibold">
                        {token ? user?.full_name : 'Silahkan login'}
                    </p>
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
                            <ClockIcon className="w-4 h-4" />
                            <span className='text-gray-400'>Work hour time</span>
                        </div>
                        <button
                            onClick={checkinAt && !checkoutSuccessful ? () => handleCheckout() : undefined}
                            disabled={!checkinAt || checkoutSuccessful}
                            className={`mt-4 px-4 py-2 rounded-lg ${checkinAt && !checkoutSuccessful ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                        >
                            Checkout
                        </button>
                    </div>
                </div>
            </header>
        </>
    );
};

export default Header;
