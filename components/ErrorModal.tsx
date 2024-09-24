import React from 'react';

interface ErrorModalProps {
    isVisible: boolean;
    onClose: () => void;
    errorMessage: string | null;
}

const ErrorModal: React.FC<ErrorModalProps> = ({ isVisible, onClose, errorMessage }) => {
    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="font-semibold text-lg mb-4">Error</h2>
                <p className="text-red-600">{errorMessage || 'An unknown error occurred.'}</p>
                <button
                    onClick={onClose}
                    className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default ErrorModal;
