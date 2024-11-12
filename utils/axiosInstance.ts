// utils/axiosInstance.ts
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://api.attendance.nuncorp.id/api',
});

axiosInstance.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

axiosInstance.interceptors.response.use(response => {
    return response;
}, error => {
    if (error.response) {
        const { status, data } = error.response;

        if (status === 401 && data?.message === 'Token expired') {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
    }
    return Promise.reject(error);
});

export default axiosInstance;
