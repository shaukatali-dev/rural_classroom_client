import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import validator from "validator";
import { Helmet } from "react-helmet";
// firebase
import { auth, googleProvider } from "../firebase";
// mui
import {
  Container,
  Grid,
  Stack,
  TextField,
  InputAdornment,
  Tooltip,
  Divider,
  Chip,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import {
  AccountCircle,
  Key,
  Login,
  LockOpen,
  Pix,
  StarBorder,
  Google,
} from "@mui/icons-material";
// contexts
import AppContext from "../contexts/AppContext";
// constants
import { COMPANY, COMPANY2, LOCALSTORAGE } from "../constants/vars";
import { HOME_ROUTE } from "../constants/routes";
import {
  AUTH_OTP_GENERATE_ENDPOINT,
  AUTH_OTP_VERIFY_ENDPOINT,
  AUTH_EMAIL_ENDPOINT,
} from "../constants/endpoints";
import { VIDEOS_AUTH_MP4 } from "../constants/videos";

const AuthUser = () => {
  const navigate = useNavigate();
  const { mode, setToken } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isGglLoading, setIsGglLoading] = useState(false);
  const [emailErr, setEmailErr] = useState("");
  const [otpErr, setOtpErr] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);

  const handleGoogleAuth = () => {
    setIsGglLoading(true);
    console.log("authentication started");
    auth
      .signInWithPopup(googleProvider)
      .then((res) => {
        console.log("res auth", res.user);
        const email = res.user.email;
        axios
          .post(AUTH_EMAIL_ENDPOINT, { email })
          .then((res) => {
            const { token } = res.data;
            // storing token
            const localData =
              JSON.parse(localStorage.getItem(LOCALSTORAGE)) || {};
            localStorage.setItem(
              LOCALSTORAGE,
              JSON.stringify({ ...localData, token })
            );
            setToken(token);
            // back to home
            navigate(HOME_ROUTE);
            // resets
            setIsGglLoading(false);
          })
          .catch((err) => {
            console.log(err);
            setIsGglLoading(false);
          });
      })
      .catch((err) => {
        console.log(err);
        setIsGglLoading(false);
      });
  };

  const generateOtp = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get("email");
    if (!validator.isEmail(email))
      setEmailErr("Please, provide a valid email addess.");
    else {
      try {
        setIsLoading(true);
        axios
          .post(AUTH_OTP_GENERATE_ENDPOINT, { email })
          .then((res) => {
            const { token } = res.data;
            // storing token
            const localData =
              JSON.parse(localStorage.getItem(LOCALSTORAGE)) || {};
            localStorage.setItem(
              LOCALSTORAGE,
              JSON.stringify({ ...localData, token })
            );
            // open otp form
            setIsOtpSent(true);
            // resets
            setIsLoading(false);
            setEmailErr("");
          })
          .catch((err) => {
            //resets
            setIsLoading(false);
            setEmailErr(err.response.data.message || "Something went wrong!");
          });
      } catch (err) {
        // resets
        setIsLoading(false);
        setEmailErr("Something went wrong! Try refreshing.");
      }
    }
  };

  const verifyOtp = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get("email");
    const otp = formData.get("otp");
    const token = JSON.parse(localStorage.getItem(LOCALSTORAGE))?.token;
    if (!otp) setOtpErr("Please, provide the One Time Password (OTP).");
    else if (!email || !token) {
      setEmailErr("Please, provide your email addess.");
      setIsOtpSent(false);
    } else {
      try {
        setIsLoading(true);
        axios
          .post(AUTH_OTP_VERIFY_ENDPOINT, { otp, email, token })
          .then(async (res) => {
            const { isVerified, token } = res.data;
            if (isVerified) {
              // storing token
              const localData =
                JSON.parse(localStorage.getItem(LOCALSTORAGE)) || {};
              localStorage.setItem(
                LOCALSTORAGE,
                JSON.stringify({ ...localData, token })
              );
              setToken(token);
              // resets
              setIsLoading(false);
              setOtpErr("");
              setIsOtpSent(false);
              navigate(HOME_ROUTE);
            }
          })
          .catch((err) => {
            // resets
            setIsLoading(false);
            setOtpErr(err.message || "Something went wrong!");
          });
      } catch (err) {
        // resets
        setIsLoading(false);
        console.log(err.message);
        setOtpErr("Something went wrong! Try refreshing.");
      }
    }
  };

  return (
    <Container
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 9999,
        px: "0 !important",
        width: "100vw",
        maxWidth: "100vw !important",
        height: "100vh",
      }}
    >
      <Helmet>
        <title>Auth | User | {COMPANY}</title>
      </Helmet>
      <Grid container>
        <Grid item xs={12}>
          <Grid container sx={{ height: "100vh" }}>
            <Grid
              item
              sm={12}
              md={6}
              lg={8}
              sx={{ display: { sm: "none", md: "flex" } }}
            >
              <Stack
                sx={{
                  position: "relative",
                  width: "100%",
                  display: { xs: "none", sm: "flex" },
                }}
                justifyContent="flex-end"
              >
                <video
                  style={{
                    position: "absolute",
                    zIndex: "0",
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                  src={VIDEOS_AUTH_MP4}
                  muted
                  autoPlay
                  loop
                ></video>
                <Stack
                  justifyContent="flex-end"
                  sx={{
                    backgroundColor: "rgba(0, 0, 255, 0.4)",
                    minHeight: "100vh",
                    zIndex: 1,
                  }}
                >
                  <Stack
                    p={2}
                    spacing={2}
                    sx={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                  >
                    <Typography color="white" variant="h4">
                      Bridging Distances, Building Dreams.
                    </Typography>
                    <List disablePadding>
                      <ListItem disableGutters disablePadding>
                        <ListItemIcon>
                          <StarBorder sx={{ color: "white" }} />
                        </ListItemIcon>
                        <ListItemText
                          sx={{ color: "white" }}
                          primary="Livestream multiple classes in real-time for a dynamic education experience that knows no boundaries."
                        />
                      </ListItem>
                      <ListItem disableGutters disablePadding>
                        <ListItemIcon>
                          <StarBorder sx={{ color: "white" }} />
                        </ListItemIcon>
                        <ListItemText
                          sx={{ color: "white" }}
                          primary="Explore a vast resource library filled with videos, documents, and materials that empower your educational journey."
                        />
                      </ListItem>
                      <ListItem disableGutters disablePadding>
                        <ListItemIcon>
                          <StarBorder sx={{ color: "white" }} />
                        </ListItemIcon>
                        <ListItemText
                          sx={{ color: "white" }}
                          primary="Connect with teachers in real-time, resolving doubts instantly through live chat and Q&A sessions."
                        />
                      </ListItem>
                      <ListItem disableGutters disablePadding>
                        <ListItemIcon>
                          <StarBorder sx={{ color: "white" }} />
                        </ListItemIcon>
                        <ListItemText
                          sx={{ color: "white" }}
                          primary="Stay on track with automated attendance tracking, ensuring your commitment to learning is recognized and supported."
                        />
                      </ListItem>
                    </List>
                  </Stack>
                </Stack>
              </Stack>
            </Grid>
            <Grid item sm={12} md={6} lg={4} sx={{ width: "100%" }}>
              <Stack
                flex={1}
                px={2}
                spacing={1}
                justifyContent="center"
                sx={{
                  height: "100%",
                  backgroundColor: (theme) =>
                    mode === "dark"
                      ? theme.palette.grey[900]
                      : theme.palette.grey[100],
                }}
              >
                <Stack direction="row" alignItems="center">
                  <Pix color="primary" fontSize="large" />
                  <Stack sx={{ userSelect: "none", ml: 1 }}>
                    <Typography color="primary" variant="h6" align="left">
                      {COMPANY}
                    </Typography>
                    <Typography
                      color="text.primary"
                      variant="body2"
                      align="left"
                      gutterBottom
                    >
                      {COMPANY2}
                    </Typography>
                  </Stack>
                </Stack>
                <form
                  onSubmit={(e) => (!isOtpSent ? generateOtp(e) : verifyOtp(e))}
                >
                  <Stack>
                    <TextField
                      variant="standard"
                      label="Email"
                      name="email"
                      error={Boolean(emailErr)}
                      helperText={
                        emailErr || "Lets begin with you email address!"
                      }
                      inputProps={{ readOnly: isOtpSent }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <AccountCircle />
                          </InputAdornment>
                        ),
                      }}
                    />
                    {isOtpSent ? (
                      <TextField
                        variant="standard"
                        label="One Time Password (OTP)"
                        name="otp"
                        error={Boolean(otpErr)}
                        helperText={
                          otpErr || "Enter the OTP sent to above email address."
                        }
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <Tooltip title="OTP">
                                <Key />
                              </Tooltip>
                            </InputAdornment>
                          ),
                        }}
                      />
                    ) : null}
                    <LoadingButton
                      type="submit"
                      variant="contained"
                      loading={isLoading}
                      endIcon={!isOtpSent ? <Login /> : <LockOpen />}
                    >
                      {!isOtpSent ? "Login" : "Verify"}
                    </LoadingButton>
                  </Stack>
                </form>
                <Divider
                  sx={{ "&::before": { top: 0 }, "&::after": { top: 0 } }}
                >
                  <Chip label="OR" />
                </Divider>
                <Stack justifyContent="center" direction="row">
                  <LoadingButton
                    loading={isGglLoading}
                    fullWidth
                    variant="outlined"
                    onClick={handleGoogleAuth}
                    startIcon={<Google />}
                  >
                    Sign In With Google
                  </LoadingButton>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AuthUser;
