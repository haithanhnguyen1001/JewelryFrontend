import React, { useState, useEffect } from "react";
import { AppBar, Typography, Box, Tab, Tabs } from "@mui/material";
import Services from "./Services";
import ServiceForm from "./ServiceForm";
import ServiceSearch from "./ServiceSearch";
import AppHeader from "../../components/AppHeader";
import { useUserStore } from "../../../store";
import { useNavigate } from "react-router-dom";

const Service = () => {
  const [value, setValue] = useState("form");
  const handleTabButton = (event, newValue) => {
    if (value !== newValue) {
      setValue(newValue);
    }
  };

  const setUsername = useUserStore((state) => state.setUsername);
  const setToken = useUserStore((state) => state.setToken);

  const navigate = useNavigate();

  useEffect(() => {
    const usernameStorage = sessionStorage.getItem("username");
    const tokenStorage = sessionStorage.getItem("token");
    if (usernameStorage && tokenStorage) {
      setUsername(usernameStorage);
      setToken(tokenStorage);
      navigate("/service");
    } else {
      navigate("/login");
    }
  }, []);

  return (
    <>
      <AppHeader>PHIẾU DỊCH VỤ</AppHeader>
      <Box sx={{ color: "black", borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          aria-label="basic tabs example"
          value={value}
          onChange={handleTabButton}
        >
          <Tab label="Lập phiếu" value={"form"}></Tab>
          <Tab label="Tra cứu phiếu" value={"search"}></Tab>
          <Tab label="Danh mục dịch vụ" value={"search-service"}></Tab>
        </Tabs>
      </Box>
      <main>
        {value === "form" ? (
          <ServiceForm show={true} />
        ) : value === "search" ? (
          <ServiceSearch show={true} />
        ) : (
          <Services show={true} />
        )}
      </main>
    </>
  );
};

export default Service;
