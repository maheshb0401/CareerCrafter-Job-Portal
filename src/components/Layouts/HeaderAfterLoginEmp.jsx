import React, { useContext, useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Button, IconButton, InputAdornment, TextField, Box, Badge, Dialog, DialogTitle, DialogContent, DialogActions, Menu, MenuItem } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SearchIcon from '@mui/icons-material/Search';
import './Header.css';
import { useLogout } from "../Auth/Logout";
import { Link } from "react-router-dom";
import AuthContext from "../Auth/AuthContext";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployerData } from "../../Store/jobSlice";
import api from "../../services/axiosConfig";

const HeaderAfterLoginEmp = () => {
  const logoutUser = useLogout();
  const [openDialog, setOpenDialog] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);

  const profileMenuOpen = Boolean(profileMenuAnchor);
  const handleProfileMenuClick = (event) => {
    setProfileMenuAnchor(event.currentTarget);
  };
  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };

  const { auth } = useContext(AuthContext);
  const dispatch = useDispatch();
  const { employerData, status } = useSelector((state) => state.jobs);

  useEffect(() => {
    const username = auth.username;
    console.log("Username in useEffect:", username);
    if (username && status === "idle") {
      dispatch(fetchEmployerData(username));
    }
  }, [dispatch, status, auth.username]);

  const handleOpenDialog = () => {
    setOpenDialog(true);
    markAllAsRead();
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  useEffect(() => {
    if (auth?.username && status === 'succeeded' && employerData?.employerId) {
      const fetchNotifications = async () => {
        try {
          const response = await api.get(`/api/notifications/employer/${employerData.employerId}`);
          setNotifications(response.data);
        } catch (error) {
          console.error("Error fetching notifications:", error);
        }
      };
      fetchNotifications();
    }
  }, [auth.username, status, employerData?.employerId]);

  useEffect(() => {
    if (notifications.length > 0) {
      const unreadNotifications = notifications.filter(notification => notification.read === false).length;
      setUnreadCount(unreadNotifications);
    }
  }, [notifications]);

  const markAllAsRead = async () => {
    if (status === "succeeded" && employerData?.employerId) {
      try {
        await api.put(`/api/notifications/employer/${employerData.employerId}/mark-read`);
        const response = await api.get(`/api/notifications/employer/${employerData.employerId}`);
        setNotifications(response.data);
        setUnreadCount(0);
      } catch (error) {
        console.error("Error marking notifications as read:", error);
      }
    }
  };

  

  return (
    <AppBar position="static" color="primary">
      <Toolbar className="headerClass">
        <Typography variant="h6" sx={{textDecoration:'none', color:"inherit"}} component={Link} to='/employerDashBoard' id="carrerCrafter" className="headerTypo">
          CareerCrafter
        </Typography>

        <Button color="inherit" component={Link} to='/application' id="applicationButton" className="headerButton">
          Applications
        </Button>
        <Button color="inherit" component={Link} to='/jobPost' id="jobPostingsButton" className="headerButton">
          Job Postings
        </Button>

        <Box component="form" sx={{ mx: 10 }} id="headerBox">
          <TextField
            size="small"
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

        <IconButton color="inherit" onClick={handleOpenDialog} className="IconButton">
          <Badge badgeContent={unreadCount} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <IconButton color="inherit" onClick={handleProfileMenuClick} id="IconButton">
          <AccountCircleIcon />
        </IconButton>

        <Menu
          id="profile-menu"
          anchorEl={profileMenuAnchor}
          open={profileMenuOpen}
          onClose={handleProfileMenuClose}
          MenuListProps={{
            "aria-labelledby": "profileMenuButton",
          }}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <MenuItem component={Link} to={`/completeEmployerProfile/${auth?.username}`}>
            Complete Profile
          </MenuItem>
          <MenuItem component={Link} to={`/updateEmployerProfile/${auth?.username}`}>
            Update Profile
          </MenuItem>
        </Menu>

        <Button onClick={logoutUser} color="inherit" id="HeaderRegister" sx={{ width: '85px !important', marginLeft:'20px'}}>Logout</Button>
      </Toolbar>

      <Dialog open={openDialog} onClose={handleCloseDialog} sx={{display:"flex", justifyContent:"flex-end", mb:'350px', mr:'150px'}}>
        <DialogTitle>Notifications</DialogTitle>
        <DialogContent onClick={(e) => e.stopPropagation()}>
          {notifications.length > 0 ? (
            <div>
              {notifications.map((notification, index) => (
                <Typography key={index} sx={{ marginBottom: '10px' }}>
                  {notification.message}
                </Typography>
              ))}
            </div>
          ) : (
            <Typography>No notifications</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">Close</Button>
        </DialogActions>
      </Dialog>
    </AppBar>
  );
};

export default HeaderAfterLoginEmp;
