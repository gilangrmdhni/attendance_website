import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { fetchApprovalRequests, updateApprovalStatus } from '../../store/slices/approvalRequestSlice';
import { RootState, useAppDispatch } from '../../store/store';
import { useRouter } from 'next/router';

const ApprovalItem = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { requests, status, error } = useSelector((state: RootState) => state.approval);

    useEffect(() => {
        dispatch(fetchApprovalRequests());
    }, [dispatch]);

    const handleApproval = (request_id: number, status: boolean) => {
        dispatch(updateApprovalStatus({ request_id, status }));
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
                                        onClick={() => handleApproval(request.request_id, false)}
                                    >
                                        Reject
                                    </button>
                                    <button
                                        className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-600"
                                        onClick={() => handleApproval(request.request_id, true)}
                                    >
                                        Approve
                                    </button>
                                </div>
                            )}
                            {/* Menambahkan garis pemisah */}
                            {index < requests.length - 1 && <hr className="my-4 border-gray-300" />}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ApprovalItem;
