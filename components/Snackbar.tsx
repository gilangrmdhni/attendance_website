// components/Snackbar.tsx

import React, { useEffect, useState } from 'react';

interface SnackbarProps {
    message: string;
    type: 'success' | 'error' | 'warning';
    visible: boolean;
    onClose: () => void;
}

const Snackbar: React.FC<SnackbarProps> = ({ message, type, visible, onClose }) => {
    const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-yellow-500';
    const textColor = 'text-white';

    useEffect(() => {
        if (visible) {
            const timer = setTimeout(() => {
                onClose();
            }, 5000); // Snackbar will be visible for 5 seconds

            return () => clearTimeout(timer);
        }
    }, [visible, onClose]);

    return (
        visible ? (
            <div
                className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-lg shadow-lg ${bgColor} ${textColor} z-50`}
                role="alert"
            >
                <div className="flex items-center justify-between">
                    <p>{message}</p>
                    <button
                        className="ml-4 text-xl font-bold"
                        onClick={onClose}
                    >
                        &times;
                    </button>
                </div>
            </div>
        ) : null
    );
};

export default Snackbar;
