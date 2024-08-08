import React, { useState, useContext, useRef } from "react";
import axios from "axios";
import { Helmet } from "react-helmet";
import { Carousel } from "react-responsive-carousel";
// components
import CourseCard from "../components/CourseCard";
import TestCard from "../components/TestCard";
// constants
import { COMPANY } from "../constants/vars";
import { FILE_UPLOAD_ENDPOINT, COURSE_NEW_ENDPOINT, COURSE_EDIT_ENDPOINT, TEST_NEW_ENDPOINT, TEST_EDIT_ENDPOINT } from "../constants/endpoints";
// contexts
import AppContext from "../contexts/AppContext";
// mui
import { Container, Stack, Box, Grid, Paper, Typography, Button, Dialog, AppBar, Toolbar, IconButton, Slide, TextField, CardMedia, Autocomplete } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Add, Close } from "@mui/icons-material";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Home = () => {
  const coursePicRef = useRef(null);
  const testPicRef = useRef(null);
  const { user, token, courses, setCourses, lectures, tests, setTests } = useContext(AppContext);
  const [courseId, setCourseId] = useState(null);
  const [course, setCourse] = useState(null);
  const [testId, setTestId] = useState(null);
  const [coursePic, setCoursePic] = useState(null);
  const [testPic, setTestPic] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCloseCourse = () => setCourseId(null);

  const handleCloseTest = () => setTestId(null);

  const handleCourse = async (e) => {
    e.preventDefault();
    if (courseId) {
      const edits = {},
        formData = new FormData(e.target);
      formData.forEach((value, key) => (edits[key] = value)); // FormData to JS object
      edits["teacher"] = user._id;
      edits["date"] = new Date().toISOString();
      if (coursePic) {
        const picData = new FormData();
        const fileName = user.role + "." + user.email + ".course." + edits.name + "." + coursePic.name.split(".").at(-1);
        edits["coursePic"] = fileName;
        picData.append("files", coursePic, fileName);
        try {
          setIsLoading(true);
          axios
            .post(FILE_UPLOAD_ENDPOINT, picData, { headers: { Authorization: `Bearer ${token}` } })
            .then((res) => {
              setIsLoading(false);
            })
            .catch((err) => {
              alert("Something went wrong! Course Picture couldn't be uploaded.");
              setIsLoading(false);
            });
        } catch (err) {
          alert("Something went wrong! Course Picture couldn't be uploaded.");
          setIsLoading(false);
        }
      }
      try {
        setIsLoading(true);
        (courseId === "new" ? axios.post(COURSE_NEW_ENDPOINT, edits, { headers: { Authorization: `Bearer ${token}` } }) : axios.patch(COURSE_EDIT_ENDPOINT, { query: { _id: courseId }, edits }, { headers: { Authorization: `Bearer ${token}` } }))
          .then((res) => {
            setCourses((courses) => [res.data.data, ...courses]);
            setCourseId(null);
            setIsLoading(false);
          })
          .catch((err) => {
            alert("Your course has NOT been updated!");
            setCourseId(null);
            setIsLoading(false);
          });
      } catch (err) {
        alert("Your course has NOT been updated!");
        setCourseId(null);
        setIsLoading(false);
      }
    }
  };

  const handleTest = async (e) => {
    e.preventDefault();
    if (testId) {
      const edits = {},
        formData = new FormData(e.target);
      formData.forEach((value, key) => (edits[key] = value)); // FormData to JS object
      edits["teacher"] = user._id;
      edits["date"] = new Date().toISOString();
      edits["course"] = courses.find((c) => c.name === edits.course)._id;
      edits["lecture"] = lectures.find((l) => l.name === edits.lecture)._id;
      if (testPic) {
        const picData = new FormData();
        const fileName = user.role + "." + user.email + ".test." + edits.name + "." + testPic.name.split(".").at(-1);
        edits["testPic"] = fileName;
        picData.append("files", testPic, fileName);
        try {
          setIsLoading(true);
          axios
            .post(FILE_UPLOAD_ENDPOINT, picData, { headers: { Authorization: `Bearer ${token}` } })
            .then((res) => {
              setIsLoading(false);
            })
            .catch((err) => {
              alert("Something went wrong! Test Picture couldn't be uploaded.");
              setIsLoading(false);
            });
        } catch (err) {
          alert("Something went wrong! Test Picture couldn't be uploaded.");
          setIsLoading(false);
        }
      }
      try {
        setIsLoading(true);
        (testId === "new" ? axios.post(TEST_NEW_ENDPOINT, edits, { headers: { Authorization: `Bearer ${token}` } }) : axios.patch(TEST_EDIT_ENDPOINT, { query: { _id: testId }, edits }, { headers: { Authorization: `Bearer ${token}` } }))
          .then((res) => {
            setTests((tests) => [res.data.data, ...tests]);
            setTestId(null);
            setIsLoading(false);
          })
          .catch((err) => {
            alert("Your test has NOT been updated!");
            setTestId(null);
            setIsLoading(false);
          });
      } catch (err) {
        alert("Your test has NOT been updated!");
        setTestId(null);
        setIsLoading(false);
      }
    }
  };

  const handleCoursePic = (e) => {
    const image = e.target.files[0];
    if (image.type.startsWith("image/")) {
      setCoursePic(image);
    } else {
      setCoursePic(null);
      alert("Invalid file type! Upload an 'image' file as your course picture.");
    }
  };

  const handleTestPic = (e) => {
    const image = e.target.files[0];
    if (image.type.startsWith("image/")) {
      setTestPic(image);
    } else {
      setTestPic(null);
      alert("Invalid file type! Upload an 'image' file as your test picture.");
    }
  };

  return (
    <Container maxWidth="100%">
      <Helmet>
        <title>Home | {COMPANY}</title>
      </Helmet>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
              <Box>
                <Typography color="primary" variant="h4">
                  Courses
                </Typography>
              </Box>
              {user?.role === "teacher" ? (
                <Button variant="outlined" startIcon={<Add />} onClick={() => setCourseId("new")}>
                  New Course
                </Button>
              ) : null}
            </Stack>
            <Carousel autoPlay infiniteLoop showIndicators={false} showStatus={false} showThumbs={false}>
              {courses && courses.length ? (
                courses
                  .filter((c, i) => i % 4 === 0)
                  .map((course, index) => (
                    <Grid container sx={{ px: { xs: 2, sm: 6 }, py: 2 }} spacing={2}>
                      {courses.slice(index * 4, index * 4 + 4).map((course, idx) => (
                        <Grid item xs={12} sm={6} md={4} lg={3}>
                          <CourseCard key={course._id + index * 4 + idx} course={course} />
                        </Grid>
                      ))}
                    </Grid>
                  ))
              ) : (
                <Typography color="text.secondary" component="p" variant="h6" sx={{ py: 4 }} gutterBottom>
                  No courses here!
                </Typography>
              )}
            </Carousel>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
              <Box>
                <Typography color="primary" variant="h4">
                  Tests
                </Typography>
              </Box>
              {user?.role === "teacher" ? (
                <Button variant="outlined" startIcon={<Add />} onClick={() => setTestId("new")}>
                  New Test
                </Button>
              ) : null}
            </Stack>
            <Carousel autoPlay infiniteLoop showIndicators={false} showStatus={false} showThumbs={false}>
              {tests && tests.length ? (
                tests
                  .filter((c, i) => i % 4 === 0)
                  .map((test, index) => (
                    <Grid container sx={{ px: { xs: 2, sm: 6 }, py: 2 }} spacing={2}>
                      {tests.slice(index * 4, index * 4 + 4).map((test, idx) => (
                        <Grid item xs={12} sm={6} md={4} lg={3}>
                          <TestCard key={test._id + index * 4 + idx} test={test} />
                        </Grid>
                      ))}
                    </Grid>
                  ))
              ) : (
                <Typography color="text.secondary" component="p" variant="h6" sx={{ py: 4 }} gutterBottom>
                  No tests here!
                </Typography>
              )}
            </Carousel>
          </Paper>
        </Grid>
      </Grid>
      <Dialog open={!!courseId} onClose={handleCloseCourse} TransitionComponent={Transition}>
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <Typography sx={{ flex: 1 }} variant="h6" component="div">
              {courseId === "new" ? "New" : "Update"} Course
            </Typography>
            <IconButton edge="start" color="inherit" onClick={handleCloseCourse}>
              <Close />
            </IconButton>
          </Toolbar>
        </AppBar>
        <form onSubmit={handleCourse}>
          <Grid container p={2} spacing={2}>
            <Grid item xs={12}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField required name="name" label="Name" fullWidth variant="standard" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField required multiline rows={4} name="description" label="Description" fullWidth variant="outlined" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField required multiline rows={4} name="syllabus" label="Syllabus" fullWidth variant="outlined" />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Typography gutterBottom>Course Picture</Typography>
              <input onChange={handleCoursePic} accept="image/*" ref={coursePicRef} type="file" hidden />
              <CardMedia
                onClick={() => coursePicRef?.current?.click()}
                component="img"
                sx={{
                  border: "2px dashed lightgray",
                  height: "200px",
                  cursor: "pointer",
                }}
                loading="lazy"
                src={coursePic ? URL.createObjectURL(coursePic) : ""}
                alt=""
              />
              <LoadingButton fullWidth sx={{ mt: 2 }} loading={isLoading} type="submit" variant="contained">
                {courseId === "new" ? "Create" : "Update"}
              </LoadingButton>
            </Grid>
          </Grid>
        </form>
      </Dialog>
      <Dialog open={testId} onClose={handleCloseTest} TransitionComponent={Transition}>
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <Typography sx={{ flex: 1 }} variant="h6" component="div">
              {testId === "new" ? "New" : "Update"} Test
            </Typography>
            <IconButton edge="start" color="inherit" onClick={handleCloseTest}>
              <Close />
            </IconButton>
          </Toolbar>
        </AppBar>
        <form onSubmit={handleTest}>
          <Grid container p={2} spacing={2}>
            <Grid item xs={12}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <TextField required name="name" label="Name" fullWidth variant="standard" />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Autocomplete name="course" onChange={(e, value) => setCourse(value)} options={courses} getOptionLabel={(option) => option.name} renderInput={(params) => <TextField {...params} required name="course" label="Course" variant="standard" />} />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Autocomplete name="lecture" options={lectures.filter((lecture) => lecture.course === course?._id)} getOptionLabel={(option) => option.name} renderInput={(params) => <TextField {...params} required name="lecture" label="Lecture" variant="standard" />} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField required multiline rows={4} name="description" label="Description" fullWidth variant="outlined" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField required multiline rows={4} name="syllabus" label="Syllabus" fullWidth variant="outlined" />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Typography gutterBottom>Test Picture</Typography>
              <input onChange={handleTestPic} accept="image/*" ref={testPicRef} type="file" hidden />
              <CardMedia
                onClick={() => testPicRef?.current?.click()}
                component="img"
                sx={{
                  border: "2px dashed lightgray",
                  height: "200px",
                  cursor: "pointer",
                }}
                loading="lazy"
                src={testPic ? URL.createObjectURL(testPic) : ""}
                alt=""
              />
              <LoadingButton fullWidth sx={{ mt: 2 }} loading={isLoading} type="submit" variant="contained">
                {testId === "new" ? "Create" : "Update"}
              </LoadingButton>
            </Grid>
          </Grid>
        </form>
      </Dialog>
    </Container>
  );
};

export default Home;
