import { Container, Paper, Stack, Box, TextField } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Alert from "@mui/material/Alert";
import React, { useEffect, useState } from "react";
import { ControlButton } from "../components/Controls";
import DoneIcon from "@mui/icons-material/Done";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/user";
import { useUserStore } from "../../store";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const username = useUserStore((state) => state.username);
  const password = useUserStore((state) => state.password);
  const errMsg = useUserStore((state) => state.errMsg);

  const setPassword = useUserStore((state) => state.setPassword);
  const setErrMsg = useUserStore((state) => state.setErrMsg);
  const setUsername = useUserStore((state) => state.setUsername);
  const setToken = useUserStore((state) => state.setToken);

  const navigate = useNavigate();

  useEffect(() => {
    const usernameStorage = sessionStorage.getItem('username');
    const tokenStorage = sessionStorage.getItem('token');
    if (usernameStorage && tokenStorage) {
      console.log('logged in')
      setUsername(usernameStorage);
      setToken(tokenStorage);
      navigate('/sell');
    }
  }, []);

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };
  const handleMouseDownPassword = (e) => {
    e.preventDefault();
  };

  const handleLogin = async () => {
    if (usernameError || passwordError) {
      setErrMsg("Thiếu tên hoặc mật khẩu đăng nhập");
      setError(true);
      return;
    }
    setIsLoading(true);
    setError(false);
    let res;
    try {
      res = await loginUser(username, password);
      setToken(res.data.token);
      setErrMsg("");
      sessionStorage.setItem("username", username);
      sessionStorage.setItem("token", res.data.token);
      navigate("/sell");
    } catch (error) {
      setError(true);
    }
    if (res?.response?.status < 200 || res?.response?.status > 200) {
      setErrMsg(res.response.data);
    }
    setIsLoading(false);
  };

  return (
    <Container
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "24px",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          height: "75%",
          width: "90%",
          borderRadius: "24px",
        }}
      >
        <Stack
          spacing={2}
          direction="row"
          sx={{
            height: "100%",
            overflow: "hidden",
            position: "relative",
            borderRadius: "24px",
          }}
        >
          <>
            <Box
              sx={{
                height: "100%",
                opacity: 0.9,
              }}
              component="img"
              alt="jewelry image"
              src="src\assets\images\login_bg_2.jpg"
              backgroundColor="#0818a8"
            />
            <Stack
              sx={{
                position: "absolute",
                top: 0,
                right: 0,
                bottom: 0,
                width: "45%",
                backgroundColor: "#FAF9F6",
                paddingX: "32px",
                paddingY: "48px",
                fontSize: "24px",
                textAlign: "center",
              }}
              spacing={5}
            >
              <h2>Đăng nhập</h2>
              <TextField
                required
                error={usernameError}
                helperText={usernameError ? "Vui lòng nhập tên đăng nhập" : ""}
                variant="standard"
                id="username"
                label="Tên người dùng"
                inputProps={{
                  style: {
                    fontSize: "2rem",
                    height: 50,
                  },
                  onBlur: () => {
                    if (!username.length) setUsernameError(true);
                  },
                  onFocus: () => {
                    setUsernameError(false);
                  },
                }}
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
              />
              <TextField
                required
                type={showPassword ? "text" : "password"}
                error={passwordError}
                helperText={passwordError ? "Vui lòng nhập mật khẩu" : ""}
                variant="standard"
                id="password"
                label="Mật khẩu"
                inputProps={{
                  style: {
                    fontSize: "2rem",
                    height: 50,
                  },
                  onBlur: () => {
                    if (!password.length) setPasswordError(true);
                  },
                  onFocus: () => {
                    setPasswordError(false);
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {showPassword ? (
                          <VisibilityIcon />
                        ) : (
                          <VisibilityOffIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />

              <Stack
                sx={{
                  margin: "auto",
                  display: "block",
                  paddingTop: "30px",
                }}
              >
                <ControlButton
                  color="success"
                  width="40%"
                  height={50}
                  fontSize={16}
                  onClick={handleLogin}
                  endIcon={<DoneIcon sx={{ fontSize: 40 }} />}
                >
                  Đăng nhập
                </ControlButton>
              </Stack>
              <Stack
                sx={{
                  margin: "auto",
                  display: "block",
                  paddingTop: "10px",
                }}
              >
                {isLoading ? (
                  <Box sx={{ display: "flex" }}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <></>
                )}
              </Stack>
              <Stack
                sx={{
                  margin: "auto",
                  display: "block",
                  paddingTop: "10px",
                }}
              >
                {error ? (
                  <Alert severity="error">
                    {errMsg ? errMsg : "Có lỗi xảy ra"}
                  </Alert>
                ) : (
                  <></>
                )}
              </Stack>
            </Stack>
          </>
        </Stack>
      </Paper>
    </Container>
  );
};

export default Login;
