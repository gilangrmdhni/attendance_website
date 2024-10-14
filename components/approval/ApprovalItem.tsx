import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { fetchApprovalRequests, updateApprovalStatus } from '../../store/slices/approvalRequestSlice';
import { RootState, useAppDispatch } from '../../store/store';
import { useRouter } from 'next/router';

const ApprovalItem = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { requests, status, error } = useSelector((state: RootState) => state.approval);

    // State untuk popup dan pesan
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [rejectMessage, setRejectMessage] = useState('');
    const [currentRequestId, setCurrentRequestId] = useState<number | null>(null);

    useEffect(() => {
        dispatch(fetchApprovalRequests());
    }, [dispatch]);

    const handleApproval = (request_id: number, status: boolean) => {
        dispatch(updateApprovalStatus({ request_id, status }));
    };

    const handleReject = (request_id: number) => {
        setCurrentRequestId(request_id);
        setIsPopupOpen(true);
    };

    const confirmReject = () => {
        if (currentRequestId !== null) {
            // Kirim pesan saat menolak
            dispatch(updateApprovalStatus({ 
                request_id: currentRequestId, 
                status: false, 
                message: rejectMessage // Sertakan pesan di sini
            }));
        }
        setIsPopupOpen(false);
        setRejectMessage('');
        setCurrentRequestId(null);
    };

    const handlePopupClose = () => {
        setIsPopupOpen(false);
        setRejectMessage('');
        setCurrentRequestId(null);
    };

    return (
        <div className="p-2">
            {status === 'loading' && <p className="text-gray-500">Loading...</p>}
            {error && <p className="text-red-500 mb-4">Error: {error}</p>}
            {status === 'succeeded' && (
                <div className="bg-white p-2 rounded-lg shadow-md">
                    {requests.map((request, index) => (
                        <div key={request.request_id} className="rounded-lg p-4">
                            <h2 className="text-lg font-semibold text-gray-800">{request.full_name}</h2>
                            <p className="text-gray-600">{request.position}</p>
                            <p className="text-gray-500">Status: {request.status}</p>
                            {request.status !== 'approved' && request.status !== 'rejected' && (
                                <div className="mt-4 flex justify-between">
                                    <button
                                        className="bg-white border-2 border-blue-500 text-blue-500 px-4 py-2 rounded hover:bg-white"
                                        onClick={() => handleReject(request.request_id)}
                                    >
                                        Menolak
                                    </button>
                                    <button
                                        className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-600"
                                        onClick={() => handleApproval(request.request_id, true)}
                                    >
                                        Menyetujui
                                    </button>
                                </div>
                            )}
                            {index < requests.length - 1 && <hr className="my-4 border-gray-300" />}
                        </div>
                    ))}
                </div>
            )}

            {/* Popup untuk menolak permintaan */}
            {isPopupOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white p-5 rounded-lg shadow-lg">
                        <h3 className="text-lg font-semibold mb-4">Izin</h3>
                        <textarea
                            className="w-full p-2 border border-gray-300 rounded"
                            placeholder="Masukkan pesan penolakan..."
                            value={rejectMessage}
                            onChange={(e) => setRejectMessage(e.target.value)}
                        />
                        <div className="mt-4 flex justify-end">
                            <button className="bg-gray-300 text-black px-4 py-2 rounded mr-2" onClick={handlePopupClose}>
                                Kembali
                            </button>
                            <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={confirmReject}>
                                Kinfirmasi menolak
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApprovalItem;
