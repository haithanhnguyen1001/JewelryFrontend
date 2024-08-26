import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import { React, useEffect, useState } from "react";
import { isPhoneNumber } from "../../reducer/form";
import { createSupplier } from "../../api/supplier";
import { useUserStore } from "../../../store";
import Alert from "@mui/material/Alert";

// Use for adding supplier only since the api called is unique
const CreateNewModal = ({ title, suppliers, setRefetch }) => {
  // Fields is an array of multiple objects,
  // each must have these properties: name, label, type, placeholder
  const [submitObj, setSubmitObj] = useState({
    supplierName: "",
    supplierAddress: "",
    supplierPhone: "",
  });
  const [open, setOpen] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [addressError, setAddressError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const token = useUserStore((state) => state.token);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const duplicate = suppliers.findIndex(
      (supplier) => supplier.name === submitObj.supplierName
    );
    if (duplicate !== -1) {
      setErrorMsg("Trùng tên người khác");
      setError(true);
    } else {
      setErrorMsg("");
      setError(false);
    }
  }, [submitObj]);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleSubmit = async () => {
    if (nameError || addressError || phoneError) {
      alert("Nhập đầy đủ các trường.");
      return;
    }
    setIsLoading(true);
    try {
      await createSupplier(token, submitObj);
      alert("Thêm nhà cung cấp thành công")
      setRefetch((prev) => !prev);
    } catch (error) {
      alert("Có lỗi xảy ra");
    }
    setIsLoading(false);

    setSubmitObj({
      supplierName: "",
      supplierAddress: "",
      supplierPhone: "",
    });
    setOpen(false);
  };
  const handleChange = (e) => {
    setSubmitObj({
      ...submitObj,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <Button onClick={handleOpen}>{title}</Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ marginBottom: 3 }}>
            Nhập đầy đủ các thông tin dưới.
          </DialogContentText>

          <TextField
            id="name"
            name="supplierName"
            label="Tên nhà cung cấp"
            fullWidth
            placeholder="Tên nhà cung cấp"
            sx={{ marginTop: 2 }}
            value={submitObj.supplierName}
            onChange={handleChange}
            required
            error={nameError}
            helperText={nameError ? "Vui lòng nhập tên" : ""}
            inputProps={{
              onBlur: () => {
                if (!submitObj.supplierName.length) setNameError(true);
              },
              onFocus: () => {
                setNameError(false);
              },
            }}
          />
          <TextField
            id="address"
            name="supplierAddress"
            label="Địa chỉ nhà cung cấp"
            fullWidth
            placeholder="Địa chỉ nhà cung cấp"
            sx={{ marginTop: 2 }}
            value={submitObj.supplierAddress}
            onChange={handleChange}
            required
            error={addressError}
            helperText={addressError ? "Vui lòng nhập địa chỉ" : ""}
            inputProps={{
              onBlur: () => {
                if (!submitObj.supplierAddress.length) setAddressError(true);
              },
              onFocus: () => {
                setAddressError(false);
              },
            }}
          />
          <TextField
            id="phone"
            name="supplierPhone"
            label="Số điện thoại nhà cung cấp"
            fullWidth
            placeholder="Số điện thoại nhà cung cấp"
            sx={{ marginTop: 2 }}
            value={submitObj.supplierPhone}
            onChange={handleChange}
            required
            error={phoneError}
            helperText={phoneError ? "Kiểm tra lại số điện thoại" : ""}
            inputProps={{
              onBlur: () => {
                if (!submitObj.supplierPhone.length) setPhoneError(true);
                if (!isPhoneNumber(submitObj.supplierPhone))
                  setPhoneError(true);
              },
              onFocus: () => {
                setPhoneError(false);
              },
            }}
          />

          {errorMsg ? <Alert severity="error">{errorMsg}</Alert> : <></>}

          <DialogActions>
            <Button onClick={handleClose}>Hủy</Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              color="success"
              variant="contained"
            >
              Xong
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateNewModal;
