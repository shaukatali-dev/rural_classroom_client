/* eslint-disable react/prop-types */
import { KeyboardArrowDownOutlined, KeyboardArrowUpOutlined } from "@mui/icons-material";
import { Box, Collapse, IconButton, TableCell, TableRow } from "@mui/material";

const TableRows = ({index, item, columns, styles, onRowClick, expanded, renderChildInExpandedView, toggleExpanded }) => {
  return (
    <>
      <TableRow
        component="div"
        sx={{
          display: "flex",
          alignItems: "center",
          borderBottom: "1px solid #E5E5E5",
          ...styles,
        }}
        onClick={() => {
          if(onRowClick){
            onRowClick(item);
          }
        }}
      >
        {columns.map((column, key) => {
          return (
            <TableCell
              key={key}
              sx={{
                display: "flex",
                alignItems: "center",
                borderBottom: "none",
                paddingLeft: 0,
              }}
              style={{ flex: column.width, ...column.style }}
            >
              {column.value(item)}
            </TableCell>
          );
        })}
        {renderChildInExpandedView && (
          <TableCell
            sx={{
              borderBottom: "unset",
            }}
          >
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={toggleExpanded(index)}
            >
              {expanded[index] ? (
                <KeyboardArrowUpOutlined />
              ) : (
                <KeyboardArrowDownOutlined />
              )}
            </IconButton>
          </TableCell>
        )}
      </TableRow>
      {renderChildInExpandedView && (
        <TableRow>
          <Collapse
            in={expanded[index]}
            timeout="auto"
            unmountOnExit
          >
            <Box
              margin={2}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {renderChildInExpandedView({ item, index })}
            </Box>
          </Collapse>
        </TableRow>
      )}
    </>
  );
};

export default TableRows;
