// Modal.tsx
import React from 'react';

interface ModalProps {
    message: string;
    onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ message, onClose }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-lg font-semibold mb-4">Error</h2>
                <p>{message}</p>
                <button
                    onClick={onClose}
                    className="mt-4 px-4 py-2 bg-primary-blue text-white rounded-md hover:bg-red-700 transition-all"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default Modal;
