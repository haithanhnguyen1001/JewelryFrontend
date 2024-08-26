import api from "./axios.config";

export const download = async (token, body) => {
  let res;
  const newBody = JSON.stringify(body);
  try {
    const result = await api.post(
      "./download",
      {
        newBody,
      },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    res = {...res, result};
  } catch (error) {
    res = { ...res, error };
  }
  return res;
};
