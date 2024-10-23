import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import axiosInstance from '../../utils/axiosInstance';

interface OvertimeRequest {
    description: string;
    start_date: string;
    start_hours: number;
    end_hours: number;
    attachment: File;
}

export const submitOvertimeRequest = createAsyncThunk(
    'overtime/submitRequest',
    async (formData: OvertimeRequest, { rejectWithValue }) => {
        const form = new FormData();
        form.append('description', formData.description);
        form.append('start_date', formData.start_date);
        form.append('start_hours', formData.start_hours.toString());
        form.append('end_hours', formData.end_hours.toString());
        form.append('attachment', formData.attachment);
        const response = await axiosInstance.post('/request/overtime', form);
        return response.data;
    }
);

const initialState = {
    data: null as any,
    status: 'idle' as 'idle' | 'loading' | 'succeeded' | 'failed',
    error: null as string | null,
};

const overtimeSlice = createSlice({
    name: 'overtime',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(submitOvertimeRequest.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(submitOvertimeRequest.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            .addCase(submitOvertimeRequest.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    },
});

export default overtimeSlice.reducer;
