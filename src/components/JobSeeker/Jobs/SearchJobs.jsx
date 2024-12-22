import { Box, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import HeaderAfterLogin from '../../Layouts/HeaderAfterLogin'
import { Link, useParams } from 'react-router-dom';
import api from '../../../services/axiosConfig';

const SearchJobs = () => {
    const [jobs, setJobs] = useState([]);
    const { jobTitle } = useParams(); // Extract jobTitle from the URL

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await api.get(`/api/employer/jobs/${jobTitle}`);
        setJobs(response.data);
      } catch (error) {
        console.error("Error fetching jobs by title:", error);
      }
    };
    fetchJobs();
  }, [jobTitle]);

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
        <Box>
        <Box>
                    {jobs.length >0 ? (
                          jobs.map( (job)=>(
                            <Box className='employerDashboard' key={job.jobId} sx={{mt:'30px'}} > 
                             <Box component={Link} to={`/jobDetails/${job.jobId}`} sx={{ textDecoration: 'none', color: 'inherit' }}>
                                <Typography variant="h4" sx={{ display: "flex", justifyItems: "left", fontSize: '20px' }}>{job.jobTitle}</Typography>
                                <Typography variant="body2" sx={{ display: "flex", justifyItems: "left", mt: '8px' }}> Skills : {job.requiredSkills}</Typography>
                                <Typography variant="body2" sx={{ display: "flex", justifyItems: "left" }}>{job.employmentType}</Typography>
                                <Typography variant="body2" sx={{ display: "flex", justifyItems: "left" }}>{job.company.companyName}</Typography>
                                <Typography variant="body2" sx={{ display: "flex", justifyItems: "left" }}>{job.location?.city}, {job.location?.state}</Typography>
                                <Typography variant="body2" sx={{ display: "flex", justifyItems: "left" }}>{job.salaryRange}</Typography>
                                <Typography variant="body2" sx={{ display: "flex", justifyItems: "left" }}>Posted {calculateDaysSincePosted(job.postedDate)} days ago</Typography>
                            </Box>
                            </Box>
                    ))
                  ): (
                    <Typography sx={{mt:'100px'}}>No Available Jobs</Typography>
                  )
                }
                </Box>
        </Box>
    </Box>
  )
}

export default SearchJobs
