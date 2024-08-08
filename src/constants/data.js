import LineChart from "../components/charts/LineChart";

export const defaultCharts = [
  {
    title: "Line Chart",
    type: "line",
    x: "date",
    data: [
      {
        date: "1/1/24",
        India: 1,
        Pakistan: 2,
        Bangladesh: 3,
      },
      {
        date: "2/1/24",
        India: 4,
        Pakistan: 1,
        Bangladesh: 3,
      },
      {
        date: "3/1/24",
        India: 0,
        Pakistan: 5,
        Bangladesh: 2,
      }
    ],
  },
  {
    title: "Area Chart",
    type: "area",
    x: "date",
    data: [
      {
        date: "1/1/24",
        India: 1,
        Pakistan: 2,
        Bangladesh: 3,
      },
      {
        date: "2/1/24",
        India: 4,
        Pakistan: 1,
        Bangladesh: 3,
      },
      {
        date: "3/1/24",
        India: 0,
        Pakistan: 5,
        Bangladesh: 2,
      }
    ],
  },
  {
    title: "Bar Chart",
    type: "bar",
    x: "date",
    data: [
      {
        date: "1/1/24",
        India: 1,
        Pakistan: 2,
        Bangladesh: 3,
      },
      {
        date: "2/1/24",
        India: 4,
        Pakistan: 1,
        Bangladesh: 3,
      },
      {
        date: "3/1/24",
        India: 0,
        Pakistan: 5,
        Bangladesh: 2,
      }
    ],
  },
];
