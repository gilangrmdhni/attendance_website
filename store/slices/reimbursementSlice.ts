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
        const form = new FormData();
        form.append('start_date', formData.start_date);
        form.append('end_date', formData.end_date);
        form.append('description', formData.description);
        form.append('trip', formData.trip);

        formData.attachments.forEach((attachment, index) => {
            form.append(`attachments[${index}][amount]`, attachment.amount.toString());
            form.append(`attachments[${index}][attachment]`, attachment.attachment ?? '');
        });

        // Log data yang akan dikirim
        console.log("Data yang dikirim ke API:", {
            start_date: formData.start_date,
            end_date: formData.end_date,
            description: formData.description,
            trip: formData.trip,
            attachments: formData.attachments.map((attachment) => ({
                amount: attachment.amount,
                attachment: attachment.attachment,
            })),
        });
        const response = await axiosInstance.post('/request/reimbursement', form);
        return response.data;

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
