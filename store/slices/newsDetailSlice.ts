import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

export interface NewsDetail {
  id: number;
  title: string;
  description: string;
  created_at: string;
  picture: string;
}

interface NewsDetailState {
  newsDetail: NewsDetail | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: NewsDetailState = {
  newsDetail: null,
  status: 'idle',
  error: null,
};

export const fetchNewsDetail = createAsyncThunk(
  'newsDetail/fetchNewsDetail',
  async (id: number) => {
    const response = await axiosInstance.get(`/news/${id}`);
    return response.data.body;
  }
);

const newsDetailSlice = createSlice({
  name: 'newsDetail',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNewsDetail.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchNewsDetail.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.newsDetail = action.payload;
      })
      .addCase(fetchNewsDetail.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Something went wrong';
      });
  },
});

export default newsDetailSlice.reducer;
