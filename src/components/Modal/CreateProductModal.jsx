import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { React, useEffect, useState } from "react";
import { useUserStore } from "../../../store";
import Dropdown from "../Container/Dropdown";
import { getAllTypes } from "../../api/producttype";
import Alert from "@mui/material/Alert";
import { createProduct } from "../../api/product";

// Use for adding supplier only since the api called is unique
const CreateProductModal = ({ title, products, setRefetch }) => {
  // Fields is an array of multiple objects,
  // each must have these properties: name, label, type, placeholder
  const [submitObj, setSubmitObj] = useState({
    name: "",
    ProductTypeId: "",
    typename: "",
    price: 0,
  });
  const [open, setOpen] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [priceError, setPriceError] = useState(false);
  const [typeError, setTypeError] = useState(false);
  const token = useUserStore((state) => state.token);
  const [dropdownShow, setDropdownShow] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [currentType, setCurrentType] = useState(0)

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
    if (productTypes.length > 0) {
      setSubmitObj({
        ...submitObj,
        ProductTypeId: productTypes[currentType].id,
        typename: productTypes[currentType].name,
      })
    }
  }, [currentType])

  useEffect(() => {
    const duplicate = products.findIndex(
      (type) => type.name === submitObj.name
    );
    if (duplicate !== -1) {
      setErrorMsg("Trùng tên sản phẩm khác");
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
      price: Number(submitObj.price),
    });
    try {
      await createProduct(token, submitObj);
      setRefetch((prev) => !prev);
      alert("Thêm sản phẩm thành công");
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

  const handleChangeUnit = (e) => {
    setCurrentType(e.target.value);
  }

  console.log(submitObj);
  return (
    <>
      <Button onClick={handleOpen}>{title}</Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ marginBottom: 3 }}>
            Nhập đầy đủ các thông tin dưới.
          </DialogContentText>
          <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="demo-simple-select-standard-label">
                Loại sản phẩm
              </InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={currentType}
                onChange={handleChangeUnit}
                label="Đơn vị"
              >
                {productTypes.map((unit, index) => (
                  <MenuItem key={unit.id} value={index}>
                    {unit.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

          <TextField
            id="name"
            name="name"
            label="Tên sản phẩm"
            fullWidth
            placeholder="Tên sản phẩm"
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
              step: 50000,
              min: 50000,
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

export default CreateProductModal;
