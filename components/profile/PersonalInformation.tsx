// components/profile/PersonalInformation.tsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { fetchUser } from '../../store/slices/userSlice';

const PersonalInformation = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { user, loading, error } = useSelector((state: RootState) => state.user);

    useEffect(() => {
        dispatch(fetchUser());
    }, [dispatch]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500">Error: {error}</div>;
    }

    return (
        <div className="p-4">
            <header className="bg-blue-800 text-white p-6 rounded-b-3xl text-center">
                <h1 className="text-xl font-semibold">Personal Information</h1>
            </header>
            <div className="bg-white p-6 rounded-lg shadow-md mt-4">
                <div className="flex items-center mb-4">
                    <img
                        src={`https://api.attendance.nuncorp.id/images/${user?.picture}`}
                        alt="Profile Picture"
                        className="w-16 h-16 rounded-full mr-4"
                    />
                    <div>
                        <h2 className="text-lg font-semibold">{user?.full_name}</h2>
                        <p className="text-gray-500">{user?.email}</p>
                    </div>
                </div>
                <div className="text-gray-700 mb-2">
                    <span className="font-semibold">Phone Number:</span> {user?.phone_number}
                </div>
                <div className="text-gray-700 mb-2">
                    <span className="font-semibold">Job Title:</span>
                     {/* {user?.position.name} */}
                     On Going
                </div>
                <div className="grid grid-cols-2 gap-4 text-gray-700">
                    <div>
                        <span className="font-semibold">Status:</span> {user?.status}
                    </div>
                    <div>
                        <span className="font-semibold">Type:</span> {user?.type}
                    </div>
                    <div>
                        <span className="font-semibold">Join Date:</span> {user?.join_date ? new Date(user?.join_date).toLocaleDateString() : 'N/A'}                    </div>
                    <div>
                        <span className="font-semibold">NIP:</span> {user?.id}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PersonalInformation;
