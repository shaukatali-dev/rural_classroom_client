import { Box, Button, Typography } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { ATTENDANCE_GET_ENDPOINT } from "../../../constants/endpoints.js";
import AppContext from "../../../contexts/AppContext.js";
import axios from "axios";
import Table from "../../../components/table/Table.js";
import AdminHeader from "../../../components/AdminHeader.js";
import AttendanceRowColumns from "./AttendanceRowColumns.js";
import ExpandedAttendanceRow from "./ExpandedAttendanceRow.js";

const Performance = () => {
  const data = React.useRef(null);

  const [attendance, setAttendance] = useState([]);
  const { token } = useContext(AppContext);

  useEffect(() => {
    const query = {};
    // fetch course
    try {
      axios
        .get(ATTENDANCE_GET_ENDPOINT, { headers: { Authorization: "Bearer " + token }, params: { query: JSON.stringify(query) } })
        .then((res) => {
         if (res.data.data?.length){
          data.current = res.data.data;
          setAttendance(res.data.data)
         } 
        })
        .catch((err) => console.log(err));
    } catch (err) {
      console.log(err);
    }
  }, [token]);

  const searchAction = (value) => {
    setAttendance(() => {
      return (
        data &&
        data.current &&
        data.current.filter((item) => {
          return item.coordinator.name.toLowerCase().includes(value);
        })
      );
    });
  };

  const searchReset = () => {
    if (data.current && data.current.length > 0) {
      setAttendance(data.current);
    }
  };

  return (
    <>
      <AdminHeader
        title="Attendance"
        searchBar
        searchAction={searchAction}
        searchReset={searchReset}
        sx={{
          px: 3,
        }}
      />
      {attendance.length > 0 ? (
         <Table
          items={attendance}
          columns={AttendanceRowColumns()}
          header={true}
          rowStyles={{
            cursor: "pointer",
          }}
          renderChildInExpandedView={({ item, index }) => {
            return (
              <ExpandedAttendanceRow data={item} index={index} />
            );
          }}
        />
      ) : (
        <Box p={8}>
          <Typography variant="h3" align="center" color="textSecondary">
            No attendance yet
          </Typography>
        </Box>
      )}
    </>
  );
};

export default Performance;
