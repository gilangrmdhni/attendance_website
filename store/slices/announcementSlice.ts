// store/slices/announcementSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

interface Announcement {
    id: number;
    title: string;
    description: string;
    dates: string;
    picture: string;
}

interface AnnouncementState {
    announcements: Announcement[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: AnnouncementState = {
    announcements: [],
    status: 'idle',
    error: null,
};


// Async thunk untuk mengambil data dari API
export const fetchAnnouncements = createAsyncThunk(
    'announcements/fetchAnnouncements',
    async () => {
        const response = await axiosInstance.get('/news/all');
        return response.data.body;
    }
);

const announcementSlice = createSlice({
    name: 'announcements',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAnnouncements.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchAnnouncements.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.announcements = action.payload;
                state.error = null;
            })
            .addCase(fetchAnnouncements.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Something went wrong';
            });
    },
});

export default announcementSlice.reducer;
