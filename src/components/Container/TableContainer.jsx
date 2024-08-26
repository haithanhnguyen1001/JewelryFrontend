import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

const TableContainer = ({ columns, rows, SearchInput = '' }) => {
  return (
    <Box
      sx={{
        height: '400px',
        width: '100%',
        '& *': {
          fontSize: '1.4rem',
        },
      }}
    >
      { rows ? <DataGrid
        columns={columns}
        rows={rows.filter((row) => {
          return Object.keys(row).some((key) => {
            if (key !== 'key') {
              const value = row[key];
              return value.toString().toLowerCase().includes(SearchInput.toLowerCase());
            }
            return false;
          });
        })}
      /> : <></>}
    </Box>
  );
};

export default TableContainer;
