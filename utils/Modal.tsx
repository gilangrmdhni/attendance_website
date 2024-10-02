// Modal.tsx
import React from 'react';

interface ModalProps {
    // message: string;
    isOpen: boolean
    onClose: () => void;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                {/* <p>{message}</p> */}
                {children}
            </div>
        </div>
    );
};

export default Modal;
