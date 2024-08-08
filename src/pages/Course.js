import React, { useState, useEffect, useContext, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Helmet } from "react-helmet";
import { io } from "socket.io-client";
import Draggable from "react-draggable";
import Webcam from "react-webcam";
import YouTube from "react-youtube";
// contexts
import AppContext from "../contexts/AppContext";
// components
import ChatBox from "../components/ChatBox";
import Chart from "../components/Chart";
// constants
import { COMPANY } from "../constants/vars";
import { BASE, COURSE_GET_ENDPOINT, LECTURE_GET_ENDPOINT, LECTURE_NEW_ENDPOINT, FILE_UPLOAD_ENDPOINT, ATTENDANCE_NEW_ENDPOINT, MATERIAL_GET_ENDPOINT, MATERIAL_NEW_ENDPOINT, MESSAGE_NEW_ENDPOINT, MESSAGE_GET_ENDPOINT, RESPONSE_NEWS_ENDPOINT, TEST_GET_ENDPOINT, QUESTION_GET_ENDPOINT, DOUBT_GET_ENDPOINT, DOUBT_NEW_ENDPOINT } from "../constants/endpoints";
import { UPLOAD_URL } from "../constants/urls";
//utils
import { truncate } from "../utils";
// apis
import { getDoubtsFromImage, getAttendanceFromImage, getResponsesFromImage, getFilteredMessages } from "../apis/multimedia";
// mui
import { Box, Container, Grid, Paper, Button, Typography, List, ListItemText, Stack, Dialog, DialogContent, DialogTitle, Badge, IconButton, TextField, ListItemButton, ListItemAvatar, Avatar, Divider, Tooltip, CircularProgress, Drawer, Autocomplete } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { VideoCall, Close, Camera, Add, FileCopy, FilterAlt, FilterAltOff, Fullscreen, Checklist, PanTool, QuestionAnswer } from "@mui/icons-material";
// vars
const socket = io(BASE);

function PaperComponent(props) {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}

const Course = () => {
  const youtubeRef = useRef(null);
  const myStreamRef = useRef(null);
  const peerStreamRef = useRef(null);
  const { token, user } = useContext(AppContext);
  const { courseId } = useParams();
  const [lectureOpen, setLectureOpen] = useState(false);
  const [doubtsOpen, setDoubtsOpen] = useState(false);
  const [responsesOpen, setResponsesOpen] = useState(false);
  const [materialsOpen, setMaterialsOpen] = useState(false);
  const [test, setTest] = useState(null);
  const [testQuestion, setTestQuestion] = useState(null);
  const [testQuestions, setTestQuestions] = useState([]);
  const [course, setCourse] = useState(null);
  const [lecture, setLecture] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMessagesFiltered, setIsMessagesFiltered] = useState(false);
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [doubts, setDoubts] = useState(0);
  const [responses, setResponses] = useState([]);
  const [classStrength, setClassStrength] = useState(0);
  const [chartData, setChartData] = useState([{ doubts: 0, time: 0.0 }]);
  const [capturedImage, setCapturedImage] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [materialFiles, setMaterialsFiles] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [viewMode, setViewMode] = useState(false);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setChartData((prev) => [...prev, { doubts: 0, time: new Date().toLocaleTimeString() }]);
  //   }, 2000);
  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, []);

  useEffect(() => {
    if (courseId) {
      try {
        const query = { _id: courseId };
        axios
          .get(COURSE_GET_ENDPOINT, { headers: { Authorization: `Bearer ${token}` }, params: { query: JSON.stringify(query) } })
          .then((res) => {
            if (res.data.data.length) setCourse(res.data.data[0]);
            else setCourse(null);
          })
          .catch((err) => {
            console.log(err);
            setCourse(null);
          });
      } catch (err) {
        console.log(err);
        setCourse(null);
      }
    }
  }, [courseId]);

  useEffect(() => {
    (async () => {
      if (isMessagesFiltered) {
        setIsLoading(true);
        const filteredMessages = await getFilteredMessages(messages);
        setIsLoading(false);
        setFilteredMessages(filteredMessages.map((message) => ({ text: message, date: new Date().toISOString() })));
      } else {
        setFilteredMessages(messages);
      }
    })();
  }, [messages, isMessagesFiltered]);

  useEffect(() => {
    if (lecture?._id) {
      // get messages
      try {
        const query = { lecture: lecture._id };
        axios
          .get(MESSAGE_GET_ENDPOINT, { headers: { Authorization: `Bearer ${token}` }, params: { query: JSON.stringify(query) } })
          .then((res) => {
            setMessages(res.data.data);
            setFilteredMessages(res.data.data);
          })
          .catch((err) => {
            console.log(err);
            setMessages([]);
            setFilteredMessages([]);
          });
      } catch (err) {
        console.log(err);
        setMessages([]);
        setFilteredMessages([]);
      }
      // get doubts
      try {
        const query = { lecture: lecture._id };
        axios
          .get(DOUBT_GET_ENDPOINT, { headers: { Authorization: `Bearer ${token}` }, params: { query: JSON.stringify(query) } })
          .then((res) => {
            if (res.data.data.length) {
              const processedDoubts = [{ doubts: 0, time: 0 }];
              const doubts = res.data.data.map((doubt) => ({ doubts: Number(doubt.doubts), time: Number(doubt.time).toFixed(1) }));
              doubts.forEach((doubt) => {
                processedDoubts.push(doubt);
                processedDoubts.push({ doubts: 0, time: (Number(doubt.time) + 0.1).toFixed(1) });
              });
              setChartData(processedDoubts);
            } else {
              setChartData([{ doubts: 0, time: 0.0 }]);
            }
          })
          .catch((err) => {
            console.log(err);
            setChartData([{ doubts: 0, time: 0.0 }]);
          });
      } catch (err) {
        console.log(err);
        setChartData([{ doubts: 0, time: 0.0 }]);
      }
      // get test
      try {
        const query = { lecture: lecture._id };
        axios
          .get(TEST_GET_ENDPOINT, { headers: { Authorization: `Bearer ${token}` }, params: { query: JSON.stringify(query) } })
          .then((res) => {
            if (res.data.data.length) {
              setTest(res.data.data[0]);
              // fetch questions
              try {
                const query = { _id: { $in: res.data.data[0].questions } };
                axios
                  .get(QUESTION_GET_ENDPOINT, { headers: { Authorization: `Bearer ${token}` }, params: { query: JSON.stringify(query) } })
                  .then((res) => {
                    if (res.data.data.length) {
                      setTestQuestion(res.data.data[0]);
                      setTestQuestions(res.data.data);
                    } else {
                      setTestQuestion(null);
                      setTestQuestions([]);
                    }
                  })
                  .catch((err) => {
                    console.log(err);
                    setTestQuestion(null);
                    setTestQuestions(null);
                  });
              } catch (err) {
                console.log(err);
                setTestQuestions(null);
              }
            } else setTest(null);
          })
          .catch((err) => {
            console.log(err);
            setTest(null);
          });
      } catch (err) {
        console.log(err);
        setTest(null);
      }
    }
  }, [lecture]);

  useEffect(() => {
    if (course) {
      // fetch lectures
      try {
        const query = { course: course._id };
        axios
          .get(LECTURE_GET_ENDPOINT, { headers: { Authorization: `Bearer ${token}` }, params: { query: JSON.stringify(query) } })
          .then((res) => {
            if (res.data.data.length) {
              setLecture(res.data.data[res.data.data.length - 1]);
              setLectures(res.data.data.reverse());
            } else {
              setLecture(null);
              setLectures([]);
            }
          })
          .catch((err) => {
            console.log(err);
            setLecture(null);
            setLectures([]);
          });
      } catch (err) {
        console.log(err);
        setLectures([]);
      }
      // fetch materials
      try {
        const query = { course: course._id };
        axios
          .get(MATERIAL_GET_ENDPOINT, { headers: { Authorization: `Bearer ${token}` }, params: { query: JSON.stringify(query) } })
          .then((res) => {
            if (res.data.data.length) {
              setMaterials(res.data.data[0].files || []);
            } else {
              setMaterials([]);
            }
          })
          .catch((err) => {
            console.log(err);
            setMaterials([]);
          });
      } catch (err) {
        console.log(err);
        setMaterials([]);
      }
    }
  }, [course]);

  useEffect(() => {
    socket.on("doubts", ({ doubts, time }) => {
      setChartData((prev) => [...prev, { doubts, time: Number(time).toFixed(1) }, {doubts: 0, time: (Number(time) + 0.1).toFixed(1)}]);
    });
    socket.on("message", ({ from, fromName, text, date }) => {
      setMessages((messages) => [...messages, { from, fromName, text, date }]);
      setFilteredMessages((messages) => [...messages, { from, fromName, text, date }]);
    });
    // join room
    socket.emit("join", { room: courseId });
    // reset
    return () => {
      socket.off();
    };
  }, [user]);

  useEffect(() => {
    if (attendance?.length) handleAttendance();
  }, [attendance]);

  useEffect(() => {
    console.log(responses);
    // if (responses?.length) handleResponses();
  }, [responses]);

  const captureImage = () => {
    // const capturedImage = myStreamRef.current.getScreenshot();
    // setCapturedImage(capturedImage);
    setDoubtsOpen(true);
  };

  const handleMessage = (e) => {
    if (e?.preventDefault) {
      e.preventDefault();
      const text = e.target.text.value;
      socket.emit("message", { room: courseId, from: user._id, fromName: user.name, text });
      e.target.reset();
      axios
        .post(MESSAGE_NEW_ENDPOINT, { course: courseId, lecture: lecture?._id, from: user._id, fromName: user.name, text, date: new Date().toISOString() }, { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => {
          console.log("message created");
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (typeof e === "string") {
      socket.emit("message", { room: courseId, from: user._id, fromName: user.name, text: e });
      if (e.toLowerCase() !== "unable to transcribe")
        axios
          .post(MESSAGE_NEW_ENDPOINT, { course: courseId, lecture: lecture?._id, from: user._id, fromName: user.name, text: e, date: new Date().toISOString() }, { headers: { Authorization: `Bearer ${token}` } })
          .then((res) => {
            console.log("message created");
          })
          .catch((err) => {
            console.log(err);
          });
    } else {
      console.log("error in handling message");
    }
  };

  const handleLecture = async (e) => {
    e.preventDefault();
    const edits = {};
    new FormData(e.target).forEach((value, key) => (edits[key] = value)); // FormData to JS object
    edits["course"] = courseId;
    edits["date"] = new Date().toISOString();
    try {
      setIsLoading(true);
      axios
        .post(LECTURE_NEW_ENDPOINT, edits, { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => {
          alert("Your lecture has been uploaded!");
          setLectures((lectures) => [res.data.data, ...lectures]);
          setLectureOpen(false);
          setIsLoading(false);
        })
        .catch((err) => {
          alert("Your lecture has NOT been updated!");
          setLectureOpen(false);
          setIsLoading(false);
        });
    } catch (err) {
      alert("Your lecture has NOT been updated!");
      setLectureOpen(false);
      setIsLoading(false);
    }
  };

  const handleMaterials = async (e) => {
    e.preventDefault();
    const data = {};
    new FormData(e.target).forEach((value, key) => (data[key] = value));
    // upload files
    const formData = new FormData(),
      fileNames = [];
    // change file name for each file before uploading
    materialFiles.forEach((file, index) => {
      const fileName = user.role + "." + user.email + ".material." + data.name + "." + index + "." + file.name.split(".").at(-1);
      fileNames.push(fileName);
      formData.append("files", file, fileName);
    });
    try {
      setIsLoading(true);
      axios
        .post(FILE_UPLOAD_ENDPOINT, formData, { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => {
          const urls = Object.values(res.data.data);
          if (urls.length) {
            const materialData = {};
            materialData["name"] = data["name"];
            materialData["files"] = fileNames;
            materialData["course"] = courseId;
            axios
              .post(MATERIAL_NEW_ENDPOINT, materialData, { headers: { Authorization: `Bearer ${token}` } })
              .then((res) => {
                setMaterials(res.data.data.files);
                setMaterialsOpen(false);
                setIsLoading(false);
              })
              .catch((err) => {
                alert("Your study materials have NOT been uploaded!");
                setMaterialsFiles([]);
                setMaterialsOpen(false);
                setIsLoading(false);
              });
          }
        })
        .catch((err) => {
          alert("Your study materials have NOT been uploaded!");
          setMaterialsFiles([]);
          setMaterialsOpen(false);
          setIsLoading(false);
        });
    } catch (err) {
      alert("Your study materials have NOT been uploaded!");
      setMaterialsFiles([]);
      setMaterialsOpen(false);
      setIsLoading(false);
    }
  };

  const handleDoubts = async (doubts) => {
    if (youtubeRef.current && youtubeRef.current.internalPlayer) {
      const time = await youtubeRef.current.internalPlayer.getCurrentTime();
      socket.emit("doubts", { room: courseId, doubts, time });
      setDoubtsOpen(false);
      setCapturedImage(null);
      alert("Doubts have been raised!");
      // store doubts
      try {
        axios
          .post(DOUBT_NEW_ENDPOINT, { course: courseId, lecture: lecture?._id, doubts, time }, { headers: { Authorization: `Bearer ${token}` } })
          .then((res) => {
            console.log("Doubts created");
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleAttendance = async () => {
    if (lecture?._id && attendance?.length) {
      try {
        axios
          .post(ATTENDANCE_NEW_ENDPOINT, { coordinator: user?._id, lecture: lecture._id, attendance, percentage: (attendance.length / classStrength) * 100 }, { headers: { Authorization: `Bearer ${token}` } })
          .then(() => {
            setAttendance([]);
            setDoubtsOpen(false);
            setCapturedImage(null);
            alert("Attendance has been taken!");
          })
          .catch((err) => {
            setDoubtsOpen(false);
            alert("Attendance has NOT been taken!");
          });
      } catch (err) {
        setDoubtsOpen(false);
        alert("Attendance has NOT been taken!");
        console.log(err);
      }
    }
  };

  const handleResponses = () => {
    if (responses.length && test && testQuestion) {
      try {
        axios.post(RESPONSE_NEWS_ENDPOINT, responses, { headers: { Authorization: `Bearer ${token}` } }).then((res) => {
          if (res.data.data) {
            setResponsesOpen(false);
            setCapturedImage(null);
            setDoubtsOpen(false);
            alert("Your responses have been uploaded!");
          } else {
            alert("Your responses have NOT been uploaded!");
          }
        });
      } catch (err) {
        alert("Your responses have NOT been uploaded!");
      }
    }
  };

  const handleDoubtsCapture = async () => {
    if (doubts) handleDoubts(doubts);
    else {
      setIsLoading(true);
      const capturedImage = myStreamRef.current.getScreenshot();
      const imageBlob = await fetch(capturedImage).then((r) => r.blob());
      const doubts = await getDoubtsFromImage(imageBlob);
      handleDoubts(doubts);
      setIsLoading(false);
    }
  };

  const handleAttendanceCapture = async () => {
    setIsLoading(true);
    const capturedImage = myStreamRef.current.getScreenshot();
    const imageBlob = await fetch(capturedImage).then((r) => r.blob());
    const attendance = await getAttendanceFromImage(imageBlob);
    setAttendance(attendance);
    setIsLoading(false);
  };

  const handleResponsesCapture = async () => {
    if (test && testQuestion) {
      setIsLoading(true);
      const capturedImage = myStreamRef.current.getScreenshot();
      const imageBlob = await fetch(capturedImage).then((r) => r.blob());
      const responses = await getResponsesFromImage(imageBlob);
      const processedResponses = responses.map((response) => ({ test: test?._id, question: testQuestion._id, student: user?._id + "_" + response.roll, response: testQuestion.options.find((q) => q.key === response.response)?.value })).filter((response) => response.response && response.student);
      setResponses(processedResponses);
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="100%">
      <Helmet>
        <title>
          {course?.name || "Course"} | {COMPANY}
        </title>
      </Helmet>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={8}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Stack direction="row" alignItems="center" spacing={1} pb={2}>
                  <Typography color="primary" variant="h6" flex={1} gutterBottom>
                    Live Class
                  </Typography>
                  {user?.role === "teacher" ? (
                    <Button
                      variant="contained"
                      color={"primary"}
                      startIcon={<VideoCall />}
                      onClick={() => {
                        setTimeout(() => setLectureOpen(true), 0);
                      }}
                    >
                      New Lecture
                    </Button>
                  ) : null}
                  {user?.role !== "teacher" ? (
                    <IconButton>
                      <Fullscreen onClick={() => setViewMode(true)} />
                    </IconButton>
                  ) : null}
                </Stack>
                <Stack direction="row" alignItems="center" sx={{ position: "relative" }}>
                  {lecture ? (
                    <YouTube
                      ref={youtubeRef}
                      style={{
                        position: "absolute",
                        zIndex: 1,
                        width: "100%",
                      }}
                      videoId={lecture.youtubeId}
                      opts={{
                        height: "300",
                        width: "100%",
                      }}
                    />
                  ) : null}
                  {user?.role === "teacher" ? <video autoPlay muted ref={myStreamRef} style={{ width: "100%", height: "300px", objectFit: "cover", borderRadius: "5px" }} /> : null}
                  {user?.role !== "teacher" ? <video autoPlay ref={peerStreamRef} style={{ width: "100%", height: "300px", objectFit: "cover", borderRadius: "5px" }} /> : null}
                  {user?.role !== "teacher" ? (
                    <div style={{ position: "fixed", zIndex: 9999, bottom: 16, right: 16, borderRadius: "5px", overflow: "hidden" }}>
                      <div style={{ position: "relative", height: "200px", width: "200px", display: "grid", placeItems: "center" }}>
                        <Webcam ref={myStreamRef} style={{ position: "absolute", top: 0, left: 0, objectFit: "cover" }} height={200} width={200} muted />
                        <IconButton sx={{ position: "absolute", transition: "all 0.2s", backgroundColor: "rgba(0, 0, 0, 0.5) !important", "&:hover": { transform: "scale(1.1)" } }} onClick={captureImage}>
                          <Camera sx={{ color: "white" }} />
                        </IconButton>
                      </div>
                    </div>
                  ) : null}
                </Stack>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={user?.role === "teacher" ? 6 : 12}>
              <Paper sx={{ p: 2 }}>
                <Stack direction="row" alignItems={"center"} justifyContent={"space-between"} spaacing={2} pb={2}>
                  <Typography color="primary" variant="h6" flex={1} gutterBottom>
                    Discussion
                  </Typography>
                  {user?.role === "teacher" ? (
                    isLoading ? (
                      <CircularProgress size={24} />
                    ) : (
                      <Tooltip title={isMessagesFiltered ? "Show all" : "Show less"}>
                        <IconButton onClick={() => setIsMessagesFiltered(!isMessagesFiltered)}>{isMessagesFiltered ? <FilterAlt /> : <FilterAltOff />}</IconButton>
                      </Tooltip>
                    )
                  ) : null}
                </Stack>
                <ChatBox messages={filteredMessages} handleMessage={handleMessage} />
              </Paper>
            </Grid>
            {user?.role === "teacher" ? (
              <Grid item xs={12} sm={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography color="primary" variant="h6" flex={1} gutterBottom>
                    Live Doubts
                  </Typography>
                  <div style={{ width: "100%", height: "300px" }}>
                    <Chart data={chartData} />
                  </div>
                </Paper>
              </Grid>
            ) : null}
          </Grid>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Stack direction="row" justifyContent={"space-between"} alignItems="center" spacing={1}>
                  <Typography color="primary" variant="h6" gutterBottom>
                    Lectures
                  </Typography>
                </Stack>
                {lectures.length ? (
                  <List sx={{ width: "100%" }}>
                    {lectures.map((lecture) => (
                      <>
                        <ListItemButton
                          alignItems="flex-start"
                          onClick={() => {
                            setLecture(lecture);
                          }}
                        >
                          <ListItemAvatar>
                            <Avatar>
                              <VideoCall />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText primary={truncate(lecture.name, 40)} secondary={truncate(lecture.description, 80)} />
                        </ListItemButton>
                        <Divider />
                      </>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body1" color="text.secondary" align="center" sx={{ py: "50px" }}>
                    No lectures yet!
                  </Typography>
                )}
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Stack direction="row" justifyContent={"space-between"} alignItems="center" spacing={1}>
                  <Typography color="primary" variant="h6" gutterBottom>
                    Study Materials
                  </Typography>
                  {user?.role === "teacher" ? (
                    <Button variant="contained" startIcon={<Add />} onClick={() => setMaterialsOpen(true)}>
                      New
                    </Button>
                  ) : null}
                </Stack>
                <Box sx={{ width: "100%", p: 1, pt: 2 }}>
                  {materials.map((material, index) => (
                    <Badge onClick={() => window.open(UPLOAD_URL + material)} badgeContent={materials.length - index} color="secondary" sx={{ mr: 2, cursor: "pointer" }}>
                      <FileCopy color="error" fontSize="large" />
                    </Badge>
                  ))}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Dialog open={materialsOpen} onClose={() => setMaterialsOpen(false)} PaperComponent={PaperComponent}>
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
          <Typography color="primary" variant="h6" gutterBottom>
            New Study Material
          </Typography>
        </DialogTitle>
        <IconButton
          onClick={() => setMaterialsOpen(false)}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>
        <DialogContent>
          <form onSubmit={handleMaterials}>
            <Grid container p={2} spacing={2}>
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField required name="name" label="Name" fullWidth variant="standard" />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      type="file"
                      label="Files"
                      fullWidth
                      variant="outlined"
                      onChange={(e) => setMaterialsFiles(Array.from(e.target.files))}
                      inputProps={{
                        multiple: true,
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <LoadingButton fullWidth sx={{ mt: 2 }} disabled={isLoading} loading={isLoading} type="submit" variant="contained">
                  Upload
                </LoadingButton>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={lectureOpen} onClose={() => setLectureOpen(false)} PaperComponent={PaperComponent}>
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
          <Typography color="primary" variant="h6">
            New Lecture
          </Typography>
        </DialogTitle>
        <IconButton
          onClick={() => setLectureOpen(false)}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>
        <DialogContent>
          <form onSubmit={handleLecture}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField required name="name" label="Name" fullWidth variant="standard" />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField required name="youtubeId" label="YouTube Video ID" fullWidth variant="standard" />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField required multiline rows={4} name="description" label="Description" fullWidth variant="outlined" />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <LoadingButton fullWidth disabled={isLoading} loading={isLoading} type="submit" variant="contained">
                  Create
                </LoadingButton>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={doubtsOpen} onClose={() => setDoubtsOpen(false)} PaperComponent={PaperComponent}>
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
          <Typography color="primary" variant="h6" gutterBottom>
            How to use the captured image?
          </Typography>
        </DialogTitle>
        <IconButton
          onClick={() => setDoubtsOpen(false)}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  {/* <CardMedia
                    component="img"
                    image={capturedImage}
                    sx={{
                      width: "100%",
                      height: "auto",
                      objectFit: "cover",
                      borderRadius: "5px",
                    }}
                  /> */}
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Stack spacing={2}>
                    <TextField required value={doubts} onChange={(e) => setDoubts(e.target.value)} label="Doubts" fullWidth variant="outlined" />
                    <LoadingButton fullWidth disabled={isLoading} loading={isLoading} variant="contained" onClick={handleDoubtsCapture}>
                      Doubts
                    </LoadingButton>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Stack spacing={2}>
                    <TextField required value={classStrength} onChange={(e) => setClassStrength(e.target.value)} label="Class Strength" fullWidth variant="outlined" />
                    <LoadingButton fullWidth disabled={isLoading || !classStrength} loading={isLoading} color="success" variant="contained" onClick={handleAttendanceCapture}>
                      Attendance
                    </LoadingButton>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Stack spacing={2}>
                    <Autocomplete fullWidth value={testQuestion} onChange={(e, value) => setTestQuestion(value)} options={testQuestions} getOptionLabel={(option) => option.question} renderInput={(params) => <TextField {...params} required label="Question" variant="outlined" />} />
                    <LoadingButton fullWidth disabled={isLoading || !testQuestion} loading={isLoading} color="success" variant="contained" onClick={handleResponsesCapture}>
                      Responses
                    </LoadingButton>
                  </Stack>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={6}></Grid>
          </Grid>
        </DialogContent>
      </Dialog>
      <Drawer anchor={"bottom"} open={viewMode && user?.role !== "teacher"} onClose={() => setViewMode(false)} onOpen={() => setViewMode(true)} sx={{ zIndex: 99999 }}>
        <Stack sx={{ width: "100%", height: "100vh" }}>
          <Box
            sx={{
              flex: 1,
              position: "relative",
              width: "100%",
            }}
          >
            {lecture ? (
              <YouTube
                ref={youtubeRef}
                style={{
                  position: "absolute",
                  zIndex: 1,
                  width: "100%",
                  height: "100%",
                }}
                videoId={lecture.youtubeId}
                opts={{
                  width: "100%",
                  height: "100%",
                }}
              />
            ) : null}
          </Box>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box sx={{ position: "relative", flex: 1 }}>
              <ChatBox sx={{ position: "absolute", top: "-328px", zIndex: 1 }} overlay messages={filteredMessages} handleMessage={handleMessage} />
            </Box>
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1} p={1} sx={{ flex: { xs: 0, md: 1 } }}>
              <Stack direction="row" spacing={1} flex={1}>
                <Stack direction="row">
                  <TextField required value={classStrength} onChange={(e) => setClassStrength(e.target.value)} label="Class Strength" variant="standard" />
                  <Tooltip title="Attendance">
                    <IconButton disabled={isLoading || !classStrength}>
                      <Checklist onClick={handleAttendanceCapture} />
                    </IconButton>
                  </Tooltip>
                </Stack>
                <Stack direction="row">
                  <TextField required value={doubts} onChange={(e) => setDoubts(e.target.value)} label="Doubts" variant="standard" />
                  <Tooltip title="Doubts">
                    <IconButton disables={isLoading}>
                      <PanTool onClick={handleDoubtsCapture} />
                    </IconButton>
                  </Tooltip>
                </Stack>
                <Stack direction="row" flex={1}>
                  <Autocomplete fullWidth value={testQuestion} onChange={(e, value) => setTestQuestion(value)} options={testQuestions} getOptionLabel={(option) => option.question} renderInput={(params) => <TextField {...params} required label="Question" variant="standard" />} />
                  <Tooltip title="Responses">
                    <IconButton disabled={isLoading || !testQuestion}>
                      <QuestionAnswer onClick={handleResponsesCapture} />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Stack>
              <Tooltip title="Close">
                <IconButton>
                  <Close onClick={() => setViewMode(false)} />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>
        </Stack>
      </Drawer>
    </Container>
  );
};

export default Course;
