import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Helmet } from "react-helmet";
// components
import Charts from "../components/Charts";
import LineChart from "../components/charts/LineChart";
import AreaChart from "../components/charts/AreaChart";
import BarChart from "../components/charts/BarChart";
// constants
import { COMPANY } from "../constants/vars";
import {
  ANALYTICS_GET_ENDPOINT,
  ANALYTICS_MAPPINGS_ENDPOINT,
} from "../constants/endpoints";
// contexts
import AppContext from "../contexts/AppContext";
// mui
import {
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
  Autocomplete,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { Insights } from "@mui/icons-material";
import { LectureAttendanceTable } from "../components/table/LectureAttendanceTable";

const Analytics = () => {
  const { token } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(false);
  const [charts, setCharts] = useState([]);
  const [coordinator, setCoordinator] = useState({
    label: "No coordinators found",
    id: "0",
  });
  const [course, setCourse] = useState({ label: "No courses found", id: "0" });
  const [lecture, setLecture] = useState({
    label: "No lectures found",
    id: "0",
  });
  const [test, setTest] = useState({ label: "No tests found", id: "0" });
  const [coordinatorMapping, setCoordinatorMapping] = useState({});
  const [lectureMapping, setLectureMapping] = useState({});
  const [courseLectureMapping, setCourseLectureMapping] = useState({});
  const [courseTestMapping, setCourseTestMapping] = useState({});
  // analytics data
  const [lectureWiseAttendance, setLectureWiseAttendance] = useState([]);

  const [attendanceTable, setAttendanceTable] = useState([]);
  const [lectureHeaders, setLectureHeaders] = useState([]);

  useEffect(() => {
    if (course) {
      if (courseLectureMapping[course.id]?.data?.length)
        setLecture({
          label: courseLectureMapping[course.id].data[0]?.name,
          id: courseLectureMapping[course.id].data[0]?._id,
        });
      else
        setLecture({
          label: "No lectures found",
          id: "0",
        });
      if (courseTestMapping[course.id]?.data?.length)
        setTest({
          label: courseTestMapping[course.id].data[0]?.name,
          id: courseTestMapping[course.id].data[0]?._id,
        });
      else
        setTest({
          label: "No tests found",
          id: "0",
        });
    }
  }, [course]);

  useEffect(() => {
    setIsLoading(true);
    try {
      axios
        .get(ANALYTICS_MAPPINGS_ENDPOINT, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (Object.keys(res.data.data.courseLectureMapping).length) {
            const lectureMapping = res.data.data.lectureMapping;
            const coordinatorMapping = res.data.data.coordinatorMapping;
            const courseLectureMapping = res.data.data.courseLectureMapping;
            const courseTestMapping = res.data.data.courseTestMapping;
            // set mappings
            setLectureMapping(lectureMapping);
            setCoordinatorMapping(coordinatorMapping);
            setCourseLectureMapping(courseLectureMapping);
            setCourseTestMapping(courseTestMapping);
            // defaults
            setCoordinator({
              label: coordinatorMapping[Object.keys(coordinatorMapping)[0]],
              id: Object.keys(coordinatorMapping)[0],
            });
            setCourse({
              label:
                courseLectureMapping[Object.keys(courseLectureMapping)[0]]
                  .course.name,
              id: courseLectureMapping[Object.keys(courseLectureMapping)[0]]
                .course._id,
            });
            setLecture({
              label:
                courseLectureMapping[Object.keys(courseLectureMapping)[0]]
                  .data[0].name,
              id: courseLectureMapping[Object.keys(courseLectureMapping)[0]]
                .data[0]._id,
            });
            setTest({
              label:
                courseTestMapping[Object.keys(courseTestMapping)[0]].data[0]
                  .name,
              id: courseTestMapping[Object.keys(courseTestMapping)[0]].data[0]
                ._id,
            });
            setIsLoading(false);
          }
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
        });
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!Object.keys(lectureWiseAttendance)?.length) {
      setCharts((prevCharts) =>
        prevCharts.filter((chart) => chart.title !== "Lecture-wise Attendance")
      );
    } else {
      const data = Object.keys(lectureWiseAttendance)
        .map((lecture) => {
          // Initialize attendance data with the lecture name mapped from lectureMapping
          const attendanceData = { lecture: lectureMapping[lecture] };

          // Check if attendance exists and is non-empty for the current lecture
          const lectureAttendance = lectureWiseAttendance[lecture];

          if (lectureAttendance && lectureAttendance.length > 0) {
            // If attendance data exists, populate the attendanceData object
            lectureAttendance.forEach((attendance) => {
              attendanceData[coordinatorMapping[attendance.coordinator]] =
                attendance.percentage;
            });
            return attendanceData; // Return the attendance data for this lecture
          }

          // If no attendance data, return null (we'll filter out nulls later)
          return null;
        })
        .filter((entry) => entry !== null); // Filter out null entries where no attendance data exists

      const lectureWiseAttend = Object.keys(lectureWiseAttendance).reduce(
        (acc, lecture) => {
          // Get attendance for the current lecture
          const lectureAttendance = lectureWiseAttendance[lecture];

          // Check if there is attendance data for the lecture
          if (lectureAttendance && lectureAttendance.length > 0) {
            // Use a Set to ensure uniqueness
            const mergedAttendance = new Set();

            // Flatten deeply nested arrays and add to the Set for uniqueness
            lectureAttendance.forEach((at) => {
              at.attendance.forEach((num) => {
                mergedAttendance.add(num); // Use .add() to ensure uniqueness
              });
            });

            // Convert the Set back to an array and assign to the lecture key in the result object
            acc[lectureMapping[lecture]] = Array.from(mergedAttendance);
          } else {
            // Assign an empty array for lectures with no attendance
            acc[lectureMapping[lecture]] = [];
          }

          return acc;
        },
        {}
      );
      console.log("lectureWiseAttendance", lectureWiseAttendance);
      console.log("lectureWiseAttend", lectureWiseAttend);

      const { attendanceTable, lectureNames } =
        prepareAttendanceTableData(lectureWiseAttend);

      setAttendanceTable(attendanceTable);
      setLectureHeaders(lectureNames);
      // Extract all coordinator names dynamically that are present across all entries
      const coordinatorNames = Object.keys(
        data.reduce((commonKeys, currentLecture) => {
          // Get keys from current lecture excluding 'lecture'
          const currentKeys = Object.keys(currentLecture).filter(
            (key) => key !== "lecture"
          );

          // If it's the first lecture, initialize commonKeys
          if (!commonKeys) return currentKeys;

          // Find common keys between current lecture and existing commonKeys
          return commonKeys.filter((key) => currentKeys.includes(key));
        }, null)
      );

      const chartData = {
        x: "lecture",
        y: coordinatorNames,
        title: "Lecture-wise Attendance",
        data: data,
        delay: 1000,
        component: LineChart,
        height: "90%",
      };

      setCharts((prevCharts) => {
        const existingChartIndex = prevCharts.findIndex(
          (chart) => chart.title === "Lecture-wise Attendance"
        );
        if (existingChartIndex !== -1) {
          prevCharts[existingChartIndex] = chartData;
          return [...prevCharts];
        }
        return [...prevCharts, chartData];
      });
    }
  }, [lectureWiseAttendance, lectureMapping, coordinatorMapping]);

  const handleAnalytics = async () => {
    setIsLoading(true);
    try {
      const res = await axios.post(
        ANALYTICS_GET_ENDPOINT,
        {
          course: course?.id,
          lecture: lecture?.id,
          test: test?.id,
          coordinator: coordinator?.id,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setLectureWiseAttendance(res.data.data.lectureWiseAttendance);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };
  const getAllUniqueStudentIds = (lectureWiseAttend) => {
    const studentSet = new Set();

    // Loop through each lecture and add student IDs to the set
    Object.values(lectureWiseAttend).forEach((studentArray) => {
      studentArray.forEach((studentId) => studentSet.add(Number(studentId))); // Convert IDs to numbers
    });

    // Convert the set to an array
    const studentArray = Array.from(studentSet);

    // Get the highest number in the array
    const highestNumber = Math.max(...studentArray);

    // Return an array from 1 to the highest number, converting each number to a string
    return Array.from({ length: highestNumber }, (_, index) =>
      String(index + 1)
    );
  };
  const prepareAttendanceTableData = (lectureWiseAttend) => {
    // Get all unique student IDs
    const allStudentIds = getAllUniqueStudentIds(lectureWiseAttend);

    // Get all lecture names
    const lectureNames = Object.keys(lectureWiseAttend);

    // Create a data structure for the table
    const attendanceTable = allStudentIds.map((studentId) => {
      const attendanceRecord = { studentId };

      lectureNames.forEach((lecture) => {
        // Check if the student is present in this lecture
        attendanceRecord[lecture] = lectureWiseAttend[lecture].includes(
          studentId
        )
          ? "P"
          : "A";
      });

      return attendanceRecord;
    });

    return { attendanceTable, lectureNames };
  };

  return (
    <Container maxWidth="100%">
      <Helmet>
        <title>Analytics | {COMPANY}</title>
      </Helmet>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} lg={3}>
          <Paper sx={{ p: 2 }}>
            <Typography color="primary" variant="h6" flex={1} gutterBottom>
              Parameters
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Autocomplete
                  value={coordinator}
                  onChange={(e, value) => setCoordinator(value)}
                  options={Object.keys(coordinatorMapping).map(
                    (coordinatorId) => ({
                      id: coordinatorId,
                      label: coordinatorMapping[coordinatorId],
                    })
                  )}
                  sx={{ width: "100%" }}
                  renderInput={(params) => (
                    <TextField {...params} label="Coordinator" />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  value={course}
                  onChange={(e, value) => setCourse(value)}
                  options={Object.keys(courseLectureMapping).map(
                    (courseId) => ({
                      id: courseLectureMapping[courseId].course._id,
                      label: courseLectureMapping[courseId].course.name,
                    })
                  )}
                  sx={{ width: "100%" }}
                  renderInput={(params) => (
                    <TextField {...params} label="Course" />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  value={lecture}
                  onChange={(e, value) => setLecture(value)}
                  options={
                    courseLectureMapping[course?.id]?.data?.length
                      ? courseLectureMapping[course?.id]?.data.map(
                          (lecture) => ({
                            label: lecture.name,
                            id: lecture._id,
                          })
                        )
                      : [{ label: "No lectures found", id: "0" }]
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="Lecture" />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  value={test}
                  onChange={(e, value) => setTest(value)}
                  options={
                    courseTestMapping[course?.id]?.data.map((test) => ({
                      label: test.name,
                      id: test._id,
                    })) || []
                  }
                  sx={{ width: "100%" }}
                  renderInput={(params) => (
                    <TextField {...params} label="Test" />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <LoadingButton
                  isLoading={isLoading}
                  startIcon={<Insights />}
                  onClick={handleAnalytics}
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Get Analytics
                </LoadingButton>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} lg={9}>
          <Paper sx={{ p: 2 }}>
            <Typography color="primary" variant="h6" flex={1} gutterBottom>
              Analytics
            </Typography>
            <Charts charts={charts} />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography color="primary" variant="h6" flex={1} gutterBottom>
              Lecture-wise Attendance (Present/Absent)
            </Typography>
            <LectureAttendanceTable
              attendanceTable={attendanceTable}
              lectureHeaders={lectureHeaders}
            />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Analytics;
