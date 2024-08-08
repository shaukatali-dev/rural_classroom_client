import { Search } from "@mui/icons-material";
import { Box, IconButton, TextField, Typography } from "@mui/material";
import React from "react";

const AdminHeader = ({
  title,
  searchBar,
  searchAction,
  searchReset,
  sx,
}) => {
  const [search, setSearch] = React.useState("");

  React.useEffect(() => {
    if (searchReset && !search) searchReset();
    if (searchAction && search && search.length > 0) searchAction(search);
  }, [search]);

  return (
    <Box
      py={2}
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        mb: 2,
        ...sx,
      }}
    >
      <Typography variant="h4" sx={{ fontWeight: 500 }}>
        {title}
      </Typography>

      {searchBar && (
        <TextField
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name"
          size="small"
          InputProps={{
            startAdornment: (
              <IconButton>
                <Search color="action" />
              </IconButton>
            ),
            sx: {
              borderRadius: 3,
            },
          }}
          sx={{
            width: 400,
          }}
        />
      )}
    </Box>
  );
};

export default AdminHeader;
