import { Box, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react'
import HeaderAfterLoginEmp from '../Layouts/HeaderAfterLoginEmp';
import AuthContext from '../Auth/AuthContext';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmployerData } from '../../Store/jobSlice';
import api from '../../services/axiosConfig';
import { Link , useNavigate} from 'react-router-dom';

const Application = () => {
  const navigate = useNavigate();
    const[appData, setAppData] = useState([]);
    const { auth } = useContext(AuthContext);  // Access auth context to get the username
    const dispatch = useDispatch();
      const employer = useSelector((state) => state.jobs);  // Use `jobs` instead of `employer`
      const { employerData, status } = employer || {};


    useEffect(() => {
           const username = auth.username;
           console.log("Username in useEffect:", username); // Log username to ensure it's correct
           if (username && status === "idle") {
             dispatch(fetchEmployerData(username));
             console.log(status);   
           }
         }, [dispatch, status, auth.username]);

    
      useEffect ( ()=>{
        const fetchApplicationData = async ()=>{
            if (status !== 'succeeded' || !employerData) return;
            try{
                const reponse = await api.get(`api/applications/employer/${employerData?.employerId}`);
                setAppData(reponse.data);
            }catch(err){
                console.error('Error Fetching data:', err.response?.data || err.message);
            }
        }
        fetchApplicationData();
      }, [employerData.employerId, employerData, status] )

      const handelBoxClick = async(applicationId) =>{
        try{
          await api.put(`api/applications/${applicationId}/status?status=REVIEWED`);
        }catch(err){
          console.error("Error occured in updating application", err.response?.data || err.message);
        }
      }

  return (
    <Box>
        <HeaderAfterLoginEmp/>
        <Box>
            { status === "succeeded" &&
                appData.length>0 ? (
                    appData.map( (app)=>(
                        <Box className='employerDashboard' key={app.applicationId} sx={{mt:'30px'}}>
                          <Box component={Link} to={`/Application/jobSeeker/${app.jobSeekerProfile?.profileId}/${app.applicationId}`} sx={{textDecoration:'none', color:'inherit'}}>
                             <Box onClick={() => handelBoxClick(app.applicationId)} sx={{ textDecoration: 'none', color: 'inherit' }}>
                             <Typography variant="h4" sx={{ display: "flex", justifyItems: "left", fontSize: '16px' }}>{app.jobSeekerProfile?.firstName} {app.jobSeekerProfile?.lastName}</Typography>
                             {/* <Typography variant="body2" sx={{ display: "flex", justifyItems: "left", mt: '8px' }}> Skills : {app.jobSeekerProfile?.skills?.skillName}</Typography> */}
                             <Typography variant="body2" sx={{ display: "flex", justifyItems: "left" }}>{app.jobSeekerProfile?.phoneNumber}</Typography>
                             <Typography variant="body2" sx={{ display: "flex", justifyItems: "left" }}>{app.jobSeekerProfile?.email}</Typography>
                             <Typography variant="body2" sx={{ display: "flex", justifyItems: "left" }}>Job Role : {app.jobPosting?.jobTitle}</Typography>
                             {/* <Typography variant="body2" sx={{ display: "flex", justifyItems: "left" }}>{app.reason}</Typography> */}
                             </Box>
                          </Box>
                        </Box>
                    ))
                )
                    :(
                    <Box> No Applications
                </Box>
                )

            }
        </Box>
    </Box>
  )
}

export default Application;
