import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
// constants
import { COMPANY, COMPANY2, LOCALSTORAGE } from "../constants/vars";
import { UPLOAD_URL } from "../constants/urls";
import { AUTH_ROUTE, PROFILE_ROUTE } from "../constants/routes";
// contexts
import AppContext from "../contexts/AppContext";
// mui
import { AppBar as MuiAppBar, Stack, Toolbar, IconButton, Typography, Avatar, Menu, MenuItem } from "@mui/material";
import styled from "@mui/material/styles/styled";
import MenuIcon from "@mui/icons-material/Menu";
import PixIcon from "@mui/icons-material/Pix";
// vars
const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const NavBar = ({ open, toggleDrawer }) => {
  const navigate = useNavigate();
  const { user, setUser, setToken } = useContext(AppContext);
  const [profileAnchor, setProfileAnchor] = useState(null);

  const handleMenuItem = (route) => {
    navigate(route);
    setProfileAnchor(null);
  };

  const handleLogout = () => {
    setUser({});
    setToken(null);
    const localData = JSON.parse(localStorage.getItem(LOCALSTORAGE)) || {};
    delete localData.token;
    localStorage.setItem(LOCALSTORAGE, JSON.stringify(localData));
    navigate(AUTH_ROUTE);
  };

  return (
    <AppBar position="absolute" open={open}>
      <Toolbar
        sx={{
          pr: "24px", // keep right padding when drawer closed
        }}
      >
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
          onClick={toggleDrawer}
          sx={{
            marginRight: "36px",
            ...(open && { display: "none" }),
          }}
        >
          <MenuIcon />
        </IconButton>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ flexGrow: 1 }}>
          <PixIcon fontSize="large" />
          <Stack>
            <Typography component="h1" variant="h6" color="inherit" noWrap>
              {COMPANY}
            </Typography>
            <Typography component="h1" variant="body2" color="inherit" noWrap>
              {COMPANY2}
            </Typography>
          </Stack>
        </Stack>
        <IconButton onClick={(e) => setProfileAnchor(e.currentTarget)} sx={{ p: 0 }}>
          <Avatar alt="Remy Sharp" src={UPLOAD_URL + user?.profilePic} />
        </IconButton>
        <Menu
          sx={{ mt: "45px" }}
          id="menu-appbar"
          anchorEl={profileAnchor}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={Boolean(profileAnchor)}
          onClose={() => setProfileAnchor(null)}
        >
          {!user?._id ? (
            <MenuItem onClick={() => handleMenuItem(AUTH_ROUTE)}>
              <Typography textAlign="center">Login</Typography>
            </MenuItem>
          ) : null}
          {user?._id ? (
            <MenuItem onClick={() => handleMenuItem(PROFILE_ROUTE)}>
              <Typography textAlign="center">Profile</Typography>
            </MenuItem>
          ) : null}
          {user?._id ? (
            <MenuItem onClick={() => handleLogout()}>
              <Typography textAlign="center">Logout</Typography>
            </MenuItem>
          ) : null}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
