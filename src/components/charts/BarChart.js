import React, { memo, useState, useEffect } from "react";
import { BarChart, Bar, ResponsiveContainer, Tooltip, Legend, CartesianGrid, XAxis, YAxis } from "recharts";
import FileSaver from "file-saver";
import { useCurrentPng } from "recharts-to-png";
// mui
import { Box, Typography, Stack, IconButton } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
// components
import CustomTooltip from "./CustomTooltip";
// utils
import { getRandomColor } from "../../utils";

const Chart = ({ data, x, title, height, delay = 1000 }) => {
  const [colors, setColors] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [getPng, { ref: pngRef }] = useCurrentPng();

  useEffect(() => {
    if (data.length) {
      const colors = [];
      for (let i = 1; i <= Object.keys(data[0]).length - 1; i++) colors.push(getRandomColor(1));
      setColors(colors);
    } else setColors([]);
  }, [data]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const handleDownload = async () => {
    const png = await getPng();
    if (png) FileSaver.saveAs(png, "pie_chart_" + new Date().toLocaleDateString() + "_" + new Date().toLocaleTimeString("en-US", { hour12: false }) + ".png");
  };

  return data?.length ? (
    <Box sx={{ height }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" color="primary" gutterBottom>
          {title}
        </Typography>
        <IconButton onClick={handleDownload}>
          <DownloadIcon />
        </IconButton>
      </Stack>
      <ResponsiveContainer>
        <BarChart
          ref={pngRef}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={x} />
          <YAxis />
          <Tooltip content={CustomTooltip} />
          <Legend />
          {isVisible
            ? Object.keys(data[0])
                .filter((key) => key !== x)
                .map((y, i) => <Bar key={i} type="monotone" name={y} dataKey={y} fill={colors[i]} stroke={colors[i]} strokeWidth={2} activeDot={{ r: 4 }} />)
            : null}
        </BarChart>
      </ResponsiveContainer>
    </Box>
  ) : (
    <></>
  );
};

export default memo(Chart);
