import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Box, Button, Dialog, DialogActions, DialogTitle, InputLabel, Select, OutlinedInput, MenuItem } from "@mui/material";
import { USER_EDIT_ENDPOINT, USER_NEW_ENDPOINT } from "../../../constants/endpoints";
import AppContext from "../../../contexts/AppContext";

const ChangeRoleDialog = ({ open, onClose, fetch, selectedUser }) => {
  const { token } = useContext(AppContext);
  const [value, setValue] = useState('coordinator');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (token) {
      const query={
        _id: selectedUser._id
      };
      const edits = {
        role: value,
      }
      axios
        .patch(USER_EDIT_ENDPOINT, { query, edits } , { headers: { Authorization: "Bearer " + token } })
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
        <DialogTitle>{`Change the role of ${selectedUser ? selectedUser.name : ""}`} </DialogTitle>
        <Box sx={{ mx: 3, mb: 2, }}>
          <Box>
            <InputLabel sx={{ mb: 1, ml: 0.5 }}>Select co-ordinator :</InputLabel>
            <Select
              value={value}
              onChange={(e)=>setValue(e.target.value)}
              input={<OutlinedInput label="coordinator" />}
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
        </Box>
        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" type="submit">
            Change Role
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default ChangeRoleDialog;
