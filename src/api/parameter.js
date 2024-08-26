import api from "./axios.config";

export const getParameter = async (token) => {
  let res;
  try {
    res = await api
      .get("./parameter", {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => (res = { ...res, result }));
  } catch (error) {
    res = { ...res, error };
  }
  return res;
};

export const updateParameter = async (token, newValue) => {
  let res;
  try {
    res = await api
      .put(
        "./parameter/0",
        { value: newValue },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      .then((result) => (res = { ...res, result }));
  } catch (error) {
    res = { ...res, error };
  }
  return res;
};
