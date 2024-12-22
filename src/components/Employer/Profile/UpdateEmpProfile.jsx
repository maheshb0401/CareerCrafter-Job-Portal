import { Box, Button, Grid, TextField, Typography } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import AuthContext from '../../Auth/AuthContext';
import { fetchEmployerData } from '../../../Store/jobSlice';
import api from '../../../services/axiosConfig';

const UpdateEmpProfile = () => {
    const dispatch = useDispatch();
    const { auth } = useContext(AuthContext);
    const employer = useSelector((state) => state.jobs);
    const { employerData, status } = employer || {};

     useEffect(() => {
        if (auth?.username && status === "idle") {
          dispatch(fetchEmployerData(auth?.username)); // Fetch employer data if not already loaded
        }
      }, [dispatch, auth.username, status]);

      const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        company: {
            companyName: '',
            industry: '',
            website: '',
            location: {
                city: '',
                state: '',
                country: ''
            }
        }
    });

    useEffect(() => {
        // Populate the form data with employer data when loaded
        if (employerData) {
            setFormData({
                firstName: employerData.firstName || '',
                lastName: employerData.lastName || '',
                phoneNumber: employerData.phoneNumber || '',
                email: employerData.email || '',
                company: {
                    companyName: employerData.company?.companyName || '',
                    industry: employerData.company?.industry || '',
                    website: employerData.company?.website || '',
                    location: {
                        city: employerData.company?.location?.city || '',
                        state: employerData.company?.location?.state || '',
                        country: employerData.company?.location?.country || '',
                    },
                },
            });
        }
    }, [employerData]);
    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCompanyChange = (field, value) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            company: {
                ...prevFormData.company,
                [field]: value
            }
        }));
    };
    
    const handleLocationChange = (field, value) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            company: {
                ...prevFormData.company,
                location: {
                    ...prevFormData.company.location,
                    [field]: value
                }
            }
        }));
    };

    const handleUpdate = async () => {
        try {
            await api.put(`/api/employer/${auth.username}`, formData);
            alert("Profile updated successfully");
        } catch (err) {
            console.error("Error updating profile:", err.response?.data || err.message);
        }
    };
    
    
    
  return (
    <Box className='empContainer'> <Grid container spacing={2}>
    <Grid item xs={12} sm={6}>
        <TextField
            label="First Name"
            name="firstName"
            fullWidth
            value={formData.firstName}
            onChange={handleChange}
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
            label="Phone Number"
            name="phoneNumber"
            fullWidth
            value={formData.phoneNumber}
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
    {/* Company Details */}
    <Grid item xs={12}>
        <Typography variant="h6" sx={{display:'flex', justifyItems:'left'}}>Company Details</Typography>
    </Grid>
    <Grid item xs={12} sm={6}>
        <TextField
            label="Company Name"
            fullWidth
            value={formData.company.companyName}
            onChange={(e) => handleCompanyChange('companyName', e.target.value)}
        />
    </Grid>
    <Grid item xs={12} sm={6}>
        <TextField
            label="Industry"
            fullWidth
            value={formData.company.industry}
            onChange={(e) => handleCompanyChange('industry', e.target.value)}
        />
    </Grid>
    <Grid item xs={12} sm={6}>
        <TextField
            label="Website"
            fullWidth
            value={formData.company.website}
            onChange={(e) => handleCompanyChange('website', e.target.value)}
        />
    </Grid>
    {/* Location */}
    <Grid item xs={12}>
        <Typography variant="h6" sx={{display:'flex', justifyItems:'left'}}>Location</Typography>
    </Grid>
    <Grid item xs={12} sm={4}>
        <TextField
            label="City"
            fullWidth
            value={formData.company.location.city}
            onChange={(e) => handleLocationChange('city', e.target.value)}
        />
    </Grid>
    <Grid item xs={12} sm={4}>
        <TextField
            label="State"
            fullWidth
            value={formData.company.location.state}
            onChange={(e) => handleLocationChange('state', e.target.value)}
        />
    </Grid>
    <Grid item xs={12} sm={4}>
        <TextField
            label="Country"
            fullWidth
            value={formData.company.location.country}
            onChange={(e) => handleLocationChange('country', e.target.value)}
        />
    </Grid>
     {/* Update Button */}
     <Grid item xs={12}>
                    <Button variant="contained" color="primary" fullWidth onClick={handleUpdate}>
                        Update Profile
                    </Button>
                </Grid>
</Grid>
 </Box>
  )
}

export default UpdateEmpProfile;
