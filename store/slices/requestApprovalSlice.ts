import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';
import { RequestApproval, RequestApprovalState } from '../types/historyTypes';

const initialState: RequestApprovalState = {
  requests: [],
  status: 'idle',
  error: null,
};

export const fetchRequestApprovals = createAsyncThunk(
    'requestApproval/fetchRequestApprovals',
    async () => {
      const response = await axiosInstance.get('/request-approval/history?page=1&limit=10');
      return response.data.body;
    }
  );  
  
const requestApprovalSlice = createSlice({
  name: 'requestApproval',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRequestApprovals.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchRequestApprovals.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.requests = action.payload;
      })
      .addCase(fetchRequestApprovals.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Something went wrong';
      });
  },
});

export default requestApprovalSlice.reducer;
