// slices/permissionSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';
import axios, { AxiosError } from 'axios';

interface PermissionRequest {
    category_permission_id: string;
    description: string;
    start_date: string;
    attachment: File;
}

interface Category {
    id: number;
    name: string;
    description: string;
}

export const submitPermissionRequest = createAsyncThunk(
    'permission/submitRequest',
    async (formData: PermissionRequest, { rejectWithValue }) => {
        const form = new FormData();
        form.append('category_permission_id', String(Number(formData.category_permission_id)));
        form.append('description', formData.description);
        form.append('start_date', formData.start_date);
        form.append('attachment', formData.attachment);
        const response = await axiosInstance.post('/request/permission', form);
        return response.data;
    }
);

export const fetchCategories = createAsyncThunk(
    'permission/fetchCategories',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/category-permission/all');
            return response.data.body; // Mengambil kategori dari "body"
        } catch (err: AxiosError | unknown) {
            if (axios.isAxiosError(err) && err.response) {
                return rejectWithValue(err.response.data.message);
            }
            return rejectWithValue('An error occurred while fetching categories');
        }
    }
);

const initialState = {
    data: null as any,
    status: 'idle' as 'idle' | 'loading' | 'succeeded' | 'failed',
    error: null as string | null,
    categories: [] as Category[],  // Menyimpan kategori izin
    categoriesStatus: 'idle' as 'idle' | 'loading' | 'succeeded' | 'failed',
    categoriesError: null as string | null,
};

const permissionSlice = createSlice({
    name: 'permission',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Untuk submit permission request
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

        // Untuk fetch kategori izin
        builder
            .addCase(fetchCategories.pending, (state) => {
                state.categoriesStatus = 'loading';
                state.categoriesError = null;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.categoriesStatus = 'succeeded';
                state.categories = action.payload;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.categoriesStatus = 'failed';
                state.categoriesError = action.payload as string;
            });
    },
});

export default permissionSlice.reducer;
