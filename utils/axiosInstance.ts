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
    if (error.response && error.response.status === 401) {
        // Token kadaluwarsa atau tidak valid
        localStorage.removeItem('token');
        window.location.href = '/login'; // Alihkan pengguna ke halaman login
    }
    return Promise.reject(error);
});

export default axiosInstance;
