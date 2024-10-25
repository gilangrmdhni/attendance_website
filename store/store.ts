import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import checkinReducer from './slices/checkinSlice';
import announcementReducer from './slices/announcementSlice';
import newsDetailReducer from './slices/newsDetailSlice';
import historyReducer from './slices/historySlice';
import requestApprovalReducer from './slices/requestApprovalSlice';
import approvalReducer from './slices/approvalRequestSlice';
import checkoutReducer from './slices/checkoutSlice';
import attendanceReducer from './slices/attendanceSlice';
import reimbursementReducer from './slices/reimbursementSlice';
import permissionReducer from './slices/permissionSlice';
import timeOffReducer from './slices/timeOffSlice';
import notificationReducer from './slices/notificationSlice';
import announcementDetailReducer from './slices/announcementDetailSlice';
import attendanceUpdateReducer from './slices/attendanceUpdateSlice';
import { useDispatch } from 'react-redux';

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    checkin: checkinReducer,
    checkout: checkoutReducer,
    announcements: announcementReducer,
    announcementDetail: announcementDetailReducer,
    newsDetail: newsDetailReducer,
    history: historyReducer,
    requestApproval: requestApprovalReducer,
    attendance: attendanceReducer,
    reimbursement: reimbursementReducer,
    permission: permissionReducer,
    timeOff: timeOffReducer,
    notifications: notificationReducer,
    approval: approvalReducer,
    attendanceUpdate: attendanceUpdateReducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
