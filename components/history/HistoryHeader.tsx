import { useState } from 'react';

const HistoryHeader = ({ activeTab, setActiveTab }: any) => {
    return (
        <header className="bg-blue-800 text-white p-4 rounded-b-lg">
            <h1 className="text-lg font-semibold">History</h1>
            <div className="flex items-center mt-4">
                <input
                    type="text"
                    placeholder="Search"
                    className="flex-1 p-3 rounded-l-lg border border-gray-300 text-gray-600"
                />
                <button className="p-3 bg-white text-blue-800 rounded-r-lg border border-gray-300 ml-1">
                    <img src="/images/filter.png" alt="Filter" className="w-5 h-5" />
                </button>
            </div>
            <div className="flex justify-center mt-4 bg-white p-2 rounded-lg">
                <button
                    className={`px-4 py-2 rounded-lg mx-2 ${activeTab === 'Attendance' ? 'bg-blue-800 text-white' : 'bg-white text-gray-400'}`}
                    onClick={() => setActiveTab('Attendance')}
                >
                    Attendance
                </button>
                <button
                    className={`px-4 py-2 rounded-lg mx-2  ${activeTab === 'Time Off' ? 'bg-blue-800 text-white' : 'bg-white text-gray-400'}`}
                    onClick={() => setActiveTab('Time Off')}
                >
                    Time Off
                </button>
            </div>
        </header>

    );
};

export default HistoryHeader;
