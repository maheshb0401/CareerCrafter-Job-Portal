import { Box, CircularProgress, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import api from '../../../services/axiosConfig';
import HeaderAfterLogin from '../../Layouts/HeaderAfterLogin';
import { Link } from 'react-router-dom';
import WysiwygIcon from '@mui/icons-material/Wysiwyg';

const AvailableJobs = () => {

  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect ( () => {
    const fetchAvailableJobs =  async ()=>{
      try{
        const response = await api.get("api/jobseeker/jobs");
        setJobs(response.data);
      }catch (err){
        console.error("Error Fetching Available Jobs ", err.response?.data || err.message);
        setError(err.response?.data || "An error occurred while fetching recommended jobs.");
      }finally{
        setLoading(false);
      }
    }
    fetchAvailableJobs();
  }, [])

  const calculateDaysSincePosted = (postedDate) => {
    const posted = new Date(postedDate);
    const today = new Date();
    const diffInTime = today - posted;
    const diffInDays = Math.floor(diffInTime / (1000 * 60 * 60 * 24));
    return diffInDays;
};

  return (
    <Box>
      <HeaderAfterLogin/>
      <Box className='AvailableJobs'>
         <Typography variant='h4' sx={{ mt:'30px', fontSize:'20px'}}>Available Jobs</Typography>
                { loading ? ( 
                  <Box sx={{ display: 'flex', justifyContent: 'center', margin: '20px' }}>
                    <CircularProgress />
                  </Box>
                ) : error ? (
                  <Typography color="error">{error}</Typography>
                ): (
                <Box>
                    {jobs.length >0 ? (
                          jobs.map( (job)=>(
                            <Box className='employerDashboard' key={job.jobId} sx={{mt:'30px'}} > 
                             <Box component={Link} to={`/jobDetails/${job.jobId}`} sx={{ textDecoration: 'none', color: 'inherit' }}>
                             <Box sx={{display:'flex'}}>
                              <WysiwygIcon color="primary" sx={{mr:'7px'}}></WysiwygIcon>
                                <Typography variant="h4" sx={{ display: "flex", justifyItems: "left", fontSize: '20px' }}>{job.jobTitle}</Typography>
                                </Box>
                                <Typography variant="body2" sx={{ display: "flex", justifyItems: "left", mt: '8px' }}> Skills : {job.requiredSkills}</Typography>
                                <Typography variant="body2" sx={{ display: "flex", justifyItems: "left" }}>{job.employmentType}</Typography>
                                <Typography variant="body2" sx={{ display: "flex", justifyItems: "left" }}>{job.company.companyName}</Typography>
                                <Typography variant="body2" sx={{ display: "flex", justifyItems: "left" }}>{job.companyLocation.city}, {job.companyLocation.state}</Typography>
                                <Typography variant="body2" sx={{ display: "flex", justifyItems: "left" }}>{job.salaryRange}</Typography>
                                <Typography variant="body2" sx={{ display: "flex", justifyItems: "left" }}>Posted {calculateDaysSincePosted(job.postedDate)} days ago</Typography>
                            </Box>
                            </Box>
                    ))
                  ): (
                    <Typography>No Available Jobs</Typography>
                  )
                }
                </Box>
                            )}
                </Box>
                </Box>
  )
}

export default AvailableJobs;
