import React, { PureComponent } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const dummyData = [
  {
    time: new Date().toLocaleTimeString(),
    doubts: 2400,
  },
  {
    time: new Date().toLocaleTimeString(),
    doubts: 1398,
  },
  {
    time: new Date().toLocaleTimeString(),
    doubts: 9800,
  },
  {
    time: new Date().toLocaleTimeString(),
    doubts: 3908,
  },
  {
    time: new Date().toLocaleTimeString(),
    doubts: 4800,
  },
  {
    time: new Date().toLocaleTimeString(),
    doubts: 3800,
  },
  {
    time: new Date().toLocaleTimeString(),
    doubts: 4300,
  },
];

const Chart = ({ data = dummyData }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis domain={[-10, 200]} />
        <Tooltip />
        <Legend />
        <Line isAnimationActive={false} type="monotone" dataKey="doubts" stroke="#8884d8" dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default Chart;
