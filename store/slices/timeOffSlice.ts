// slices/timeOffSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

interface TimeOffRequest {
    description: string;
    start_date: string;
    end_date: string;
    attachment: File;
}

interface LeaveAllowanceState {
    leaveAllowance: number | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    data: any; // Ganti dengan tipe yang lebih spesifik jika memungkinkan
}

export const submitTimeOffRequest = createAsyncThunk(
    'timeoff/submitRequest',
    async (formData: TimeOffRequest, { rejectWithValue }) => {
        try {
            const form = new FormData();
            form.append('description', formData.description);
            form.append('start_date', formData.start_date);
            form.append('end_date', formData.end_date);
            form.append('attachment', formData.attachment);

            const response = await axiosInstance.post('/request/time-off', form);

            // Jika sukses, kembalikan data dari response
            return response.data;
        } catch (error: any) {
            // Menangani error jaringan (misalnya tidak ada koneksi)
            if (!error.response) {
                console.error("Kesalahan jaringan:", error.message);
                return rejectWithValue({
                    code: 0,
                    message: "Kesalahan jaringan: Tidak dapat menghubungi server. Silakan periksa koneksi Anda.",
                    details: error.message,
                });
            }

            // Menangani kesalahan client (4xx)
            if (error.response.status >= 400 && error.response.status < 500) {
                const errorMessage = error.response.data.message || "Permintaan tidak valid. Silakan periksa inputan Anda.";
                console.error("Kesalahan klien:", errorMessage);
                return rejectWithValue({
                    code: error.response.status,
                    message: errorMessage,
                    details: error.response.data.error || null,
                });
            }

            // Menangani kesalahan otentikasi atau izin (401/403)
            if (error.response.status === 401) {
                console.error("Unauthorized:", error.response.data.message || "Akses tidak sah. Silakan login untuk melanjutkan.");
                return rejectWithValue({
                    code: 401,
                    message: "Akses ditolak. Anda perlu login untuk melanjutkan.",
                    details: error.response.data.error || null,
                });
            }

            if (error.response.status === 403) {
                console.error("Forbidden:", error.response.data.message || "Anda tidak memiliki izin untuk melakukan tindakan ini.");
                return rejectWithValue({
                    code: 403,
                    message: "Anda tidak memiliki izin untuk melakukan tindakan ini.",
                    details: error.response.data.error || null,
                });
            }

            // Menangani kesalahan server (5xx)
            if (error.response.status >= 500) {
                console.error("Kesalahan server:", error.response.data.message || "Terjadi kesalahan internal server.");
                return rejectWithValue({
                    code: error.response.status,
                    message: "Terjadi kesalahan di server, coba lagi nanti atau hubungi dukungan.",
                    details: error.response.data.error || null,
                });
            }

            // Menangani kesalahan tak terduga
            console.error("Kesalahan tak terduga:", error.message);
            return rejectWithValue({
                code: 0,
                message: "Terjadi kesalahan yang tidak terduga. Mohon coba lagi.",
                details: error.message,
            });
        }
    }
);

export const fetchLeaveAllowance = createAsyncThunk(
    'timeoff/fetchLeaveAllowance',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/user/leave-allowance');
            return Number(response.data.body.leave_allowance);
        } catch (error: any) {
            // Menangani error jaringan (misalnya tidak ada koneksi)
            if (!error.response) {
                console.error("Kesalahan jaringan:", error.message);
                return rejectWithValue({
                    code: 0,
                    message: "Kesalahan jaringan: Tidak dapat menghubungi server. Silakan periksa koneksi Anda.",
                    details: error.message,
                });
            }

            // Menangani kesalahan client (4xx)
            if (error.response.status >= 400 && error.response.status < 500) {
                const errorMessage = error.response.data.message || "Permintaan tidak valid. Silakan periksa inputan Anda.";
                console.error("Kesalahan klien:", errorMessage);
                return rejectWithValue({
                    code: error.response.status,
                    message: errorMessage,
                    details: error.response.data.error || null,
                });
            }

            // Menangani kesalahan server (5xx)
            if (error.response.status >= 500) {
                console.error("Kesalahan server:", error.response.data.message || "Terjadi kesalahan internal server.");
                return rejectWithValue({
                    code: error.response.status,
                    message: "Terjadi kesalahan di server, coba lagi nanti atau hubungi dukungan.",
                    details: error.response.data.error || null,
                });
            }

            // Menangani kesalahan tak terduga
            console.error("Kesalahan tak terduga:", error.message);
            return rejectWithValue({
                code: 0,
                message: "Terjadi kesalahan yang tidak terduga. Mohon coba lagi.",
                details: error.message,
            });
        }
    }
);

const initialState: LeaveAllowanceState = {
    leaveAllowance: null,
    status: 'idle',
    error: null,
    data: null,
};

const timeOffSlice = createSlice({
    name: 'timeoff',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(submitTimeOffRequest.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(submitTimeOffRequest.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            .addCase(submitTimeOffRequest.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(fetchLeaveAllowance.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchLeaveAllowance.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.leaveAllowance = action.payload;
            })
            .addCase(fetchLeaveAllowance.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    },
});

export default timeOffSlice.reducer;
