import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { AppDispatch, RootState } from '../../store/store';
import { useRouter } from 'next/router';
import MobileContainer from '@/components/MobileContainer';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Footer from '@/components/Footer';
import axiosInstance from '@/utils/axiosInstance';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const EmployeesPage = () => {
    const [divisions, setDivisions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const { token } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await axiosInstance.get('/userdivision/all', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setDivisions(response.data.body || []);
            } catch (err) {
                setError('Failed to fetch employees');
            } finally {
                setLoading(false);
            }
        };

        fetchEmployees();
    }, [token, router]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const getStatusColor = (attendance: string) => {
        if (attendance === 'present') return 'bg-green-500 shadow-green-300';
        return 'bg-red-500 shadow-red-300';
    };

    const filteredDivisions = divisions.map(division => ({
        ...division,
        users: division.users.filter((user: any) =>
            user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.position.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }));

    if (loading) return <p className="text-center p-4">Loading...</p>;
    if (error) return <p className="text-center text-red-500 p-4">{error}</p>;

    return (
        <MobileContainer>
            <div className="bg-blue-800 text-white p-4 rounded-b-3xl">
                <div className='relative flex items-center'>
                    <button onClick={() => router.back()} className='mr-4'>
                        <ArrowLeftIcon className="w-6 h-6" />
                    </button>
                    <h1 className='text-2xl font-bold'>Employee List</h1>
                </div>
                <div className="relative mt-2">
                    <input
                        type="text"
                        placeholder="Search employees..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="p-2 w-full rounded-lg text-gray-500 pl-10 border border-gray-300"
                    />
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                </div>
            </div>
            <div className="p-4 space-y-4 mb-20">
                {filteredDivisions.map((division, index) => (
                    <div key={index} className="bg-white shadow-md rounded-lg p-4 border border-gray-200">
                        <h2 className="text-xl font-semibold">{division.division_name}</h2>
                        <div className="space-y-2">
                            {division.users.map((user: any, userIndex: number) => (
                                <div key={userIndex} className="flex items-center p-2 border-b border-gray-200 last:border-b-0">
                                    <div className="flex-1">
                                        <p className="font-medium">{user.full_name}</p>
                                        <p className="text-sm text-gray-600">{user.position}</p>
                                    </div>
                                    <span className={`w-3 h-3 p-1 rounded-full ${getStatusColor(user.attendance)} border-4`}></span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <Footer />
        </MobileContainer>
    );
};

export default EmployeesPage;
