import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

interface TimeOffRequest {
    description: string;
    dates: string;
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
        const form = new FormData();
        form.append('description', formData.description);
        form.append('dates', formData.dates);
        form.append('attachment', formData.attachment);
        const response = await axiosInstance.post('/request/time-off', form);
        return response.data;
    }
);

export const fetchLeaveAllowance = createAsyncThunk(
    'timeoff/fetchLeaveAllowance',
    async () => {
        const response = await axiosInstance.get('/user/leave-allowance');
        return Number(response.data.body.leave_allowance);
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
                state.leaveAllowance = action.payload; // Menyimpan total cuti
            })
            .addCase(fetchLeaveAllowance.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    },
});

export default timeOffSlice.reducer;
