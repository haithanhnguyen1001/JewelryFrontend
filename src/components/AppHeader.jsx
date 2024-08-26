import React, { useState } from "react";
import { AppBar, Toolbar, Grid, IconButton, Badge, Box } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import { useNavigate } from "react-router-dom";
import { logout } from "../api/user";
import { useUserStore } from "../../store";

const AppHeader = ({ children }) => {
  const navigate = useNavigate();
  const username = useUserStore((state) => state.username);
  const token = useUserStore((state) => state.token);
  const setUsername = useUserStore((state) => state.setUsername);
  const setPassword = useUserStore((state) => state.setPassword);
  const setToken = useUserStore((state) => state.setToken);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleLogout = async () => {
    if (token) {
      let res;
      setIsLoading(true);
      try {
        res = await logout(username, token);
        setUsername("");
        setPassword("");
        setToken("");
        navigate("/login");
      } catch (error) {
        setError(true);
      }
      setIsLoading(false);
    }
  };

  return (
    <AppBar position="sticky" sx={{ width: "100%" }}>
      <Toolbar>
        <Grid container alignItems="center">
          <Grid item>
            <h1>{children}</h1>
          </Grid>
          <Grid item sm></Grid>
          <Grid item sx={{ display: 'flex', justifyContent: "space-between", alignItems: "center" }}>
            <h1>{username}</h1>
            <IconButton onClick={handleLogout}>
              {error ? (
                <Alert severity="error">
                  {errMsg ? errMsg : "Có lỗi xảy ra"}
                </Alert>
              ) : (
                <></>
              )}
              {isLoading ? (
                <Box sx={{ display: "flex" }}>
                  <CircularProgress />
                </Box>
              ) : (
                <></>
              )}
              <Badge>
                <PowerSettingsNewIcon
                  fontSize="large"
                  sx={{ color: "#fff" }}
                />
              </Badge>
            </IconButton>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default AppHeader;
