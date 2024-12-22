import { Box, Button, Divider, Typography, Link as MuiLink } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import HeaderAfterLogin from '../../Layouts/HeaderAfterLogin';
import api from '../../../services/axiosConfig';
import "./JobDetails.css";
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import AuthContext from '../../Auth/AuthContext';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobSeekerData } from '../../../Store/jobSeekerSlice';

const JobDetails = () => {
    const {id} = useParams();
    const [jobData, setJobData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error , setError] = useState([]);
    const [isApplied, setIsApplied] = useState(false);

    const currDate = new Date();
    const {auth} = useContext(AuthContext);
    const dispatch = useDispatch();
    const jobSeeker = useSelector( (state) => state.jobSeeker);
    const {jobSeekerData, status} = jobSeeker  || {};

    useEffect( ()=>{
        if(auth?.username && status==='idle'){
            dispatch(fetchJobSeekerData(auth.username));
        }
    },[dispatch, auth.username, status])

    useEffect( ()=>{
        const fetchJobData = async ()=>{
            try{
                const response =  await api.get(`api/employer/job/${id}`);
                setJobData(response.data);
            }catch(err){
                console.error("error in fetching jobs data", err.response?.data || err.message);
                setError(err.response?.data ||  "error occured in fetching job data");
            }finally{
                setLoading(false);
            }
        }
        fetchJobData();
    }, [id])

    useEffect(() => {
        const checkApplicationStatus = async () => {
            if (!jobSeekerData || !jobSeekerData.profileId) return;
    
            try {
                const response = await api.get('api/applicationTracking/check', {
                    params: {
                        jobId: jobData.jobId,
                        jobSeekerId: jobSeekerData.profileId,
                    },
                });
    
                setIsApplied(response.data);
            } catch (err) {
                console.error("Error checking application status", err.response?.data || err.message);
            }
        };
    
        if (jobData.jobId && status === 'succeeded') {
            checkApplicationStatus();
        }
    }, [jobData.jobId, jobSeekerData, status]);
    


    const handelApply = async ()=>{
        if(status!=='succeeded' || !jobSeekerData){
            alert('JobSeeker Data not loaded yet');
        }
        try{
            const postData = {jobId: jobData.jobId, jobSeekerId:jobSeekerData.profileId, resumeId:jobSeekerData.resumes[0].id , applicationDate:currDate.toISOString().split('T')[0]};
            const response = await api.post('api/applications/jobSeeker/apply', postData)
            console.log(response.data);
            alert("Applied Succesfully")
            setIsApplied(true);
        }catch(err){
            console.error("Error in applying job", err.response?.data ||err.message)
        }
    }


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
        <Box className='JobDetails'>
            <Box sx={{mb:'10px', display:'flex', justifyContent: 'space-between'}}>
                <Box>
            <Typography variant='h4' sx={{ display: "flex", justifyItems: "left",fontSize:'20px'}}>  {jobData.jobTitle} </Typography>
            <Typography variant="body2" sx={{ display: "flex", justifyItems: "left", mt:'8px' }}>{jobData.employmentType}</Typography>
            <Typography variant="body2" sx={{ display: "flex", justifyItems: "left" }}>{jobData.salaryRange}</Typography>
            <Typography variant="body2" sx={{ display: "flex", justifyItems: "left" }}>{jobData.location?.city}, {jobData.location?.state}</Typography>
               </Box>
                <Box sx={{mr:'200px'}}>
                     <Typography variant='h4' sx={{fontSize:'20px', mr:'20px'}}>About Company : </Typography>
                     <Typography variant="body2" sx={{ display: "flex", justifyItems: "left", mt:'8px' }}>{jobData.company?.industry}</Typography>
                     <Typography variant="body2" sx={{ display: "flex", justifyItems: "left" }}>{jobData.company?.companyName}</Typography>
                     <MuiLink href={jobData.company?.website} target="_blank" variant="body2" sx={{ display: "flex", justifyItems: "left" }}>{jobData.company?.website}</MuiLink>
                </Box>
            </Box>
            <Divider/>
            <Box sx={{ display: "flex", justifyItems: "left", mt:'10px' }}>
                <Typography variant="body2" sx={{mt:'11px'}}>Posted {calculateDaysSincePosted(jobData.postedDate)} day ago</Typography>
                <Button
                    color="inherit"
                    id="HeaderRegister"
                    onClick={handelApply}
                    disabled={isApplied}
                    sx={{
                        color: 'white',
                        ml: '50px',
                        width: '85px !important',
                        backgroundColor: isApplied ? '#b0bec5 !important' : '#1976d2 !important',
                        height: '36px',
                    }}
                >
                    {isApplied ? "Applied" : "Apply"}
                </Button>

            </Box>
            <Box sx={{mt:'50px'}}>
                <Typography variant='h4' sx={{ display:'flex', fontSize:'20px'}}>Job Description :</Typography>
                <Typography variant="body2" sx={{ display: "flex", justifyItems: "left", mt: '8px',  textAlign: 'justify', opacity: 0.7 }}>{jobData.jobDescription} 
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Repellat rerum at officia eligendi blanditiis ab in soluta deleniti dolores! 
                    Dolorem natus molestias ipsam neque odit perspiciatis cum, deleniti voluptatem at sint quibusdam quia ex 
                    temporibus officiis esse, aspernatur est atque quis consequuntur, ut aperiam? Voluptatibus, eaque animi perspiciatis 
                    illum ducimus repellendus quasi unde possimus numquam, voluptate asperiores sequi corporis dolorem quae veritatis labore
                     voluptatem. </Typography>
                <Typography variant="body2" sx={{ display: "flex", justifyItems: "left", mt: '8px',  opacity: 0.7}}>Required Skills : {jobData.requiredSkills}</Typography>
            </Box>
        </Box>
    </Box>
  )
}

export default JobDetails;
