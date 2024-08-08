import { Box, Button, Typography } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import AppContext from "../../../contexts/AppContext.js";
import axios from "axios";
import Table from "../../../components/table/Table.js";
import AdminHeader from "../../../components/AdminHeader.js";
import FeesRowColumns from "./FeesRowColumns.js";
import { FEES_GET_ENDPOINT } from "../../../constants/endpoints.js";
import AddFeesDialog from "./AddFeesDialog.js";

const Fees = () => {
  const data = React.useRef(null);

  const [fees, setFees] = useState();
  const [addFeesDialog,setAddFeesDialog] = useState(false);
  const { token } = useContext(AppContext);

  const fetch = () => {
    const query = {};
    // fetch fees
    try {
      axios
        .get(FEES_GET_ENDPOINT, { headers: { Authorization: "Bearer " + token }, params: { query: JSON.stringify(query) } })
        .then((res) => {
         if (res.data.data?.length){
          data.current = res.data.data;
          setFees(res.data.data)
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
    setFees(() => {
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
      setFees(data.current);
    }
  };
  
  return (
    <>
      <AdminHeader
        title="Fees"
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
        onClick={()=>setAddFeesDialog(true)}
      >
        Add Fees
      </Button>
      {fees && fees.length > 0 ? (
          <Table
          items={fees}
          columns={FeesRowColumns()}
          header={true}
          rowStyles={{
            cursor: "pointer",
          }}
        />
       ) : (
        <Box p={8}>
          <Typography variant="h3" align="center" color="textSecondary">
            No fees yet
          </Typography>
        </Box>
      )}
      <AddFeesDialog
        open={addFeesDialog}
        fetch={fetch}
        onClose={()=>setAddFeesDialog(false)}
      />
    </>
  );
};

export default Fees;
