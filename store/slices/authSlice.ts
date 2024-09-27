import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';
import { AuthState, LoginPayload, LoginResponse } from '../types/authTypes';

const initialState: AuthState = {
    token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
    user: null,
    loading: false,
    error: null,
};

export const login = createAsyncThunk('auth/login', async (loginData: { username: string, password: string }, thunkAPI) => {
    try {
        const response = await axiosInstance.post<LoginResponse>('/auth/login', {
            ...loginData,
        });
        const token = response.data.meta.token_string;
        const user = response.data.body;
        localStorage.setItem('token', token);
        return { token, user };
    } catch (error: any) {
        if (error.response && error.response.data) {
            return thunkAPI.rejectWithValue(error.response.data.message);
        }
        return thunkAPI.rejectWithValue('An unknown error occurred');
    }
});


const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.token = null;
            state.user = null;
            localStorage.removeItem('token');
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.token;
                state.user = action.payload.user;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = typeof action.payload === 'string' ? action.payload : 'An unknown error occurred';
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
