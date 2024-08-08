import { Avatar, Box, Typography } from "@mui/material";
import { formattedDate } from "../../../utils";

const AttendanceRowColumns = () => {
  return [
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
              src={x.coordinator.profilePic}
            />
            <Typography>
              {x.coordinator.name}
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
              src={x.lecture.course.teacher.profilePic}
            />
            <Typography>
              {x.lecture.course.teacher.name}
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
            {x.lecture.course.name}
          </Typography>
        );
      },
    },
    {
      label: "Lecture name",
      width: 2,
      value: (x) => {
        return (
          <Typography>
            {x.lecture.title}
          </Typography>
        );
      },
    },
    {
      label:"Attended on",
      width: 2,
      value: (x) => {
        return (
          <Typography>
            {formattedDate(new Date(x.lecture.createdAt))}
          </Typography>
        )
      }
    }
  ].filter(Boolean);
};

export default AttendanceRowColumns;
