import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useDispatch, useSelector } from 'react-redux';
import { FiArrowRight } from 'react-icons/fi';
import { checkInWFO, checkInWFAWFH } from '../../store/slices/checkinSlice';
import { AppDispatch, RootState } from '../../store/store';
import SuccessModal from '../../components/SuccessModal'; // Import the SuccessModal component
import ErrorModal from '../../components/ErrorModal'; // Import the ErrorModal component
import { useRouter } from 'next/router';


const Map = dynamic(() => import('../../utils/Map'), { ssr: false });

const ScanContent = () => {
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [selectedOption, setSelectedOption] = useState<'WFO' | 'WFA/WFH' | null>(null);
    const [selectedLocation, setSelectedLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [filePreview, setFilePreview] = useState<string | null>(null);
    const dispatch = useDispatch<AppDispatch>();
    const { status, error } = useSelector((state: RootState) => state.checkin);
    const [isCheckedIn, setIsCheckedIn] = useState(false);
    const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false); // State for success modal
    const [isErrorModalVisible, setIsErrorModalVisible] = useState(false); // State for error modal
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const router = useRouter(); // Inisialisasi router

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    const { latitude, longitude } = position.coords;
                    setSelectedLocation({ latitude, longitude });
                },
                error => console.error("Geolocation error:", error)
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    }, []);

    useEffect(() => {
        if (status === 'succeeded') {
            setIsCheckedIn(true);
            setIsSuccessModalVisible(true); // Show success modal
        } else if (status === 'failed') {
            setErrorMessage(error || 'Something went wrong. Please try again.');
            setIsErrorModalVisible(true); // Show error modal
        }
    }, [status, error]);

    const handleLocationSelect = (latitude: number, longitude: number) => {
        setSelectedLocation({ latitude, longitude });
    };

    const togglePopup = () => {
        setIsPopupVisible(prev => !prev);
    };

    const handleOptionSelect = (option: 'WFO' | 'WFA/WFH') => {
        setSelectedOption(option);
        togglePopup();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setFilePreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleCheckIn = async () => {
        if (!selectedOption || !selectedLocation || !selectedFile) {
            console.error("Missing required fields: Option, location, or file");
            return;
        }
        const formData = new FormData();
        formData.append('checkin_latitude', selectedLocation.latitude.toString());
        formData.append('checkin_longitude', selectedLocation.longitude.toString());
        formData.append('picture', selectedFile);

        try {
            if (selectedOption === 'WFO') {
                await dispatch(checkInWFO(formData)).unwrap();
            } else if (selectedOption === 'WFA/WFH') {
                await dispatch(checkInWFAWFH(formData)).unwrap();
            }
            setIsCheckedIn(true);
        } catch (error: any) { // Ubah di sini untuk menetapkan tipe 'any'
            console.error("Check-in error:", error);

            // Ambil pesan kesalahan dari API
            if (error && error.data && error.data.error) {
                setErrorMessage(error.data.error); // Set pesan kesalahan dari API
            } else {
                setErrorMessage('Failed to check in.'); // Pesan default jika tidak ada pesan dari API
            }
            setIsErrorModalVisible(true);
        }
    };

    const closePopup = () => {
        setIsPopupVisible(false);
    };

    const closeSuccessModal = () => {
        setIsSuccessModalVisible(false);
        setIsCheckedIn(false); // Reset checked-in status
        window.location.reload();
        router.push('/'); // Arahkan ke halaman home
    };

    const closeErrorModal = () => {
        setIsErrorModalVisible(false);
        setErrorMessage(null); // Reset error message
        window.location.reload(); // Refresh the page
    };

    return (
        <section className="relative p-4 max-w-sm mx-auto">
            {/* Main Container */}
            <div onClick={togglePopup} className="bg-white p-6 rounded-xl shadow-md mb-4 flex items-center cursor-pointer max-w-full">
                <img
                    src={selectedOption === 'WFO' ? "/images/wfo.png" : selectedOption === 'WFA/WFH' ? "/images/wfh.png" : "/images/globe.png"}
                    alt="Icon"
                    className="w-10 h-10 mr-4 bg-blue-100 p-2 rounded-full"
                />
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

            {/* Map Section */}
            <div className="bg-white p-4 rounded-xl shadow-md mb-4 z-auto">
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

            {/* File Upload Section */}
            <div className="bg-white p-4 rounded-xl shadow-md mb-4 text-center">
                <div
                    className="border-2 border-dashed border-blue-500 rounded-lg p-10 mb-4 bg-blue-100 cursor-pointer"
                    onClick={() => document.getElementById('fileInput')?.click()}
                >
                    <img src="/images/camera.png" alt="Camera Icon" className="w-8 h-8 mx-auto mb-2" />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="fileInput"
                        capture="environment" // Atribut ini akan mengarahkan ke kamera belakang jika tersedia
                    />
                    <label className="text-primary-blue text-sm">Ambil foto selfie</label>
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
                    className={`w-full py-2 rounded-lg text-sm md:text-base ${isCheckedIn ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 text-white'}`}
                    disabled={isCheckedIn || status === 'loading'}
                >
                    {status === 'loading' ? 'Checking In...' : isCheckedIn ? 'Checked In' : 'Check In'}
                </button>
            </div>

            {/* Popup for Selecting Option */}
            {isPopupVisible && (
                <div className="fixed inset-0 flex items-end justify-center bg-black bg-opacity-50 z-[9999]">
                    <div className="bg-white w-full max-w-md p-4 rounded-t-lg shadow-lg z-[10000]">
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
                                <img src="/images/wfh.png" alt="Home Icon" className="w-10 h-10 mr-4" />
                                <div>
                                    <p className="font-semibold">Check-In WFA/WFH</p>
                                    <p className="text-gray-500 text-sm">Check in for working Outside the office</p>
                                </div>
                                <FiArrowRight className="ml-auto text-gray-500" />
                            </div>
                            <button onClick={closePopup} className="mt-4 w-full align-text-top p-2 rounded-lg bg-primary-blue text-white">Close</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Modal */}
            <SuccessModal
                isVisible={isSuccessModalVisible}
                onClose={closeSuccessModal}
            />

            {/* Error Modal */}
            <ErrorModal
                isVisible={isErrorModalVisible}
                onClose={closeErrorModal}
                errorMessage={errorMessage}
            />
        </section>
    );
};

export default ScanContent;
