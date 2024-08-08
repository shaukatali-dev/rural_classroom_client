import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Box, Button, Dialog, DialogActions, DialogTitle, InputLabel, TextField, Select, OutlinedInput, MenuItem } from "@mui/material";
import { FILE_UPLOAD_ENDPOINT, STUDENT_NEW_ENDPOINT, USER_GET_ENDPOINT } from "../../../constants/endpoints";
import AppContext from "../../../contexts/AppContext";

const AddStudentDialog = ({ open, onClose, fetch }) => {
  const { token } = useContext(AppContext);
  const [picture, setPicture] = useState("");
  const [value, setValue] = useState();
  const [coordinators,setCoordinators] = useState([]);

  useEffect(() => {
    const query = {role: "coordinator"};
    // fetch coordinators
    try {
      axios
        .get(USER_GET_ENDPOINT, { headers: { Authorization: "Bearer " + token }, params: { query: JSON.stringify(query) } })
        .then((res) => {
         if (res.data.data?.length){
          setCoordinators(res.data.data)
         } 
        })
        .catch((err) => console.log(err));
    } catch (err) {
      console.log(err);
    }
  }, [token]);

  const uploadPicture = (files) => {
    const formData = new FormData();
    for (const key of Object.keys(files)) {
      formData.append("files", files[key]);
    }
    if (files.length) {
      try {
        axios
          .post(FILE_UPLOAD_ENDPOINT, formData, { headers: { Authorization: "Bearer " + token } })
          .then((res) => {
            setPicture(Object.values(res.data.data)[0]);
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
        roll: value._id+"_"+(form["roll"].value),
        contact: form["contact"].value,
        profilePic: picture,
      };
      axios
        .post(STUDENT_NEW_ENDPOINT, data, { headers: { Authorization: "Bearer " + token } })
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
        <DialogTitle>Add new Students</DialogTitle>
        <Box sx={{ mx: 3 }}>
          <Box>
            <InputLabel sx={{ mb: 1, ml: 0.5 }}>Name of the Student:</InputLabel>
            <TextField required fullWidth sx={{ mb: 2 }} name="name" placeholder={"Enter you name"} />
          </Box>
          <Box>
            <InputLabel sx={{ mb: 1, ml: 0.5 }}>Select co-ordinator :</InputLabel>
            <Select
              value={value}
              onChange={(e)=>setValue(e.target.value)}
              input={<OutlinedInput label="coordinator" />}
              fullWidth
            >
              {coordinators.map((coordinator) => (
                <MenuItem
                  key={coordinator.id}
                  value={coordinator}
                >
                  {coordinator.name}
                </MenuItem>
              ))}
            </Select>
          </Box>
          <Box>
            <InputLabel sx={{ mb: 1, ml: 0.5 }}>Roll number of the Student:</InputLabel>
            <TextField type="number" required fullWidth sx={{ mb: 2 }} name="roll" placeholder={"Enter the roll number"} />
          </Box>
          <Box>
            <InputLabel sx={{ mb: 1, ml: 0.5 }}>Contact number of student:</InputLabel>
            <TextField type="number" required fullWidth sx={{ mb: 2 }} name="contact" placeholder={"Enter you number"} />
          </Box>
          <Box>
            <InputLabel sx={{ mb: 1, ml: 0.5 }}>Picture :</InputLabel>
            <TextField
              type="file"
              required
              fullWidth
              inputProps={{
                accept: "image/*",
              }}
              sx={{ mb: 2 }}
              onChange={(e) => uploadPicture(e.target.files)}
            />
          </Box>
        </Box>
        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" type="submit">
            Add Student
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default AddStudentDialog;