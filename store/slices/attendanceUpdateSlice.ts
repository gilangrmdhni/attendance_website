import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

interface AttendanceUpdateRequest {
    description: string;
    start_date: string;
    end_date: string;
    attachment: File;
}

export const submitAttendanceUpdateRequest = createAsyncThunk(
    'attendanceUpdate/submitRequest',
    async (formData: AttendanceUpdateRequest, { rejectWithValue }) => {
        const form = new FormData();
        form.append('description', formData.description);
        form.append('start_date', formData.start_date);
        form.append('end_date', formData.end_date);
        form.append('attachment', formData.attachment);
        try {
            const response = await axiosInstance.post('/request/attendance-update', form);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                return rejectWithValue(error.response.data.message);
            }
            return rejectWithValue('An error occurred while submitting attendance update request');
        }
    }
);

const initialState = {
    data: null as any,
    status: 'idle' as 'idle' | 'loading' | 'succeeded' | 'failed',
    error: null as string | null,
};

const attendanceUpdateSlice = createSlice({
    name: 'attendanceUpdate',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(submitAttendanceUpdateRequest.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(submitAttendanceUpdateRequest.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            .addCase(submitAttendanceUpdateRequest.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    },
});

export default attendanceUpdateSlice.reducer;
