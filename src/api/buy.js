import api from "./axios.config";

export const getAllBuyForms = async (token) => {
  let res;
  try {
    await api.get('./buy', {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    }).then(result => res = result);
    return res;
  } catch (error) {
    console.log(error);
  }
}

export const createBuyForm = async (token, reqBody) => {
  let res;
  const { SupplierId, cart, total } = reqBody;
  try {
    await api.post('./buy/create', {
      SupplierId,
      cart,
      total
    }, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    }).then(result => res = {...res, result});
    return res;
  } catch (error) {
    console.log(error);
    res = {...res, error}
    return res;
  }
}