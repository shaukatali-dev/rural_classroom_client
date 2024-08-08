import { Box, Typography, Button } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { USER_GET_ENDPOINT } from "../../../constants/endpoints.js";
import AppContext from "../../../contexts/AppContext.js";
import axios from "axios";
import Table from "../../../components/table/Table.js";
import AdminHeader from "../../../components/AdminHeader.js";
import UsersRowColumns from "./UsersRowColumns.js";
import ChangeRoleDialog from "./ChangeRoleDialog.js";
import AddUserDialog from "./AddUserDialog.js";

const Users = () => {
  const data = React.useRef(null);

  const [users, setUsers] = useState([]);
  const [changeRoleDialog,setChangeRoleDialog] = useState(false);
  const [addUserDialog,setAddUserDialog] = useState(false);
  const [selectedUser,setSelectedUser] = useState();
  const { token } = useContext(AppContext);

  const fetch = () => {
    const query = {};
    // fetch course
    try {
      axios
        .get(USER_GET_ENDPOINT, { headers: { Authorization: "Bearer " + token }, params: { query: JSON.stringify(query) } })
        .then((res) => {
         if (res.data.data?.length){
          data.current = res.data.data;
          setUsers(res.data.data)
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
    setUsers(() => {
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
      setUsers(data.current);
    }
  };
  
  return (
    <>
      <AdminHeader
        title="Users"
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
        onClick={()=>setAddUserDialog(true)}
      >
        Add User
      </Button>
      {users.length > 0 ? (
         <Table
          items={users}
          columns={UsersRowColumns({setChangeRoleDialog,setSelectedUser})}
          header={true}
          rowStyles={{
            cursor: "pointer",
          }}
        />
      ) : (
        <Box p={8}>
          <Typography variant="h3" align="center" color="textSecondary">
            No users yet
          </Typography>
        </Box>
      )}
      <ChangeRoleDialog
        open={changeRoleDialog}
        onClose={()=>setChangeRoleDialog(false)}
        selectedUser={selectedUser}
        fetch={fetch}
      />
      <AddUserDialog
        open={addUserDialog}
        fetch={fetch}
        onClose={()=>setAddUserDialog(false)}
      />
    </>
  );
};

export default Users;
