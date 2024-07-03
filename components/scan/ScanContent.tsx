import { useState } from 'react';
import dynamic from 'next/dynamic';
import { FiArrowRight } from 'react-icons/fi';

const Map = dynamic(() => import('../../utils/Map'), { ssr: false });

const ScanContent = () => {
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [selectedOption, setSelectedOption] = useState<'WFO' | 'WFA/WFH' | null>(null);

    const togglePopup = () => {
        setIsPopupVisible(!isPopupVisible);
    };

    const handleOptionSelect = (option: 'WFO' | 'WFA/WFH') => {
        setSelectedOption(option);
        togglePopup();
    };

    return (
        <div className="relative p-4 mt-14 mb-10">
            <div onClick={togglePopup} className="bg-white p-6 rounded-xl shadow-md mb-4 flex items-center cursor-pointer">
                <img src={selectedOption === 'WFO' ? "/images/wfo.png" : selectedOption === 'WFA/WFH' ? "/images/wfh.png" : "/images/globe.png"} alt="Globe Icon" className="w-10 h-10 mr-4 bg-blue-100 p-2 rounded-full" />
                <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                        <div>
                            <p className="font-semibold">{selectedOption ? `Check-In ${selectedOption}` : 'Pilih kondisi Absensi mu'}</p>
                            <p className="text-gray-400 text-sm">{selectedOption ? `Check in for working ${selectedOption === 'WFO' ? 'Inside' : 'Outside'} the office` : 'Kamu bisa memilih untuk kerja Work from Office atau Work from Away'}</p>
                        </div>
                        <button className="text-gray-500">
                            <FiArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md mb-4">
                <div className="bg-gray-100 rounded-lg p-4 mb-4">
                    <Map />
                    <p className="text-gray-500 mt-2">F2FQ+V7 Sukamekar, Bogor Regency, West Java, Indonesia</p>
                </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md mb-4 text-center">
                <div className="border-2 border-dashed border-blue-500 rounded-lg p-6 mb-4 bg-blue-100">
                    <img src="/images/camera.png" alt="Camera Icon" className="w-10 h-10 mx-auto mb-2" />
                    <p className="text-blue-600">Take a selfie of yourself</p>
                </div>
                <button className="bg-blue-500 text-white w-full py-2 rounded-lg">Check In</button>
            </div>

            {/* Pop-up */}
            {isPopupVisible && (
                <div className="fixed inset-0 flex items-end justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white w-full max-w-md p-4 rounded-t-lg shadow-lg animate-slide-up z-50">
                        <div className="p-4">
                            <h2 className="font-semibold text-lg mb-4">Pilih kondisi Absensi</h2>
                            <div onClick={() => handleOptionSelect('WFO')} className="mb-4 p-4 bg-gray-100 rounded-lg flex items-center cursor-pointer">
                                <img src="/images/wfo.png" alt="Office Icon" className="w-10 h-10 mr-4" />
                                <div>
                                    <p className="font-semibold">Check-In WFO</p>
                                    <p className="text-gray-500 text-sm">Check in for working Inside the office</p>
                                </div>
                                <FiArrowRight className="ml-auto text-gray-500" />
                            </div>
                            <div onClick={() => handleOptionSelect('WFA/WFH')} className="p-4 bg-gray-100 rounded-lg flex items-center cursor-pointer">
                                <img src="/images/wfh.png" alt="Remote Icon" className="w-10 h-10 mr-4" />
                                <div>
                                    <p className="font-semibold">Check-In WFA/WFH</p>
                                    <p className="text-gray-500 text-sm">Check in for working Outside the office</p>
                                </div>
                                <FiArrowRight className="ml-auto text-gray-500" />
                            </div>
                            <button
                                onClick={togglePopup}
                                className="mt-4 bg-blue-500 text-white w-full py-2 rounded-lg"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ScanContent;
