import api from "./axios.config";

export const getAllTypes = async (token) => {
  let res;
  try {
    await api.get("/product-type", {
      headers: {
        Authorization: "Bearer " + token
      }
    }).then(result => res = {...res, result});
  } catch (error) {
    console.log(error);
    res = {...res, error};
  }
  return res;
}

export const createProductType = async (token, type) => {
  let res;
  try {
    await api.post('./product-type/new-type', {
      ...type,
    }, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    }).then(result => res = {...res, result});
  } catch (error) {
    console.log(error);
    res = {...res, error}
  }
  return res;
}

export const updateProductType = async (token, body, id) => {
  let res;
  try {
    await api.put(`./product-type/update/${id}`, {
      ...body
    }, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    }).then(result => res = {...res, result});
  } catch (error) {
    console.log(error);
    res = {...res, error}
  }
  return res;
}