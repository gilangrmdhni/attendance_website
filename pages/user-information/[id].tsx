import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import axiosInstance from '@/utils/axiosInstance';
import MobileContainer from '@/components/MobileContainer';

const UserInformation = () => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        console.log('Received ID:', id);
        const fetchUserData = async () => {
            if (typeof id !== 'string') return;

            try {
                const response = await axiosInstance.get(`/user/employee/${id}`);
                setUser(response.data.body);
            } catch (err) {
                setError('Failed to fetch user data');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [id]);

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
        <MobileContainer>
            <div className="relative">
                <header className="bg-primary-blue text-white p-6 h-60 relative bg-[url('/images/header.png')] bg-cover bg-center rounded-b-3xl">
                    <div className="flex items-center">
                        <button
                            onClick={() => router.back()}
                            className="text-white p-2 rounded-full bg-blue-700 hover:bg-blue-800"
                        >
                            <ArrowLeftIcon className="w-6 h-6" />
                        </button>
                        <h1 className="ml-4 text-xl font-semibold">User Information</h1>
                    </div>
                </header>

                <div className="absolute top-24 left-4 right-4">
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
                            <p className="text-gray-400">Name:</p>
                            <p className="text-gray-700">{user?.full_name}</p>
                        </div>
                        <div className="mb-2">
                            <p className="text-gray-400">Job Title:</p>
                            <p className="text-gray-700">{user?.position ? String(user.position) : 'N/A'}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-gray-700 relative">
                            <div className="border-r border-gray-300 pr-4">
                                <p className="text-gray-400 text-sm">Status</p>
                                <p className="text-gray-700">{user?.status}</p>
                            </div>
                            <div className="pl-4">
                                <p className="text-gray-400 text-sm">Type</p>
                                <p className="text-gray-700">{user?.type}</p>
                            </div>
                            <div className="border-r border-gray-300 pr-4">
                                <p className="text-gray-400 text-sm">Join Date</p>
                                <p className="text-gray-700">
                                    {user?.join_date ? new Date(user?.join_date).toLocaleDateString() : 'N/A'}
                                </p>
                            </div>
                            <div className="pl-4">
                                <p className="text-gray-400 text-sm">NIP</p>
                                <p className="text-gray-700">{user?.nip || 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MobileContainer>
    );
};

export default UserInformation;
