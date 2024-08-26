import { Box, IconButton, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CancelIcon from '@mui/icons-material/Cancel';

const SearchBox = ({ value, onChange, onClick }) => {
  return (
    <Box variant="outlined" sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: '40%' }}>
      <SearchIcon sx={{ m: '10px', fontSize: 20 }} />
      <TextField
        sx={{ mr: 1, flex: 1 }}
        variant="standard"
        placeholder="Tìm kiếm"
        value={value}
        onChange={onChange}
        InputProps={{
          endAdornment: value ? (
            <InputAdornment position="end">
              <IconButton onClick={onClick}>
                <CancelIcon />
              </IconButton>
            </InputAdornment>
          ) : null,
        }}
      />
    </Box>
  );
};

export default SearchBox;
