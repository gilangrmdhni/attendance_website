// slices/reimbursementSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

interface Attachment {
    amount: number; // Menggunakan number untuk amount
    attachment: string | null;  // Menggunakan File untuk attachment
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
                return rejectWithValue("Network error: Unable to reach the server. Please check your connection.");
            }

            // Handling response with status 400-499 (client errors)
            if (error.response.status >= 400 && error.response.status < 500) {
                const errorMessage = error.response.data.message || "Bad Request";
                console.error("Client error:", errorMessage);
                return rejectWithValue({
                    code: error.response.status,
                    message: errorMessage,
                    details: error.response.data.error || null,
                });
            }

            // Handling response with status 500+ (server errors)
            if (error.response.status >= 500) {
                console.error("Server error:", error.response.data.message || "Internal Server Error");
                return rejectWithValue({
                    code: error.response.status,
                    message: "Server error: Please try again later or contact support.",
                });
            }

            // Handling any other unclassified errors
            console.error("Unexpected error:", error.message);
            return rejectWithValue("Unexpected error occurred. Please try again.");
        }
    }
);


const initialState = {
    data: null as any,
    status: 'idle' as 'idle' | 'loading' | 'succeeded' | 'failed',
    error: null as string | null,
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
                state.error = action.payload as string;
            });
    },
});

export default reimbursementSlice.reducer;
