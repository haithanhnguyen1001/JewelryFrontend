import api from "./axios.config";


export const loginUser = async (username, password) => {
  let res;
  try {
    res = await api.post("/user/login", {
      username,
      password,
    });
    console.log(res);
    return res;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const logout = async (username, token) => {
  let res;
  try {
    res = await api.post("/user/logout", {
      user: username
    }, {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });
    sessionStorage.setItem("username", "");
    sessionStorage.setItem("token", "");
    return res;
  } catch (error) {
    console.log(error);
    return error;
  }
}
