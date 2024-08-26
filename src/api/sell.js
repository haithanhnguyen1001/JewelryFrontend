import api from "./axios.config";

export const getAllSellForms = async (token) => {
  let res;
  try {
    await api.get('./sell', {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    }).then(result => res = result);
    return res;
  } catch (error) {
    console.log(error);
  }
}

export const createSellForm = async (token, reqBody) => {
  let res;
  const { customer, cart, total } = reqBody;
  try {
    await api.post('./sell/create', {
      customer,
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