import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/axiosConfig";

export const fetchJobSeekerData = createAsyncThunk(
    'jobSeeker/fetchJobSeekerData',
    async (username, { rejectWithValue }) => {
        try {
            const response = await api.get(`api/jobseeker/byUsername?username=${username}`);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);


export const jobSeekerSlice = createSlice({
    name: 'jobSeeker',
    initialState: {
        jobSeekerData: {},
        status: 'idle',
        error: null        
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchJobSeekerData.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchJobSeekerData.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.jobSeekerData = action.payload; // Corrected property name
            })
            .addCase(fetchJobSeekerData.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export default jobSeekerSlice.reducer;
