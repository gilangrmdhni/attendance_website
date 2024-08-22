import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useDispatch, useSelector } from 'react-redux';
import { FiArrowRight } from 'react-icons/fi';
import { checkInWFO, checkInWFAWFH } from '../../store/slices/checkinSlice';
import { AppDispatch, RootState } from '../../store/store';

const Map = dynamic(() => import('../../utils/Map'), { ssr: false });

const ScanContent = () => {
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [isSuccessPopupVisible, setIsSuccessPopupVisible] = useState(false);
    const [selectedOption, setSelectedOption] = useState<'WFO' | 'WFA/WFH' | null>(null);
    const [selectedLocation, setSelectedLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [filePreview, setFilePreview] = useState<string | null>(null); // State untuk preview gambar
    const dispatch = useDispatch<AppDispatch>();
    const { status, error } = useSelector((state: RootState) => state.checkin);
    const [isErrorPopupVisible, setIsErrorPopupVisible] = useState(false);
    const [errorPopupMessage, setErrorPopupMessage] = useState('');


    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                setSelectedLocation({ latitude, longitude });
            }, (error) => {
                console.error("Geolocation error:", error);
            });
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    }, []);

    const handleLocationSelect = (latitude: number, longitude: number) => {
        setSelectedLocation({ latitude, longitude });
    };

    const togglePopup = () => {
        setIsPopupVisible(!isPopupVisible);
    };

    const handleOptionSelect = (option: 'WFO' | 'WFA/WFH') => {
        setSelectedOption(option);
        togglePopup();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setSelectedFile(file);

            // Buat URL untuk preview gambar
            const reader = new FileReader();
            reader.onloadend = () => {
                setFilePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCheckIn = () => {
        if (!selectedOption || !selectedLocation || !selectedFile) return;
        const formData = new FormData();
        formData.append('checkin_latitude', selectedLocation.latitude.toString());
        formData.append('checkin_longitude', selectedLocation.longitude.toString());
        formData.append('picture', selectedFile);

        if (selectedOption === 'WFO') {
            dispatch(checkInWFO(formData)).then(() => {
                setIsSuccessPopupVisible(true);
            }).catch(() => {
                setIsErrorPopupVisible(true);
            });
        } else if (selectedOption === 'WFA/WFH') {
            dispatch(checkInWFAWFH(formData)).then(() => {
                setIsSuccessPopupVisible(true);
            }).catch(() => {
                setIsErrorPopupVisible(true);
            });
        }
    };

    const closeSuccessPopup = () => {
        setIsSuccessPopupVisible(false);
    };

    return (
        <section className="relative p-4 max-w-sm mx-auto">
            {/* Container utama */}
            <div onClick={togglePopup} className="bg-white p-6 rounded-xl shadow-md mb-4 flex items-center cursor-pointer max-w-full">
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

            {/* Bagian peta */}
            <div className="bg-white p-4 rounded-xl shadow-md mb-4 z-auto" style={{ zIndex: 10 }}>
                <div className="bg-gray-100 rounded-lg p-2 md:p-4 mb-4">
                    {selectedLocation ? (
                        <Map
                            position={[selectedLocation.latitude, selectedLocation.longitude]}
                            onLocationSelect={handleLocationSelect}
                        />
                    ) : (
                        <p className="text-gray-500 text-xs md:text-sm">Menunggu lokasi...</p>
                    )}
                </div>
            </div>

            {/* Bagian upload foto */}
            <div
                className="bg-white p-4 rounded-xl shadow-md mb-4 text-center"
            >
                <div
                    className="border-2 border-dashed border-blue-500 rounded-lg p-4 mb-4 bg-blue-100"
                    onClick={() => {
                        const fileInput = document.getElementById('fileInput') as HTMLInputElement;
                        if (fileInput) {
                            fileInput.click();
                        }
                    }}
                >
                    <img src="/images/camera.png" alt="Camera Icon" className="w-8 h-8 mx-auto mb-2" />

                    {/* Hidden file input */}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="fileInput"
                    />

                    {/* Custom upload button */}
                    <label className="text-primary-blue text-sm">
                        Ambil atau Upload foto selfie
                    </label>

                    {/* Preview gambar */}
                    {filePreview && (
                        <div className="mt-4">
                            <img
                                src={filePreview}
                                alt="Preview"
                                className="w-full h-32 object-cover rounded-lg border-2 border-gray-300"
                            />
                        </div>
                    )}
                </div>
                <button
                    onClick={handleCheckIn}
                    className="bg-blue-500 text-white w-full py-2 rounded-lg text-sm md:text-base"
                    disabled={status === 'loading'}
                >
                    {status === 'loading' ? 'Checking In...' : 'Check In'}
                </button>
                {status === 'failed' && <p className="text-red-500 mt-2 text-xs md:text-sm">{error}</p>}
            </div>

            {/* Pop-up Select Option */}
            {isPopupVisible && (
                <div className="fixed inset-0 flex items-end justify-center bg-black bg-opacity-50  z-[9999]">
                    <div className="bg-white w-full max-w-md p-4 rounded-t-lg shadow-lg animate-slide-up  z-[10000]">
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
                                className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Pop-up Success */}
            {isSuccessPopupVisible && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
                    <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                        <h2 className="font-semibold text-lg mb-4">Success</h2>
                        <p className="text-gray-700">Check-In berhasil!</p>
                        <button
                            onClick={closeSuccessPopup}
                            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Pop-up Error */}
            {isErrorPopupVisible && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
                    <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                        <h2 className="font-semibold text-lg mb-4">Error</h2>
                        <p className="text-gray-700">Check-In Gagal!</p>
                        <button
                            onClick={() => setIsErrorPopupVisible(false)}
                            className="mt-4 bg-red-500 text-white py-2 px-4 rounded-lg"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
};

export default ScanContent;
