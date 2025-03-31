import { Box, CircularProgress, Typography } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import HeaderAfterLogin from '../../Layouts/HeaderAfterLogin';
import AuthContext from '../../Auth/AuthContext';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobSeekerData } from '../../../Store/jobSeekerSlice';
import api from '../../../services/axiosConfig';
import { Link } from 'react-router-dom';
import WysiwygIcon from '@mui/icons-material/Wysiwyg';

const AppliedJobs = () => {
  const [appData, setAppData] = useState([]);
  const[loading, setLoading] = useState(false);
  const [error, setError] = useState([]);

  const {auth} = useContext(AuthContext);
  const dispatch = useDispatch();
  const jobSeeker = useSelector( (state) => state.jobSeeker);
  const {jobSeekerData, status} = jobSeeker || {};

   useEffect( ()=>{
          if(auth?.username && status==='idle'){
              dispatch(fetchJobSeekerData(auth.username));
          }
      },[dispatch, auth.username, status])

   useEffect( ()=>{
         const fetchApplicationData = async()=>{
          if (status === 'succeeded' && jobSeekerData?.profileId) {
          try{
            const response = await api.get(`api/applications/jobSeeker/${jobSeekerData.profileId}`);
            setAppData(response.data);
          }catch(err){
            console.error("Error in fetching application data", err.response?.data || err.message);
            setError("Error in fetching Data" || err.response?.data);
          }finally{
            setLoading(false);
          }
         }  else if (status === 'failed') {
          setError("Failed to load job seeker data.");
          setLoading(false);
      }
        };
         fetchApplicationData();
   }, [jobSeekerData.profileId, status])

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
         <Typography variant='h4' sx={{ mt:'30px', fontSize:'20px'}}>Applied Jobs</Typography>
                {/* { loading ? ( 
                  <Box sx={{ display: 'flex', justifyContent: 'center', margin: '20px' }}>
                    <CircularProgress />
                  </Box>
                ) : error ? (
                  <Typography color="error">{error}</Typography>
                ): ( */}
                <Box>
                    {appData.length > 0 ? (
                          appData.map( (app)=>(
                            <Box className='employerDashboard' key={app.applicationId} sx={{mt:'30px'}} > 
                             <Box>
                                <Box sx={{display:'flex'}}>
                                                            <WysiwygIcon color="primary" sx={{mr:'7px'}}></WysiwygIcon>
                                <Typography variant="h4" sx={{ display: "flex", justifyItems: "left", fontSize: '20px' }}>{app.jobPosting?.jobTitle}</Typography> </Box>
                                {/* <Typography variant="body2" sx={{ display: "flex", justifyItems: "left", mt: '8px' }}> Skills : {app.requiredSkills}</Typography> */}
                                <Typography variant="body2" sx={{ display: "flex", justifyItems: "left", mt:'8px' }}>{app.jobPosting?.employmentType}</Typography>
                                <Typography variant="body2" sx={{ display: "flex", justifyItems: "left" }}>{app.jobPosting?.company?.companyName}</Typography>
                                <Typography variant="body2" sx={{ display: "flex", justifyItems: "left" }}>{app.jobPosting?.location.city}, {app.jobPosting?.location.state}</Typography>
                                <Typography variant="body2" sx={{ display: "flex", justifyItems: "left" }}>{app.jobPosting?.salaryRange}</Typography>
                                <Box sx={{ display: "flex", justifyItems: "left" }}>
                                <Typography sx={{mt:'0px'}} variant="body2" >Applied {calculateDaysSincePosted(app.applicationDate)} days ago</Typography>
                                <Typography sx={{ml: '30px', fontSize:'14px', fontStyle: 'italic', color: 'blue'}}>{app.status}</Typography>
                                </Box>

                            </Box>
                            </Box>
                    ))
                  ): (
                    <Typography>No Applied Jobs</Typography>
                  )
                }
                </Box>
              {/* ) } */}
         </Box>
    </Box>
  )
}

export default AppliedJobs;
