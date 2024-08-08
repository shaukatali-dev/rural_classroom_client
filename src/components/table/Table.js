/* eslint-disable react/prop-types */
import { Table as MuiTable, TableBody, TableContainer } from "@mui/material";
import TableRowHeader from "./TableRowHeader.js";
import TableRows from "./TableRows.js";
import React from "react";

const TableItems = ({ data, index, styles = {}, onRowClick, expanded, renderChildInExpandedView, toggleExpanded }) => {
  const { items, columns } = data;

  if (!items || !items[index]) return null;

  const item = items[index].node || items[index];

  return (
    <TableRows
      item={item}
      columns={columns}
      styles={styles}
      onRowClick={onRowClick}
      expanded={expanded}
      index={index}
      renderChildInExpandedView={renderChildInExpandedView}
      toggleExpanded={toggleExpanded}
    />
  );
};

const Table = ({ 
  header, 
  items, 
  columns, 
  rowStyles = {}, 
  onRowClick,
  renderChildInExpandedView,
}) => {
  const [expanded, setExpanded] = React.useState(() =>
    new Array(items.length).fill(true).reduce(
      (acc, it, index) => ({
        ...acc,
        [index]: false,
      }),
      {},
    ),
  );

  const toggleExpanded = (index) => () => {
    setExpanded((x) => ({
      ...x,
      [index]: !x[index],
    }));
  };

  return (
    <TableContainer
      sx={{
        overflowX: "visible",
        width:'calc(100% - 64px)',
        m:3,
      }}
    >
      <MuiTable aria-label="sticky table" sx={{ p: 0 }}>
        {header && (
          <TableRowHeader header columns={columns} renderChildInExpandedView={renderChildInExpandedView}/>
        )}
        <TableBody>
          {(items || []).map((item, index) => {
            return (
              <TableItems
                key={index}
                data={{ items, columns }}
                index={index}
                styles={rowStyles}
                onRowClick={onRowClick}
                expanded={expanded}
                renderChildInExpandedView={renderChildInExpandedView}
                toggleExpanded={toggleExpanded}
              />
            );
          })}
        </TableBody>
      </MuiTable>
    </TableContainer>
  );
};

export default Table;
