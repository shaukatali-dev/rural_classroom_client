import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Box, Button, Dialog, DialogActions, DialogTitle, InputLabel, TextField, Select, OutlinedInput, MenuItem } from "@mui/material";
import { FILE_UPLOAD_ENDPOINT, STUDENT_NEW_ENDPOINT, USER_GET_ENDPOINT, USER_NEW_ENDPOINT } from "../../../constants/endpoints";
import AppContext from "../../../contexts/AppContext";

const AddUserDialog = ({ open, onClose, fetch }) => {
  const { token } = useContext(AppContext);
  const [profilePic, setProfilePic] = useState("");
  const [coverPic, setCoverPic] = useState("");
  const [value, setValue] = useState('coordinator');


  const uploadProfilePic = (files) => {
    const formData = new FormData();
    for (const key of Object.keys(files)) {
      formData.append("files", files[key]);
    }
    if (files.length) {
      try {
        axios
          .post(FILE_UPLOAD_ENDPOINT, formData, { headers: { Authorization: "Bearer " + token } })
          .then((res) => {
            setProfilePic(Object.values(res.data.data)[0]);
          })
          .catch((err) => console.log(err));
      } catch (err) {
        console.log(err);
      }
    }
  };

  const uploadCoverPic = (files) => {
    const formData = new FormData();
    for (const key of Object.keys(files)) {
      formData.append("files", files[key]);
    }
    if (files.length) {
      try {
        axios
          .post(FILE_UPLOAD_ENDPOINT, formData, { headers: { Authorization: "Bearer " + token } })
          .then((res) => {
            setCoverPic(Object.values(res.data.data)[0]);
          })
          .catch((err) => console.log(err));
      } catch (err) {
        console.log(err);
      }
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    if (token) {
      const data = {
        name: form["name"].value,
        email: form["email"].value,
        contact: form["contact"].value,
        role: value,
        profilePic,
        coverPic,
      };
      axios
        .post(USER_NEW_ENDPOINT, data, { headers: { Authorization: "Bearer " + token } })
        .then((res) => {
          console.log(res.data);
          fetch();
          onClose();
        })
        .catch((err) => {
          console.log(err);
          onClose();
        });
    } else {
      console.log("missing user or token");
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle>Add new User</DialogTitle>
        <Box sx={{ mx: 3 }}>
          <Box>
            <InputLabel sx={{ mb: 1, ml: 0.5 }}>Name of the User:</InputLabel>
            <TextField required fullWidth sx={{ mb: 2 }} name="name" placeholder={"Enter the name"} />
          </Box>
          <Box>
            <InputLabel sx={{ mb: 1, ml: 0.5 }}>Email of the User:</InputLabel>
            <TextField required fullWidth sx={{ mb: 2 }} name="email" placeholder={"Enter the email"} />
          </Box>
          <Box>
            <InputLabel sx={{ mb: 1, ml: 0.5 }}>Contact number of student:</InputLabel>
            <TextField type="number" required fullWidth sx={{ mb: 2 }} name="contact" placeholder={"Enter the number"} />
          </Box>
          <Box>
            <InputLabel sx={{ mb: 1, ml: 0.5 }}>Select the role for user:</InputLabel>
            <Select
              value={value}
              onChange={(e)=>setValue(e.target.value)}
              input={<OutlinedInput label="role" />}
              fullWidth
            >
                <MenuItem
                  value={'coordinator'}
                >
                  Coordinator
                </MenuItem>
                <MenuItem
                  value={'teacher'}
                >
                  Teacher
                </MenuItem>
                <MenuItem
                  value={'admin'}
                >
                  Admin
                </MenuItem>
            </Select>
          </Box>
          <Box>
            <InputLabel sx={{ mb: 1, ml: 0.5 }}>Profile Picture :</InputLabel>
            <TextField
              type="file"
              required
              fullWidth
              inputProps={{
                accept: "image/*",
              }}
              sx={{ mb: 2 }}
              onChange={(e) => uploadProfilePic(e.target.files)}
            />
          </Box>
          <Box>
            <InputLabel sx={{ mb: 1, ml: 0.5 }}>Cover Picture :</InputLabel>
            <TextField
              type="file"
              required
              fullWidth
              inputProps={{
                accept: "image/*",
              }}
              sx={{ mb: 2 }}
              onChange={(e) => uploadCoverPic(e.target.files)}
            />
          </Box>
        </Box>
        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" type="submit">
            Add User
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default AddUserDialog;
