import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { User } from '../types/authTypes';
import axiosInstance from '../../utils/axiosInstance';


export const fetchUser = createAsyncThunk(
  'user/fetchUser',
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const token = state.auth.token;

    if (!token) {
      return rejectWithValue('No token found');
    }

    try {
      const response = await axiosInstance.get('/auth/user', {
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
      const response = await axiosInstance.put('/user/update-picture', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('API Response:', response.data);
      
      // Kembalikan URL gambar baru, jika tidak ada di body, maka kembalikan null
      return response.data.body?.picture || null; 
    } catch (error: any) {
      console.error('Error while updating picture:', error);
      return rejectWithValue('Failed to update picture');
    }    
  }
);

// Update User Profile
export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async (profileData: { full_name: string; email: string; phone_number: string }, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const token = state.auth.token;

    if (!token) {
      return rejectWithValue('No token found');
    }

    try {
      const response = await axiosInstance.put('/user/update-profile', profileData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data.body;
    } catch (error: any) {
      return rejectWithValue('Failed to update profile');
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
          state.user.picture = action.payload;  
        }
      })      
      .addCase(updateUserPicture.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default userSlice.reducer;
