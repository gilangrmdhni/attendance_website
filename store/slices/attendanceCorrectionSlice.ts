import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

interface AttendanceUpdateRequest {
    description: string;
    start_date: string;
    end_date: string;
    attachment: File;
}

interface LeaveAllowanceState {
    leaveAllowance: number | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    data: any; 
}

export const submitAttendanceUpdateRequest = createAsyncThunk(
    'attendanceupdate/submitRequest',
    async (formData: AttendanceUpdateRequest, { rejectWithValue }) => {
        const form = new FormData();
        form.append('description', formData.description);
        form.append('start_date', formData.start_date);
        form.append('end_date', formData.end_date);
        form.append('attachment', formData.attachment);
        const response = await axiosInstance.post('/request/attendance-update', form);
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
