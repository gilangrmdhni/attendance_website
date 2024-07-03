const TimeOffItem = ({ type, reason, date, duration }: any) => {
    const icon = type === "Sick" ? "/icons/sick.png" : "/icons/sick.png";
    const typeName = type === "Sick" ? "Izin Sakit" : "Izin Cuti";

    return (
        <div className="bg-white p-4 rounded-lg shadow-md mb-4 flex items-center">
            <img src={icon} alt={typeName} className="w-10 h-10 mr-4" />
            <div className="flex-1">
                <p className="text-gray-400 text-sm">{typeName}</p>
                <p className="text-sm">{reason}</p>
                <p className="text-gray-400 text-xs mt-2">{date}</p>
            </div>
        </div>
    );
};

export default TimeOffItem;
