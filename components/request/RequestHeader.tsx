import { useRouter } from 'next/router';
import React from 'react';

const RequestHeader: React.FC = () => {
    const router = useRouter();

    const handleMenuClick = (type: string) => {
        router.push(`/request/${type}`);
    };

    return (
        <header className="bg-primary-blue text-white p-4 pb-20 relative bg-[url('/images/header.png')] bg-cover bg-center rounded-b-lg">
            <div className="flex flex-col items-start">
                <h1 className="text-xl font-semibold">Request</h1>
            </div>
            <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-[-70px] w-full max-w-xs">
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <div className="grid grid-cols-2 gap-4">
                        <div
                            className="bg-white p-4 rounded-lg border-2 flex flex-col items-center cursor-pointer"
                            onClick={() => handleMenuClick('timeoff')}
                        >
                            <img src="/icons/cuti.png" alt="timeoff" className="w-10 h-10 mb-2" />
                            <span className="text-sm font-medium text-blue-800">Cuti</span>
                        </div>
                        <div
                            className="bg-white p-4 rounded-lg border-2 flex flex-col items-center cursor-pointer"
                            onClick={() => handleMenuClick('overtime')}
                        >
                            <img src="/icons/lembur.png" alt="overtime" className="w-10 h-10 mb-2" />
                            <span className="text-sm font-medium text-blue-800">Lembur</span>
                        </div>
                        <div
                            className="bg-white p-4 rounded-lg border-2 flex flex-col items-center cursor-pointer"
                            onClick={() => handleMenuClick('reimbursement')}
                        >
                            <img src="/icons/reimbursement.png" alt="Reimbursement" className="w-10 h-10 mb-2" />
                            <span className="text-sm font-medium text-blue-800">Reimbursement</span>
                        </div>
                        <div
                            className="bg-white p-4 rounded-lg border-2 flex flex-col items-center cursor-pointer"
                            onClick={() => handleMenuClick('permission')}
                        >
                            <img src="/icons/izin.png" alt="permission" className="w-10 h-10 mb-2" />
                            <span className="text-sm font-medium text-blue-800">Izin</span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default RequestHeader;
