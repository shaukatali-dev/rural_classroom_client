import React, { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
// constants
import { ADMIN_ATTENDANCE_ROUTE, ADMIN_FEES_ROUTE, ADMIN_PERFORMANCE_ROUTE, ADMIN_STUDENTS_ROUTE, ADMIN_USERS_ROUTE, HOME_ROUTE } from "../constants/routes";
// contexts
import AppContext from "../contexts/AppContext";
// mui
import { Drawer as MuiDrawer, Toolbar, List, ListItemIcon, ListItemText, ListItemButton, Divider, IconButton } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import styled from "@mui/material/styles/styled";
import { ChevronLeft, People, ListAlt, Attachment, Assessment, Home, AssignmentInd } from "@mui/icons-material";
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

const AdminSideBar = ({ open, toggleDrawer }) => {
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
        <ListItemButton onClick={() => navigate(HOME_ROUTE)} sx={{ backgroundColor: (location.pathname === HOME_ROUTE ? theme.palette.primary.main : "") + " !important" }}>
          <ListItemIcon>
            <Home />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItemButton>
        <ListItemButton onClick={() => navigate(ADMIN_USERS_ROUTE)} sx={{ backgroundColor: (location.pathname === ADMIN_USERS_ROUTE ? theme.palette.primary.main : "") + " !important" }}>
          <ListItemIcon>
            <AssignmentInd />
          </ListItemIcon>
          <ListItemText primary="Users" />
        </ListItemButton>
        <ListItemButton onClick={() => navigate(ADMIN_STUDENTS_ROUTE)} sx={{ backgroundColor: (location.pathname === ADMIN_STUDENTS_ROUTE ? theme.palette.primary.main : "") + " !important" }}>
          <ListItemIcon>
            <People />
          </ListItemIcon>
          <ListItemText primary="Students" />
        </ListItemButton>
        <ListItemButton onClick={() => navigate(ADMIN_PERFORMANCE_ROUTE)} sx={{ backgroundColor: (location.pathname === ADMIN_PERFORMANCE_ROUTE ? theme.palette.primary.main : "") + " !important" }}>
          <ListItemIcon>
            <ListAlt />
          </ListItemIcon>
          <ListItemText primary="Perfomance" />
        </ListItemButton>
        <ListItemButton onClick={() => navigate(ADMIN_ATTENDANCE_ROUTE)} sx={{ backgroundColor: (location.pathname === ADMIN_ATTENDANCE_ROUTE ? theme.palette.primary.main : "") + " !important" }}>
          <ListItemIcon>
            <Assessment />
          </ListItemIcon>
          <ListItemText primary="Attendance" />
        </ListItemButton>
        <ListItemButton onClick={() => navigate(ADMIN_FEES_ROUTE)} sx={{ backgroundColor: (location.pathname === ADMIN_FEES_ROUTE ? theme.palette.primary.main : "") + " !important" }}> 
          <ListItemIcon>
            <Attachment />
          </ListItemIcon>
          <ListItemText primary="Fees" />
        </ListItemButton>
      </List>
    </Drawer>
  );
};

export default AdminSideBar;
