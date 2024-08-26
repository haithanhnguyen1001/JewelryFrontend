import { Stack, Typography, Box } from '@mui/material';
import { SearchBox } from '../Controls';
import Container from './Container';

const SearchContainer = ({ show, title, onChange, onClick, value, children }) => {
  return (
    <Stack spacing={2} sx={{ p: '20px', display: `${show ? 'block' : 'none'}` }}>
      <Container>
        <Stack direction="row" flex="1" mt="10px" mb="40px">
          <Box sx={{ display: 'flex', alignItems: 'center', width: '60%' }}>
            <Typography variant="h4" component="h4">
              <b>{title}</b>
            </Typography>
          </Box>
          <SearchBox onChange={onChange} onClick={onClick} value={value} />
        </Stack>
        {children}
      </Container>
    </Stack>
  );
};

export default SearchContainer;
