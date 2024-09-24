import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';
import { CheckinState, CheckInResponse } from '../types/checkinTypes';

const initialState: CheckinState = {
    status: 'idle',
    error: null,
    data: null,

};

export const checkInWFO = createAsyncThunk<
    CheckInResponse,
    FormData,
    { rejectValue: string }
>(
    'checkin/checkInWFO',
    async (payload, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post<CheckInResponse>('/attendance/wfo', payload, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error: any) {
            const errorMessage = error.response?.data?.error || 'Failed to check in WFO';
            return rejectWithValue(errorMessage);
        }
    }
);

export const checkInWFAWFH = createAsyncThunk<
    CheckInResponse,
    FormData,
    { rejectValue: string }
>(
    'checkin/checkInWFAWFH',
    async (payload, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post<CheckInResponse>('/attendance/wfa', payload, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error: any) {
            const errorMessage = error.response?.data?.error || 'Failed to check in WFA/WFH';
            return rejectWithValue(errorMessage);
        }
    }
);

const checkinSlice = createSlice({
    name: 'checkin',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(checkInWFO.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(checkInWFO.fulfilled, (state, action: PayloadAction<CheckInResponse>) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            .addCase(checkInWFO.rejected, (state, action: PayloadAction<string | undefined>) => {
                state.status = 'failed';
                state.error = action.payload || 'Failed to check in WFO';
            })
            .addCase(checkInWFAWFH.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(checkInWFAWFH.fulfilled, (state, action: PayloadAction<CheckInResponse>) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            .addCase(checkInWFAWFH.rejected, (state, action: PayloadAction<string | undefined>) => {
                state.status = 'failed';
                state.error = action.payload || 'Failed to check in WFA/WFH';
            });
    },
});

export default checkinSlice.reducer;