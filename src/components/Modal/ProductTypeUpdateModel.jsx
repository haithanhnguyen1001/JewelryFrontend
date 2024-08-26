import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import React, { useEffect, useState } from "react";
import { ModalContainer } from "../Container";
import { ControlButton } from "../Controls";
import { updateProductType } from "../../api/producttype";
import { useUserStore } from "../../../store";
import { getAllUnits } from "../../api/unit";

const ProductTypeUpdateModal = ({ open, onButtonClose, title, data, setRefetch }) => {
  const [newName, setNewName] = useState("");
  const [newUnit, setNewUnit] = useState("");
  const [newUnitId, setNewUnitId] = useState("");
  const [newIntereset, setNewIntereset] = useState(data.interest);
  const token = useUserStore(state => state.token);
  const [currentUnit, setCurrentUnit] = useState(0)
  const [units, setUnits] = useState([])
  // const [priceDisplay, setPriceDisplay] = useState(newPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))

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
      setNewUnitId(units[currentUnit].id);
      setNewUnit(units[currentUnit].name);
    }
  }, [currentUnit])

  const modalTitle = (
    <div>
      <Typography variant="h4" component="h4" mt="12px">
        <b>{title}</b>
      </Typography>
    </div>
  );

  useEffect(() => {
    setNewIntereset(0);
  }, [open])

  const handleChangeUnit = (e) => {
    setCurrentUnit(e.target.value);
  }

  const handleUpdateProduct = async () => {
    if (!newName && !newUnit && !newIntereset && !newUnitId) {
      alert("Chưa nhập thông tin gì.");
    }
    let res;
    try {
      await updateProductType(token, { name: newName, unit: newUnit, interest: newIntereset, UnitId: newUnitId }, data.id).then(result => res = result);
      console.log(res);
      if (res.error) {
        alert("Chỉnh sửa không thành công", res?.error?.response?.data);
      } else {
        setRefetch(prev => !prev);
        alert("Chỉnh sửa thành công");
      }
      onButtonClose();
    } catch (error) {
      alert(error);
    }
  };

  const handleIncrementPrice = () => {
    setNewIntereset(newIntereset + 1)
    // setPriceDisplay(newIntereset.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))
  }
  const handleDecrementPrice = () => {
    if (newIntereset > 1) {
      setNewIntereset(newIntereset - 1)
    }
    // setPriceDisplay(newIntereset.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))
  }
  const handleChangeInterest = (e) => {
    setNewIntereset(Number(e.target.value))
    // setPriceDisplay(newIntereset.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))
  }

  return (
    <ModalContainer title={modalTitle} open={open} onClose={onButtonClose}>
      <Stack spacing={3}>
        <Stack direction="row" spacing={1}>
          <TextField
            disabled
            label="Mã sản phẩm"
            value={data.id}
            sx={{ width: "250px" }}
          />
        </Stack>
        <Paper variant="outlined" sx={{ padding: "16px", display: "flex", flexDirection: 'column' }}>
          <Typography sx={{ mb: "28px", fontSize: "2.4rem" }}>
            <b>Điền thông tin chỉnh sửa</b>
          </Typography>
          <TextField
            variant="outlined"
            id="id"
            label="Tên loại sản phẩm"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            sx={{ mb: "28px" }}
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
            variant="outlined"
            id="price"
            label="Phần trăm loại sản phẩm"
            type="text"
            value={newIntereset}
            onChange={handleChangeInterest}
            InputProps={{
              endAdornment: 
                <>
                  <InputAdornment position="end">₫</InputAdornment>
                  <IconButton color="secondary" sx={{marginLeft: "6px"}} onClick={handleIncrementPrice}><ArrowDropUpIcon fontSize="large" /></IconButton>
                  <IconButton color="secondary" sx={{marginLeft: "6px"}} onClick={handleDecrementPrice}><ArrowDropDownIcon fontSize="large" /></IconButton>
                </>,
            }}
            sx={{
              marginTop: '24px'
            }}
          />
        </Paper>
        <Paper
          variant="outlined"
          sx={{
            display: "flex",
            flexDirection: "row",
            padding: "16px",
            alignItems: "center",
            justifyContent: "end",
          }}
        >
          <ControlButton 
            onClick={handleUpdateProduct}
            color='success'
            width={130}
            fontSize={14}
            height={40}
          >Xong</ControlButton>
        </Paper>
      </Stack>
    </ModalContainer>
  );
};

export default ProductTypeUpdateModal;
