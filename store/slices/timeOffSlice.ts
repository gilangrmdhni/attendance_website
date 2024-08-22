import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const submitTimeOffRequest = createAsyncThunk(
    'timeOff/submitRequest',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await axios.post('https://api.attendance.nuncorp.id/api/request/time-off', formData);
            return response.data;
        } catch (error) {
            return rejectWithValue('An unknown error occurred');
        }
    }
);

const initialState = {
    data: null as any,
    status: 'idle' as 'idle' | 'loading' | 'succeeded' | 'failed',
    error: null as string | null,
};


const timeOffSlice = createSlice({
    name: 'timeOff',
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
