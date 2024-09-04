import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';
import { HistoryItem, HistoryState } from '../types/historyTypes';

const initialState: HistoryState = {
  history: [],
  status: 'idle',
  error: null,
};

export const fetchHistory = createAsyncThunk(
  'history/fetchHistory',
  async () => {
    const response = await axiosInstance.get('/attendance/history');
    return response.data.body;
  }
);

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHistory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchHistory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.history = action.payload;
      })
      .addCase(fetchHistory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Something went wrong';
      });
  },
});

export default historySlice.reducer;
