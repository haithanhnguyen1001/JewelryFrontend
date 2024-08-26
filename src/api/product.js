import api from "./axios.config";

export const getAllProducts = async (token) => {
  let res;
  try {
    res = await api.get('./product', {
      headers: {
        Authorization: 'Bearer ' + token
      }
    }).then(result => res = result);
    return res;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export const createProduct = async (token, product) => {
  let res;
  try {
    await api.post('./product/new', {
      ...product,
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

export const updateProduct = async (token, body, id) => {
  let res;
  try {
    await api.put(`./product/update/${id}`, {
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