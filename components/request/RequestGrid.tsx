const RequestGrid = () => {
    return (
      <div className="p-4">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg border-2 flex flex-col items-center">
              <img src="/icons/cuti.png" alt="Cuti" className="w-10 h-10 mb-2" />
              <span className="text-sm font-medium">Cuti</span>
            </div>
            <div className="bg-white p-4 rounded-lg border-2 flex flex-col items-center">
              <img src="/icons/lembur.png" alt="Lembur" className="w-10 h-10 mb-2" />
              <span className="text-sm font-medium">Lembur</span>
            </div>
            <div className="bg-white p-4 rounded-lg border-2 flex flex-col items-center">
              <img src="/icons/reimbursement.png" alt="Reimbursement" className="w-10 h-10 mb-2" />
              <span className="text-sm font-medium">Reimbursement</span>
            </div>
            <div className="bg-white p-4 rounded-lg border-2 flex flex-col items-center">
              <img src="/icons/izin.png" alt="Izin" className="w-10 h-10 mb-2" />
              <span className="text-sm font-medium">Izin</span>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default RequestGrid;
  