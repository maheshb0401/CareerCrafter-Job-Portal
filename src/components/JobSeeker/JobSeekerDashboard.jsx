import { Box, Typography, Card, CardContent, CardActionArea, CardMedia, CircularProgress } from "@mui/material";
import React, { useState, useEffect } from "react";
import HeaderAfterLogin from "../Layouts/HeaderAfterLogin";
import api from "../../services/axiosConfig";
import "./JobSeekerDashboard.css";
import companyLogo from "../../assets/companyLogo.png";
import {Link} from 'react-router-dom';


const JobSeekerDashboard = () => {
  const [companyData, setCompanyData] = useState([]); 
  const [error, setError] = useState(null); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const response = await api.get("api/companies/getAll");
        console.log("API Response Data:", response.data);
        
        setCompanyData(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error("Error fetching company data:", err.response?.data || err.message);
        setError(err.response?.data || "An error occurred while fetching data.");
      }finally {
        setLoading(false);
      }
    };
    fetchCompanyData();
  }, []);


  return (
    <Box>
      <HeaderAfterLogin />
      <Box className="jobSeekerDashboard">
        <Typography variant="h5" sx={{marginBottom:'20px'}}>Top companies hiring</Typography>
        { loading ? ( 
          <Box sx={{ display: 'flex', justifyContent: 'center', margin: '20px' }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <Box className = "companyBox">
            {companyData.length > 0 ? (
              companyData.map((company, index) => (
                <Card key={index} sx={{ maxWidth: 300 }}>
                <CardActionArea component={Link} to={`/companyDetails/${company.companyID}`} >
                  <CardMedia
                    component="img"
                    height="180"
                    image={companyLogo}
                  />
                  <CardContent>
                    <Box >
                    <Typography gutterBottom variant="h6" component="div" sx={{display:"flex", justifyItems:'left'}}>
                      {company.companyName}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary',display:"flex", justifyItems:'left'}}>
                      {company.website}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary',display:"flex", justifyItems:'left'}}>
                      {company.companyLocation.city}, {company.companyLocation.state}
                    </Typography>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
              ))
            ) : (
              <Typography>No companies available</Typography>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default JobSeekerDashboard;
