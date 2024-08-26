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
import Dropdown from "../Container/Dropdown";
import { getAllTypes } from "../../api/producttype";
import Alert from "@mui/material/Alert";
import { createProduct } from "../../api/product";
import { createUnit } from "../../api/unit";

// Use for adding supplier only since the api called is unique
const CreateUnitModal = ({ title, products, setRefetch }) => {
  // Fields is an array of multiple objects,
  // each must have these properties: name, label, type, placeholder
  const [submitObj, setSubmitObj] = useState({
    name: "",
  });
  const [open, setOpen] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [priceError, setPriceError] = useState(false);
  const [typeError, setTypeError] = useState(false);
  const token = useUserStore((state) => state.token);
  const [dropdownShow, setDropdownShow] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [productTypes, setProductTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await getAllTypes(token);
        setProductTypes(res.result.data);
        setError(false);
      } catch (err) {
        setError(true);
        console.log(err);
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const duplicate = products.findIndex(
      (type) => type.name === submitObj.name
    );
    if (duplicate !== -1) {
      setErrorMsg("Trùng tên đơn vị khác");
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
    if (nameError || priceError || typeError)
      alert("Vui lòng nhập đủ các trường");
    setIsLoading(true);
    setSubmitObj({
      ...submitObj,
    });
    try {
      await createUnit(token, submitObj);
      setRefetch((prev) => !prev);
      alert("Thêm đơn vị thành công");
    } catch (error) {
      alert("Có lỗi xảy ra");
    }
    setIsLoading(false);

    setSubmitObj({
      name: "",
      ProductTypeId: "",
      typename: "",
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
  const handleChangeType = (e) => {
    setDropdownShow(false);
    submitObj.typename = e.target.value;
  };

  const handleItemPick = (item) => {
    setDropdownShow(true);
    setSubmitObj({
      ...submitObj,
      typename: item.name,
      ProductTypeId: item.id,
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
            label="Tên đơn vị mới"
            fullWidth
            placeholder="Tên đơn vị mới"
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

export default CreateUnitModal;
