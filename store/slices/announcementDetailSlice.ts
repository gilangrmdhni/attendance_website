import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance'; // Import axiosInstance

export interface AnnouncementDetailState {
  announcement: {
    id: number;
    title: string;
    description: string;
    dates: string;
    picture: string;
  } | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AnnouncementDetailState = {
  announcement: null,
  status: 'idle',
  error: null,
};

// Thunk untuk fetch detail pengumuman
export const fetchAnnouncementDetail = createAsyncThunk(
  'announcementDetail/fetchAnnouncementDetail',
  async (id: number) => {
    const response = await axiosInstance.get(`/news/${id}`); // Gunakan axiosInstance
    return response.data.body;
  }
);

const announcementDetailSlice = createSlice({
  name: 'announcementDetail',
  initialState,
  reducers: {
    reset: (state) => {
      state.announcement = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnnouncementDetail.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAnnouncementDetail.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.announcement = action.payload;
      })
      .addCase(fetchAnnouncementDetail.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch announcement detail';
      });
  },
});

export const { reset } = announcementDetailSlice.actions;
export default announcementDetailSlice.reducer;
