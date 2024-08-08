import Table from "../../../components/table/Table"
import QuestionRowColumns from "./QuestionRowColumns"

const ExpandedQuestionRow = ({
  data,
  index,
}) => {
  return (
    <Table
      items={data.questions}
      columns={QuestionRowColumns()}
      header={true}
      rowStyles={{
        cursor: "pointer",
      }}
    />
  )
}

export default ExpandedQuestionRow