import React from "react";
import { AppBar, Toolbar, Typography, Button, IconButton, InputAdornment, TextField, Box } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import './Header.css';
import { Link } from "react-router-dom";
const HeaderBeforeLogin = ()=>{

    //   const { user } = useContext(AuthContext);
    const user = { role: "JOB_SEEKER" };

    return(
        <AppBar position="static" color="primary">
      <Toolbar className="headerClass">
        <Typography variant="h6" component="div" id="carrerCrafter" className="headerTypo">
          CareerCrafter
        </Typography>

        {user?.role === "JOB_SEEKER" && (
          <>
            <Button color="inherit" onClick={ ()=>{alert("Login First")} }  id="jobButton" className="headerButton" >
              Jobs
            </Button>
            <Button color="inherit" onClick={ ()=>{alert("Login First")} } id="companiesButton" className="headerButton" >
              Companies
            </Button>
          </>
        )}
        {user?.role === "EMPLOYER" && (
          <>
            <Button color="inherit" onClick={ ()=>{alert("Login First")} } id="applicationButton" className="headerButton">
              Applications
            </Button>
            <Button color="inherit" onClick={ ()=>{alert("Login First")} } id="jobPostingsButton" className="headerButton">
              Job Postings
            </Button>
          </>
        )}

        <Box component="form" sx={{ mx: 10 }} id="headerBox">
          <TextField
            size="small"
            // variant="outlined"
            placeholder="Search here..."
            sx={{
              bgcolor: "white",
              borderRadius: 4,
              input: { color: "black" },
            }}
            id="headerTextfield"
            InputProps={{
                endAdornment: (
                  <InputAdornment position="end" sx={{ margin: 0 }}>
                    <IconButton >
                    <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
          />
        </Box>
        <Button component={Link} to='/' color="inherit" id="HeaderLogin" >Login</Button>
        <Button component={Link} to='/register' color="inherit" id="HeaderRegister" sx={{ width: '85px !important'}}>Sign Up</Button>
      </Toolbar>
    </AppBar>
    );

}

export default HeaderBeforeLogin;