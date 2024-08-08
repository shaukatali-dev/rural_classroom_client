import { Avatar, Box, Typography } from "@mui/material";

const PerformanceRowColumns = () => {
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
              src={x.student.profilePic}
            />
            <Typography>
              {x.student.name}
            </Typography>
          </Box>
        );
      },
    },
    {
      label: "Teacher name",
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
              src={x.course.teacher.profilePic}
            />
            <Typography>
              {x.course.teacher.name}
            </Typography>
          </Box>
        );
      },
    },
    {
      label: "Course name",
      width: 2,
      value: (x) => {
        return (
          <Typography >
            {x.course.name}
          </Typography>
        );
      },
    },
    {
      label: "Total tests",
      width: 2,
      value: (x) => {
        return (
          <Typography>
            {x.tests.length}
          </Typography>
        );
      },
    },
  ].filter(Boolean);
};

export default PerformanceRowColumns;
