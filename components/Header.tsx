import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import axiosInstance from '../utils/axiosInstance';
import Snackbar from './Snackbar';
import { ClockIcon } from '@heroicons/react/24/solid';
import { fetchUser } from '../store/slices/userSlice';
import { useRouter } from 'next/router';

const Header = () => {
    const [checkinAt, setCheckinAt] = useState<string | null>(null);
    const [checkoutAt, setCheckoutAt] = useState<string | null>(null);
    const [elapsedTime, setElapsedTime] = useState<number>(0);
    const [checkinType, setCheckinType] = useState<'WFO' | 'WFA/WFH'>('WFO');
    const [checkoutLatitude, setCheckoutLatitude] = useState<number | null>(null);
    const [checkoutLongitude, setCheckoutLongitude] = useState<number | null>(null);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarType, setSnackbarType] = useState<'success' | 'error' | 'warning'>('success');
    const [warningMessage, setWarningMessage] = useState<string | null>(null);
    const [buttonDisabled, setButtonDisabled] = useState<boolean>(true);
    const [checkoutSuccessful, setCheckoutSuccessful] = useState<boolean>(false);
    const { user, loading } = useSelector((state: RootState) => state.user);
    const { token } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch<AppDispatch>();
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [confirmCheckout, setConfirmCheckout] = useState(false);
    const router = useRouter();
    const [greeting, setGreeting] = useState('');
    const [showMessageInput, setShowMessageInput] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');


    const fetchTimer = async () => {
        try {
            const response = await axiosInstance.get('/attendance/timer');
            console.log("API Response:", response.data); // Debugging response

            if (response.data && response.data.body) {
                const { checkin, checkout } = response.data.body;

                console.log("Checkin At from API:", checkin?.checkin_at);

                if (checkin?.checkin_at) {
                    setCheckinAt(checkin.checkin_at);
                    setCheckinType(checkin.checkin_type === 'work from office' ? 'WFO' : 'WFA/WFH');
                    setButtonDisabled(checkout ? true : false);
                } else {
                    setCheckinAt(null);
                    setButtonDisabled(true);
                }

                if (checkout) {
                    setCheckoutAt(checkout);
                    setButtonDisabled(true);
                } else {
                    setCheckoutAt(null);
                    setButtonDisabled(false);
                }
            } else {
                console.error("No data body found in response.");
                setCheckinAt(null);
                setCheckoutAt(null);
                setButtonDisabled(true); // Ensure button is disabled if no data
            }
        } catch (error) {
            console.error("Error fetching timer:", error);
            setCheckinAt(null);
            setCheckoutAt(null);
            setButtonDisabled(true); // Ensure button is disabled on error
        }
    };

    const updateGreeting = () => {
        const currentHour = new Date().getHours();
        let newGreeting = 'Selamat Pagi 🙌'; // Default greeting

        if (currentHour >= 10 && currentHour < 14) {
            newGreeting = 'Selamat Siang 🌞';
        } else if (currentHour >= 14) {
            newGreeting = 'Selamat Sore 🌙';
        }

        setGreeting(newGreeting);
    };

    useEffect(() => {
        updateGreeting(); // Set initial greeting
        const interval = setInterval(updateGreeting, 60000); // Update every minute

        return () => clearInterval(interval); // Cleanup interval on unmount
    }, []);


    useEffect(() => {
        fetchTimer();
    }, []);

    useEffect(() => {
        if (token) {
            dispatch(fetchUser());
        }
    }, [dispatch, token]);


    useEffect(() => {
        let interval: NodeJS.Timeout | undefined;

        if (checkinAt && !checkoutAt && !checkoutSuccessful) {
            const checkinDate = new Date(checkinAt);

            if (isNaN(checkinDate.getTime())) {
                console.error("Invalid Checkin Date:", checkinDate);
                return;
            }

            interval = setInterval(() => {
                const now = new Date();
                const diff = now.getTime() - checkinDate.getTime();
                setElapsedTime(Math.floor(diff / 1000));
            }, 1000);
        }

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [checkinAt, checkoutAt, checkoutSuccessful]);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCheckoutLatitude(position.coords.latitude);
                    setCheckoutLongitude(position.coords.longitude);
                },
                (error) => {
                    console.error("Error getting location:", error);
                    setSnackbarMessage("Error getting location.");
                    setSnackbarType('error');
                    setSnackbarVisible(true);
                }
            );
        } else {
            setSnackbarMessage("Geolocation is not supported by this browser.");
            setSnackbarType('error');
            setSnackbarVisible(true);
        }
    }, []);

    useEffect(() => {
        console.log("Checkin At:", checkinAt);
        console.log("Elapsed Time:", elapsedTime);
    }, [checkinAt, elapsedTime]);

    const formatTime = (seconds: number) => {
        if (isNaN(seconds) || seconds < 0) {
            console.error("Invalid seconds value:", seconds);
            return "00:00:00";
        }

        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;

        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    const handleMessageChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setMessage(event.target.value);
    };

    const handleCheckout = async () => {
        if (checkoutLatitude === null || checkoutLongitude === null) {
            showSnackbar("Lokasi checkout tidak tersedia.", 'error');
            return;
        }

        const workHours = 8 * 3600; // 8 jam dalam detik
        if (elapsedTime < workHours && !confirmCheckout) {
            setShowConfirmDialog(true);
            setShowMessageInput(true);
            return;
        }

        const checkoutAt = new Date().toISOString();

        try {
            await handleCheckoutAPI(checkoutAt, message, checkinType);
            showSnackbar("Checkout berhasil!", 'success');
            setCheckoutSuccessful(true);
            setButtonDisabled(true);
            resetCheckoutStates();
        } catch (error) {
            console.error("Kesalahan saat checkout:", error);
            showSnackbar("Kesalahan saat checkout. Silakan coba lagi.", 'error');
        }
    };

    const showSnackbar = (message: string, type: 'success' | 'error' | 'warning') => {
        setSnackbarMessage(message);
        setSnackbarType(type);
        setSnackbarVisible(true);
    };

    const resetCheckoutStates = () => {
        setElapsedTime(0);
        setCheckinAt(null);
        setCheckoutAt(null);
    };

    const handleCheckoutAPI = async (checkoutAt: string, message: string, type: 'WFO' | 'WFA/WFH') => {
        const endpoint = type === 'WFO' ? '/attendance/wfo/out' : '/attendance/wfa/out';
        const payload = {
            checkout_at: checkoutAt,
            message: message,
            elapsed_time: elapsedTime,
            checkout_latitude: checkoutLatitude,
            checkout_longitude: checkoutLongitude,
        };

        await axiosInstance.put(endpoint, payload);
    };




    const allowedPositions = [
        "Vice President Delivery And Operation",
        "Vice President of Business Research & Development",
        "Vice President of HRGA",
        "Vice President of Finance & Tax",
        "General Manager",
        "Manager",
        "Finance Supervisor",
        "Officer"
    ];

    const handleIconClick = () => {
        router.push('/approval'); // Navigate to the ApprovalRequests page
    };

    return (
        <>
            <Snackbar
                message={warningMessage || snackbarMessage}
                type={warningMessage ? 'warning' : snackbarType}
                visible={snackbarVisible}
                onClose={() => setSnackbarVisible(false)}
            />

            <header className="bg-primary-blue text-white p-8 pb-20 relative bg-[url('/images/header.png')] bg-cover bg-center rounded-b-xl">
                <div className="flex justify-between items-center">
                    {/* Left Column */}
                    <div className="flex flex-col items-start">
                        <h1 className="text-xl font-semibold">{greeting}</h1>
                        <p className="text-lg font-semibold">
                            {token ? user?.full_name : 'Silahkan login'}
                        </p>
                    </div>

                    {/* Right Column */}
                    <div className="flex items-center space-x-2">
                        {user?.position && allowedPositions.includes(String(user.position)) && (
                            <img src="/icons/manager.png" alt="User Icon" className="w-6 h-6" onClick={handleIconClick} />
                        )}
                        <img
                            src="/icons/notification.png"
                            alt="Notification Icon"
                            className="w-6 h-6 cursor-pointer"
                            onClick={() => router.push('/Notifications')}
                        />
                    </div>
                </div>

                <div className="absolute justify-center right-4 top-full mt-[-70px] w-full max-w-[350px]">
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
                            <span className='text-gray-400'>Waktu jam kerja</span>
                        </div>
                        <button
                            className={`${buttonDisabled
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-primary-blue'
                                } text-white font-semibold py-2 px-4 rounded-lg mt-4 w-full`}
                            onClick={handleCheckout}
                            disabled={buttonDisabled}
                        >
                            {checkoutSuccessful ? 'Sudah Absen Keluar' : 'Absen Keluar'}
                        </button>
                    </div>
                </div>
            </header>

            {showConfirmDialog && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-8 max-w-lg mx-auto">
                        <p className="text-lg font-semibold mb-4">Peringatan</p>
                        <p className="text-gray-600 mb-6">
                            Anda belum menyelesaikan waktu kerja 8 jam. Apakah Anda yakin ingin checkout?
                        </p>
                        {/* Tambahkan logika untuk menampilkan input alasan */}
                        {showMessageInput && (
                            <div className="mb-4">
                                <textarea
                                    value={message}
                                    onChange={handleMessageChange}
                                    className="mt-1 p-2 border border-gray-300 rounded w-full"
                                    placeholder="Masukkan alasan"
                                    rows={4}
                                />
                            </div>
                        )}
                        <div className="flex justify-end">
                            <button
                                className="bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg mr-2"
                                onClick={() => {
                                    setShowConfirmDialog(false);
                                    setShowMessageInput(false); // Menyembunyikan input alasan saat batal
                                }}
                            >
                                Batalkan
                            </button>
                            <button
                                className="bg-primary-blue text-white font-semibold py-2 px-4 rounded-lg"
                                onClick={() => {
                                    setConfirmCheckout(true);
                                    setShowConfirmDialog(false);
                                    handleCheckout();
                                }}
                            >
                                Absen Keluar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Header;
