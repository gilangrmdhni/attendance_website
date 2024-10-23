const TimeOffItem = ({ type, reason, start_date, submission, category }: any) => {
    // Menentukan ikon berdasarkan status
    let icon;
    let statusLabel;

    switch (submission) {
        case "approved":
            icon = "/icons/clipboardText.png";
            statusLabel = "Disetujui";
            break;
        case "waiting":
            icon = "/icons/clipboardDefault.png";
            statusLabel = "Menunggu Persetujuan";
            break;
        case "rejected":
            icon = "/icons/clipboardDefault.png";
            statusLabel = "Ditolak";
            break;
        default:
            icon = "/icons/lembur.png";
            statusLabel = "Status Tidak Diketahui";
    }

    return (
        <div className="bg-white p-4 rounded-lg shadow-md mb-4 flex items-center">
            <img src={icon} alt={statusLabel} className="w-10 h-10 mr-4" />
            <div className="flex-1">
                <p className="text-xs text-gray-400">{statusLabel}</p>
                <p className="text-md">{category}</p>
                <p className="text-sm text-gray-500">{reason}</p>
                <p className="text-gray-400 text-xs mt-2">Mulai :{start_date}</p>
            </div>
        </div>
    );
};

export default TimeOffItem;
