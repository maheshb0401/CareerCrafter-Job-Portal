import { Box, Typography, Divider, Link as MuiLink } from "@mui/material";
import React, { useEffect, useState } from "react";
import HeaderAfterLogin from "../Layouts/HeaderAfterLogin";
import { useParams, Link } from "react-router-dom";
import api from "../../services/axiosConfig";
import "./CompanyDetails.css";
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import WysiwygIcon from '@mui/icons-material/Wysiwyg';

const CompanyDetails = ()=>{
    const [companyDetails, setCompanyDetails] = useState([]);
    const [companyJobs, setCompanyJobs] = useState([]);
    const [loading, setLoading] = useState([true]);
    const [error, setError] = useState([]);
    const {id} = useParams();

    useEffect(()=>{
        const fetchCompanyDetails = async ()=>{
            try{
                const numericId = Number(id);
                if (isNaN(numericId)) {
                throw new Error("Invalid company ID");
                }
                const response = await api.get(`api/companies/${id}`);
                setCompanyDetails(response.data);
            } catch(err){
                console.error("Error fetching company data:", err.response?.data || err.message);
                setError(err.response?.data || "An error occurred while fetching data.");
            } finally{
                setLoading(false);
            }
        };
        fetchCompanyDetails();
    }, [id]);


    useEffect ( ()=>{
        const fetchCompanyJobs = async ()=>{
            try{
                const response =  await api.get(`/api/employer/jobs/company/${id}`);
                setCompanyJobs(( response).data);
            }catch(err){
                console.error("Error fetching company jobs:", err.response?.data || err.message);
            }
        };
        fetchCompanyJobs();
    }, [id])

    const calculateDaysSincePosted = (postedDate) => {
        const posted = new Date(postedDate);
        const today = new Date();
        const diffInTime = today - posted;
        const diffInDays = Math.floor(diffInTime / (1000 * 60 * 60 * 24));
        return diffInDays;
    };
    return(
        <Box>
            <HeaderAfterLogin/>
            <Box className='companyDashboard'>
            <Link to="/jobseekerDashboard" sx={{ textDecoration: 'none'  }} >
            <ArrowLeftIcon fontSize='large'  sx={{display:'flex', justifyContent:'left', ml:'255px', mt:'30px'}}/></Link>
                <Box className='companyDetails'>
                    <Typography variant="h6" sx={{display:"flex", justifyItems:"left"}}>{companyDetails.companyName}</Typography>
                    <Box sx={{display:"flex", justifyItems:'left', gap:'20px'}} >
                        <Typography>{companyDetails.industry}</Typography>
                        <Typography>{companyDetails.location?.city}, {companyDetails.location?.state}</Typography>
                    </Box>
                    <MuiLink href={companyDetails.website} target="_blank" sx={{display:"flex", justifyItems:"left"}}>{companyDetails.website}</MuiLink>
                </Box>
                <Divider sx={{marginTop: '20px', marginLeft:'270px', marginRight:'270px'}}></Divider>
            </Box>

            {companyJobs.length >0 ? (
                        companyJobs.map( (job)=>(
                                <Box className='employerDashboard' key={job.jobId} sx={{mt:'30px'}} > 
                                <Box component={Link} to={`/jobDetails/${job.jobId}`} sx={{ textDecoration: 'none', color: 'inherit' }}>
                                  <Box sx={{display:'flex'}}>
                                                              <WysiwygIcon color="primary" sx={{mr:'7px'}}></WysiwygIcon>
                                    <Typography variant="h4" sx={{ display: "flex", justifyItems: "left", fontSize: '20px' }}>{job.jobTitle}</Typography> </Box>
                                    <Typography variant="body2" sx={{ display: "flex", justifyItems: "left", mt: '8px' }}> Skills : {job.requiredSkills}</Typography>
                                    <Typography variant="body2" sx={{ display: "flex", justifyItems: "left" }}>{job.employmentType}</Typography>
                                    <Typography variant="body2" sx={{ display: "flex", justifyItems: "left" }}>{job.company?.companyName}</Typography>
                                    <Typography variant="body2" sx={{ display: "flex", justifyItems: "left" }}>{job.location?.city}, {job.location?.state}</Typography>
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
    );
}

export default CompanyDetails;