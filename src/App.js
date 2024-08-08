import React, { lazy, Suspense, useState, useEffect } from "react";
import axios from "axios";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";
// constants
import { LOCALSTORAGE, COMPANY } from "./constants/vars";
import { AUTH_TOKEN_ENDPOINT, COURSE_GET_ENDPOINT, TEST_GET_ENDPOINT, LECTURE_GET_ENDPOINT } from "./constants/endpoints";
// components
import Loader from "./components/Loader";
import NavBar from "./components/NavBar";
import SideBar from "./components/SideBar";
import Footer from "./components/Footer";
// mui
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Box, Toolbar, SpeedDial, SpeedDialIcon, SpeedDialAction } from "@mui/material";
import { LightMode, DarkMode } from "@mui/icons-material";
import AppContext from "./contexts/AppContext";
import AdminSideBar from "./components/AdminSideBar";
// pages
const Home = lazy(() => import("./pages/Home"));
const Profile = lazy(() => import("./pages/Profile"));
const Course = lazy(() => import("./pages/Course"));
const Test = lazy(() => import("./pages/Test"));
const Auth = lazy(() => import("./pages/Auth"));

const AdminStudents = lazy(() => import ("./pages/admin/students/index"));
const AdminPerformance = lazy(() => import ("./pages/admin/performance/index"));
const AdminAttendance = lazy(() => import ("./pages/admin/attendance/index"));
const AdminFees = lazy(() => import ("./pages/admin/fees/index"));
const AdminUsers = lazy(() => import ("./pages/admin/users/index"));
const Analytics = lazy(() => import("./pages/Analytics"));

const Dashboard = () => {
  const [mode, setMode] = useState("light");
  const [token, setToken] = useState(null);
  const [user, setUser] = useState({});
  const [courses, setCourses] = useState([]);
  const [lectures, setLectures] = useState([]);
  const [tests, setTests] = useState([]);
  const [open, setOpen] = useState(false);
  const [showAdminSideBar, setShowAdminSideBar] = useState(false);
  const location = useLocation();
  const toggleDrawer = () => {
    setOpen(!open);
  };

  useEffect(() => {
    if (location.pathname.includes("/admin")) {
      setShowAdminSideBar(true);
    } else {
      setShowAdminSideBar(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    const localData = JSON.parse(localStorage.getItem(LOCALSTORAGE)) || {};
    // set token
    setToken(localData?.token);
    // set mode
    if (localData.mode) setMode(localData.mode);
  }, []);

  useEffect(() => {
    if (token) {
      try {
        axios
          .post(AUTH_TOKEN_ENDPOINT, {}, { headers: { Authorization: `Bearer ${token}` } })
          .then((res) => {
            const user = res.data.data;
            setUser(user);
          })
          .catch((err) => {
            setUser(null);
          });
      } catch (err) {
        setUser(null);
      }
    } else setUser(null);
  }, [token]);

  useEffect(() => {
    if (user?.role) {
      // fetch courses
      {
        const query = {};
        if (user.role === "teacher") query["teacher"] = user._id;
        else query["_id"] = { $in: user.courses };
        axios
          .get(COURSE_GET_ENDPOINT, { headers: { Authorization: `Bearer ${token}` }, params: { query: JSON.stringify(query) } })
          .then((res) => {
            setCourses(res.data.data);
          })
          .catch((err) => {
            console.log("Something went wrong! Courses couldn't be fetched.");
          });
      }
      // fetch lectures
      {
        const query = {};
        query["course"] = { $in: user.courses };
        axios
          .get(LECTURE_GET_ENDPOINT, { headers: { Authorization: `Bearer ${token}` }, params: { query: JSON.stringify(query) } })
          .then((res) => {
            setLectures(res.data.data);
          })
          .catch((err) => {
            console.log("Something went wrong! Courses couldn't be fetched.");
          });
      }
      // fetch tests
      {
        const query = {};
        query["course"] = { $in: user.courses };
        axios
          .get(TEST_GET_ENDPOINT, { headers: { Authorization: `Bearer ${token}` }, params: { query: JSON.stringify(query) } })
          .then((res) => {
            setTests(res.data.data);
          })
          .catch((err) => {
            console.log("Something went wrong! Courses couldn't be fetched.");
          });
      }
    }
  }, [user]);

  const handleMode = () => {
    const newMode = mode === "light" ? "dark" : "light";
    setMode(newMode);
    // save to localstorage
    localStorage.setItem(LOCALSTORAGE, JSON.stringify({ ...JSON.parse(localStorage.getItem(LOCALSTORAGE)), mode: newMode }));
  };

  const isProfileComplete = (user) => {
    const { name, email } = user;
    if (name && email) return true;
    return false;
  };

  const theme = createTheme({ palette: { mode } });
  return (
    <ThemeProvider theme={theme}>
      <AppContext.Provider value={{ mode, handleMode, user, setUser, token, setToken, courses, setCourses, lectures, setLectures, tests, setTests }}>
        <Helmet>
          <title>{COMPANY}</title>
        </Helmet>
        <SpeedDial sx={{ position: "fixed", bottom: 16, left: 16, zIndex: 99999 }} icon={<SpeedDialIcon />} direction={"up"} ariaLabel="SpeedDial playground example">
          <SpeedDialAction onClick={handleMode} icon={mode === "light" ? <LightMode /> : <DarkMode />} tooltipTitle={"Switch to " + (mode === "light" ? "Dark" : "Light") + " Theme"} />
        </SpeedDial>
        <Box sx={{ display: "flex" }}>
          <NavBar open={open} toggleDrawer={toggleDrawer} />
          {!showAdminSideBar && <SideBar open={open} toggleDrawer={toggleDrawer} />}
          {showAdminSideBar && <AdminSideBar open={open} toggleDrawer={toggleDrawer} />}
          <Box
            component="main"
            sx={{
              backgroundColor: (theme) => (theme.palette.mode === "light" ? theme.palette.grey[100] : theme.palette.grey[900]),
              flexGrow: 1,
              height: "100vh",
              overflow: "auto",
            }}
          >
            <Toolbar sx={{ mb: 3 }} />
            <Suspense fallback={<Loader />}>
              <Routes>
                {user ? (
                  <>
                    {!isProfileComplete(user) ? <Route path="/*" element={<Profile />} /> : null}
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/course/:courseId" element={<Course />} />
                    <Route path="/test/:testId" element={<Test />} />
                    <Route path="/profile/" element={<Profile />} />
                    {/* admin routes */}
                    <Route path="/admin" element={<Navigate to="/admin/students" replace />} />
                    <Route path="/admin/users" element={<AdminUsers/>} />
                    <Route path="/admin/students" element={<AdminStudents />} />
                    <Route path="/admin/performance" element={<AdminPerformance />} />
                    <Route path="/admin/attendance" element={<AdminAttendance />} />
                    <Route path="/admin/fees" element={<AdminFees />} />
                    <Route path="/*" element={<Home />} />
                  </>
                ) : (
                  <>
                    <Route path="/*" element={<Auth />} />
                  </>
                )}
              </Routes>
            </Suspense>
            {!showAdminSideBar && <Footer sx={{ mt: 3 }} />}
          </Box>
        </Box>
      </AppContext.Provider>
    </ThemeProvider>
  );
};

export default Dashboard;
