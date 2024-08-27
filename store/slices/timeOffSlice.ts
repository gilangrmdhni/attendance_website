import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import axiosInstance from '../../utils/axiosInstance';

interface TimeOffRequest {
    description: string;
    dates: string;
    attachment: File;
}

export const submitTimeOffRequest = createAsyncThunk(
    'timeoff/submitRequest',
    async (formData: TimeOffRequest, { rejectWithValue }) => {
        const form = new FormData();
        form.append('description', formData.description);
        form.append('dates', formData.dates);
        form.append('attachment', formData.attachment);
        const response = await axiosInstance.post('/request/time-off', form);
        return response.data;
    }
);

const initialState = {
    data: null as any,
    status: 'idle' as 'idle' | 'loading' | 'succeeded' | 'failed',
    error: null as string | null,
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
            });
    },
});

export default timeOffSlice.reducer;
