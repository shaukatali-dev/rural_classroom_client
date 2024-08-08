import React, { useContext } from "react";
// contexts
import AppContext from "../contexts/AppContext";
// mui
import { Stack, Typography } from "@mui/material";

const ChatMessage = ({ overlay, message }) => {
  const { user } = useContext(AppContext);
  return (
    <Stack sx={{ width: "fit-content", mb: 2, ml: message.from === user?._id ? "auto" : "", mr: message.from !== user?._id ? "64px" : "" }}>
      <Typography variant="body1" color={overlay ? "white" : "text.primary"}>
        {message.fromName}
      </Typography>
      <Typography variant="body1" sx={{ color: "white", p: 1, borderRadius: "10px", backgroundColor: overlay ? "transparent" : message.from === user?._id ? "primary.main" : "secondary.main", paddingBottom: "32px", position: "relative" }}>
        {message.text}
        <Typography variant="body2" color="white" sx={{ position: "absolute", right: 6, bottom: 6, fontSize: "10px" }}>
          {new Date(message.date).toLocaleString()}
        </Typography>
      </Typography>
    </Stack>
  );
};

export default ChatMessage;
