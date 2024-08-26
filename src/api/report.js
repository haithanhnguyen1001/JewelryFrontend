import api from "./axios.config";

export const createReport = async (token, cart, month, year) => {
  let res;
  try {
    const result = await api.post(
      "./report/create",
      {
        month,
        year,
        cart
      },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    res = {...res, result};
  } catch (error) {
    res = {...res, error};
  }
  return res;
};
