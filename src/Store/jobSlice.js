import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/axiosConfig";


export const fetchEmployerData = createAsyncThunk(
    'employer/fetchEmployerData', 
    async(username, {rejectWithValue})=>{
        try{
            const response = await api.get(`api/employer/byUsername?username=${username}`);
            return response.data;
        }catch(err){
            return rejectWithValue(err.response?.data||err.message);
        }
    }
);

export const employerSlice = createSlice({
    name: 'employer',
    initialState:{
        employerData: { jobPostings: [] },
        status: 'idle',
        error : null
    },
    reducers:{
        addJob(state, action) {
            if (state.employerData && state.employerData.jobPostings) {
              state.employerData.jobPostings.push(action.payload);
            }
          },
    },
    extraReducers: (builder)=>{
        builder
        .addCase(fetchEmployerData.pending, (state)=>{
            state.status='loading';
        })
        .addCase(fetchEmployerData.fulfilled, (state, action)=>{
            state.status='succeeded';
            state.employerData = action.payload;
        })
        .addCase(fetchEmployerData.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload;
          });
    },
});

export const {addJob} = employerSlice.actions;
export default employerSlice.reducer;