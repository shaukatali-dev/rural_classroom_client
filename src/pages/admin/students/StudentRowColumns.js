import { Avatar, Box, Typography } from "@mui/material";
import { formattedDate } from "../../../utils";

const StudentRowColumns = () => {
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
      label: "Roll number",
      width: 2,
      value: (x) => {
        return (
          <Typography >
            {x.roll.split('_')[1]}
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
  ].filter(Boolean);
};

export default StudentRowColumns;
