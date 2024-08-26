import {
  Grid,
  Paper,
  TableContainer,
  TableHead,
  TableCell,
  Typography,
  TableRow,
  TableBody,
} from "@mui/material";
import React from "react";

const Search = ({ label, title, fields }) => {
  // fields bao gồm các thuộc tính của Object đang search
  const tableHeaders = [...fields];
  const [data, setData] = useState([]);

  //useEffect(() => {
  // get data by api
  //}, []);

  const itemToCells = (item) => {
    // Map các prop của object thành cell
    let toJSX = <></>;
    for (const prop in item) {
      toJSX = (
        <>
          {toJSX}
          <TableCell align="right">{item[prop]}</TableCell>
        </>
      );
    }
    return toJSX;
  };

  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography varient="h5">{title}</Typography>
      </Grid>
      <Grid item xs={12}>
        <TableContainer component={Paper}>
          <Table aria-label={label}>
            <TableHead>
              <TableRow>
                {tableHeaders.map((header, index) => {
                  const aligner = index === 0 ? "left" : "right";
                  return (
                    <TableCell align={aligner}>
                      {index === 0 ? "STT" : header.label}
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>

            <TableBody>
              {data.map((item, index) => (
                <TableRow
                  key={item.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {index + 1}
                  </TableCell>
                  {itemToCells(item)}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
};

export default Search;
