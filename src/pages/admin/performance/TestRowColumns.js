import { Typography } from "@mui/material";
import { formattedDate } from "../../../utils";

const TestRowColumns = () => {
  return [
    {
      label:"Test date",
      width: 2,
      value: (x) => {
        return (
          <Typography>
            {formattedDate(new Date(x.date))}
          </Typography>
        )
      }
    },
    {
      label: "Test name",
      width: 2,
      value: (x) => {
        return (
          <Typography >
            {x.name}
          </Typography>
        );
      },
    },
    {
      label: "Test description",
      width: 2,
      value: (x) => {
        return (
          <Typography noWrap>
            {x.description}
          </Typography>
        );
      },
    },
    {
      label: "Test syllabus",
      width: 2,
      value: (x) => {
        return (
          <Typography noWrap>
            {x.syllabus}
          </Typography>
        );
      },
    },
    {
      label: "Score",
      width: 2,
      value: (x) => {
        return (
          <Typography>
            {`${x.score}%`}
          </Typography>
        );
      },
    },
  ].filter(Boolean);
};

export default TestRowColumns;
