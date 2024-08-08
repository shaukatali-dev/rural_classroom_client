import React, { useState, useEffect, useRef } from "react";
import { useReactMediaRecorder } from "react-media-recorder";
// apis
import { speechToText } from "../apis/multimedia";
// mui
import { Box, Stack, TextField, IconButton, CircularProgress } from "@mui/material";
import { Mic, MicOff, Send, AudioFile } from "@mui/icons-material";
import ChatMessage from "./ChatMessage";
// vars
const mimeType = "audio/webm;codecs=opus";

const ChatBox = ({ sx, overlay, messages, handleMessage }) => {
  const chatBoxRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const { status, startRecording, stopRecording, mediaBlobUrl } = useReactMediaRecorder({ audio: true });

  useEffect(() => {
    if (chatBoxRef.current) chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
  }, [messages]);

  useEffect(() => {
    (async () => {
      if (mediaBlobUrl) {
        setIsLoading(true);
        try {
          const response = await fetch(mediaBlobUrl);
          const blob = await response.blob();
          const reader = new FileReader();
          reader.onload = async (e) => {
            const blobWithMimeType = new Blob([new Uint8Array(e.target.result)], { type: mimeType });
            const text = await speechToText(blobWithMimeType);
            handleMessage(text);
            setIsLoading(false);
          };
          reader.readAsArrayBuffer(blob);
        } catch (err) {
          setIsLoading(false);
          console.log(err);
        }
      }
    })();
  }, [mediaBlobUrl]);

  const handleMic = () => {
    if ((status === "idle" || status === "stopped") && !isLoading) {
      startRecording();
    } else {
      stopRecording();
    }
  };

  const handleAudioFile = () => {
    if (!isLoading) {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "audio/*";
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = async (e) => {
            setIsLoading(true);
            try {
              const blobWithMimeType = new Blob([new Uint8Array(e.target.result)], { type: mimeType });
              const text = await speechToText(blobWithMimeType);
              handleMessage(text);
              setIsLoading(false);
            } catch (err) {
              setIsLoading(false);
              console.log(err);
            }
          };
          reader.readAsArrayBuffer(file);
        }
      };
      input.click();
    }
  };

  return (
    <Box component="form" onSubmit={handleMessage} sx={{ ...sx, width: "100%" }}>
      <Stack
        ref={chatBoxRef}
        sx={{
          p: 2,
          height: "300px",
          overflowX: "hidden",
          background: overlay ? "linear-gradient(45deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0))" : "transparent",
          overflowY: "auto",
          "&::-webkit-scrollbar": {
            display: overlay ? "none" : "auto",
          },
        }}
      >
        {messages.map((message, index) => (
          <ChatMessage key={"chat" + index} overlay={overlay} message={message} />
        ))}
      </Stack>
      <Stack direction="row" alignItems="flex-end">
        <IconButton onClick={handleAudioFile}>
          <AudioFile color="success" />
        </IconButton>
        <IconButton onClick={handleMic}>{status === "idle" || status === "stopped" ? <MicOff color="primary" /> : <Mic color="error" />}</IconButton>
        <TextField fullWidth sx={{ mx: 1 }} variant="standard" label="Type your message." placeholder="Ex:- I have a doubt!" name="text" type="text" />
        {isLoading ? (
          <CircularProgress sx={{ height: "auto !important" }} />
        ) : (
          <IconButton type="submit">
            <Send />
          </IconButton>
        )}
      </Stack>
    </Box>
  );
};

export default ChatBox;
