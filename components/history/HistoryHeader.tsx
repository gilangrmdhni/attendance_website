import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { useState, useEffect, useRef } from 'react';

interface HistoryHeaderProps {
    activeTab: 'Attendance' | 'Time Off';
    setActiveTab: (tab: 'Attendance' | 'Time Off') => void;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    filterCategory: string | null;
    setFilterCategory: (category: string | null) => void;
    filterStatus: string | null;
    setFilterStatus: (status: string | null) => void;
    filterStartDate: string | null;
    setFilterStartDate: (date: string | null) => void;
    filterEndDate: string | null;
    setFilterEndDate: (date: string | null) => void;
}

const HistoryHeader = ({
    activeTab,
    setActiveTab,
    searchTerm,
    setSearchTerm,
    filterCategory,
    setFilterCategory,
    filterStatus,
    setFilterStatus,
    filterStartDate,
    setFilterStartDate,
    filterEndDate,
    setFilterEndDate,
}: HistoryHeaderProps) => {
    const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
    const filterRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
                setIsFilterOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleFilterClick = () => {
        setIsFilterOpen(!isFilterOpen);
    };

    return (
        <header className="bg-primary-blue text-white p-4 rounded-b-lg relative bg-[url('/images/header.png')] bg-cover bg-center">
            <h1 className="text-xl font-semibold">Riwayat</h1>
            <div className="flex items-center mt-4 relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 p-3 pl-10 rounded-l-lg border border-gray-300 text-gray-600"
                />
                <button
                    onClick={handleFilterClick}
                    className="p-3 bg-white text-blue-800 rounded-r-lg border border-gray-300 ml-1"
                >
                    <img src="/images/filter.png" alt="Filter" className="w-5 h-5" />
                </button>
            </div>

            <div className="flex justify-center mt-4 bg-white p-2 rounded-lg">
                <button
                    className={`px-4 py-2 rounded-lg mx-2 ${activeTab === 'Attendance' ? 'bg-blue-800 text-white' : 'bg-white text-gray-400'}`}
                    onClick={() => setActiveTab('Attendance')}
                >
                    Kehadrian
                </button>
                <button
                    className={`px-4 py-2 rounded-lg mx-2 ${activeTab === 'Time Off' ? 'bg-blue-800 text-white' : 'bg-white text-gray-400'}`}
                    onClick={() => setActiveTab('Time Off')}
                >
                    Izin
                </button>
            </div>
            {isFilterOpen && (
                <div
                    ref={filterRef}
                    className="absolute top-16 right-0 bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl"
                >
                    <h2 className="text-lg font-semibold mb-2">Filter</h2>
                    <div className="flex items-center mb-4">
                        <div className="relative w-full sm:w-1/2 sm:mr-2 mb-2 sm:mb-0">
                            <input
                                type="date"
                                value={filterStartDate || ''}
                                onChange={(e) => setFilterStartDate(e.target.value || null)}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                placeholder="Select date start"
                            />
                        </div>
                        <span className="text-gray-500 mx-4">to</span>
                        <div className="relative w-full sm:w-1/2 sm:ml-2">
                            <input
                                type="date"
                                value={filterEndDate || ''}
                                onChange={(e) => setFilterEndDate(e.target.value || null)}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                placeholder="Select date end"
                            />
                        </div>
                    </div>
                    <button
                        onClick={() => setIsFilterOpen(false)}
                        className="mt-4 p-2 bg-blue-800 text-white rounded-lg w-full"
                    >
                        Apply
                    </button>
                </div>
            )}
        </header>
    );
};

export default HistoryHeader;
