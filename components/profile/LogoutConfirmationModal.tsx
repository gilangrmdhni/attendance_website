import React from 'react';

interface LogoutConfirmationModalProps {
  isVisible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const LogoutConfirmationModal: React.FC<LogoutConfirmationModalProps> = ({ isVisible, onConfirm, onCancel }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-end justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-full max-w-md p-4 rounded-t-lg shadow-lg animate-slide-up z-50">
        <div className="p-4 text-center">
          <img src="/images/modalLogout.png" alt="Logout Icon" className="w-60 h-60 mx-auto mb-4" />
          <h2 className="font-semibold text-lg mb-4 text-start">Apakah kamu yakin ingin keluar dari akun mu sekarang</h2>
          <button
            onClick={onConfirm}
            className="mb-2 bg-red-500 text-white w-full py-2 rounded-lg"
          >
            Keluar Akun
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-200 text-gray-800 w-full py-2 rounded-lg"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmationModal;
