import api from "./axios.config";

export const getAllServices = async (token) => {
  let res;
  try {
    await api.get("/service", {
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

export const updateServiceType = async (token, item, id) => {
  let res;
  try {
    await api.put(`./service/${id}`, {
      ...item
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

export const createServiceType = async (token, type) => {
  let res;
  try {
    await api.post('./service/new', {
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

export const getAllServiceForms = async (token) => {
  let res;
  try {
    await api.get('./service-form', {
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

export const getServiceDetails = async (token, id) => {
  let res;
  try {
    await api.get(`./service-form/detail/${id}`, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    }).then(result => res ={...res, result});
  } catch (error) {
    console.log(error);
    res = {...res, error}
  }
  return res;
}

export const updateServiceDetail = async (token, item, id) => {
  let res;
  try {
    await api.put(`./service-form/detail/${id}`, {
      ...item, // service form and type id included
    }, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    }).then(result => res = {...res, result});
  } catch (error) {
    res = {...res, error}
  }
  return res;
}

export const createServiceForm = async (token, reqBody) => {
  let res;
  // const { customer, phone, total, paid, remain, cart } = reqBody;
  try {
    await api.post('./service-form', {
      ...reqBody
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