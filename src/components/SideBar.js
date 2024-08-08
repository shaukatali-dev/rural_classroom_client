import React, { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
// constants
import { ADMIN_ROUTE, AUTH_ROUTE, HOME_ROUTE, ANALYTICS_ROUTE } from "../constants/routes";
// contexts
import AppContext from "../contexts/AppContext";
// mui
import { Drawer as MuiDrawer, Toolbar, List, ListItemIcon, ListItemText, ListItemButton, Divider, IconButton } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import styled from "@mui/material/styles/styled";
import { Home, ChevronLeft, AccountCircle, AdminPanelSettings, Insights } from "@mui/icons-material";
// vars
const drawerWidth = 240;

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== "open" })(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

const SideBar = ({ open, toggleDrawer }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { user } = useContext(AppContext);

  return (
    <Drawer variant="permanent" open={open}>
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          px: [1],
        }}
      >
        <IconButton onClick={toggleDrawer}>
          <ChevronLeft />
        </IconButton>
      </Toolbar>
      <Divider />
      <List component="nav">
        {user && user.email ? (
          <>
            <ListItemButton onClick={() => navigate(HOME_ROUTE)} sx={{ backgroundColor: (location.pathname === HOME_ROUTE ? theme.palette.primary.main : "") + " !important" }}>
              <ListItemIcon>
                <Home />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItemButton>
            <ListItemButton onClick={() => navigate(ANALYTICS_ROUTE)} sx={{ backgroundColor: (location.pathname === ANALYTICS_ROUTE ? theme.palette.primary.main : "") + " !important" }}>
              <ListItemIcon>
                <Insights />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItemButton>
          </>
        ) : (
          <>
            <ListItemButton onClick={() => navigate(AUTH_ROUTE)} sx={{ backgroundColor: (location.pathname === AUTH_ROUTE ? theme.palette.primary.main : "") + " !important" }}>
              <ListItemIcon>
                <AccountCircle />
              </ListItemIcon>
              <ListItemText primary="Auth" />
            </ListItemButton>
          </>
        )}
        {user && user.role === "admin" && (
          <>
            <ListItemButton onClick={() => navigate(ADMIN_ROUTE)}>
              <ListItemIcon>
                <AdminPanelSettings />
              </ListItemIcon>
              <ListItemText primary="Admin panel" />
            </ListItemButton>
          </>
        )}
      </List>
    </Drawer>
  );
};

export default SideBar;
