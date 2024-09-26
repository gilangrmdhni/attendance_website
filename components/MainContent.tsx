import { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';



const MainContent = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [daysInMonth, setDaysInMonth] = useState<(number | null)[]>([]);

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

    const monthNames = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    const daysOfWeek = ['MNG', 'SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB'];

    return (
        <section className="bg-white p-4 rounded-lg shadow-md mb-4">
            <div className="flex justify-between items-center mb-4">
                <button
                    onClick={handlePrevMonth}
                    className="flex items-center justify-center w-8 h-8 text-primary-blue rounded-full "
                    aria-label="Previous Month"
                >
                    <ChevronLeftIcon className="w-5 h-5" />
                </button>
                <h2 className="text-center text-lg">
                    {monthNames[currentMonth]} {currentYear}
                </h2>
                <button
                    onClick={handleNextMonth}
                    className="flex items-center justify-center w-8 h-8 text-primary-blue rounded-full "
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
    )
};

export default MainContent;
