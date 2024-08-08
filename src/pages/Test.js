import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import Webcam from "react-webcam";
import Draggable from "react-draggable";
// constants
import { COMPANY } from "../constants/vars";
import { TEST_GET_ENDPOINT, TEST_EDIT_ENDPOINT, QUESTION_NEW_ENDPOINT, QUESTION_GET_ENDPOINT, QUESTION_EDIT_ENDPOINT, RESPONSE_NEWS_ENDPOINT } from "../constants/endpoints";
// contexts
import AppContext from "../contexts/AppContext";
// utils
import { truncate } from "../utils";
import { getResponsesFromImage } from "../apis/multimedia";
// mui
import { Container, Grid, Paper, TextField, Typography, List, ListItemText, ListItemButton, Stack, Button, Box, IconButton, Dialog, DialogContent, DialogTitle, CardMedia } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Add, Edit, Upload, Camera, Close } from "@mui/icons-material";
// vars
const questionTemplate = {
  question: "",
  options: [
    { key: "A", value: "" },
    { key: "B", value: "" },
    { key: "C", value: "" },
    { key: "D", value: "" },
    { key: "E", value: "" },
    { key: "F", value: "" },
  ],
  answer: "",
};

function PaperComponent(props) {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}

const Test = () => {
  const { testId } = useParams();
  const myStreamRef = useRef(null);
  const { token, user } = useContext(AppContext);
  const [test, setTest] = useState();
  const [question, setQuestion] = useState(questionTemplate);
  const [testQuestion, setTestQuestion] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [capturedImage, setCapturedImage] = useState(null);
  const [responses, setResponses] = useState([]);
  const [responsesOpen, setResponsesOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (testId) {
      try {
        const query = { _id: testId };
        axios
          .get(TEST_GET_ENDPOINT, { headers: { Authorization: `Bearer ${token}` }, params: { query: JSON.stringify(query) } })
          .then((res) => {
            if (res.data.data.length) {
              const test = res.data.data[0];
              setTest(test);
              const query = { _id: { $in: test.questions } };
              axios
                .get(QUESTION_GET_ENDPOINT, { headers: { Authorization: `Bearer ${token}` }, params: { query: JSON.stringify(query) } })
                .then((res) => {
                  if (res.data.data.length) {
                    setQuestions(res.data.data);
                  } else {
                    setQuestions([]);
                  }
                })
                .catch((err) => {
                  console.log(err);
                  setQuestions([]);
                });
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
  }, [testId]);

  useEffect(() => {
    // set test question
    if (question?._id) setTestQuestion(question);
    else if (questions?.length) setTestQuestion(questions[0]);
    else setTestQuestion(null);
    // set responses
    if (questions?.length) setResponses(questions.map((question) => ({ question: question._id, responses: [] })));
  }, [question, questions]);

  useEffect(() => {
    (async () => {
      if (capturedImage) {
        setIsLoading(true);
        try {
          const imageBlob = await fetch(capturedImage).then((r) => r.blob());
          const responses = await getResponsesFromImage(imageBlob);
          setResponses(responses);
          if (testQuestion?._id) {
            const processedResponses = responses.map((response) => ({ test: testId, question: testQuestion._id, student: user?._id + "_" + response.roll, response: testQuestion.options.find((q) => q.key === response.response)?.value }));
            setResponses(processedResponses);
          }
          setIsLoading(false);
        } catch (err) {
          setIsLoading(false);
          console.log(err);
        }
      }
    })();
  }, [capturedImage]);

  const captureImage = () => {
    const capturedImage = myStreamRef.current.getScreenshot();
    setCapturedImage(capturedImage);
    setResponsesOpen(true);
  };

  const handleQuestion = (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      (!question?._id ? axios.post(QUESTION_NEW_ENDPOINT, question, { headers: { Authorization: `Bearer ${token}` } }) : axios.patch(QUESTION_EDIT_ENDPOINT, { query: { _id: question._id }, edits: question }, { headers: { Authorization: `Bearer ${token}` } }))
        .then((res) => {
          if (res.data.data) {
            setQuestion(questionTemplate);
            if (!question?._id) {
              setQuestions((questions) => [res.data.data, ...questions]);
              axios
                .patch(TEST_EDIT_ENDPOINT, { query: { _id: testId }, edits: { questions: [...test.questions, res.data.data._id] } }, { headers: { Authorization: `Bearer ${token}` } })
                .then(() => {
                  setTest((test) => ({ ...test, questions: [...test.questions, res.data.data._id] }));
                  e.target.reset();
                  setIsLoading(false);
                })
                .catch((err) => {
                  alert("Your test has NOT been updated!");
                  setIsLoading(false);
                });
            } else {
              setQuestion(questionTemplate);
              setIsLoading(false);
            }
          } else {
            e.target.reset();
            setIsLoading(false);
          }
        })
        .catch((err) => {
          alert("Your question has NOT been updated!");
          setIsLoading(false);
        });
    } catch (err) {
      alert("Your question has NOT been updated!");
      setIsLoading(false);
    }
  };

  const handleResponses = () => {
    try {
      axios.post(RESPONSE_NEWS_ENDPOINT, responses, { headers: { Authorization: `Bearer ${token}` } }).then((res) => {
        if (res.data.data) {
          alert("Your responses have been uploaded!");
          setResponsesOpen(false);
          setCapturedImage(null);
        } else {
          alert("Your responses have NOT been uploaded!");
        }
      });
    } catch (err) {
      alert("Your responses have NOT been uploaded!");
    }
  };

  return (
    <Container maxWidth="100%">
      <Helmet>
        <title>
          {test?.name || "Test"} | {COMPANY}
        </title>
      </Helmet>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={8}>
          <Paper sx={{ p: 2 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
              <Typography color="primary" variant="h6" flex={1} gutterBottom>
                Test
              </Typography>
            </Stack>
            {user?.role === "teacher" ? (
              <form onSubmit={handleQuestion}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField required fullWidth value={question.question} onChange={(e) => setQuestion((question) => ({ ...question, question: e.target.value }))} name="question" label="Type your question." variant="outlined" />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField required fullWidth value={question.options?.length >= 1 ? question.options[0].value : ""} onChange={(e) => setQuestion((question) => ({ ...question, options: question.options.map((option, index) => (index === 0 ? { ...option, value: e.target.value } : option)) }))} name="o1" label="Option 1" variant="outlined" />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth value={question.options?.length >= 2 ? question.options[1].value : ""} onChange={(e) => setQuestion((question) => ({ ...question, options: question.options.map((option, index) => (index === 1 ? { ...option, value: e.target.value } : option)) }))} name="o2" label="Option 2" variant="outlined" />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth value={question.options?.length >= 3 ? question.options[2].value : ""} onChange={(e) => setQuestion((question) => ({ ...question, options: question.options.map((option, index) => (index === 2 ? { ...option, value: e.target.value } : option)) }))} name="o3" label="Option 3" variant="outlined" />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth value={question.options?.length >= 4 ? question.options[3].value : ""} onChange={(e) => setQuestion((question) => ({ ...question, options: question.options.map((option, index) => (index === 3 ? { ...option, value: e.target.value } : option)) }))} name="o4" label="Option 4" variant="outlined" />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth value={question.options?.length >= 5 ? question.options[4].value : ""} onChange={(e) => setQuestion((question) => ({ ...question, options: question.options.map((option, index) => (index === 4 ? { ...option, value: e.target.value } : option)) }))} name="o5" label="Option 5" variant="outlined" />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth value={question.options?.length >= 6 ? question.options[5].value : ""} onChange={(e) => setQuestion((question) => ({ ...question, options: question.options.map((option, index) => (index === 5 ? { ...option, value: e.target.value } : option)) }))} name="o6" label="Option 6" variant="outlined" />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField required fullWidth value={question.answer} onChange={(e) => setQuestion((question) => ({ ...question, answer: e.target.value }))} name="answer" label="Answer" variant="outlined" />
                  </Grid>
                  <Grid item xs={12}>
                    <LoadingButton startIcon={question?._id ? <Edit /> : <Upload />} type="submit" variant="contained" color="primary" loading={isLoading} sx={{ ml: "auto" }}>
                      {question?._id ? "Update" : "Upload"}
                    </LoadingButton>
                  </Grid>
                </Grid>
              </form>
            ) : null}
            {user?.role !== "teacher" && testQuestion?._id ? (
              <Box>
                <Typography variant="body1" color="text.secondary" sx={{ my: 2, fontWeight: "bold" }}>
                  {testQuestion.question}
                </Typography>
                <Grid container spacing={2}>
                  {testQuestion.options
                    .filter((o) => o.value)
                    .map((option) => (
                      <Grid item xs={12} sm={6}>
                        <Button key={option.key} fullWidth variant="outlined">
                          {option.key + ". " + option.value}
                        </Button>
                      </Grid>
                    ))}
                </Grid>
              </Box>
            ) : null}
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 2 }}>
            <Stack direction="row" justifyContent={"space-between"} alignItems="center" spacing={1}>
              <Typography color="primary" variant="h6" gutterBottom>
                Questions
              </Typography>
              {user?.role === "teacher" ? (
                <Button variant="contained" startIcon={<Add />} onClick={() => setQuestion(questionTemplate)}>
                  New
                </Button>
              ) : null}
            </Stack>
            {questions.length ? (
              <List sx={{ width: "100%" }}>
                {questions.map((question, index) => (
                  <ListItemButton key={question._id} alignItems="flex-start" onClick={() => setQuestion(question)}>
                    <ListItemText primary={"Question " + (index + 1)} secondary={truncate(question.question, 50)} />
                  </ListItemButton>
                ))}
              </List>
            ) : (
              <Typography variant="body1" color="text.secondary" align="center" sx={{ py: "50px" }}>
                No questions yet!
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
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
      <Dialog open={responsesOpen} onClose={() => setResponsesOpen(false)} PaperComponent={PaperComponent}>
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
          <Typography color="primary" variant="h6" gutterBottom>
            Upload the responses!
          </Typography>
        </DialogTitle>
        <IconButton
          onClick={() => setResponsesOpen(false)}
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
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <CardMedia
                    component="img"
                    image={capturedImage}
                    sx={{
                      width: "100%",
                      height: "auto",
                      objectFit: "cover",
                      borderRadius: "5px",
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <LoadingButton fullWidth disabled={isLoading} loading={isLoading} variant="contained" onClick={handleResponses}>
                Send
              </LoadingButton>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default Test;
