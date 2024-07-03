const HistoryItem = ({ type, date, startTime, endTime, totalTime }: any) => {
    const icon = type === "Office" ? "/images/wfo.png" : "/images/wfh.png";
    const typeName = type === "Office" ? "Work form Office" : "Work form Anywhere";

    return (
        <div className="bg-white p-4 rounded-lg shadow-md mb-4 flex items-center">
            <img src={icon} alt={typeName} className="w-10 h-10 mr-4" />
            <div className="flex-1">
                <p className="text-gray-400 text-sm">{typeName}</p>
                <p className="text-sm">{date}</p>
                <div className="flex items-center mt-2">
                    <p className="text-gray-400 text-xs mr-4">
                        <img src="/icons/login.png" alt="Clock" className="inline-block w-3 h-3 mr-1" />
                        {startTime}
                    </p>
                    <p className="text-gray-400 text-xs">
                        <img src="/icons/logout.png" alt="Clock" className="inline-block w-3 h-3 mr-1 justify-between" />
                        {endTime}
                    </p>
                </div>
            </div>
            <div className="text-right">
                <p className="text-gray-400 text-xs">Total Time</p>
                <p className="text-gray-400 text-sm">{totalTime}</p>
            </div>
        </div>
    );
};

export default HistoryItem;
