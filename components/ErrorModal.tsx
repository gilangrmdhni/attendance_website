import React from 'react';

interface ErrorModalProps {
    isVisible: boolean;
    onClose: () => void;
    errorMessage: string | null;
}

const ErrorModal: React.FC<ErrorModalProps> = ({ isVisible, onClose, errorMessage }) => {
    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-[9999]">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <div className="mb-4 flex justify-center">
                    <img
                        src="/icons/eror.png" // Perbaiki nama file dari "eror.png" menjadi "error.png"
                        alt="Error Icon"
                        className="w-20 h-20 object-cover" // Pastikan ukuran gambar sesuai
                    />
                </div>
                <h2 className="text-xl font-semibold text-gray-800 text-center">Terjadi Kesalahan</h2>
                <p className='text-gray-600 text-center mt-2'>
                    {errorMessage || 'Terjadi kesalahan yang tidak terduga.'}
                </p>
                <div className="flex justify-center mt-4">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ErrorModal;
