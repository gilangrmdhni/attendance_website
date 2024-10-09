// slices/approvalSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

// Interface untuk Approval Request
interface ApprovalRequest {
    request_id: number;
    full_name: string;
    position: string;
    status: string;
}


interface UpdateApprovalStatusPayload {
    request_id: number;
    status: boolean;
    message?: string; // Buat message opsional
}

// Async thunk untuk mengambil data request approval
export const fetchApprovalRequests = createAsyncThunk(
    'approval/fetchRequests',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/request-approval/all');
            return response.data.body;
        } catch (error: any) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const updateApprovalStatus = createAsyncThunk(
    'approval/updateStatus',
    async ({ request_id, status, message }: UpdateApprovalStatusPayload, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/request-approval/update`, {
                request_id,
                status,
                message, // Sertakan message di sini
            });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data);
        }
    }
);

const initialState = {
    requests: [] as ApprovalRequest[],
    status: 'idle' as 'idle' | 'loading' | 'succeeded' | 'failed',
    error: null as string | null,
};

const approvalSlice = createSlice({
    name: 'approval',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchApprovalRequests.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchApprovalRequests.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.requests = action.payload;
            })
            .addCase(fetchApprovalRequests.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(updateApprovalStatus.fulfilled, (state, action) => {
                const updatedRequest = action.meta.arg;
                const index = state.requests.findIndex(req => req.request_id === updatedRequest.request_id);
                if (index !== -1) {
                    state.requests[index].status = updatedRequest.status ? 'approved' : 'rejected';
                }
            });
    },
});

export default approvalSlice.reducer;
