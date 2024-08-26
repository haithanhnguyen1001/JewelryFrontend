import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { React, useEffect, useState } from "react";
import { useUserStore } from "../../../store";
import Alert from "@mui/material/Alert";
import { createProductType } from "../../api/producttype";
import { getAllUnits } from "../../api/unit";

// Use for adding supplier only since the api called is unique
const CreateProductTypeModal = ({ title, producttypes, setRefetch }) => {
  // Fields is an array of multiple objects,
  // each must have these properties: name, label, type, placeholder
  const [submitObj, setSubmitObj] = useState({
    name: "",
    unit: "",
    interest: 0,
    UnitId: "",
  });
  const [open, setOpen] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [interestError, setInterestError] = useState(false);
  const [unitError, setUnitError] = useState(false);
  const token = useUserStore((state) => state.token);
  const [errorMsg, setErrorMsg] = useState("");
  const [units, setUnits] = useState([])
  const [currentUnit, setCurrentUnit] = useState(0)

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchUnit = async() => {
      let res;
      try {
        res = await getAllUnits(token);
        if (res) {
          setUnits(res.data);
        }
      } catch (error) {
        alert("Lỗi xảy ra khi lấy danh sách đơn vị")
        return
      }
    }
    fetchUnit()
  }, [])

  useEffect(() => {
    if (units.length > 0) {
      setSubmitObj({
        ...submitObj,
        unit: units[currentUnit].name,
        UnitId: units[currentUnit].id,
      })
    }
  }, [currentUnit])
  

  useEffect(() => {
    const duplicate = producttypes.findIndex(
      (type) => type.name === submitObj.name
    );
    if (duplicate !== -1) {
      setErrorMsg("Trùng tên loại sản phẩm khác");
      setError(true);
    }
    else {
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
    if (!submitObj.name || !submitObj.unit || !submitObj.interest) {
      alert("Vui lòng nhập đủ các trường");
      return;
    }
    setIsLoading(true);
    setSubmitObj({
      ...submitObj,
      interest: Number(submitObj.interest),
    });
    try {
      await createProductType(token, submitObj);
      setRefetch((prev) => !prev);
      alert("Thêm loại sản phẩm thành công");
    } catch (error) {
      alert("Có lỗi xảy ra");
    }
    setIsLoading(false);

    setSubmitObj({
      name: "",
      unit: "",
      interest: 0,
    });
    setOpen(false);
  };
  const handleChange = (e) => {
    setSubmitObj({
      ...submitObj,
      [e.target.name]: e.target.value,
    });
  };
  const handleChangeUnit = (e) => {
    setCurrentUnit(e.target.value);
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

          <TextField
            id="name"
            name="name"
            label="Tên loại sản phẩm"
            fullWidth
            placeholder="Tên loại sản phẩm"
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
          <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="demo-simple-select-standard-label">
                Đơn vị
              </InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={currentUnit}
                onChange={handleChangeUnit}
                label="Đơn vị"
              >
                {units.map((unit, index) => (
                  <MenuItem key={unit.id} value={index}>
                    {unit.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          <TextField
            id="interest"
            name="interest"
            label="Phần trăm lợi nhuận"
            fullWidth
            placeholder="Phần trăm lợi nhuận"
            sx={{ marginTop: 2 }}
            value={submitObj.supplierAddress}
            onChange={handleChange}
            required
            error={interestError}
            helperText={
              interestError ? "Vui lòng nhập phần trăm lợi nhuận" : ""
            }
            inputProps={{
              onBlur: () => {
                if (!Number(submitObj.interest)) setInterestError(true);
              },
              onFocus: () => {
                setInterestError(false);
              },
              style: {
                fontSize: "1.5rem",
                height: 20,
                textAlign: "center",
              },
              type: "number",
              step: 1,
              min: 1,
              max: 100,
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

export default CreateProductTypeModal;
