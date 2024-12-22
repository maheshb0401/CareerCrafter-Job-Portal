import React, { useContext, useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Box,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Badge,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SearchIcon from "@mui/icons-material/Search";
import "./Header.css";
import { useLogout } from "../Auth/Logout";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../Auth/AuthContext";
import { useDispatch, useSelector } from "react-redux";
import { fetchJobSeekerData } from "../../Store/jobSeekerSlice";
import api from "../../services/axiosConfig";

const HeaderAfterLogin = () => {
  const logoutUser = useLogout();
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);

  const profileMenuOpen = Boolean(profileMenuAnchor);
  const handleProfileMenuClick = (event) => {
    setProfileMenuAnchor(event.currentTarget);
  };
  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (searchQuery.trim()) {
      const encodedJobTitle = encodeURIComponent(searchQuery.trim());
      navigate(`/availableJobs/${encodedJobTitle}`);
    }
  };

  const { auth } = useContext(AuthContext); // Access auth context to get the username
  const dispatch = useDispatch();
  const jobSeeker = useSelector((state) => state.jobSeeker);
  const { jobSeekerData, status } = jobSeeker;

  useEffect(() => {
    if (auth?.username && status === "idle") {
      dispatch(fetchJobSeekerData(auth.username));
    }
  }, [dispatch, auth.username, status]);

  const handleOpenDialog = () => {
    setOpenDialog(true);
    markAllAsRead();
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  useEffect(() => {
    if (auth?.username && status === "succeeded" && jobSeekerData?.profileId) {
      const fetchNotifications = async () => {
        try {
          const response = await api.get(
            `/api/notifications/jobseeker/${jobSeekerData.profileId}`
          );
          const notifications = response.data;
          setNotifications(notifications);
        } catch (error) {
          console.error("Error fetching notifications:", error);
        }
      };
      fetchNotifications();
    }
  }, [auth.username, status, jobSeekerData?.profileId]);

  useEffect(() => {
    if (notifications.length > 0) {
      const unreadNotifications = notifications.filter(
        (notification) => notification.read === false
      ).length;
      setUnreadCount(unreadNotifications); // Calculate unread count after notifications are fetched
    }
  }, [notifications]); // Recalculate unread count when notifications change

  const markAllAsRead = async () => {
    if (status === "succeeded" && jobSeekerData?.profileId) {
      try {
        await api.put(
          `/api/notifications/jobseeker/${jobSeekerData.profileId}/mark-read`
        );
        const response = await api.get(
          `/api/notifications/jobseeker/${jobSeekerData.profileId}`
        );
        setNotifications(response.data); // Update notifications state with the latest data
        setUnreadCount(0); // Reset unread count after marking as read
      } catch (error) {
        console.error("Error marking notifications as read:", error);
      }
    }
  };

  // const handelDelete = async()=>{
  //   try{
  //     await api.delete(`/api/jobseeker/${auth.username}`)
  //     alert("Profile Deleted Successfully")
  //   }catch(err){
  //     console.error("error in deleting profile")
  //   }
  // }

  return (
    <AppBar position="static" color="primary">
      <Toolbar className="headerClass">
        <Typography variant="h6" component="div" id="carrerCrafter" className="headerTypo">
          CareerCrafter
        </Typography>

        <Button
          color="inherit"
          id="jobButton"
          className="headerButton"
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
        >
          Jobs
        </Button>
        <Menu
          id="jobs-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "jobButton",
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
          <MenuItem component={Link} to="/recommendedJobs" sx={{ fontSize: "14px" }}>
            Recommended Jobs
          </MenuItem>
          <MenuItem component={Link} to="/availableJobs" sx={{ fontSize: "14px" }}>
            Available Jobs
          </MenuItem>
          <MenuItem component={Link} to="/appliedJobs" sx={{ fontSize: "14px" }}>
            Applied Jobs
          </MenuItem>
        </Menu>

        <Button
          component={Link}
          to="/jobSeekerDashBoard"
          color="inherit"
          id="companiesButton"
          className="headerButton"
        >
          Companies
        </Button>

        <Box sx={{ mx: 10 }} id="headerBox">
          <TextField
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
            placeholder="Search here..."
            sx={{
              bgcolor: "white",
              borderRadius: 4,
              input: { color: "black" },
            }}
            id="headerTextfield"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleSearch}>
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
        <IconButton
          color="inherit"
          id="profileMenuButton"
          onClick={handleProfileMenuClick}
        >
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
          <MenuItem
            component={Link}
            to={`/completeJobSeekerProfile/${auth?.username}`}
          >
            Complete Profile
          </MenuItem>
          <MenuItem component={Link} to={`/updateJobSeekerProfile/${auth?.username}`}>
            Update Profile
          </MenuItem>
          {/* <MenuItem onClick={handelDelete} component={Link} to='/'>
            Delete Profile
          </MenuItem> */}
        </Menu>

        <Button
          onClick={logoutUser}
          color="inherit"
          id="HeaderRegister"
          sx={{ width: "85px !important", marginLeft: "20px" }}
        >
          Logout
        </Button>
      </Toolbar>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        sx={{ display: "flex", justifyContent: "flex-end", mb: "350px", mr: "100px" }}
      >
        <DialogTitle>Notifications</DialogTitle>
        <DialogContent onClick={(e) => e.stopPropagation()}>
          {/* Prevents closing when clicking inside content */}
          {notifications.length > 0 ? (
            <div>
              {notifications.map((notification, index) => (
                <Typography key={index} sx={{ marginBottom: "10px" }}>
                  {notification.message} {/* Assuming notification has a 'message' field */}
                </Typography>
              ))}
            </div>
          ) : (
            <Typography>No notifications</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </AppBar>
  );
};

export default HeaderAfterLogin;
