import api from "./axios.config";

export const getAllUnits = async (token) => {
  let res;
  try {
    res = await api.get('./unit', {
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

export const createUnit = async (token, product) => {
  let res;
  try {
    await api.post('./unit/new', {
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

export const updateUnit = async (token, body, id) => {
  let res;
  try {
    await api.put(`./unit/update/${id}`, {
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