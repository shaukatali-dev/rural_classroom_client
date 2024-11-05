import React, { useState, useRef, useContext } from "react";
import { uploadPicture } from "../firebase";
import axios from "axios";
import { Helmet } from "react-helmet";
// contexts
import AppContext from "../contexts/AppContext";
// components
import Loader from "../components/Loader";
// constants
import { COMPANY } from "../constants/vars";
import { USER_EDIT_ENDPOINT } from "../constants/endpoints";
// mui
import {
  Paper,
  Box,
  Grid,
  Button,
  TextField,
  Typography,
  CardMedia,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { SyncAlt, Edit } from "@mui/icons-material";

const Profile = () => {
  const formRef = useRef(null);
  const { user, setUser, token } = useContext(AppContext);
  const profilePicRef = useRef(null);
  const coverPicRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [coverPic, setCoverPic] = useState(null);
  console.log("user", user);
  const handleEdit = () => {
    setIsEditable(true);
    window.scrollTo(0, 0);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (formRef.current) {
      const edits = {},
        formData = new FormData(formRef.current);
      if (profilePic) {
        setIsLoading(true);
        const url = await uploadPicture(profilePic, "profile-pic");
        console.log("Uploaded picture URL:", url);
        edits["profilePic"] = url;
      }
      if (coverPic) {
        setIsLoading(true);
        const url = await uploadPicture(coverPic, "cover-pic");
        console.log("Uploaded picture URL:", url);
        edits["coverPic"] = url;
      }
      formData.forEach((value, key) => (edits[key] = value)); // FormData to JS object
      try {
        setIsLoading(true);
        axios
          .patch(
            USER_EDIT_ENDPOINT,
            { query: { _id: user._id }, edits },
            { headers: { Authorization: `Bearer ${token}` } }
          )
          .then((res) => {
            alert("Your profile has been updated!");
            setUser((user) => ({ ...user, ...edits }));
            setIsEditable(false);
            setIsLoading(false);
          })
          .catch((err) => {
            setIsLoading(false);
          });
      } catch (err) {
        setIsLoading(false);
      }
    }
  };

  const handleCoverPic = (e) => {
    const image = e.target.files[0];
    if (image.type.startsWith("image/")) {
      setCoverPic(image);
      setIsEditable(true);
    } else {
      alert("Invalid file type! Upload an 'image' file as your cover picture.");
      setCoverPic(null);
    }
  };

  const handleProfilePic = (e) => {
    const image = e.target.files[0];
    if (image.type.startsWith("image/")) {
      setProfilePic(image);
      setIsEditable(true);
    } else {
      setProfilePic(null);
      alert(
        "Invalid file type! Upload an 'image' file as your profile picture."
      );
    }
  };

  return (
    <>
      <Helmet>
        <title>Profile | {COMPANY}</title>
      </Helmet>
      {isLoading ? <Loader /> : null}
      {user && user.email ? (
        <Paper sx={{ mx: 3 }}>
          <Box p={2}>
            <Grid container>
              <Grid item xs={12} md={8} mb={{ xs: 5, md: 0 }}>
                <Typography color="primary" variant="h4" gutterBottom>
                  Profile
                </Typography>
                <form onSubmit={handleUpdate} ref={formRef}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        inputProps={{ disabled: !isEditable }}
                        defaultValue={user.name}
                        name="name"
                        label="Name"
                        fullWidth
                        variant="standard"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        inputProps={{ disabled: true }}
                        defaultValue={user.role}
                        label="Role"
                        fullWidth
                        variant="standard"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        inputProps={{ disabled: !isEditable }}
                        defaultValue={user.contact}
                        name="contact"
                        label="Contact"
                        fullWidth
                        variant="standard"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        inputProps={{ disabled: true }}
                        defaultValue={user.email}
                        name="email"
                        label="Email Address"
                        fullWidth
                        variant="standard"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        inputProps={{ disabled: !isEditable }}
                        defaultValue={user.address1}
                        name="address1"
                        label="Address line 1"
                        fullWidth
                        variant="standard"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        inputProps={{ disabled: !isEditable }}
                        defaultValue={user.address2}
                        name="address2"
                        label="Address line 2"
                        fullWidth
                        variant="standard"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        inputProps={{ disabled: !isEditable }}
                        defaultValue={user.city}
                        name="city"
                        label="City"
                        fullWidth
                        variant="standard"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        inputProps={{ disabled: !isEditable }}
                        defaultValue={user.state}
                        name="state"
                        label="State/Province/Region"
                        fullWidth
                        variant="standard"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        inputProps={{ disabled: !isEditable }}
                        defaultValue={user.zip}
                        name="zip"
                        label="Zip / Postal code"
                        fullWidth
                        variant="standard"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        inputProps={{ disabled: !isEditable }}
                        defaultValue={user.country}
                        name="country"
                        label="Country"
                        fullWidth
                        variant="standard"
                      />
                    </Grid>
                  </Grid>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    {isEditable ? (
                      <LoadingButton
                        loading={isLoading}
                        type="submit"
                        variant="contained"
                        startIcon={<SyncAlt />}
                        sx={{ mt: 3 }}
                      >
                        Update Profile
                      </LoadingButton>
                    ) : null}
                    {!isEditable ? (
                      <Button
                        variant="contained"
                        startIcon={<Edit />}
                        sx={{ mt: 3 }}
                        onClick={() => handleEdit()}
                      >
                        Edit Profile
                      </Button>
                    ) : null}
                  </Box>
                </form>
              </Grid>
              <Grid item xs={12} md={4} pl={{ xs: 0, md: 5 }}>
                <Typography variant="h6" gutterBottom>
                  Media
                </Typography>
                <input
                  onChange={handleCoverPic}
                  accept="image/*"
                  ref={coverPicRef}
                  type="file"
                  hidden
                />
                <CardMedia
                  onClick={() => coverPicRef?.current?.click()}
                  component="img"
                  sx={{
                    height: "150px",
                    backgroundColor: "lightgray",
                    cursor: "pointer",
                    transition: "all 0.5s",
                    "&:hover": { filter: "brightness(0.75)" },
                  }}
                  loading="lazy"
                  src={coverPic ? URL.createObjectURL(coverPic) : user.coverPic}
                  alt=""
                />
                <input
                  onChange={handleProfilePic}
                  accept="image/*"
                  ref={profilePicRef}
                  type="file"
                  hidden
                />
                <CardMedia
                  onClick={() => profilePicRef?.current?.click()}
                  component="img"
                  sx={{
                    position: "relative",
                    borderRadius: "50%",
                    backgroundColor: "lightgray",
                    width: "150px",
                    height: "150px",
                    outline: "2px solid white",
                    margin: "auto",
                    marginTop: "-75px",
                    zIndex: "1",
                    cursor: "pointer",
                    transition: "all 0.5s",
                    "&:hover": { filter: "brightness(0.75)" },
                  }}
                  loading="lazy"
                  src={
                    profilePic
                      ? URL.createObjectURL(profilePic)
                      : user.profilePic
                  }
                  alt=""
                />
              </Grid>
            </Grid>
          </Box>
        </Paper>
      ) : null}
    </>
  );
};

export default Profile;
