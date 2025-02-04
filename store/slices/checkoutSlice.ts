import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { CheckoutPayload, CheckoutResponse } from '../types/checkoutTypes';
import axiosInstance from '@/utils/axiosInstance';

// Fungsi checkoutWFO yang diperbarui
export const checkoutWFO = createAsyncThunk<CheckoutResponse, CheckoutPayload>(
  'checkout/checkoutWFO',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/attendance/wfo/out', payload);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to checkout WFO');
    }
  }
);

// Fungsi checkoutWFAWFH yang diperbarui
export const checkoutWFAWFH = createAsyncThunk<CheckoutResponse, CheckoutPayload>(
  'checkout/checkoutWFAWFH',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/attendance/wfa/out', payload);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to checkout WFA/WFH');
    }
  }
);

// Modifikasi CheckoutState jika diperlukan
interface CheckoutState {
  data: CheckoutResponse | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  message: string | null; 
}

const initialState: CheckoutState = {
  data: null,
  status: 'idle',
  error: null,
  message: null, 
};

// Sisa kode tetap sama
const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(checkoutWFO.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(checkoutWFO.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = 'succeeded';
      })
      .addCase(checkoutWFO.rejected, (state, action) => {
        state.error = action.payload as string;
        state.status = 'failed';
      })
      .addCase(checkoutWFAWFH.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(checkoutWFAWFH.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = 'succeeded';
      })
      .addCase(checkoutWFAWFH.rejected, (state, action) => {
        state.error = action.payload as string;
        state.status = 'failed';
      });
  },
});

export default checkoutSlice.reducer;
