import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';

const ScanPopup = ({ onClose }: any) => {
    const dispatch = useDispatch<AppDispatch>();

    const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 flex items-end justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white w-full max-w-md p-6 rounded-t-lg shadow-lg animate-slide-up z-50">
                <div className="p-4">
                    <h2 className="font-semibold text-lg mb-6 text-center">Pilih Metode</h2>
                    <div className="flex justify-around mb-6">
                        <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center cursor-pointer">
                            <label className="flex flex-col items-center">
                                <img src="/icons/camera.png" alt="Camera Icon" className="w-12 h-12 mb-2 bg-blue-200 rounded-full p-2" />
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    capture="environment" 
                                    className="hidden" 
                                    onChange={handlePictureChange} 
                                />
                                <p className="text-black">Camera</p>
                            </label>
                        </div>
                        <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center">
                            <label className="flex flex-col items-center">
                                <img src="/icons/image.png" alt="Gallery Icon" className="w-12 h-12 mb-2 bg-blue-200 rounded-full p-2" />
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    className="hidden" 
                                    onChange={handlePictureChange} 
                                />
                                <p className="text-black">Gallery</p>
                            </label>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="mt-4 bg-blue-500 text-white w-full py-2 rounded-lg"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ScanPopup;
