import {configureStore} from '@reduxjs/toolkit';
import  employerReducer  from './jobSlice';
import jobSeekerReducer from './jobSeekerSlice';


const store = configureStore({
    reducer:{
        jobs: employerReducer,
        jobSeeker: jobSeekerReducer
    },
});

export default store;