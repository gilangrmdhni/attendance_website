import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import axiosInstance from '../../utils/axiosInstance';

interface OvertimeRequest {
    description: string;
    dates: string;
    overtime_hours: number;
    attachment: File;
}

export const submitOvertimeRequest = createAsyncThunk(
    'overtime/submitRequest',
    async (formData: OvertimeRequest, { rejectWithValue }) => {
        const form = new FormData();
        form.append('description', formData.description);
        form.append('dates', formData.dates);
        form.append('overtime_hours', formData.overtime_hours.toString());
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
