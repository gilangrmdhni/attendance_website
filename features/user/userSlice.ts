// features/user/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  name: string;
  workHourTime: string;
  date: string;
}

const initialState: UserState = {
  name: 'Aloy',
  workHourTime: '0:0:0:0',
  date: 'Jumat, 14 Juni 2024',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUser(state, action: PayloadAction<Partial<UserState>>) {
      return { ...state, ...action.payload };
    },
  },
});

export const { updateUser } = userSlice.actions;
export default userSlice.reducer;
