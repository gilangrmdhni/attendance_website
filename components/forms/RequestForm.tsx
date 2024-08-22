import { useRouter } from 'next/router';
import React from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

interface DynamicFormProps {
    title: string;
    description: string;
    fields: { type: 'text' | 'date' | 'textarea' | 'file'; label: string; name: string }[];
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

const RequestForm: React.FC<DynamicFormProps> = ({ title, description, fields, onSubmit }) => {
    const router = useRouter();

    const handleBackClick = () => {
        router.back();
    };

    return (
        <header className="bg-primary-blue text-white p-4 pb-20 relative rounded-b-lg">
            <div className="flex flex-col items-start">
                <button
                    onClick={handleBackClick}
                    className="text-white p-2 rounded-full bg-blue-700 hover:bg-blue-800"
                >
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="ml-4 text-xl font-semibold">{title}</h1>
            </div>
            <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-[-70px] w-full max-w-xs">
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <form onSubmit={onSubmit} className="space-y-4">
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
                                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Masukan Keterangan"
                                    />
                                ) : field.type === 'file' ? (
                                    <div className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                        <input
                                            id={field.name}
                                            type="file"
                                            name={field.name}
                                            className="hidden"
                                        />
                                        <label htmlFor={field.name} className="block text-sm font-medium text-blue-500 cursor-pointer">
                                            Upload Bukti foto untuk mengajukan
                                        </label>
                                    </div>
                                ) : (
                                    <div className="relative">
                                        <input
                                            id={field.name}
                                            type={field.type}
                                            name={field.name}
                                            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder={field.label}
                                        />
                                        {field.type === 'date' && (
                                            <span className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
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

export default RequestForm;
