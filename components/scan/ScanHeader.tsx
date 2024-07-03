const ScanHeader = () => {
    return (
        <header className="bg-blue-800 text-white p-4 pb-20 relative rounded-b-lg">
            <div className="flex flex-col items-start">
                <h1 className="text-xl font-semibold">Attandance</h1>
            </div>
            <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-[-70px] w-full max-w-xs">
                <div className="bg-white p-6 rounded-xl shadow-md mb-4 text-center">
                    <p className="text-gray-500">Jumat, 14 Juni 2024</p>
                    <div className="flex justify-center items-center text-2xl font-semibold my-2 text-black">
                        <span>07</span>:<span>46</span>:<span>23</span> <span className="text-sm ml-1">AM</span>
                    </div>
                    <p className="text-gray-500">Waktu Indonesia Barat</p>
                </div>
            </div>
        </header>
    );
};

export default ScanHeader;
