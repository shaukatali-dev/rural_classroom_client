/* eslint-disable react/prop-types */
import { TableCell, TableRow, TableSortLabel } from "@mui/material";


const TableRowHeader = ({
  header,
  item,
  columns,
  style,
  createSortHandler,
  orderBy = null,
  order = null,
  styles = {},
  extraHeight = false,
  noBoldheaders = false,
  renderChildInExpandedView,
}) => {
  return (
    <TableRow
      className={styles.rowStyle}
      style={style}
      component="div"
      sx={{
        width: "100%",
        height: extraHeight ? 90 : 76,
        display: "flex",
        alignItems: "center",
        borderBottom: "1px solid #e0e0e0",
      }}
    >
      {columns.map((column, key) => {
        return (
          <TableCell
            key={key}
            className={styles.cellStyle}
            component="div"
            style={{ flex: column.width, ...column.style }}
            sx={{
              display: "flex",
              alignItems: "center",
              wordWrap: "break-word",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: extraHeight ? "normal" : "nowrap",
              borderBottom: "unset",
              padding: 2,
              // font customization. Legacy stuff.
              fontWeight: header && !noBoldheaders && 600,
              ...(extraHeight && { textAlign: "center" }),
            }}
          >
            {header && column.isColumnSortable ? (
              <>
                <TableSortLabel
                  active={orderBy === column.id}
                  dir={orderBy === column.id ? order : "asc"}
                  onClick={createSortHandler && createSortHandler(column.id)}
                >
                  {column.label}
                </TableSortLabel>
              </>
            ) : (
              <>{header ? column.label : column.value(item)}</>
            )}
          </TableCell>
        );
      })}
      {renderChildInExpandedView && (
          <TableCell
            style={{ flex: 0.5 }}
            sx={{
              borderBottom: "unset",
            }}
          >
            {""}
          </TableCell>
      )}
    </TableRow>
  );
};

export default TableRowHeader;
