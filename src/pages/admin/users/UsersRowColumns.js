import { Avatar, Box, Typography, Button } from "@mui/material";
import { formattedDate } from "../../../utils";

const UsersRowColumns = ({setChangeRoleDialog, setSelectedUser}) => {
  return [
    {
      label: "Name",
      width: 2,
      value: (x) => {
        return (
          <Box
            sx={{
              display: 'flex',
              flexDirection: "row",
              width: "100%",
              alignItems: "center",
              cursor: "pointer",
            }}
          >
            <Avatar
              sx={{ width: 32, height: 32, mr: 1 }}
              src={x.profilePic}
            />
            <Typography>
              {x.name}
            </Typography>
          </Box>
        );
      },
    },
    {
      label: "Email",
      width: 2,
      value: (x) => {
        return (
          <Typography >
            {x.email}
          </Typography>
        );
      },
    },
    {
      label: "Contact",
      width: 2,
      value: (x) => {
        return (
          <Typography>
            {x.contact}
          </Typography>
        );
      },
    },
    {
      label: "Role",
      width: 2,
      value: (x) => {
        return (
          <Typography>
            {x.role}
          </Typography>
        );
      },
    },
    {
      label: "Last Updated",
      width: 2,
      value: (x) => {
        return <Typography>{formattedDate(new Date(x.updatedAt))}</Typography>;
      },
    },
    {
      label: "Date joined",
      width: 2,
      value: (x) => {
        return <Typography>{formattedDate(new Date(x.createdAt))}</Typography>;
      },
    },
    {
      label: "Change Role",
      width: 2,
      value: (x) => {
        return (
          <Button
            variant="contained"
            onClick={()=> {
              setSelectedUser(x);
              setChangeRoleDialog(true);
            }}
          >
            Change Role
          </Button>
        )
      }
    }
  ].filter(Boolean);
};

export default UsersRowColumns;
