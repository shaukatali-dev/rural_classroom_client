import Table from "../../../components/table/Table"
import TestRowColumns from "./TestRowColumns"
import ExpandedQuestionRow from "./Expanded QuestionRow"

const ExpandedTestRow = ({
  data,
  index,
}) => {
  return (
    <Table
      items={data.tests}
      columns={TestRowColumns()}
      header={true}
      rowStyles={{
        cursor: "pointer",
      }}
      renderChildInExpandedView={({ item, index }) => {
        return (
          <ExpandedQuestionRow data={item} index={index} />
        );
      }}
    />
  )
}

export default ExpandedTestRow