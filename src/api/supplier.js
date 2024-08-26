import api from "./axios.config";

export const getAllSuppliers = async (token) => {
  let res;
  try {
    await api.get('./supplier', {
      headers: {
        Authorization: 'Bearer ' + token
      }
    }).then (result => res = result);
    return res;
  } catch (error) {
    alert("Lỗi xảy ra khi lấy danh sách nhà cung cấp");
    return;
  }
}

export const createSupplier = async (token, supplier) => {
  let res;
  try {
    await api.post("./supplier/create", {
      name: supplier.supplierName,
      address: supplier.supplierAddress,
      phone: supplier.supplierPhone
    }, {
      headers: {
        Authorization: "Bearer " + token
      }
    }).then (result => res = result);
    return res;
  } catch (error) {
    alert("Lỗi xảy ra.")
  }
}

export const updateSupplier = async (token, supplier, id) => {
  let res;
  try {
    await api.put(`./supplier/update/${id}`, {
      ...supplier
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