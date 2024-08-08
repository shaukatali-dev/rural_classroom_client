import { Box, Typography } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { PERFORMANCE_GET_ENDPOINT } from "../../../constants/endpoints.js";
import AppContext from "../../../contexts/AppContext.js";
import axios from "axios";
import Table from "../../../components/table/Table.js";
import AdminHeader from "../../../components/AdminHeader.js";
import PerformanceRowColumns from "./PerformanceRowColumns.js";
import ExpandedTestRow from "./ExpandedTestRow.js";

const Performance = () => {
  const data = React.useRef(null);

  const [performance, setPerformance] = useState([]);
  const { token } = useContext(AppContext);

  useEffect(() => {
    const query = {};
    // fetch course
    try {
      axios
        .get(PERFORMANCE_GET_ENDPOINT, { headers: { Authorization: "Bearer " + token }, params: { query: JSON.stringify(query) } })
        .then((res) => {
         if (res.data.data?.length){
          data.current = res.data.data;
          setPerformance(res.data.data)
         } 
        })
        .catch((err) => console.log(err));
    } catch (err) {
      console.log(err);
    }
  }, [token]);

  const searchAction = (value) => {
    setPerformance(() => {
      return (
        data &&
        data.current &&
        data.current.filter((item) => {
          return item.student.name.toLowerCase().includes(value);
        })
      );
    });
  };

  const searchReset = () => {
    if (data.current && data.current.length > 0) {
      setPerformance(data.current);
    }
  };

  return (
    <>
      <AdminHeader
        title="Performance"
        searchBar
        searchAction={searchAction}
        searchReset={searchReset}
        sx={{
          px: 3,
        }}
      />
      {performance.length > 0 ? (
         <Table
          items={performance}
          columns={PerformanceRowColumns()}
          header={true}
          rowStyles={{
            cursor: "pointer",
          }}
          renderChildInExpandedView={({ item, index }) => {
            return (
              <ExpandedTestRow data={item} index={index} />
            );
          }}
        />
      ) : (
        <Box p={8}>
          <Typography variant="h3" align="center" color="textSecondary">
            No performance yet
          </Typography>
        </Box>
      )}
    </>
  );
};

export default Performance;
