import React, { useContext, useEffect, useState } from "react";
import {Box, Button, IconButton, TextField, Typography} from '@mui/material';
import { Add, Flare, Remove } from '@mui/icons-material';
import AuthContext from "../../Auth/AuthContext";
import { useDispatch, useSelector } from "react-redux";
import { fetchJobSeekerData } from "../../../Store/jobSeekerSlice";
import api from "../../../services/axiosConfig";
import './CompleteProfile.css';
import { Link } from "react-router-dom";



const CompleteProfile = () => {
  const dispatch = useDispatch();
  const {auth} = useContext(AuthContext);
  const jobSeeker = useSelector((state) => state.jobSeeker);
  const { jobSeekerData, status } = jobSeeker;

  useEffect(() => {
    if (auth?.username && status === 'idle') {
      dispatch(fetchJobSeekerData(auth?.username));
    }
  }, [dispatch, auth.username, status]);


  const handelSubmit = async ()=>{
    try{

      const profileId = jobSeekerData.profileId;

      const payload = {
        ...formData,
        profileId,
      };

      await api.post("/api/jobseeker/profile", payload);
      alert("Profile Completed Succesfully");
      dispatch(fetchJobSeekerData(auth?.username));

    }catch(err){
      console.error("Error in Submitting" , err.response?.data || err.message);
    }
  }

  const [formData, setFormData] = useState({
    profileId: "",
    skills: [{ skillName: "" }],
    educationList: [
      {
        degree: "",
        institution: "",
        grade: "",
        yearOfPassing: ""
      }
    ],
    experienceList: [
      {
        jobTitle: "",
        companyName: "",
        duration: null,
        responsibilities: ""
      }
    ],
    resume: {
      resumeURL: "",
      resumeFileName: ""
    }
  });


  const handleSkillAdd = () => {
    setFormData(prev => ({
      ...prev,
      skills: [...prev.skills, { skillName: "" }]
    }));
  };
  
  const handleSkillRemove = (index) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };
  
  const handleSkillChange = (index, value) => {
    setFormData(prev => {
      const updatedSkills = [...prev.skills];
      updatedSkills[index].skillName = value;
      return { ...prev, skills: updatedSkills };
    });
  };
  

  const handleEducationChange = (index, field, value) => {
    const updatedEducationList = [...formData.educationList];
    updatedEducationList[index][field] = value;
    setFormData((prev) => ({ ...prev, educationList: updatedEducationList }));
  };
  
  const handleEducationAdd = () => {
    setFormData((prev) => ({
      ...prev,
      educationList: [
        ...prev.educationList,
        { degree: "", institution: "", grade: "", yearOfPassing: "" },
      ],
    }));
  };
  
  const handleEducationRemove = (index) => {
    setFormData((prev) => ({
      ...prev,
      educationList: prev.educationList.filter((_, i) => i !== index),
    }));
  };
  

  const handleExperienceChange = (index, field, value) => {
    const updatedExperienceList = [...formData.experienceList];
    updatedExperienceList[index][field] = value;
    setFormData((prev) => ({ ...prev, experienceList: updatedExperienceList }));
  };
  
  const handleExperienceAdd = () => {
    setFormData((prev) => ({
      ...prev,
      experienceList: [
        ...prev.experienceList,
        { jobTitle: "", companyName: "", duration: null, responsibilities: "" },
      ],
    }));
  };
  
  const handleExperienceRemove = (index) => {
    setFormData((prev) => ({
      ...prev,
      experienceList: prev.experienceList.filter((_, i) => i !== index),
    }));
  };
  

  const handleResumeChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      resume: {
        ...prev.resume,
        [field]: value
      }
    }));
  };

  return (
    <Box className='container'>
      <Box className='leftContainer' sx={{justifyItems:"left"}}>
        <Typography sx={{ml:'5px', mt:'10px'}}>Account Created</Typography>
        <Typography sx={{ml:'5px', mt:'0px', opacity:'0.6'}}>Add Your Details to Complete Profile</Typography>
      </Box>

      <Box className='rightContainer'>
  {/* <Typography variant="h6" sx={{ display:"flex", justifyItems:"left" }}>Skills</Typography> */}
  {formData.skills.map((skill, index) => (
    <Box key={index} display="flex" alignItems="center">
      <TextField
        label="Skill"
        value={skill.skillName}
        onChange={(e) => handleSkillChange(index, e.target.value)}
        size="small"
        sx={{ width: "80%", mr: 1,display:"flex", justifyItems:"left", mb:1 }}
      />
      <IconButton sx={{display:"flex", justifyItems:"left"}} onClick={() => handleSkillRemove(index)}><Remove /></IconButton>
    </Box>
  ))}
  <Button sx={{display:"flex", justifyItems:"left"}} onClick={handleSkillAdd} startIcon={<Add />}>Add Skill</Button>

  {/* <Typography variant="h6" sx={{ mt: 2, display:"flex", justifyItems:"left" }}>Education</Typography> */}
  {formData.educationList.map((edu, index) => (
    <Box key={index} >
      <TextField
        label="Degree"
        value={edu.degree}
        onChange={(e) => handleEducationChange(index, "degree", e.target.value)}
        size="small"
        fullWidth
        sx={{ mb: 1, width: "80%",display:"flex", justifyItems:"left" }}
      />
      <TextField
        label="Institution"
        value={edu.institution}
        onChange={(e) => handleEducationChange(index, "institution", e.target.value)}
        size="small"
        fullWidth
        sx={{ mb: 1, width: "80%", display:"flex", justifyItems:"left" }}
      />
      <TextField
        label="Grade"
        value={edu.grade}
        onChange={(e) => handleEducationChange(index, "grade", e.target.value)}
        size="small"
        fullWidth
        sx={{ mb: 1, width: "80%", display:"flex", justifyItems:"left" }}
      />
      <TextField
        label="Year of Passing"
        value={edu.yearOfPassing}
        onChange={(e) => handleEducationChange(index, "yearOfPassing", e.target.value)}
        size="small"
        fullWidth
        sx={{ mb: 1, width: "80%", display:"flex", justifyItems:"left" }}
      />
      <IconButton sx={{display:"flex", justifyItems:"left"}} onClick={() => handleEducationRemove(index)}><Remove /></IconButton>
    </Box>
  ))}
  <Button sx={{display:"flex", justifyItems:"left"}} onClick={handleEducationAdd} startIcon={<Add />}>Add Education</Button>

  {/* <Typography variant="h6" sx={{ mt: 2, display:"flex", justifyItems:"left" }}>Experience</Typography> */}
  {formData.experienceList.map((exp, index) => (
    <Box key={index} mb={2}>
      <TextField
        label="Job Title"
        value={exp.jobTitle}
        onChange={(e) => handleExperienceChange(index, "jobTitle", e.target.value)}
        size="small"
        fullWidth
        sx={{ mb: 1, width: "80%", display:"flex", justifyItems:"left" }}
      />
      <TextField
        label="Company Name"
        value={exp.companyName}
        onChange={(e) => handleExperienceChange(index, "companyName", e.target.value)}
        size="small"
        fullWidth
        sx={{ mb: 1, width: "80%", display:"flex", justifyItems:"left" }}
      />
      <TextField
        label="Duration"
        type="number"
        value={exp.duration}
        onChange={(e) => handleExperienceChange(index, "duration", e.target.value)}
        size="small"
        fullWidth
        sx={{ mb: 1, width: "80%", display:"flex", justifyItems:"left" }}
      />
      <TextField
        label="Responsibilities"
        value={exp.responsibilities}
        onChange={(e) => handleExperienceChange(index, "responsibilities", e.target.value)}
        size="small"
        fullWidth
        sx={{ mb: 1, width: "80%", display:"flex", justifyItems:"left" }}
      />
      <IconButton sx={{display:"flex", justifyItems:"left"}} onClick={() => handleExperienceRemove(index)}><Remove /></IconButton>
    </Box>
  ))}
  <Button sx={{display:"flex", justifyItems:"left"}} onClick={handleExperienceAdd} startIcon={<Add />}>Add Experience</Button>

  {/* <Typography variant="h6" sx={{ mt: 2, display:"flex", justifyItems:"left" }}>Resume</Typography> */}
  <TextField
    label="Resume URL"
    value={formData.resume.resumeURL}
    onChange={(e) => handleResumeChange("resumeURL", e.target.value)}
    size="small"
    fullWidth
    sx={{ mb: 1, width: "80%" , display:"flex", justifyItems:"left"}}
  />
  <TextField
    label="Resume File Name"
    value={formData.resume.resumeFileName}
    onChange={(e) => handleResumeChange("resumeFileName", e.target.value)}
    size="small"
    fullWidth
    sx={{ mb: 1, width: "80%", display:"flex", justifyItems:"left" }}
  />

  <Button variant="contained" component={Link} to='/jobSeekerDashBoard' color="primary" onClick={handelSubmit} sx={{ mt: 2, display:"flex", justifyItems:"left" }}>Submit</Button>
</Box>


    </Box>
  )
  
};

export default CompleteProfile;

