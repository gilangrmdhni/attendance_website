import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { fetchUser } from '../../store/slices/userSlice';
import Image from 'next/image';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/router';

const PersonalInformation = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { user, loading, error } = useSelector((state: RootState) => state.user);
    const router = useRouter();

    useEffect(() => {
        dispatch(fetchUser());
    }, [dispatch]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500">Error: {error}</div>;
    }

    const profilePictureUrl = user?.picture
        ? `https://api.attendance.nuncorp.id${user.picture}`
        : '/images/profile-user.png';

    return (
        <div className="relative">
            <header className="bg-blue-800 text-white p-6 h-60 rounded-b-3xl">
                <div className="flex items-center">
                    <button
                        onClick={() => router.back()}
                        className="text-white p-2 rounded-full bg-blue-700 hover:bg-blue-800"
                    >
                        <ArrowLeftIcon className="w-6 h-6" />
                    </button>
                    <h1 className="ml-4 text-xl font-semibold">Personal Information</h1>
                </div>
            </header>
            <div className="absolute top-24 left-4 right-4 z-10">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center mb-4">
                        <div className="relative w-20 h-20 rounded-full overflow-hidden mr-4">
                            <Image
                                src={profilePictureUrl}
                                alt="Profile Picture"
                                layout="fill"
                                objectFit="cover"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold">{user?.full_name}</h2>
                            <p className="text-gray-500">{user?.email}</p>
                        </div>
                    </div>
                    <div className="mb-6">
                        <span className="text-gray-400 font-normal">Phone Number : </span>
                        <span className="text-gray-700">{user?.phone_number}</span>
                    </div>
                    <div className="mb-2">
                        <p className="text-gray-400">Job Title:</p>
                        <p className="text-gray-700">{'N/A'}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-gray-700">
                        <div>
                            <p className="text-gray-400 text-sm">Status:</p>
                            <p className="text-gray-700">{user?.status}</p>
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">Type:</p>
                            <p className="text-gray-700">{user?.type}</p>
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">Join Date:</p>
                            <p className="text-gray-700">
                                {user?.join_date ? new Date(user?.join_date).toLocaleDateString() : 'N/A'}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">NIP:</p>
                            <p className="text-gray-700">{user?.nip || 'N/A'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PersonalInformation;
