import { Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
// / Table component to display lecture-wise attendance
export const LectureAttendanceTable = ({ attendanceTable, lectureHeaders }) => {
  if (!attendanceTable.length) {
    return <Typography>No attendance data available.</Typography>;
  }
  
  // Adjust the colors to be a bit duller
  const getCellColor = (status) => {
    if (status === "P") {
      return "#c8e6c9";  // Light green for Present (duller)
    } else if (status === "A") {
      return "#ffcdd2";  // Light red for Absent (duller)
    }
    return "inherit";   // Default color if no matching status
  };

  return (
    <Table sx={{ borderCollapse: 'separate', borderSpacing: '8px' }}> {/* Add borderSpacing for gaps */}
      <TableHead>
        <TableRow>
          <TableCell sx={{ paddingRight: '16px' }}>Roll Number</TableCell> {/* Adjust padding for gap */}
          {/* <TableCell>Student Name</TableCell> */}
          {/* Render lecture names dynamically */}
          {lectureHeaders.map((lecture, index) => (
            <TableCell key={index} sx={{ paddingRight: '16px' }}>{lecture}</TableCell> 
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {attendanceTable.map((student, index) => (
          <TableRow key={index}>
            <TableCell sx={{ paddingRight: '16px' }}>{student.studentId}</TableCell>
            {/* <TableCell>{student.studentName}</TableCell> */}
            {/* Render "Present" or "Absent" for each lecture with colored cells */}
            {lectureHeaders.map((lecture, idx) => (
              <TableCell 
                key={idx} 
                sx={{ bgcolor: getCellColor(student[lecture]), color: 'black', paddingRight: '16px', padding: '8px' }}  // Adjust background, text color and gap
              >
                {student[lecture]}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};