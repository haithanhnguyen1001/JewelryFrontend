import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { AppBar, Typography, Box, Tab, Tabs } from '@mui/material';
import BuyForm from './BuyForm';
import BuySearch from './BuySearch';
import AppHeader from '../../components/AppHeader';
import { useUserStore } from '../../../store';

const Buy = () => {
  const [value, setValue] = useState('form');

  const handleTabButton = (event, newValue) => {
    if (value !== newValue) {
      setValue(newValue);
    }
  };

  const setUsername = useUserStore((state) => state.setUsername);
  const setToken = useUserStore((state) => state.setToken);

  const navigate = useNavigate();

  useEffect(() => {
    const usernameStorage = sessionStorage.getItem('username');
    const tokenStorage = sessionStorage.getItem('token');
    if (usernameStorage && tokenStorage) {
      setUsername(usernameStorage);
      setToken(tokenStorage);
      navigate('/buy');
    } else {
      navigate('/login');
    }
  }, []);

  return (
    <>
      <AppHeader>PHIẾU MUA</AppHeader>
      <Box sx={{ color: 'black', borderBottom: 1, borderColor: 'divider' }}>
        <Tabs aria-label="basic tabs example" value={value} onChange={handleTabButton}>
          <Tab label="Lập phiếu" value={'form'}></Tab>
          <Tab label="Tra cứu" value={'search'}></Tab>
        </Tabs>
      </Box>
      <main>
        {value === 'form' ? <BuyForm show={true} /> : <BuySearch show={true} />}
      </main>
    </>
  );
};

export default Buy;
