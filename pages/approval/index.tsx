import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { fetchApprovalRequests } from '../../store/slices/approvalRequestSlice';
import { RootState, useAppDispatch } from '../../store/store';
import MobileContainer from '@/components/MobileContainer';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/router';
import ApprovalItem from '@/components/approval/ApprovalItem';

const ApprovalRequests = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { status, error } = useSelector((state: RootState) => state.approval);

    useEffect(() => {
        dispatch(fetchApprovalRequests());
    }, [dispatch]);

    return (
        <MobileContainer>
            <header className="bg-primary-blue text-white p-6 relative bg-[url('/images/OrnamenManager.png')] bg-cover bg-center rounded-b-3xl">
                <div className="flex items-center">
                    <button
                        onClick={() => router.back()}
                        className="text-white p-2 rounded-full bg-blue-700 hover:bg-blue-800"
                    >
                        <ArrowLeftIcon className="w-6 h-6" />
                    </button>
                    <h1 className="ml-4 text-xl font-semibold">Approval Requests</h1>
                </div>
            </header>
            <main className="px-4 py-4">
                {status === 'loading' && <p className="text-gray-500">Loading...</p>}
                {error && <p className="text-red-500 mb-4">Error: {error}</p>}
                <ApprovalItem />
            </main>
        </MobileContainer>
    );
};

export default ApprovalRequests;
