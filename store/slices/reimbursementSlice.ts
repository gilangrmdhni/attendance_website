// slices/reimbursementSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

interface ReimbursementRequest {
    description: string;
    dates: string;
    account: string;
    amount: string;
    trip: string;
    attachment: File;
}

export const submitReimbursementRequest = createAsyncThunk(
    'reimbursement/submitRequest',
    async (formData: ReimbursementRequest, { rejectWithValue }) => {
        const form = new FormData();
        form.append('description', formData.description);
        form.append('dates', formData.dates);
        form.append('account', formData.account);
        form.append('amount', formData.amount);
        form.append('trip', formData.trip);
        form.append('attachment', formData.attachment);
        const response = await axiosInstance.post('/request/reimbursment', form);
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
