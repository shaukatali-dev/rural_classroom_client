import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

// Table component to display lecture-wise attendance
export const LectureAttendanceTable = ({ formattedAttendanceArray }) => {
  if (!formattedAttendanceArray.length) {
    return <Typography>No attendance data available.</Typography>;
  }

  // Extract unique roll numbers and lecture headers
  const lectureHeaders = formattedAttendanceArray.map(
    (lecture) => lecture.lecture
  );
  const uniqueRollNumbers = Array.from(
    new Set(formattedAttendanceArray.flatMap((lecture) => lecture.attendance))
  ).sort((a, b) => parseInt(a) - parseInt(b));

  // Build attendance table with student ID and lecture attendance status
  const attendanceTable = uniqueRollNumbers.map((rollNumber) => {
    const attendanceStatus = formattedAttendanceArray.map((lecture) =>
      lecture.attendance.includes(rollNumber) ? "P" : "A"
    );
    return { studentId: rollNumber, attendanceStatus };
  });

  // Adjust cell colors for attendance status
  const getCellColor = (status) => {
    if (status === "P") return "#c8e6c9"; // Light green for Present
    if (status === "A") return "#ffcdd2"; // Light red for Absent
    return "inherit";
  };

  return (
    <Table sx={{ borderCollapse: "separate", borderSpacing: "8px" }}>
      <TableHead>
        <TableRow>
          <TableCell sx={{ paddingRight: "16px" }}>Roll Number</TableCell>
          {lectureHeaders.map((lecture, index) => (
            <TableCell key={index} sx={{ paddingRight: "16px" }}>
              {lecture}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {attendanceTable.map((student, index) => (
          <TableRow key={index}>
            <TableCell sx={{ paddingRight: "16px" }}>
              {student.studentId}
            </TableCell>
            {student.attendanceStatus.map((status, idx) => (
              <TableCell
                key={idx}
                sx={{
                  bgcolor: getCellColor(status),
                  color: "black",
                  paddingRight: "16px",
                  padding: "8px",
                }}
              >
                {status}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
