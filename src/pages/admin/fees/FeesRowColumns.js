import { Avatar, Box, Typography } from "@mui/material";
import { formattedDate } from "../../../utils";

const FeesRowColumns = () => {
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
              {x.student.name}
            </Typography>
          </Box>
        );
      },
    },
    {
      label: "Coordinator name",
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
              {x.coordinator.name}
            </Typography>
          </Box>
        );
      },
    },
    {
      label: "Amount",
      width: 2,
      value: (x) => {
        return (
          <Typography >
            {`₹${x.amount}`}
          </Typography>
        );
      },
    },
    {
      label: "Is paid",
      width: 2,
      value: (x) => {
        return (
          <Typography >
            {x.is_submitted ? "Yes" : "No"}
          </Typography>
        );
      },
    },
    {
      label: "Last Submission date",
      width: 2,
      value: (x) => {
        return <Typography>{formattedDate(new Date(x.last_date))}</Typography>;
      },
    },
    {
      label: "Created on",
      width: 2,
      value: (x) => {
        return <Typography>{formattedDate(new Date(x.createdAt))}</Typography>;
      },
    },
  ].filter(Boolean);
};

export default FeesRowColumns;
