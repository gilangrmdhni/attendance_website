import { useEffect, useRef, useState } from 'react';

interface NotificationHeaderProps {
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

const NotificationHeader = ({
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
}: NotificationHeaderProps) => {
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
        <header className="bg-primary-blue text-white p-4 relative bg-[url('/images/header.png')] bg-cover bg-center rounded-b-lg">
            <div className="flex flex-col items-start mb-6">
                <h1 className="text-2xl font-semibold">Notification</h1>
            </div>
            <div className="flex items-center mt-4">
                <input
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 p-3 rounded-l-lg border border-gray-300 text-gray-600"
                />
                <button
                    onClick={handleFilterClick}
                    className="p-3 bg-white text-blue-800 rounded-r-lg border border-gray-300 ml-1"
                >
                    <img src="/images/filter.png" alt="Filter" className="w-5 h-5" />
                </button>
                {isFilterOpen && (
                    <div ref={filterRef} className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg border border-gray-300 z-10">
                        <div className="p-4">
                            <h3 className="text-lg font-semibold">Filters</h3>
                            <div className="mt-2">
                                <label className="block text-sm font-medium text-gray-700">Category</label>
                                <select
                                    value={filterCategory || ''}
                                    onChange={(e) => setFilterCategory(e.target.value || null)}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                >
                                    <option value="">All</option>
                                    <option value="Category1">Category 1</option>
                                    <option value="Category2">Category 2</option>
                                    {/* Add more categories as needed */}
                                </select>
                            </div>
                            <div className="mt-2">
                                <label className="block text-sm font-medium text-gray-700">Status</label>
                                <select
                                    value={filterStatus || ''}
                                    onChange={(e) => setFilterStatus(e.target.value || null)}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                >
                                    <option value="">All</option>
                                    <option value="Status1">Status 1</option>
                                    <option value="Status2">Status 2</option>
                                    {/* Add more statuses as needed */}
                                </select>
                            </div>
                            <div className="mt-2">
                                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                                <input
                                    type="date"
                                    value={filterStartDate || ''}
                                    onChange={(e) => setFilterStartDate(e.target.value || null)}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                />
                            </div>
                            <div className="mt-2">
                                <label className="block text-sm font-medium text-gray-700">End Date</label>
                                <input
                                    type="date"
                                    value={filterEndDate || ''}
                                    onChange={(e) => setFilterEndDate(e.target.value || null)}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default NotificationHeader;
