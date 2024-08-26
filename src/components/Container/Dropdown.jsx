import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

const Dropdown = ({ current, data, handler, showOverridden }) => {
  const [items, setItems] = useState(data);
  const filtered = items.filter((item) =>
    item.name.toLowerCase().includes(current.toLowerCase())
  );

  let dropDownInner = filtered.map((item, idx) => {
    return (
      <ListItem key={idx}>
        <ListItemButton
          id={item.id}
          onClick={() => {
            handler(item);
          }}
        >
          <ListItemText primary={item.name}></ListItemText>
        </ListItemButton>
      </ListItem>
    );
  });

  let show = current.length && !showOverridden ? "block" : "none";
  if (filtered.length === 0) {
    dropDownInner = (
      <Typography variant="h6" align="left" sx={{ marginLeft: 1 }}>
        Không tìm thấy.
      </Typography>
    );
  }

  return (
    <Paper
      elevation={2}
      sx={{
        display: `${show}`,
        position: "absolute",
        width: "90%",
        zIndex: 10,
        overflowY: "scroll",
      }}
    >
      <List dense>{dropDownInner}</List>
    </Paper>
  );
};

export default Dropdown;
