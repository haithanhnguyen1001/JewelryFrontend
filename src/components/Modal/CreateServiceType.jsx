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
import { useUserStore } from "../../../store";
import Alert from "@mui/material/Alert";
import { createServiceType } from "../../api/service";

// Use for adding supplier only since the api called is unique
const CreateServiceType = ({ title, services, setRefetch }) => {
  // Fields is an array of multiple objects,
  // each must have these properties: name, label, type, placeholder
  const [submitObj, setSubmitObj] = useState({
    name: "",
    price: 0,
  });
  const [open, setOpen] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [priceError, setPriceError] = useState(false);
  const token = useUserStore((state) => state.token);
  const [errorMsg, setErrorMsg] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const duplicate = services.findIndex(
      (type) => type.name === submitObj.name
    );
    if (duplicate !== -1) {
      setErrorMsg("Trùng tên loại khác");
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
    if (!submitObj.name.length) {
      alert("Vui lòng nhập đủ các trường");
      return;
    }
    setIsLoading(true);
    setSubmitObj({
      ...submitObj,
      price: Number(submitObj.price),
    });
    console.log(submitObj);
    try {
      const res = await createServiceType(token, submitObj);
      if (res.error) {
        alert("Thêm không thành công")
      } else {
        setRefetch((prev) => !prev);
        alert("Thêm loại dịch vụ thành công");
      }
    } catch (error) {
      alert("Có lỗi xảy ra");
    }
    setIsLoading(false);

    setSubmitObj({
      name: "",
      price: 0,
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
            name="name"
            label="Tên loại dịch vụ"
            fullWidth
            placeholder="Tên loại dịch vụ"
            sx={{ marginTop: 2 }}
            value={submitObj.name}
            onChange={handleChange}
            required
            error={nameError}
            helperText={nameError ? "Vui lòng nhập tên" : ""}
            inputProps={{
              onBlur: () => {
                if (!submitObj.name.length) setNameError(true);
              },
              onFocus: () => {
                setNameError(false);
              },
            }}
          />
          <TextField
            id="price"
            name="price"
            label="Giá"
            fullWidth
            placeholder="Giá"
            sx={{ marginTop: 2 }}
            value={submitObj.supplierAddress}
            onChange={handleChange}
            required
            error={priceError}
            helperText={priceError ? "Vui lòng nhập giá" : ""}
            inputProps={{
              onBlur: () => {
                if (!Number(submitObj.price)) setPriceError(true);
              },
              onFocus: () => {
                setPriceError(false);
              },
              style: {
                fontSize: "1.5rem",
                height: 20,
                textAlign: "center",
              },
              type: "number",
              step: 25000,
              min: 25000,
              inputMode: "numeric",
              pattern: "[0-9]*",
            }}
          />

          {errorMsg ? <Alert severity="error">{errorMsg}</Alert> : <></>}

          <DialogActions sx={{ marginTop: 5 }}>
            <Button onClick={handleClose}>Hủy</Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading || error}
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

export default CreateServiceType;
