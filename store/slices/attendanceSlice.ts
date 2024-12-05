import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../../store/store';
import axiosInstance from '@/utils/axiosInstance';

export const fetchTimer = createAsyncThunk<string | null>(
  'attendance/fetchTimer',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/attendance/timer');
      return response.data.body.checkin_at;
    } catch (error) {
      return rejectWithValue('Failed to fetch timer');
    }
  }
);

export const fetchCheckinStatus = createAsyncThunk<boolean>(
  'attendance/fetchCheckinStatus',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/attendance/status'); // Example endpoint
      return response.data.body.isWFO; // Assuming you get isWFO status from this endpoint
    } catch (error) {
      return rejectWithValue('Failed to fetch check-in status');
    }
  }
);

interface AttendanceState {
  checkinAt: string | null;
  elapsedTime: number;
  isWFO: boolean;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AttendanceState = {
  checkinAt: null,
  elapsedTime: 0,
  isWFO: false,
  status: 'idle',
  error: null,
};

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    setElapsedTime(state, action) {
      state.elapsedTime = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTimer.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTimer.fulfilled, (state, action) => {
        state.checkinAt = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchTimer.rejected, (state, action) => {
        state.error = action.payload as string;
        state.status = 'failed';
      })
      .addCase(fetchCheckinStatus.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCheckinStatus.fulfilled, (state, action) => {
        state.isWFO = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchCheckinStatus.rejected, (state, action) => {
        state.error = action.payload as string;
        state.status = 'failed';
      });
  },
});

export const { setElapsedTime } = attendanceSlice.actions;
export default attendanceSlice.reducer;
