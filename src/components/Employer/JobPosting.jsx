import { Box, Button, TextField } from '@mui/material'
import React, { useEffect, useState, useContext } from 'react'
import HeaderAfterLoginEmp from '../Layouts/HeaderAfterLoginEmp'
import './JobPosting.css';
import { Link, useNavigate } from 'react-router-dom';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import { useDispatch, useSelector } from 'react-redux';
import { addJob, fetchEmployerData } from '../../Store/jobSlice';
import AuthContext from '../Auth/AuthContext';  // Import AuthContext
import api from '../../services/axiosConfig';

const JobPosting = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);  // Access the auth context for username
  const employer = useSelector((state) => state.jobs);  // Use `jobs` instead of `employer`
  const { employerData, status } = employer || {};

  const [jobData, setJobData] = useState({
    jobTitle: '',
    jobDescription: '',
    location: {
      city: '',
      state: '',
      country: '',
    },
    requiredSkills: '',
    employmentType: '',
    salaryRange: '',
    applicationDeadline: '',
    status: true,
  });

  useEffect(() => {
    if (auth.username && !employerData) {
      dispatch(fetchEmployerData(auth.username));  // Fetch employer data only if not already in state
    }
  }, [dispatch, employerData, auth.username]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes('location.')) {
      const locationField = name.split('.')[1];
      setJobData((prevState) => ({
        ...prevState,
        location: {
          ...prevState.location,
          [locationField]: value,
        },
      }));
    } else {
      setJobData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async () => {
    if (status !== 'succeeded' || !employerData) {
      alert('Employer data is not yet loaded. Please try again later.');
      return;
    }
    try {
      const postData = { ...jobData, employerId: employerData.employerId, companyId: employerData.company.companyId }; // Add employerId to the data
      const response = await api.post('api/employer/jobPosting', postData);
      console.log('Job posted successfully:', response.data);
      dispatch(addJob(response.data));
      dispatch(fetchEmployerData(employerData.username));
      alert('Job posted successfully!');
      navigate('/employerDashBoard');
    } catch (err) {
      console.error('Error posting job:', err.response?.data || err.message);
      alert('Failed to post the job. Please try again.');
    }
  };

  return (
    <Box>
      <HeaderAfterLoginEmp />
      <Box className="jobPostContainer">
        <Link to="/employerDashBoard" sx={{ textDecoration: 'none' }}>
          <ArrowLeftIcon fontSize="large" sx={{ display: 'flex', justifyContent: 'left', ml: '20px' }} />
        </Link>
        <form>
          <TextField
            name="jobTitle"
            label="Job Title"
            value={jobData.jobTitle}
            onChange={handleChange}
            margin="normal"
            className="jobPostInput"
          />
          <TextField
            name="jobDescription"
            label="Job Description"
            value={jobData.jobDescription}
            onChange={handleChange}
            className="jobPostInput"
            multiline
            rows={3}
            margin="normal"
          />
          <TextField
            name="location.city"
            label="City"
            value={jobData.location.city}
            onChange={handleChange}
            className="jobPostInput"
            margin="normal"
          />
          <TextField
            name="location.state"
            label="State"
            value={jobData.location.state}
            onChange={handleChange}
            className="jobPostInput"
            margin="normal"
          />
          <TextField
            name="location.country"
            label="Country"
            value={jobData.location.country}
            onChange={handleChange}
            className="jobPostInput"
            margin="normal"
          />
          <TextField
            name="requiredSkills"
            label="Required Skills"
            value={jobData.requiredSkills}
            onChange={handleChange}
            className="jobPostInput"
            margin="normal"
          />
          <TextField
            name="employmentType"
            label="Employment Type"
            value={jobData.employmentType}
            onChange={handleChange}
            className="jobPostInput"
            margin="normal"
          />
          <TextField
            name="salaryRange"
            label="Salary Range"
            value={jobData.salaryRange}
            onChange={handleChange}
            className="jobPostInput"
            margin="normal"
          />
          <TextField
            name="applicationDeadline"
            label="Application Deadline"
            type="date"
            value={jobData.applicationDeadline}
            onChange={handleChange}
            className="jobPostInput"
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <Button
            variant="contained"
            onClick={handleSubmit}
            id="HeaderRegister"
            sx={{ color: 'white !important', width: '60%', backgroundColor: '#1976d2 !important', mt: '15px !important' }}
          >
            Post Job
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default JobPosting;
