import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Box, Button, Dialog, DialogActions, DialogTitle, InputLabel, TextField, Select, OutlinedInput, MenuItem } from "@mui/material";
import { FEES_NEW_ENDPOINT, FILE_UPLOAD_ENDPOINT, STUDENT_GET_ENDPOINT, STUDENT_NEW_ENDPOINT, USER_GET_ENDPOINT } from "../../../constants/endpoints";
import AppContext from "../../../contexts/AppContext";

const AddFeesDialog = ({ open, onClose, fetch }) => {
  const { token } = useContext(AppContext);
  const [picture, setPicture] = useState("");
  const [value, setValue] = useState();
  const [student, setStudent] = useState();
  const [students, setStudents] = useState([]);
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
    const fees_query = {};
    // fetch students
    try {
      axios
        .get(STUDENT_GET_ENDPOINT, { headers: { Authorization: "Bearer " + token }, params: { query: JSON.stringify(fees_query) } })
        .then((res) => {
         if (res.data.data?.length){
          setStudents(res.data.data)
         } 
        })
        .catch((err) => console.log(err));
    } catch (err) {
      console.log(err);
    }
  }, [token]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    if (token) {
      const data = {
        student: student._id,
        coordinator: value._id,
        amount: form["amount"].value,
        last_date: (new Date(form["submissiondate"].value)).toISOString(),
        is_submitted: false,
      };
      axios
        .post(FEES_NEW_ENDPOINT, data, { headers: { Authorization: "Bearer " + token } })
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
    <Dialog open={open} onClose={onClose} maxWidth='md'>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle>Add new fees</DialogTitle>
        <Box sx={{ mx: 3 }}>
          <Box>
            <InputLabel sx={{ mb: 1, ml: 0.5 }}>Select student :</InputLabel>
            <Select
              value={value}
              onChange={(e)=>setStudent(e.target.value)}
              input={<OutlinedInput label="student" />}
              fullWidth
            >
              {students.map((student) => (
                <MenuItem
                  key={student.id}
                  value={student}
                >
                  {student.name}
                </MenuItem>
              ))}
            </Select>
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
            <InputLabel sx={{ mb: 1, ml: 0.5 }}>Amount:</InputLabel>
            <TextField type="number" required fullWidth sx={{ mb: 2 }} name="amount" placeholder={"Enter the amount"} />
          </Box>
          <Box>
            <InputLabel sx={{ mb: 1, ml: 0.5 }}>Last submission date:</InputLabel>
            <TextField type="date" required fullWidth sx={{ mb: 2 }} name="submissiondate" placeholder={"Last submission date"} />
          </Box>
        </Box>
        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" type="submit">
            Add fees
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default AddFeesDialog;

