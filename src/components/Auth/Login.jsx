import { Box, TextField, Typography, Button, Divider } from "@mui/material";
import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import AuthContext from "./AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const { setAuth } = useContext(AuthContext); 
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:8090/api/auth/login", formData);

      const { accessToken, userDto } = response.data;
      const { role } = userDto;

      if (accessToken) {
        setAuth({
          username: userDto.username,
          token: accessToken,
          role: role
        });

        // localStorage.setItem("accessToken", accessToken);
        // localStorage.setItem("username", userDto.username);
        // localStorage.setItem("role", role);

        // Navigate based on role
        if (role === "JOB_SEEKER") {
          navigate("/jobSeekerDashBoard");
        } else if (role === "EMPLOYER") {
          navigate("/employerDashBoard");
        } else {
          alert("Unknown role. Contact support.");
        }
      } else {
        console.error("Access token not found in response:", response.data);
        alert("Login succeeded but no access token received.");
      }
    } catch (error) {
      console.error("Error during login:", error.response?.data || error.message);
      alert("Login failed. Please check your username and password.");
    }
  };

  return (
    <Box className="LoginContainer">
      <Box className="LoginBox">
        <Typography variant="h6" id="registerHeading">Login</Typography>
      </Box>
      <Box className="LoginBox">
        <Typography className="LoginTypo">Username</Typography>
        <TextField
          name="username"
          className="LoginInput"
          placeholder="Enter your username"
          variant="outlined"
          size="small"
          value={formData.username}
          onChange={handleInputChange}
        />
      </Box>
      <Box className="LoginBox">
        <Typography className="LoginTypo">Password</Typography>
        <TextField
          name="password"
          className="LoginInput"
          placeholder="Enter your password"
          variant="outlined"
          size="small"
          type="password"
          value={formData.password}
          onChange={handleInputChange}
        />
      </Box>
      <Box className="LoginBox">
        <Button
          onClick={handleLogin}
          color="inherit"
          id="HeaderRegister"
          sx={{ color: 'white', width: '80%', display: "flex", backgroundColor: '#1976d2 !important' }}
        >
          Login
        </Button>
      </Box>
      <Box className="LoginBox" sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Divider sx={{ flexGrow: 1, marginRight: '5px' }} />
        <Typography sx={{ display: "flex" }}>Or</Typography>
        <Divider sx={{ flexGrow: 1, marginRight: '90px', marginLeft: '5px' }} />
      </Box>
      <Box className="LoginBox">
        <Typography
          component={Link}
          to='/register'
          sx={{ display: 'flex', marginLeft: '110px' }}
        >
          New User? Sign Up
        </Typography>
      </Box>
    </Box>
  );
};

export const logoutUser = () => {
  window.location.href = "/";
};

export default Login;
