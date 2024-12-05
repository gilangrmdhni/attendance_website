// utils/axiosInstance.ts
import store from '@/store/store'; 
import axios from 'axios';
import router from 'next/router';
import { logout } from '../store/slices/authSlice'; 

const axiosInstance = axios.create({
    baseURL: 'https://api.attendance.nuncorp.id/api',
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response, 
    (error) => {
        if (error.response) {
            const { status, data } = error.response;

            if (status === 401 && data?.message === 'Token expired') {
                localStorage.removeItem('token');
                store.dispatch(logout());

                if (typeof window !== 'undefined') {
                    router.push('/login');
                }
            } else if (status === 401) {
                console.error('Unauthorized access:', data?.message);
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
