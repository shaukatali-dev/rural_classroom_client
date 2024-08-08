import Table from "../../../components/table/Table"
import StudentsRowColumns from "./StudentsRowColumns"

const ExpandedAttendanceRow = ({
  data,
  index,
}) => {
  return (
    <Table
      items={data.attendance}
      columns={StudentsRowColumns()}
      header={true}
      rowStyles={{
        cursor: "pointer",
      }}
    />
  )
}

export default ExpandedAttendanceRow