import { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import router from 'next/router';
import axiosInstance from '../utils/axiosInstance'; // Import axiosInstance

const MainContent = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [daysInMonth, setDaysInMonth] = useState<(number | null)[]>([]);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [isLunchSubmitted, setIsLunchSubmitted] = useState(false);


    useEffect(() => {
        const date = new Date(currentYear, currentMonth);
        const days: (number | null)[] = [];
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const lastDate = new Date(currentYear, currentMonth + 1, 0).getDate();

        // Fill in the days of the week
        for (let i = 0; i < firstDay; i++) {
            days.push(null);
        }
        for (let i = 1; i <= lastDate; i++) {
            days.push(i);
        }

        setDaysInMonth(days);
    }, [currentMonth, currentYear]);

    const handlePrevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    useEffect(() => {
        const checkLunchStatus = async () => {
            try {
                const response = await axiosInstance.get('/lunch/history');
                if (response.status === 200 && response.data.body.length > 0) {
                    setIsLunchSubmitted(true); 
                }
            } catch (error) {
                console.error('Gagal memeriksa status lunch:', error);
            }
        };

        checkLunchStatus();
    }, []);


    const handleConfirm = async () => {
        try {
            const response = await axiosInstance.post('/lunch/checkin');
            if (response.status === 200) {
                setShowSuccess(true); // Show success popup
            } else {
                alert('Terjadi kesalahan, coba lagi.');
            }
        } catch (error) {
            alert('Terjadi kesalahan saat memanggil API');
        }
    };

    const monthNames = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    const daysOfWeek = ['MNG', 'SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB'];

    return (
        <>
            <section className="mb-4">
                <div className="relative w-full bg-[#E5EEF9] text-black p-4 rounded-lg shadow-md overflow-hidden">
                    {/* Title */}
                    <div className="relative z-10">
                        <h2 className="text-xl font-semibold text-[#0068BA]">List <br /> Makan Siang</h2>
                    </div>

                    {/* Decorative Image */}
                    <div className="absolute top-12 right-0 w-72 h-72 -m-28">
                        <img
                            src="/images/assetMakan.png"
                            alt="Decorative"
                            className="w-full h-full object-cover opacity-70"
                        />
                    </div>

                    {!isLunchSubmitted && (
                        <div className="relative z-10 mt-8 flex justify-center">
                            <button
                                className="bg-white text-primary-blue font-semibold py-2 px-12 rounded-lg"
                                onClick={() => setShowConfirmation(true)} 
                            >
                                Tambah
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* Popup Konfirmasi */}
            {showConfirmation && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-80 max-w-md text-center">
                        {/* Image above the text */}
                        <img
                            src="/icons/iconlerge.png" // Ganti dengan path gambar yang sesuai
                            alt="Makanan"
                            className="mx-auto w-16 h-16 mb-4" // Menyesuaikan ukuran gambar dan jarak dengan teks
                        />

                        <h3 className="text-lg font-semibold">Apakah kamu ingin memesan makan siang?</h3>
                        <p className="pt-2 text-gray-400 text-sm">Setelah kamu melanjutkan ini, kamu tidak bisa membatalkan pilihanmu.</p>

                        <div className="mt-6 flex flex-col space-y-2">
                            <button
                                className="bg-primary-blue text-white font-semibold py-2 px-6 rounded-lg"
                                onClick={() => {
                                    handleConfirm(); // Call API if confirmed
                                    setShowConfirmation(false); // Close confirmation popup
                                }}
                            >
                                Setuju
                            </button>
                            <button
                                className="bg-gray-200 text-black font-semibold py-2 px-6 rounded-lg"
                                onClick={() => setShowConfirmation(false)} // Close confirmation popup if not confirmed
                            >
                                Tidak
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Popup Sukses */}
            {showSuccess && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
                    <div className="bg-white rounded-lg shadow-lg w-80 max-w-md relative overflow-hidden">
                        {/* Tombol Close di Pojok Kanan Atas */}
                        <button
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                            onClick={() => setShowSuccess(false)} // Close popup
                        >
                            ✕
                        </button>

                        {/* Gambar */}
                        <img
                            src="/images/ornamen.png"
                            alt="Success Icon"
                            className="w-full h-auto object-cover"
                        />

                        {/* Konten */}
                        <div className="p-6 text-center">
                            <h2 className="text-lg font-semibold text-gray-700">Berhasil</h2>
                            <p className="text-gray-500">Makan siang berhasil ditambahkan</p>
                        </div>
                    </div>
                </div>
            )}

            <section className="bg-white p-4 rounded-lg shadow-md mb-4">
                <div className="flex justify-between items-center mb-4">
                    <button
                        onClick={handlePrevMonth}
                        className="flex items-center justify-center w-8 h-8 text-primary-blue rounded-full"
                        aria-label="Previous Month"
                    >
                        <ChevronLeftIcon className="w-5 h-5" />
                    </button>
                    <h2 className="text-center text-lg">
                        {monthNames[currentMonth]} {currentYear}
                    </h2>
                    <button
                        onClick={handleNextMonth}
                        className="flex items-center justify-center w-8 h-8 text-primary-blue rounded-full"
                        aria-label="Next Month"
                    >
                        <ChevronRightIcon className="w-5 h-5" />
                    </button>
                </div>
                <div className="grid grid-cols-7 gap-2 text-center">
                    {daysOfWeek.map((day, index) => (
                        <span key={index} className="text-xs">{day}</span>
                    ))}
                    {daysInMonth.map((day, index) => (
                        <span
                            key={index}
                            className={`p-2 text-sm ${day === new Date().getDate() && currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear() ? 'bg-blue-500 text-white rounded-full' : ''}`}
                        >
                            {day !== null ? day : ''}
                        </span>
                    ))}
                </div>
            </section>
        </>
    );
};

export default MainContent;
