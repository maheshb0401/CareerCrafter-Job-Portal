import React, { useState, useContext } from "react";
import { Box, TextField, Typography, Button, RadioGroup, FormControlLabel, FormControl } from "@mui/material";
import Radio from "@mui/material/Radio";
import { registerEmployer, registerJobSeeker } from "../../services/GetSerivce";
import { useNavigate } from "react-router-dom";
import AuthContext from "./AuthContext";  // Import AuthContext

const Register = () => {
  const [selectedRole, setSelectedRole] = useState("jobseeker");
  const { setAuth } = useContext(AuthContext);  // Access setAuth from context
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "email" ? value.toLowerCase() : value,
    });
  };

  const handleSignUp = async () => {

    if (selectedRole === "jobseeker") {
      try {
        const response = await registerJobSeeker(formData);
        if (response?.data?.accessToken && response?.data?.userDto) {
            const { accessToken, userDto } = response.data;
    
            setAuth({
              username: userDto.username,
              token: accessToken,
              role: userDto.role
            });
        }


        navigate(`/`);
        console.log("Registration successful:", response.data);
      } catch (error) {
        console.error("Registration failed:", error.response?.data || error.message);
      }
    } else {
      try {
        const response = await registerEmployer(formData);
        if (response?.data?.accessToken && response?.data?.userDto) {
          const { accessToken, userDto } = response.data;
  
          setAuth({
            username: userDto.username,
            token: accessToken,
            role: userDto.role
          });
      }

        navigate("/");
        console.log("Registration successful:", response.data);
      } catch (error) {
        console.error("Registration failed:", error.response?.data || error.message);
      }
    }
  };

  return (
    <Box className="registerContainer">
      <Box className="registerBox">
        <Typography variant="h6" id="registerHeading">Create your CareerCrafter profile</Typography>
        <Typography id="registerSubHeading">Search & apply to jobs from India's No.1 Job Site</Typography>
      </Box>
      <Box className="registerBox">
        <FormControl component="fieldset" sx={{ display: "flex", justifyItems: "left" }}>
          <RadioGroup row aria-label="role" name="role" value={selectedRole} onChange={handleRoleChange}>
            <FormControlLabel value="jobseeker" control={<Radio />} label="Jobseeker" />
            <FormControlLabel value="employer" control={<Radio />} label="Employer" />
          </RadioGroup>
        </FormControl>
      </Box>
      {["username", "password", "email", "firstName", "lastName", "phoneNumber"].map((field) => (
        <Box key={field} className="registerBox">
          <Typography className="registerTypo">{field.charAt(0).toUpperCase() + field.slice(1)}</Typography>
          <TextField
            className="registerInput"
            name={field}
            placeholder={`Enter your ${field}`}
            variant="outlined"
            size="small"
            value={formData[field]}
            onChange={handleInputChange}
          />
        </Box>
      ))}
      <Box className="registerBox" sx={{ marginTop: "18px!important", mr:'80px' }}>
        <Button onClick={handleSignUp} color="inherit" sx={{ color: "white", width: "80%", backgroundColor: "#1976d2" }}>
          Sign Up
        </Button>
      </Box>
    </Box>
  );
};

export default Register;
