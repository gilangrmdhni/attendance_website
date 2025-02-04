import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { fetchApprovalRequests, updateApprovalStatus } from '../../store/slices/approvalRequestSlice';
import { RootState, useAppDispatch } from '../../store/store';
import { useRouter } from 'next/router';
import axiosInstance from '@/utils/axiosInstance';

const ApprovalItem = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { requests, status, error } = useSelector((state: RootState) => state.approval);

    // State untuk popup, pesan penolakan, file attachment, dan request_id saat ini
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isFilePopupOpen, setIsFilePopupOpen] = useState(false); // Popup untuk lampiran file
    const [rejectMessage, setRejectMessage] = useState('');
    const [currentRequestId, setCurrentRequestId] = useState<number | null>(null);
    const [file, setFile] = useState<File | null>(null); // State untuk menyimpan file yang di-upload

    useEffect(() => {
        dispatch(fetchApprovalRequests());
    }, [dispatch]);

    const handleApproval = (request_id: number, status: boolean, category: string) => {
        if (category === 'Lembur') {
            // Jika approve lembur, munculkan popup untuk melampirkan file
            setCurrentRequestId(request_id);
            setIsFilePopupOpen(true);
        } else {
            dispatch(updateApprovalStatus({ request_id: Number(request_id), status }));
        }
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

    const confirmApprovalWithFile = async () => {
        if (currentRequestId !== null && file) {
            const formData = new FormData();
            formData.append('request_id', String(currentRequestId));
            formData.append('attachment', file);

            try {
                const response = await axiosInstance.put('/request-approval/upload-file', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                console.log('File uploaded successfully:', response.data);
                // Lakukan update status approval setelah upload
                dispatch(updateApprovalStatus({ request_id: currentRequestId, status: true }));
            } catch (error) {
                console.error('Error uploading file:', error);
            }
        }
        setIsFilePopupOpen(false);
        setFile(null);
        setCurrentRequestId(null);
    };

    const handlePopupClose = () => {
        setIsPopupOpen(false);
        setRejectMessage('');
        setCurrentRequestId(null);
    };

    const handleFilePopupClose = () => {
        setIsFilePopupOpen(false);
        setFile(null);
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
                            <p className="text-gray-600">Kategori: {request.category}</p>
                            <p className="text-gray-600">Posisi: {request.position}</p>
                            <p className="text-gray-500">Status: {request.status}</p>
                            <p className="text-gray-500">Alasan: {request.description}</p>
                            {request.attachment && (
                                <div className="text-sm text-blue-500 mt-2">
                                    <a
                                        href={`https://api.attendance.nuncorp.id${request.attachment}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="underline"
                                    >
                                        Unduh Lampiran (PDF)
                                    </a>
                                </div>
                            )}
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
                                        onClick={() => handleApproval(request.request_id, true, request.category)}
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
                                Konfirmasi menolak
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Popup untuk melampirkan file */}
            {isFilePopupOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white p-5 rounded-lg shadow-lg">
                        <h3 className="text-lg font-semibold mb-4">Lampirkan File untuk Lembur</h3>
                        <input
                            type="file"
                            onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                            className="mb-4"
                        />
                        <div className="mt-4 flex justify-end">
                            <button className="bg-gray-300 text-black px-4 py-2 rounded mr-2" onClick={handleFilePopupClose}>
                                Batal
                            </button>
                            <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={confirmApprovalWithFile}>
                                Upload dan Setujui
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApprovalItem;
