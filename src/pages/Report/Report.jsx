import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Tab, Tabs } from '@mui/material';
import AppHeader from '../../components/AppHeader';
import StockReport from './StockReport';
import { useUserStore } from '../../../store';

const Report = () => {

  const setUsername = useUserStore((state) => state.setUsername);
  const setToken = useUserStore((state) => state.setToken);

  const navigate = useNavigate();

  useEffect(() => {
    const usernameStorage = sessionStorage.getItem('username');
    const tokenStorage = sessionStorage.getItem('token');
    if (usernameStorage && tokenStorage) {
      setUsername(usernameStorage);
      setToken(tokenStorage);
      navigate('/report');
    } else {
      navigate('/login');
    }
  }, []);
  return (
    <>
      <AppHeader>BÁO CÁO</AppHeader>
      <Box sx={{ color: 'black', borderBottom: 1, borderColor: 'divider' }}>
      </Box>
      <main>
        <StockReport show={true} />
      </main>
    </>
  );
};

export default Report;
