import { useState, useEffect } from 'react';

const ScanHeader = () => {
    const [dateTime, setDateTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setDateTime(new Date());
        }, 1000);

        // Clean up interval on component unmount
        return () => clearInterval(interval);
    }, []);

    // Format date and time
    const formatDate = (date: Date) => {
        const options: Intl.DateTimeFormatOptions = {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        };
        return date.toLocaleDateString('id-ID', options);
    };

    const formatTime = (date: Date) => {
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const hour = hours % 12 || 12; // Convert 24-hour to 12-hour format

        return {
            time: `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
            period: ampm
        };
    };

    const { time, period } = formatTime(dateTime);

    return (
        <header className="bg-primary-blue text-white p-4 pb-20 relative bg-[url('/images/header.png')] bg-cover bg-center rounded-b-lg">
            <div className="flex flex-col items-start">
                <h1 className="text-xl font-semibold">Kehadiran</h1>
            </div>
            <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-[-70px] w-full max-w-xs">
                <div className="bg-white p-6 rounded-xl shadow-md mb-4 text-center">
                    <p className="text-gray-500">{formatDate(dateTime)}</p>
                    <div className="flex justify-center items-center text-2xl font-semibold my-2 text-black">
                        <span>{time}</span> <span className="text-sm ml-1">{period}</span>
                    </div>
                    <p className="text-gray-500">Waktu Indonesia Barat</p>
                </div>
            </div>
        </header>
    );
};

export default ScanHeader;
