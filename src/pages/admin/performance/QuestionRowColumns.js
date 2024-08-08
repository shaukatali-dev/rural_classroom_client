import { Typography } from "@mui/material";

const QuestionRowColumns = () => {
  return [
    {
      label: "Question",
      width: 2,
      value: (x) => {
        return (
          <Typography >
            {`${x.question}`}
          </Typography>
        );
      },
    },
    {
      label: "Correct answer",
      width: 2,
      value: (x) => {
        return (
          <Typography >
            {`${x.answer}. ${x.options.find(y=> y.key===x.answer).value}`}
          </Typography>
        );
      },
    },
  ].filter(Boolean);
};

export default QuestionRowColumns;
