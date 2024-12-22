import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from "@mui/material";
import React, { useEffect, useContext, useState } from "react";
import HeaderAfterLoginEmp from "./../Layouts/HeaderAfterLoginEmp";
import './EmployerDashBoard.css';
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployerData } from "../../Store/jobSlice";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AuthContext from "../Auth/AuthContext";  // Import AuthContext
import api from "../../services/axiosConfig";

const EmployerDashboard = () => {
    const { auth } = useContext(AuthContext);  // Access auth context to get the username
    const dispatch = useDispatch();
    const { employerData, status, error } = useSelector((state) => state.jobs);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);

    useEffect(() => {
        const username = auth.username;
        console.log("Username in useEffect:", username);
        if (username && status === "idle") {
          dispatch(fetchEmployerData(username));
        }
      }, [dispatch, status, auth.username]);

      const handleEditClick = (jobData) => {
        setSelectedJob(jobData);
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setSelectedJob(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
            setSelectedJob((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        };


        
    
    const handelSave = async () => {
        try {
            if (!selectedJob || !selectedJob.jobId) {
                console.error("Job ID is missing.");
                return;
            }
    
            // Prepare the updated job data
            const updatedJob = {
                ...selectedJob,
            };
    
            console.log("Sending updated job data:", updatedJob);
            await api.put(`/api/employer/jobPost/${selectedJob.jobId}`, updatedJob);
    
            dispatch(fetchEmployerData(auth.username)); // Refresh data
            setDialogOpen(false);
        } catch (err) {
            console.error("Failed to update job:", err.response?.data || err.message);
        }
    };

    const handelDeleteJob = async (jobId)=>{    
        console.log("Attempting to delete job with ID:", jobId);
        try{
            await api.delete(`/api/employer/jobPost/${jobId}`);
            dispatch(fetchEmployerData(auth.username));
        }catch(err){
            console.error("Failed to Delete job:", err.response?.data || err.message);
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
            <HeaderAfterLoginEmp />
            <Box>
                {status === "loading" && (
                    <Box sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
                        <CircularProgress />
                    </Box>
                )}
                {status === "failed" && (
                    <Typography color="error" variant="h6" sx={{ textAlign: "center", marginTop: "20px" }}>
                        Failed to load employer data: {error}
                    </Typography>
                )}

                {status === "succeeded" &&
                    employerData.jobPostings.map((jobData, index) => (
                        <Box className="employerDashboard" key={index}>
                            <Typography variant="h4" sx={{ display: "flex", justifyItems: "left", fontSize: '20px' }}>{jobData.jobTitle}</Typography>
                            <Typography variant="body2" sx={{ display: "flex", justifyItems: "left", mt: '8px' }}> Skills : {jobData.requiredSkills}</Typography>
                            <Typography variant="body2" sx={{ display: "flex", justifyItems: "left" }}>{jobData.employmentType}</Typography>
                            <Typography variant="body2" sx={{ display: "flex", justifyItems: "left" }}>{employerData.company.companyName}</Typography>
                            <Typography variant="body2" sx={{ display: "flex", justifyItems: "left" }}>{jobData.location?.city}, {jobData.location?.state}</Typography>
                            <Typography variant="body2" sx={{ display: "flex", justifyItems: "left" }}>{jobData.salaryRange}</Typography>
                            <Typography variant="body2" sx={{ display: "flex", justifyItems: "left" }}>Posted {calculateDaysSincePosted(jobData.postedDate)} days ago</Typography>
                            <Box sx={{ display: "flex", justifyItems: "left", mt: '5px' }}>
                                <EditIcon color="primary" sx={{ mr: '10px', cursor:'pointer' }} onClick={() => handleEditClick(jobData)} />
                                <DeleteIcon onClick={()=>handelDeleteJob(jobData.jobId) } color="primary" sx={{cursor:'pointer'}} />
                            </Box>
                        </Box>
                    ))
                }

                <Button component={Link} to='/jobPost' color="inherit" id="HeaderRegister" sx={{ marginTop: '30px!important', color: 'white', width: '10%', backgroundColor: '#1976d2 !important' }}>
                    Post New Job
                </Button>

                 {/* Edit Dialog */}
                 <Dialog open={dialogOpen} onClose={handleDialogClose}>
                    <DialogTitle>Update Job</DialogTitle>
                    <DialogContent>
                        {selectedJob && (
                            <form>
                                <TextField
                                    name="jobTitle"
                                    label="Job Title"
                                    value={selectedJob.jobTitle}
                                    onChange={handleChange}
                                    margin="normal"
                                    fullWidth
                                />
                                <TextField
                                    name="jobDescription"
                                    label="Job Description"
                                    value={selectedJob.jobDescription}
                                    onChange={handleChange}
                                    margin="normal"
                                    fullWidth
                                    multiline
                                    rows={3}
                                />
                                 <TextField
                                    name="requiredSkills"
                                    label="Required Skills"
                                    value={selectedJob.requiredSkills}
                                    onChange={handleChange}
                                    margin="normal"
                                    fullWidth
                                />
                                <TextField
                                    name="salaryRange"
                                    label="Salary Range"
                                    value={selectedJob.salaryRange}
                                    onChange={handleChange}
                                    margin="normal"
                                    fullWidth
                                />
                                 <TextField
                                    name="applicationDeadline"
                                    label="Application Deadline"
                                    type="date"
                                    value={selectedJob.applicationDeadline}
                                    onChange={handleChange}
                                    margin="normal"
                                    fullWidth
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </form>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleDialogClose} color="secondary">
                            Cancel
                        </Button>
                        <Button onClick={handelSave} color="primary" variant="contained">
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box>
    );
}

export default EmployerDashboard;
