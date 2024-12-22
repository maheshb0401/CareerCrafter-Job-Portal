import { Box, CircularProgress, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import HeaderAfterLogin from '../../Layouts/HeaderAfterLogin';
import api from '../../../services/axiosConfig';
import AuthContext from '../../Auth/AuthContext';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobSeekerData } from '../../../Store/jobSeekerSlice';
import { Link } from 'react-router-dom';

const RecommendedJobs = () => {
    const [recommJobs, setRecommJobs] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const { auth } = useContext(AuthContext); // Access auth context to get the username
    const dispatch = useDispatch();
    const jobSeeker = useSelector((state) => state.jobSeeker);
    const { jobSeekerData, status } = jobSeeker;

    useEffect(() => {
        if (auth?.username && status === 'idle') {
            console.log(auth.username);
            dispatch(fetchJobSeekerData(auth.username));
        }
    }, [dispatch, auth.username, status]);

    useEffect(() => {
        const fetchRecommJobs = async () => {
            if (status === 'succeeded' && jobSeekerData?.profileId) {
                try {
                    const response = await api.get(`/api/recommendations/jobSeeker/${jobSeekerData.profileId}`);
                    console.log(response);
                    setRecommJobs(response.data);
                } catch (err) {
                    console.error("Error fetching recommended jobs:", err.response?.data || err.message);
                    setError(err.response?.data || "An error occurred while fetching recommended jobs.");
                } finally {
                    setLoading(false);
                }
            } else if (status === 'failed') {
                setError("Complete Profile To Check Recommendations");
                setLoading(false);
            }
        };

        fetchRecommJobs();
    }, [jobSeekerData?.profileId, status]);


    return (
        <Box>
            <HeaderAfterLogin />
            <Box className="recomm-jobs">
                <Typography variant='h4' sx={{ mt:'30px', fontSize:'20px'}}>Recommended Jobs</Typography>
            { loading ? ( 
                  <Box sx={{ display: 'flex', justifyContent: 'center', margin: '20px' }}>
                    <CircularProgress />
                  </Box>
                ) : error ? (
                  <Typography color="error">{error}</Typography>
                ): (
                <Box>
                {recommJobs.length > 0 ? (
                    recommJobs.map((job) => (
                        <Box className='employerDashboard' key={job.jobId} sx={{mt:'30px'}}>
                             <Box component={Link} to={`/jobDetails/${job.jobId}`} sx={{ textDecoration: 'none', color: 'inherit' }}>
                             <Typography variant="h4" sx={{ display: "flex", justifyItems: "left", fontSize: '20px' }}>{job.jobTitle}</Typography>
                             <Typography variant="body2" sx={{ display: "flex", justifyItems: "left", mt: '8px' }}> Skills : {job.requiredSkills}</Typography>
                             <Typography variant="body2" sx={{ display: "flex", justifyItems: "left" }}>{job.companyName}, {job.location}</Typography>
                             <Typography variant="body2" sx={{ display: "flex", justifyItems: "left" }}>{job.reason}</Typography>
                             </Box>
                        </Box>
                    ))
                ) : (
                    <Typography>No recommended jobs available.</Typography>
                )}

                </Box>
                )}
            </Box>
        </Box>
    );
};

export default RecommendedJobs;
