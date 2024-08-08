import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// contexts
import AppContext from "../contexts/AppContext";
// constants
import { COURSE_ROUTE } from "../constants/routes";
import { UPLOAD_URL } from "../constants/urls";
import { USER_GET_ENDPOINT } from "../constants/endpoints";
// utils
import { truncate } from "../utils";
// mui
import { Card, CardHeader, CardMedia, CardContent, CardActions, Avatar, Button, Typography } from "@mui/material";
import { FileOpen } from "@mui/icons-material";

const CourseCard = ({ course }) => {
  const navigate = useNavigate();
  const { token } = useContext(AppContext);
  const [teacher, setTeacher] = useState(null);

  useEffect(() => {
    if (course?._id) {
      try {
        const query = { _id: course.teacher };
        axios
          .get(USER_GET_ENDPOINT, { headers: { Authorization: `Bearer ${token}` }, params: { query: JSON.stringify(query) } })
          .then((res) => {
            if (res.data.data.length) setTeacher(res.data.data[0]);
            else setTeacher(null);
          })
          .catch((err) => {
            setTeacher(null);
            console.log("Something went wrong! Teacher couldn't be fetched.");
          });
      } catch (err) {
        setTeacher(null);
        console.log(err);
      }
    }
  }, [course]);

  return (
    <Card>
      <CardHeader avatar={<Avatar src={UPLOAD_URL + teacher?.profilePic}>{teacher?.name ? teacher.name[0] : "T"}</Avatar>} align="left" title={course.name} subheader={new Date(course.date).toLocaleString()} />
      <CardMedia component="img" height="194" image={UPLOAD_URL + course.coursePic} alt={course.name} />
      <CardContent>
        <Typography variant="body2" color="text.secondary" align="left" mb={2}>
          {truncate(course.description, 175)}
        </Typography>
        <Typography variant="body2" color="text.primary" align="right">
          ~ {teacher?.name}
        </Typography>
      </CardContent>
      <CardActions>
        <Button fullWidth variant="contained" startIcon={<FileOpen />} onClick={() => navigate(COURSE_ROUTE + "/" + course._id)}>
          Explore
        </Button>
      </CardActions>
    </Card>
  );
};

export default CourseCard;
