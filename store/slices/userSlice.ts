// store/slices/userSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store';
import { User } from '../types/authTypes';

export const fetchUser = createAsyncThunk(
  'user/fetchUser',
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const token = state.auth.token;

    if (!token) {
      return rejectWithValue('No token found');
    }

    try {
      const response = await axios.get('https://api.attendance.nuncorp.id/api/auth/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.body;
    } catch (error: any) {
      return rejectWithValue('Failed to fetch user');
    }
  }
);

export const updateUserPicture = createAsyncThunk(
  'user/updatePicture',
  async (picture: File, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const token = state.auth.token;

    if (!token) {
      return rejectWithValue('No token found');
    }

    const formData = new FormData();
    formData.append('picture', picture);

    try {
      const response = await axios.put('https://api.attendance.nuncorp.id/api/user/update-picture', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      return { picture: URL.createObjectURL(picture) };
    } catch (error: any) {
      return rejectWithValue('Failed to update picture');
    }
  }
);

interface UserState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateUserPicture.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserPicture.fulfilled, (state, action) => {
        state.loading = false;
        if (state.user) {
          state.user.picture = action.payload.picture;
        }
      })
      .addCase(updateUserPicture.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default userSlice.reducer;
