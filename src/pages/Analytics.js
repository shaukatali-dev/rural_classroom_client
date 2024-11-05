import React, { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import { Helmet } from "react-helmet";
// components
import Charts from "../components/Charts";
import LineChart from "../components/charts/LineChart";
// constants
import { COMPANY } from "../constants/vars";
import {
  ANALYTICS_GET_ENDPOINT,
  ANALYTICS_MAPPINGS_ENDPOINT,
  ANALYTICS_COURSES_ENDPOINT,
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
import TestAnalytics from "../components/table/TestAnalytics";

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
  const [courseList, setCourseList] = useState([]);
  const [lectureList, setLectureList] = useState([]);
  const [testList, setTestList] = useState([]);
  const [coordinatorList, setCoordinatorList] = useState([]);
  const [coordinatorNames, setCoordinatorNames] = useState([]);
  const [formattedAttendanceArray, setFormattedAttendanceArray] = useState([]);
  // analytics data
  const [lectureWiseAttendance, setLectureWiseAttendance] = useState([]);
  const [questionAnalytics, setQuestionAnalytics] = useState([]);
  const [studentScores, setStudentScores] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(ANALYTICS_COURSES_ENDPOINT, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setCourseList(res.data.data);
        setCourse({
          label: res.data.data[0].name,
          id: res.data.data[0].id,
        });
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  }, [token]);

  const fetchMapping = useCallback(() => {
    if (!course || course.id === "0") {
      setLecture({ label: "No lectures found", id: "0" });
      setTest({ label: "No tests found", id: "0" });
      return;
    }

    setIsLoading(true);
    axios
      .post(
        ANALYTICS_MAPPINGS_ENDPOINT,
        { course: course.id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        console.log("res.data.data", res.data);
        setLectureList(res.data.lecture);
        setTestList(res.data.test);
        setCoordinatorList(res.data.coordinator);
        setLecture({
          label: res.data.lecture[0].name,
          id: res.data.lecture[0].id,
        });
        setTest({
          label: res.data.test[0].name,
          id: res.data.test[0].id,
        });
        setCoordinator({
          label: res.data.coordinator[0].name,
          id: res.data.coordinator[0].id,
        });
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  }, [course, token]);

  useEffect(() => {
    fetchMapping();
  }, [fetchMapping]);

  useEffect(() => {
    if (!Object.keys(lectureWiseAttendance)?.length) {
      setCharts((prevCharts) =>
        prevCharts.filter((chart) => chart.title !== "Lecture-wise Attendance")
      );
    } else {
      console.log("lectureWiseAttendance", lectureWiseAttendance);
      const chartData = {
        x: "lecture",
        y: coordinatorNames,
        title: "Lecture-wise Attendance",
        data: lectureWiseAttendance,
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
  }, [lectureWiseAttendance, coordinatorNames]);

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
      console.log("res.data", res.data);
      setLectureWiseAttendance(res.data.data);
      setCoordinatorNames(res.data.coordinatorNames);
      setFormattedAttendanceArray(res.data.formattedAttendanceArray);
      setQuestionAnalytics(res.data.questionAnalytics);
      setStudentScores(res.data.studentScores);
    } catch (err) {
      console.log(err);
      setLectureWiseAttendance([]);
      setCoordinatorNames([]);
      setFormattedAttendanceArray([]);
    } finally {
      setIsLoading(false);
    }
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
                  value={course}
                  onChange={(e, value) => setCourse(value)}
                  options={courseList.map((course) => ({
                    label: course.name,
                    id: course.id,
                  }))}
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
                  options={lectureList.map((lecture) => ({
                    label: lecture.name,
                    id: lecture.id,
                  }))}
                  renderInput={(params) => (
                    <TextField {...params} label="Lecture" />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  value={coordinator}
                  onChange={(e, value) => setCoordinator(value)}
                  options={coordinatorList.map((coordinator) => ({
                    label: coordinator.name,
                    id: coordinator.id,
                  }))}
                  sx={{ width: "100%" }}
                  renderInput={(params) => (
                    <TextField {...params} label="Coordinator" />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Autocomplete
                  value={test}
                  onChange={(e, value) => setTest(value)}
                  options={testList.map((test) => ({
                    label: test.name,
                    id: test.id,
                  }))}
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
            {formattedAttendanceArray.length > 0 &&
              formattedAttendanceArray.map((attendance) => (
                <div key={attendance.coordinator}>
                  <Typography key={attendance.coordinator}>
                    {attendance.coordinator}
                  </Typography>
                  <LectureAttendanceTable
                    formattedAttendanceArray={attendance.attendances}
                  />
                </div>
              ))}
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <TestAnalytics
            questionData={questionAnalytics}
            studentScores={studentScores}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Analytics;
