import { Avatar, Box, Typography } from "@mui/material";

const StudentsRowColumns = () => {
  return [
    {
      label: "Student name",
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
      label: "Roll number",
      width: 2,
      value: (x) => {
        return (
          <Typography >
            {x.roll}
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
  ].filter(Boolean);
};

export default StudentsRowColumns;
