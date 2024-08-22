import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { submitPermissionRequest } from '../../store/slices/permissionSlice';
import { submitReimbursementRequest } from '../../store/slices/reimbursementSlice';
import { AppDispatch, RootState } from '../../store/store'; // sesuaikan dengan path yang benar
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import router from 'next/router';

type DynamicFormField = {
    name: string;
    label: string;
    type: 'text' | 'email' | 'password' | 'textarea' | 'file' | 'date';
};

type DynamicFormProps = {
    title: string;
    description?: string;
    fields: DynamicFormField[];
    onSubmit?: (formData: FormData) => void;
};

const DynamicFormWithHeader: React.FC<DynamicFormProps> = ({ title, description, fields, onSubmit }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { status, error } = useSelector((state: RootState) => state.permission); // sesuaikan dengan state yang sesuai

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        // Convert FormData to object
        const formObject = Object.fromEntries(formData.entries());
        const formattedData = {
            ...formObject,
            attachment: formData.get('attachment') as File, // Cast attachment to File
        };

        if (title.includes('Permission')) {
            dispatch(submitPermissionRequest(formattedData as any)); // Cast formattedData to PermissionRequest
        } else if (title.includes('Reimbursement')) {
            dispatch(submitReimbursementRequest(formattedData as any)); // Cast formattedData to ReimbursementRequest
        }
    };

    return (
        <header className="bg-primary-blue text-white p-4 pb-20 relative rounded-b-lg">
            <div className="flex items-start">
                <button
                    onClick={() => router.back()}
                    className="text-white p-2 rounded-full bg-blue-700 hover:bg-blue-800"
                >
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="ml-4 text-xl font-semibold ">{title}</h1>
            </div>
            <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-[-70px] w-full max-w-xs">
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {fields.map((field, index) => (
                            <div key={index}>
                                <label
                                    htmlFor={field.name}
                                    className="block text-sm font-medium text-gray-600 mb-2"
                                >
                                    {field.label}
                                </label>
                                {field.type === 'textarea' ? (
                                    <textarea
                                        id={field.name}
                                        name={field.name}
                                        rows={4}
                                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                                        placeholder={field.label}
                                    />
                                ) : field.type === 'file' ? (
                                    <div className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-center text-black">
                                        <input
                                            id={field.name}
                                            type="file"
                                            name={field.name}
                                            className="hidden text-black"
                                            accept="*/*" // Sesuaikan dengan jenis file yang diterima
                                        />
                                        <label htmlFor={field.name} className="block text-sm font-medium text-blue-500 cursor-pointer ">
                                            Upload {field.label}
                                        </label>
                                    </div>
                                ) : (
                                    <div className="relative">
                                        <input
                                            id={field.name}
                                            type={field.type}
                                            name={field.name}
                                            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                                            placeholder={field.label}
                                        />
                                        {field.type === 'date' && (
                                            <span className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-black">
                                                <svg
                                                    className="w-5 h-5 text-gray-400"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M8 7V3m8 4V3m-6 8h6m-8 4h10M5 8h14M5 12h.01M5 16h.01"
                                                        className='text-black'
                                                    />
                                                </svg>
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Ajukan
                        </button>
                    </form>
                </div>
            </div>
        </header>
    );
};

export default DynamicFormWithHeader;
