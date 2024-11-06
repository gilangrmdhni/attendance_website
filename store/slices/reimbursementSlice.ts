// slices/reimbursementSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

interface Attachment {
    amount: number; // Menggunakan number untuk amount
    attachment: string | null;  // Menggunakan string untuk attachment (URL atau path file)
}

interface ReimbursementRequest {
    start_date: string; // Tanggal mulai
    end_date: string; // Tanggal akhir
    description: string;
    trip: string;
    attachments: Attachment[]; // Menggunakan array untuk attachments
}

export const submitReimbursementRequest = createAsyncThunk(
    'reimbursement/submitRequest',
    async (formData: ReimbursementRequest, { rejectWithValue }) => {
        try {
            // Membangun payload JSON sesuai dengan dokumentasi
            const payload = {
                start_date: formData.start_date,
                end_date: formData.end_date,
                description: formData.description,
                trip: formData.trip,
                attachments: formData.attachments.map((attachment) => ({
                    amount: attachment.amount,
                    attachment: attachment.attachment,
                })),
            };

            // Log data untuk memastikan struktur payload
            console.log("Data yang dikirim ke API:", payload);

            // Mengirim request dengan header `Content-Type` yang sesuai
            const response = await axiosInstance.post('/request/reimbursment', payload, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response.data;

        } catch (error: any) {
            // Handling network errors
            if (!error.response) {
                console.error("Network error:", error.message);
                return rejectWithValue({
                    code: 0,
                    message: "Kesalahan jaringan: Tidak dapat menghubungi server. Silakan periksa koneksi Anda.",
                    details: error.message,
                });
            }

            // Handling response with status 400-499 (client errors)
            if (error.response.status >= 400 && error.response.status < 500) {
                const errorMessage = error.response.data.message || "Permintaan tidak valid. Silakan periksa kembali inputan Anda.";
                console.error("Kesalahan klien:", errorMessage);
                return rejectWithValue({
                    code: error.response.status,
                    message: errorMessage,
                    details: error.response.data.error || null,
                });
            }

            // Handling response with status 401 (Unauthorized)
            if (error.response.status === 401) {
                console.error("Unauthorized:", error.response.data.message || "Akses tidak sah. Silakan login untuk melanjutkan.");
                return rejectWithValue({
                    code: 401,
                    message: "Akses ditolak. Anda perlu login untuk melanjutkan.",
                    details: error.response.data.error || null,
                });
            }

            // Handling response with status 403 (Forbidden)
            if (error.response.status === 403) {
                console.error("Forbidden:", error.response.data.message || "Anda tidak memiliki izin untuk melakukan tindakan ini.");
                return rejectWithValue({
                    code: 403,
                    message: "Anda tidak memiliki izin untuk melakukan tindakan ini.",
                    details: error.response.data.error || null,
                });
            }

            // Handling response with status 404 (Not Found)
            if (error.response.status === 404) {
                console.error("Not Found:", error.response.data.message || "Data yang diminta tidak ditemukan.");
                return rejectWithValue({
                    code: 404,
                    message: "Data yang diminta tidak ditemukan.",
                    details: error.response.data.error || null,
                });
            }

            // Handling response with status 500+ (server errors)
            if (error.response.status >= 500) {
                console.error("Server error:", error.response.data.message || "Terjadi kesalahan internal server.");
                return rejectWithValue({
                    code: error.response.status,
                    message: "Terjadi kesalahan di server, coba lagi nanti atau hubungi dukungan.",
                    details: error.response.data.error || null,
                });
            }

            // Handling any other unclassified errors
            console.error("Kesalahan tak terduga:", error.message);
            return rejectWithValue({
                code: 0,
                message: "Terjadi kesalahan yang tidak terduga. Mohon coba lagi.",
                details: error.message,
            });
        }
    }
);

const initialState = {
    data: null as any,
    status: 'idle' as 'idle' | 'loading' | 'succeeded' | 'failed',
    error: null as {
        code: number;
        message: string;
        details?: string | null;
    } | null,
};

const reimbursementSlice = createSlice({
    name: 'reimbursement',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(submitReimbursementRequest.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(submitReimbursementRequest.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            .addCase(submitReimbursementRequest.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as { code: number; message: string; details?: string };
            });
    },
});

export default reimbursementSlice.reducer;
