import React, { useContext, useEffect, useState } from "react";
import { Box, Button, IconButton, TextField, Typography } from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import AuthContext from "../../Auth/AuthContext";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployerData } from "../../../Store/jobSlice";
import api from "../../../services/axiosConfig";
import { Link } from "react-router-dom";
import '../../JobSeeker/./Profile/./CompleteProfile.css'

const CompleteEmpProfile = () => {
  const dispatch = useDispatch();
  const { auth } = useContext(AuthContext);
  const employer = useSelector((state) => state.jobs);
  const { employerData, status } = employer || {};

  // State for storing the form data
  const [formData, setFormData] = useState({
    employerId: "", // Ensure initial value is from employerData
    company: {
      companyName: "",
      companyLocation: {
        city: "",
        state: "",
        country: "",
      },
      industry: "",
      website: "",
    },
  });

  useEffect(() => {
    if (auth?.username && status === "idle") {
      dispatch(fetchEmployerData(auth?.username)); // Fetch employer data if not already loaded
    }
  }, [dispatch, auth.username, status]);

  // Handle form submission
  const handleSubmit = async () => {
    try {
        const employerId = employerData.employerId
      const payload = {
        ...formData,
        employerId
      };

      await api.post("/api/employer/profile", payload); // API endpoint to save employer data
      alert("Profile completed successfully!");
    } catch (err) {
      console.error("Error in submitting", err.response?.data || err.message);
    }
  };

  // Handle changes in the company name field
  const handleCompanyChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      company: {
        ...prev.company,
        [field]: value,
      },
    }));
  };

  // Handle changes in the location fields (city, state, country)
  const handleLocationChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      company: {
        ...prev.company,
        companyLocation: {
          ...prev.company.companyLocation,
          [field]: value,
        },
      },
    }));
  };

  return (
    <Box className="container">
      <Box className="leftContainer" sx={{ justifyItems: "left" }}>
        <Typography sx={{ ml: "5px", mt: "10px" }}>Account Created</Typography>
        <Typography sx={{ ml: "3px", mt: "0px", opacity: "0.6", textAlign:"justify" }}>
          Add Your Company Details to Complete Profile
        </Typography>
      </Box>

      <Box className="rightContainer">
        {/* Company Name */}
        <TextField
          label="Company Name"
          value={formData.company.companyName}
          onChange={(e) => handleCompanyChange("companyName", e.target.value)}
          size="small"
          fullWidth
          sx={{ mb: 1, width: "80%", display: "flex", justifyItems: "left" }}
        />

        {/* Industry */}
        <TextField
          label="Industry"
          value={formData.company.industry}
          onChange={(e) => handleCompanyChange("industry", e.target.value)}
          size="small"
          fullWidth
          sx={{ mb: 1, width: "80%", display: "flex", justifyItems: "left" }}
        />

        {/* Location */}
        <Box display="flex" flexDirection="column">
          <TextField
            label="City"
            value={formData.company.companyLocation.city}
            onChange={(e) =>
              handleLocationChange("city", e.target.value)
            }
            size="small"
            fullWidth
            sx={{
              mb: 1,
              width: "80%",
              display: "flex",
              justifyItems: "left",
            }}
          />
          <TextField
            label="State"
            value={formData.company.companyLocation.state}
            onChange={(e) =>
              handleLocationChange("state", e.target.value)
            }
            size="small"
            fullWidth
            sx={{
              mb: 1,
              width: "80%",
              display: "flex",
              justifyItems: "left",
            }}
          />
          <TextField
            label="Country"
            value={formData.company.companyLocation.country}
            onChange={(e) =>
              handleLocationChange("country", e.target.value)
            }
            size="small"
            fullWidth
            sx={{
              mb: 1,
              width: "80%",
              display: "flex",
              justifyItems: "left",
            }}
          />
        </Box>

        {/* Website */}
        <TextField
          label="Website"
          value={formData.company.website}
          onChange={(e) => handleCompanyChange("website", e.target.value)}
          size="small"
          fullWidth
          sx={{ mb: 1, width: "80%", display: "flex", justifyItems: "left" }}
        />

        <Button
          variant="contained"
          component={Link}
          to="/employerDashboard"
          color="primary"
          onClick={handleSubmit}
          sx={{ mt: 2, display: "flex", justifyItems: "left" }}
        >
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default CompleteEmpProfile;
