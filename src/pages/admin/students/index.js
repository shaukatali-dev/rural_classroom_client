import { Box, Button, Typography } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { STUDENT_GET_ENDPOINT } from "../../../constants/endpoints.js";
import AppContext from "../../../contexts/AppContext.js";
import axios from "axios";
import StudentRowColumns from "./StudentRowColumns.js";
import Table from "../../../components/table/Table.js";
import AdminHeader from "../../../components/AdminHeader.js";
import AddStudentDialog from "./AddStudentDialog.js";

const Users = () => {
  const data = React.useRef(null);

  const [students, setStudents] = useState([]);
  const [addStudentDialog,setAddStudentDialog] = useState(false);
  const { token } = useContext(AppContext);

  const fetch = () => {
    const query = {};
    // fetch course
    try {
      axios
        .get(STUDENT_GET_ENDPOINT, { headers: { Authorization: "Bearer " + token }, params: { query: JSON.stringify(query) } })
        .then((res) => {
         if (res.data.data?.length){
          data.current = res.data.data;
          setStudents(res.data.data)
         } 
        })
        .catch((err) => console.log(err));
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetch();
  }, [token]);

  const searchAction = (value) => {
    setStudents(() => {
      return (
        data &&
        data.current &&
        data.current.filter((item) => {
          return item.name.toLowerCase().includes(value);
        })
      );
    });
  };

  const searchReset = () => {
    if (data.current && data.current.length > 0) {
      setStudents(data.current);
    }
  };
  
  return (
    <>
      <AdminHeader
        title="Students"
        searchBar
        searchAction={searchAction}
        searchReset={searchReset}
        sx={{
          px: 3,
        }}
      />
      <Button
        variant="outlined"
        color="primary"
        sx={{
          ml: 2,
        }}
        onClick={()=>setAddStudentDialog(true)}
      >
        Add Student
      </Button>
      {students.length > 0 ? (
         <Table
          items={students}
          columns={StudentRowColumns()}
          header={true}
          rowStyles={{
            cursor: "pointer",
          }}
        />
      ) : (
        <Box p={8}>
          <Typography variant="h3" align="center" color="textSecondary">
            No students yet
          </Typography>
        </Box>
      )}
      <AddStudentDialog
        open={addStudentDialog}
        fetch={fetch}
        onClose={()=>setAddStudentDialog(false)}
      />
    </>
  );
};

export default Users;
