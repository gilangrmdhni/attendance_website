import React from 'react';

interface SuccessModalProps {
    isVisible: boolean;
    onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isVisible, onClose }) => {
    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
           <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                    <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-md text-center">
                        <div className="mb-4 w-full">
                            <img
                                src="/images/ornamen.png"
                                alt="Success Icon"
                                className="w-full h-auto object-cover"
                            />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-500">Berhasi</h2>
                        <p className='text-gray-500'>Anda telah berhasil absen!</p>
                        <button
                            onClick={onClose}
                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
                        >
                            Close
                        </button>
                    </div>
                </div>
        </div>
    );
};

export default SuccessModal;
