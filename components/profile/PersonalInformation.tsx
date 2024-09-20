import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { fetchUser, updateUserProfile } from '../../store/slices/userSlice';
import Image from 'next/image';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/router';
import Modal from '../../utils/Modal'; // Import the Modal component

const PersonalInformation = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { user, loading, error } = useSelector((state: RootState) => state.user);
    const router = useRouter();

    // Local state for form fields
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    // Local state for edit mode
    const [isEditing, setIsEditing] = useState(false);

    // Local state for error message
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal state

    useEffect(() => {
        dispatch(fetchUser());
    }, [dispatch]);

    useEffect(() => {
        if (user) {
            setName(user.full_name || '');
            setEmail(user.email || '');
            setPhoneNumber(user.phone_number || '');
        }
    }, [user]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500">Error: {error}</div>;
    }

    const profilePictureUrl = user?.picture === '/storage/uploads/default.jpg'
        ? '/icons/userEdit.png'
        : user?.picture
            ? `https://api.attendance.nuncorp.id${user.picture}`
            : '/icons/userEdit.png';

    const handleSave = async () => {
        const profileData = {
            full_name: name,
            email: email,
            phone_number: phoneNumber,
        };

        try {
            await dispatch(updateUserProfile(profileData)).unwrap();
            setIsEditing(false); // Kembali ke mode tampilan setelah berhasil menyimpan
            setErrorMessage(null); // Reset error message on success
            setIsModalOpen(false); // Close modal if it was open
        } catch (error: any) {
            // Set error message based on the response from the API
            if (error.code === 400 && error.error) {
                setErrorMessage(Object.values(error.error).join(', ')); // Join multiple error messages
            } else {
                setErrorMessage('Failed to save profile. Please try again.'); // Fallback error message
            }
            setIsModalOpen(true); // Open modal on error
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setErrorMessage(null); // Clear error message on close
    };

    return (
        <div className="relative">
            <header className="bg-primary-blue text-white p-6 h-60 relative bg-[url('/images/header.png')] bg-cover bg-center rounded-b-3xl">
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

                {/* New Editable Card */}
                <div className="mt-6 bg-white p-6 rounded-lg shadow-md mb-20">
                    <div className="mb-4">
                        <label className="block text-gray-500 text-sm mb-2" htmlFor="name">Nama</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={!isEditing}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-500 text-sm mb-2" htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={!isEditing}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-500 text-sm mb-2" htmlFor="phone_number">Nomor Telepon</label>
                        <input
                            type="text"
                            id="phone_number"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            disabled={!isEditing}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue"
                        />
                    </div>
                    <p className="text-xs text-gray-400 mb-4">
                        * make sure to use your real information like on your identity card (KTP) for legal reasons
                    </p>
                    <button
                        onClick={isEditing ? handleSave : () => setIsEditing(true)}
                        className="w-full py-2 bg-primary-blue text-white rounded-md hover:bg-blue-800 transition-all"
                    >
                        {isEditing ? 'Save' : 'Edit'}
                    </button>
                </div>
            </div>

            {/* Modal for error messages */}
            {isModalOpen && errorMessage && (
                <Modal message={errorMessage} onClose={closeModal} />
            )}
        </div >
    );
};

export default PersonalInformation;
