import { Box, Card, CardContent, Typography, Button, Grid } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/axiosConfig';
import HeaderAfterLoginEmp from '../Layouts/HeaderAfterLoginEmp';
import './JobSeekerDetails.css';
import { Bolt } from '@mui/icons-material';

const JobSeekerDetails = () => {
    const { jobseekerId, applicationId } = useParams();
  const [jobSeekerData, setJobSeekerData] = useState(null);

  useEffect(() => {
    const fetchJobseekerData = async () => {
      try {
        const response = await api.get(`api/jobseeker/${jobseekerId}`);
        setJobSeekerData(response.data);
      } catch (err) {
        console.error('Error in fetching data', err.response?.data || err.message);
      }
    };

    fetchJobseekerData();
  }, [jobseekerId]);

  const handelAcceptButton = async() =>{
    try{
        await api.put(`api/applications/${applicationId}/status?status=ACCEPTED`);
        alert("Application Accepted");
      }catch(err){
        console.error("Error occured in updating application", err.response?.data || err.message);
      }
  }

  const handelRejectButton = async() =>{
    try{
        await api.put(`api/applications/${applicationId}/status?status=REJECTED`);
        alert("Application Rejected");
      }catch(err){
        console.error("Error occured in updating application", err.response?.data || err.message);
      }
  }

  return (
    <Box>
      <HeaderAfterLoginEmp />
      <Box className="ApplicantsContainer" sx={{ padding: '20px' }}>
      <Typography variant='h4' sx={{ display: 'flex', justifyContent: 'flex-start', ml: '20px', fontSize:'16px', fontWeight:'bold' }}>
              {jobSeekerData?.firstName} {jobSeekerData?.lastName}
            </Typography>

            {/* <Typography sx={{ display: 'flex', justifyContent: 'flex-start', ml: '20px', fontSize:'14px' }}>
               {jobSeekerData?.email}
            </Typography>

            <Typography sx={{ display: 'flex', justifyContent: 'flex-start', ml: '20px', fontSize:'14px' }}>
               {jobSeekerData?.phoneNumber}
            </Typography> */}

            <Typography sx={{ display: 'flex', justifyContent: 'flex-start', ml: '20px', mt: '10px' }}>
              <strong >Skills :</strong> <span>&nbsp;&nbsp;</span> {jobSeekerData?.skills.map(skill => skill.skillName).join(', ')}
            </Typography>

            <Box>
            <Typography component={'div'} sx={{ display: 'flex', justifyContent: 'flex-start', ml: '20px', mt: '10px' }}>
              <strong>Education :</strong>
              <Box sx={{ ml: '20px', mt: '10px' }}>
                {jobSeekerData?.educationList.map((edu, index) => (
                  <Typography key={edu.id} sx={{ display: 'flex', justifyContent: 'flex-start', mt: '5px' }}>
                    {index + 1}. {edu.degree} ({edu.yearOfPassing}) at {edu.institution}
                  </Typography>
                ))}
              </Box>
            </Typography>
            </Box>

            <Box>
            <Typography component={'div'} sx={{ display: 'flex', justifyContent: 'flex-start', ml: '20px', mt: '10px' }}>
              <strong>Experience :</strong>
              <Box sx={{ ml: '20px', mt: '10px' }}>
                {jobSeekerData?.experienceList.map((exp, index) => (
                  <Typography key={exp.id} sx={{ display: 'flex', justifyContent: 'flex-start', mt: '5px' }}>
                    {index + 1}. {exp.jobTitle} at {exp.companyName} for {exp.duration} years
                  </Typography>
                ))}
              </Box>
            </Typography>
            </Box>

            <Typography sx={{ display: 'flex', justifyContent: 'flex-start', ml: '20px', mt: '10px' }}>
              <strong>Resume :</strong><span>&nbsp;&nbsp;</span>
              <a href={jobSeekerData?.resumes[0]?.resumeURL} target="_blank" rel="noopener noreferrer">
                {jobSeekerData?.resumes[0]?.resumeFileName}
              </a>
            </Typography>

            <Box sx={{display:'flex', justifyItems:'left', ml:'12px', mt:'10px'}}>
                <Button onClick={handelAcceptButton} id="HeaderRegister" sx={{ color: 'white', width: '10%', display: "flex", backgroundColor: '#1976d2 !important', mr:'50px' }}>Accept</Button>
                <Button onClick={handelRejectButton} id="HeaderRegister" sx={{ color: 'white', width: '10%', display: "flex" }}>Reject</Button>
            </Box>
      </Box>
    </Box>
  );
};

export default JobSeekerDetails;
