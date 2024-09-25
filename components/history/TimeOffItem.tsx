const TimeOffItem = ({ type, reason, date, duration }: any) => {
    // Menentukan ikon dan nama berdasarkan tipe
    let icon;
    let typeName;

    switch (type) {
        case "Sick":
            icon = "/icons/sick.png";
            typeName = "Izin Sakit";
            break;
        case "Leave":
            icon = "/icons/sick.png"; // Ganti dengan ikon yang sesuai untuk Izin
            typeName = "Izin Cuti";
            break;
        case "Reimbursement":
            icon = "/icons/sick.png"; // Ganti dengan ikon yang sesuai untuk Reimbursment
            typeName = "Reimbursment";
            break;
        case "Overtime":
            icon = "/icons/sick.png"; // Ganti dengan ikon yang sesuai untuk Lembur
            typeName = "Lembur";
            break;
        default:
            icon = "/icons/sick.png"; // Ikon default untuk kategori yang tidak terdaftar
            typeName = "Other"; // Nama default
    }

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
