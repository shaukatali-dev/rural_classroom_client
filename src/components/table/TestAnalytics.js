import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";

const TestAnalytics = ({ questionData, studentScores }) => {
  // Sort students by score in descending order
  const sortedScores = [...studentScores].sort((a, b) => b.score - a.score);
  const top5Scorers = sortedScores.slice(0, 5);

  return (
    <div>
      {/* Question Analytics Table */}

      <Typography color="primary" variant="h6" flex={1} gutterBottom>
        Question Analytics
      </Typography>
      <TableContainer component={Paper} style={{ marginBottom: 20 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Question </TableCell>
              <TableCell>Correct Answer</TableCell>
              <TableCell>Most Common Answer</TableCell>
              <TableCell>% Correct</TableCell>
              {/* Render dynamic answer options based on the first question's distribution */}
              {/* {Object.keys(questionData[0]?.distribution || {}).map(
                (option, index) => (
                  <TableCell key={index}>{option}</TableCell>
                )
              )} */}
              <TableCell>A</TableCell>
              <TableCell>B</TableCell>
              <TableCell>C</TableCell>
              <TableCell>D</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {questionData.map((question, index) => (
              <TableRow key={index}>
                <TableCell>{question.number}</TableCell>
                <TableCell>{question.correctAnswer}</TableCell>
                <TableCell>{question.mostCommonAnswer}</TableCell>
                <TableCell>{question.percentageCorrect}</TableCell>
                {/* Display distribution counts dynamically */}
                {Object.keys(question.distribution).map((option, i) => (
                  <TableCell key={i}>{question.distribution[option]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Student Scores Table */}

      <Typography color="primary" variant="h6" flex={1} gutterBottom>
        Student Scores
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student ID</TableCell>
              <TableCell>Score</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedScores.map((student, index) => (
              <TableRow
                key={student.id}
                style={{ fontWeight: index < 5 ? "bold" : "normal" }}
              >
                <TableCell>{student.id}</TableCell>
                <TableCell>{student.score}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography color="primary" variant="h6" flex={1} gutterBottom>
        Top 5 Scorers
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Rank</TableCell>
              <TableCell>Student ID</TableCell>
              <TableCell>Score</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {top5Scorers.map((student, index) => (
              <TableRow key={student.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{student.id}</TableCell>
                <TableCell>{student.score}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default TestAnalytics;
