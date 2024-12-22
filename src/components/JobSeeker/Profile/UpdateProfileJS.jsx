import { Box, Button, Grid, IconButton, TextField, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import AuthContext from '../../Auth/AuthContext';
import { fetchJobSeekerData } from '../../../Store/jobSeekerSlice';
import api from '../../../services/axiosConfig';
import { Add } from '@mui/icons-material';
import './CompleteProfile.css';

const UpdateJobSeekerProfile = () => {
    const dispatch = useDispatch();
    const {auth} = useContext(AuthContext);
    const jobSeeker = useSelector((state) => state.jobSeeker);
    const { jobSeekerData, status } = jobSeeker;

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        skills: [{ skillName: '' }],
        educationList: [{ degree: '', institution: '', grade: '', yearOfPassing: '' }],
        experienceList: [{ jobTitle: '', companyName: '', duration: '', responsibilities: '' }],
        resumes: [{ resumeURL: '', resumeFileName: '' }],
      });
  
    useEffect(() => {
      if (auth?.username && status === 'idle') {
        dispatch(fetchJobSeekerData(auth?.username));
      }
    }, [dispatch, auth.username, status]);

    useEffect(() => {
        // If job seeker data is loaded, populate the form
        if (jobSeekerData) {
          setFormData({
            firstName: jobSeekerData.firstName || '',
            lastName: jobSeekerData.lastName || '',
            email: jobSeekerData.email || '',
            phoneNumber: jobSeekerData.phoneNumber || '',
            skills: jobSeekerData.skills || [{ skillName: '' }],
            educationList: jobSeekerData.educationList || [{ degree: '', institution: '', grade: '', yearOfPassing: '' }],
            experienceList: jobSeekerData.experienceList || [{ jobTitle: '', companyName: '', duration: '', responsibilities: '' }],
            resumes: jobSeekerData.resumes || [{ resumeURL: '', resumeFileName: '' }],
          });
        }
      }, [jobSeekerData]);

      const handleChange = (e) => {
        const { name, value, dataset } = e.target;
        const { type, index, array } = dataset;
    
        // Handle changes to nested fields (like skills, education, etc.)
        if (array && index !== undefined) {
          const updatedArray = [...formData[array]];
          updatedArray[index][name] = value;
          setFormData({ ...formData, [array]: updatedArray });
        } else {
          setFormData({ ...formData, [name]: value });
        }
      };

      const handleSkillChange = (index, value) => {
        // Copy current skills array
        const updatedSkills = [...formData.skills];
        updatedSkills[index].skillName = value; // Update skill at given index
        setFormData({
          ...formData,
          skills: updatedSkills, // Update state with the new skills array
        });
      };
      
      const handleEducationChange = (index, field, value) => {
        const updatedEducationList = [...formData.educationList];
        updatedEducationList[index][field] = value;
        setFormData({
          ...formData,
          educationList: updatedEducationList,
        });
      };
      
      const handleExperienceChange = (index, field, value) => {
        // Copy current experienceList array
        const updatedExperienceList = [...formData.experienceList];
        updatedExperienceList[index][field] = value; // Update specific field in the experience at index
        setFormData({
          ...formData,
          experienceList: updatedExperienceList, // Update state with the new experience list
        });
      };
      
      const handleResumeChange = (index, field, value) => {
        // Copy current resumes array
        const updatedResumes = [...formData.resumes];
        updatedResumes[index][field] = value; // Update specific field in the resume at index
        setFormData({
          ...formData,
          resumes: updatedResumes, // Update state with the new resumes list
        });
      };

      const handleSkillAdd = () => {
        setFormData({
          ...formData,
          skills: [...formData.skills, { skillName: "" }], // Add a new empty skill
        });
      };
      
      const handleSkillRemove = (index) => {
        const updatedSkills = formData.skills.filter((_, i) => i !== index); // Remove skill at given index
        setFormData({
          ...formData,
          skills: updatedSkills, // Update state with the new skills array
        });
      };
      
      const handleEducationAdd = () => {
        setFormData({
          ...formData,
          educationList: [...formData.educationList, { degree: "", institution: "", grade: "", yearOfPassing: "" }],
        });
      };
      
      const handleEducationRemove = (index) => {
        const updatedEducationList = formData.educationList.filter((_, i) => i !== index);
        setFormData({
          ...formData,
          educationList: updatedEducationList,
        });
      };
      
      const handleExperienceAdd = () => {
        setFormData({
          ...formData,
          experienceList: [...formData.experienceList, { jobTitle: "", companyName: "", duration: "", responsibilities: "" }],
        });
      };
      
      const handleExperienceRemove = (index) => {
        const updatedExperienceList = formData.experienceList.filter((_, i) => i !== index);
        setFormData({
          ...formData,
          experienceList: updatedExperienceList,
        });
      };
      
      const handleResumeAdd = () => {
        setFormData({
          ...formData,
          resumes: [...formData.resumes, { resumeURL: "", resumeFileName: "" }],
        });
      };
      
      const handleResumeRemove = (index) => {
        const updatedResumes = formData.resumes.filter((_, i) => i !== index);
        setFormData({
          ...formData,
          resumes: updatedResumes,
        });
      };
      

      const handleUpdate = async () => {
        console.log('Form data to be sent:', formData); 
        try {
          const response = await api.put(`/api/jobseeker/${auth.username}/update-profile`, formData);
          alert("Profile updated successfully");
        } catch (err) {
          console.error("Error in updating profile", err.response?.data || err.message);
        }
      };

  return (

    <Box className="updateContainer" sx={{}}>
    <Typography variant="h4" sx={{fontSize:'24px', mb:3}}>Update Job Seeker Profile</Typography>
  
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <TextField
          label="First Name"
          name="firstName"
          fullWidth
          value={formData.firstName}
          onChange={handleChange} // Handling top-level fields
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          label="Last Name"
          name="lastName"
          fullWidth
          value={formData.lastName}
          onChange={handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          label="Email"
          name="email"
          fullWidth
          value={formData.email}
          onChange={handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          label="Phone Number"
          name="phoneNumber"
          fullWidth
          value={formData.phoneNumber}
          onChange={handleChange}
        />
      </Grid>
  
      {/* Skills */}
      <Grid item xs={12}>
        <Typography variant="h6" sx={{display:'flex', justifyItems:'left', mb:2}}>Skills</Typography>
        {formData.skills.map((skill, index) => (
          <Grid container key={index} spacing={2}>
            <Grid item xs={10}>
              <TextField
                label="Skill Name"
                name="skillName"
                fullWidth
                value={skill.skillName}
                sx={{mb:1}}
                onChange={(e) => handleSkillChange(index, e.target.value)} // Updated handler
              />
            </Grid>
            <Grid item xs={2}>
              <IconButton onClick={() => handleSkillRemove(index)}>-</IconButton> {/* Remove skill */}
            </Grid>
          </Grid>
        ))}
        <IconButton onClick={handleSkillAdd}> <Add /> </IconButton> {/* Add new skill */}
      </Grid>
  
      {/* Education */}
      <Grid item xs={12}>
        <Typography variant="h6" sx={{display:'flex', justifyItems:'left', mb:2}}>Education</Typography>
        {formData.educationList.map((education, index) => (
          <Grid container key={index} spacing={2}>
            <Grid item xs={3}>
              <TextField
                label="Degree"
                name="degree"
                fullWidth
                value={education.degree}
                sx={{mb:1}}
                onChange={(e) => handleEducationChange(index, "degree", e.target.value)} // Updated handler
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                label="Institution"
                name="institution"
                fullWidth
                value={education.institution}
                onChange={(e) => handleEducationChange(index, "institution", e.target.value)} // Updated handler
              />
            </Grid>
            <Grid item xs={2}>
              <TextField
                label="Grade"
                name="grade"
                fullWidth
                value={education.grade}
                onChange={(e) => handleEducationChange(index, "grade", e.target.value)} // Updated handler
              />
            </Grid>
            <Grid item xs={2}>
              <TextField
                label="Year of Passing"
                name="yearOfPassing"
                fullWidth
                value={education.yearOfPassing}
                onChange={(e) => handleEducationChange(index, "yearOfPassing", e.target.value)} // Updated handler
              />
            </Grid>
            <Grid item xs={2}>
              <IconButton onClick={() => handleEducationRemove(index)}>-</IconButton> {/* Remove education */}
            </Grid>
          </Grid>
        ))}
        <IconButton onClick={handleEducationAdd}> <Add /> </IconButton> {/* Add new education */}
      </Grid>
  
      {/* Experience */}
      <Grid item xs={12}>
        <Typography variant="h6" sx={{display:'flex', justifyItems:'left', mb:2}}>Experience</Typography>
        {formData.experienceList.map((experience, index) => (
          <Grid container key={index} spacing={2}>
            <Grid item xs={3}>
              <TextField
                label="Job Title"
                name="jobTitle"
                fullWidth
                sx={{mb:1}}
                value={experience.jobTitle}
                onChange={(e) => handleExperienceChange(index, "jobTitle", e.target.value)} // Updated handler
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                label="Company Name"
                name="companyName"
                fullWidth
                value={experience.companyName}
                onChange={(e) => handleExperienceChange(index, "companyName", e.target.value)} // Updated handler
              />
            </Grid>
            <Grid item xs={2}>
              <TextField
                label="Duration"
                name="duration"
                fullWidth
                value={experience.duration}
                onChange={(e) => handleExperienceChange(index, "duration", e.target.value)} // Updated handler
              />
            </Grid>
            <Grid item xs={2}>
              <TextField
                label="Responsibilities"
                name="responsibilities"
                fullWidth
                value={experience.responsibilities}
                onChange={(e) => handleExperienceChange(index, "responsibilities", e.target.value)} // Updated handler
              />
            </Grid>
            <Grid item xs={2}>
              <IconButton onClick={() => handleExperienceRemove(index)}>-</IconButton> {/* Remove experience */}
            </Grid>
          </Grid>
        ))}
        <IconButton onClick={handleExperienceAdd}> <Add /> </IconButton> {/* Add new experience */}
      </Grid>
  
      {/* Resumes */}
      <Grid item xs={12}>
        <Typography variant="h6" sx={{display:'flex', justifyItems:'left', mb:2}}>Resumes</Typography>
        {formData.resumes.map((resume, index) => (
          <Grid container key={index} spacing={2}>
            <Grid item xs={5}>
              <TextField
                label="Resume URL"
                name="resumeURL"
                fullWidth
                sx={{mb:1}}
                value={resume.resumeURL}
                onChange={(e) => handleResumeChange(index, "resumeURL", e.target.value)} // Updated handler
              />
            </Grid>
            <Grid item xs={5}>
              <TextField
                label="Resume File Name"
                name="resumeFileName"
                fullWidth
                value={resume.resumeFileName}
                onChange={(e) => handleResumeChange(index, "resumeFileName", e.target.value)} // Updated handler
              />
            </Grid>
            <Grid item xs={2}>
            <IconButton onClick={() => handleResumeRemove(index)}>-</IconButton> {/* Remove resume */}
          </Grid>
          </Grid>
        ))}
        <IconButton onClick={handleResumeAdd}> <Add /> </IconButton> {/* Add new resume */}
      </Grid>
  
      <Grid item xs={12}>
        <Button variant="contained" onClick={handleUpdate}>Update Profile</Button>
      </Grid>
    </Grid>
  </Box>
  
  );
}

export default UpdateJobSeekerProfile;
