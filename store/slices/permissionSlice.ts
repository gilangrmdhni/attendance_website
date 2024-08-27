// slices/permissionSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';
import axios, { AxiosError } from 'axios';

interface PermissionRequest {
    permission: string;
    description: string;
    dates: string; // Pastikan format tanggal sesuai yang diharapkan API
    attachment: File; // Menyesuaikan dengan tipe file
}

export const submitPermissionRequest = createAsyncThunk(
    'permission/submitRequest',
    async (formData: PermissionRequest, { rejectWithValue }) => {
        const form = new FormData();
        form.append('permission', formData.permission);
        form.append('description', formData.description);
        form.append('dates', formData.dates);
        form.append('attachment', formData.attachment);
        const response = await axiosInstance.post('/request/permission', form);
        return response.data;
    }
);
const initialState = {
    data: null as any,
    status: 'idle' as 'idle' | 'loading' | 'succeeded' | 'failed',
    error: null as string | null,
};

const permissionSlice = createSlice({
    name: 'permission',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(submitPermissionRequest.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(submitPermissionRequest.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            .addCase(submitPermissionRequest.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    },
});

export default permissionSlice.reducer;
