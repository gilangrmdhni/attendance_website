const ProfilePopup = ({ onClose }: any) => {
    return (
        <div className="fixed inset-0 flex items-end justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white w-full max-w-md p-4 rounded-t-lg shadow-lg animate-slide-up z-50">
                <div className="p-4">
                    <h2 className="font-semibold text-lg mb-4">Pilih Metode</h2>
                    <div className="flex justify-around mb-4">
                        <div onClick={onClose} className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center cursor-pointer">
                            <img src="/icons/camera.png" alt="Camera Icon" className="w-10 h-10 mb-2 bg-blue-200 rounded-full p-2" />
                            <p className="text-black">Camera</p>
                        </div>
                        <div onClick={onClose} className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center cursor-pointer">
                            <img src="/icons/image.png" alt="Gallery Icon" className="w-10 h-10 mb-2 bg-blue-200 rounded-full p-2" />
                            <p className="text-black">Gallery</p>
                        </div>
                        <div onClick={onClose} className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center cursor-pointer">
                            <img src="/icons/user-edit.png" alt="Avatar Icon" className="w-10 h-10 mb-2 bg-blue-200 rounded-full p-2" />
                            <p className="text-black">Avatar</p>
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

export default ProfilePopup;
