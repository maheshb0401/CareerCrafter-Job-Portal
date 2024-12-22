import React from "react";
import { Box, Typography, Button} from '@mui/material';
import HeaderBeforeLogin from "./HeaderBeforeLogin";
import CheckIcon from '@mui/icons-material/Check';
import Login from "../Auth/Login";
import {Link} from "react-router-dom";

const HomePageLogin = ()=>{
    return(
        <Box className='homePage'>
        <HeaderBeforeLogin/>
        <Box className="homeParentContainer">
        <Box className='homeContainer'>
            <Box className="homeBox">
                <Typography variant="h6" >New to CareerCrafter?</Typography>
                <Box className="pointsBox">
                    <Box sx={{display:"flex"}}>
                        <CheckIcon ></CheckIcon>
                        <Typography sx={{marginLeft: 1, fontSize: "14px"}}>One click apply using carrerCrafter.</Typography>
                    </Box>
                    <Box sx={{display:"flex"}}>
                        <CheckIcon ></CheckIcon>
                        <Typography sx={{marginLeft: 1, fontSize: "14px"}}>Get relevant job recommendations.</Typography>
                    </Box>
                    <Box sx={{display:"flex"}}>
                        <CheckIcon ></CheckIcon>
                        <Typography sx={{marginLeft: 1, fontSize: "14px"}}>Showcase profile to top companies and consultants. </Typography>
                    </Box>
                    <Box sx={{display:"flex"}}>
                        <CheckIcon ></CheckIcon>
                        <Typography sx={{marginLeft: 1, fontSize: "14px"}}>Know application status on applied jobs.</Typography>
                    </Box>
                    <Button component={Link} to='/register' color="inherit" id="HeaderRegister" sx={{ color: 'white', width: '80%', marginTop:'10px !important'}}>Register for Free</Button>

                </Box>

            </Box>
        </Box>
        <Box className="homeContainer2">
        <Login/>
        </Box>
        </Box>
       </Box>
    );
}

export default HomePageLogin;