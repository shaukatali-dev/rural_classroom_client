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
import { ANALYTICS_GET_ENDPOINT, ANALYTICS_MAPPINGS_ENDPOINT } from "../constants/endpoints";
// contexts
import AppContext from "../contexts/AppContext";
// mui
import { Container, Grid, Paper, TextField, Typography, Autocomplete } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { Insights } from "@mui/icons-material";

const Analytics = () => {
  const { token } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(false);
  const [charts, setCharts] = useState([]);
  const [coordinator, setCoordinator] = useState({ label: "No coordinators found", id: "0" });
  const [course, setCourse] = useState({ label: "No courses found", id: "0" });
  const [lecture, setLecture] = useState({ label: "No lectures found", id: "0" });
  const [test, setTest] = useState({ label: "No tests found", id: "0" });
  const [coordinatorMapping, setCoordinatorMapping] = useState({});
  const [lectureMapping, setLectureMapping] = useState({});
  const [courseLectureMapping, setCourseLectureMapping] = useState({});
  const [courseTestMapping, setCourseTestMapping] = useState({});
  // analytics data
  const [lectureWiseAttendance, setLectureWiseAttendance] = useState([]);

  useEffect(() => {
    if (course) {
      if (courseLectureMapping[course.id]?.data?.length) setLecture({ label: courseLectureMapping[course.id].data[0]?.name, id: courseLectureMapping[course.id].data[0]?._id });
      else
        setLecture({
          label: "No lectures found",
          id: "0",
        });
      if (courseTestMapping[course.id]?.data?.length) setTest({ label: courseTestMapping[course.id].data[0]?.name, id: courseTestMapping[course.id].data[0]?._id });
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
        .get(ANALYTICS_MAPPINGS_ENDPOINT, { headers: { Authorization: `Bearer ${token}` } })
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
            setCoordinator({ label: coordinatorMapping[Object.keys(coordinatorMapping)[0]], id: Object.keys(coordinatorMapping)[0] });
            setCourse({ label: courseLectureMapping[Object.keys(courseLectureMapping)[0]].course.name, id: courseLectureMapping[Object.keys(courseLectureMapping)[0]].course._id });
            setLecture({ label: courseLectureMapping[Object.keys(courseLectureMapping)[0]].data[0].name, id: courseLectureMapping[Object.keys(courseLectureMapping)[0]].data[0]._id });
            setTest({ label: courseTestMapping[Object.keys(courseTestMapping)[0]].data[0].name, id: courseTestMapping[Object.keys(courseTestMapping)[0]].data[0]._id });
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
      setCharts(charts.filter((chart) => chart.title !== "Lecture-wise Attendance"));
    } else {
      const data = [];
      Object.keys(lectureWiseAttendance).forEach((lecture) => {
        data.push({ lecture: lectureMapping[lecture] });
        lectureWiseAttendance[lecture].forEach((attendance) => {
          data[data.length - 1] = { ...data[data.length - 1], [coordinatorMapping[attendance.coordinator]]: attendance.percentage };
        });
      });
      const chartData = {
        x: "lecture",
        title: "Lecture-wise Attendance",
        data,
        delay: 1000,
        component: LineChart,
        height: "90%",
      };
      setCharts((charts) =>
        charts.length
          ? charts.map((chart) => {
              if (chart.title === "Lecture-wise Attendance") return chartData;
              else return chart;
            })
          : [chartData]
      );
    }
  }, [lectureWiseAttendance, lectureMapping, coordinatorMapping]);

  const handleAnalytics = () => {
    setIsLoading(true);
    try {
      axios
        .post(ANALYTICS_GET_ENDPOINT, { course: course?.id, lecture: lecture?.id, test: test?.id, coordinator: coordinator?.id }, { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => {
          console.log(res.data.data.lectureWiseAttendance);
          setLectureWiseAttendance(res.data.data.lectureWiseAttendance);
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
        });
    } catch (err) {
      console.log(err);
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
                <Autocomplete value={coordinator} onChange={(e, value) => setCoordinator(value)} options={Object.keys(coordinatorMapping).map((coordinatorId) => ({ id: coordinatorId, label: coordinatorMapping[coordinatorId] }))} sx={{ width: "100%" }} renderInput={(params) => <TextField {...params} label="Coordinator" />} />
              </Grid>
              <Grid item xs={12}>
                <Autocomplete value={course} onChange={(e, value) => setCourse(value)} options={Object.keys(courseLectureMapping).map((courseId) => ({ id: courseLectureMapping[courseId].course._id, label: courseLectureMapping[courseId].course.name }))} sx={{ width: "100%" }} renderInput={(params) => <TextField {...params} label="Course" />} />
              </Grid>
              <Grid item xs={12}>
                <Autocomplete value={lecture} onChange={(e, value) => setLecture(value)} options={courseLectureMapping[course.id]?.data.map((lecture) => ({ label: lecture.name, id: lecture._id })) || []} sx={{ width: "100%" }} renderInput={(params) => <TextField {...params} label="Lecture" />} />
              </Grid>
              <Grid item xs={12}>
                <Autocomplete value={test} onChange={(e, value) => setTest(value)} options={courseTestMapping[course.id]?.data.map((test) => ({ label: test.name, id: test._id })) || []} sx={{ width: "100%" }} renderInput={(params) => <TextField {...params} label="Test" />} />
              </Grid>
              <Grid item xs={12}>
                <LoadingButton isLoading={isLoading} startIcon={<Insights />} onClick={handleAnalytics} variant="contained" color="primary" fullWidth>
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
      </Grid>
    </Container>
  );
};

export default Analytics;
