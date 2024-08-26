import {
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import React, { useEffect, useState } from "react";
import { ModalContainer } from "../Container";
import { ControlButton } from "../Controls";
import { updateServiceType } from "../../api/service";
import { useUserStore } from "../../../store";

const ServiceTypeUpdateModal = ({ open, onButtonClose, title, data, setRefetch }) => {
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState(0);
  const token = useUserStore(state => state.token);
  // const [priceDisplay, setPriceDisplay] = useState(newPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))

  const modalTitle = (
    <div>
      <Typography variant="h4" component="h4" mt="12px">
        <b>{title}</b>
      </Typography>
    </div>
  );

  useEffect(() => {
    setNewPrice(0);
  }, [open])

  const handleUpdateServiceType = async () => {
    if (!newName && !newPrice) {
      alert("Chưa nhập thông tin gì.");
    }
    let res;
    try {
      await updateServiceType(token, { name: newName, price: newPrice }, data.id).then(result => res = result);
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
    setNewPrice(newPrice + 50000)
    // setPriceDisplay(newPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))
  }
  const handleDecrementPrice = () => {
    setNewPrice(newPrice - 50000)
    // setPriceDisplay(newPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))
  }
  const handleChangePrice = (e) => {
    setNewPrice(Number(e.target.value))
    // setPriceDisplay(newPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))
  }

  return (
    <ModalContainer title={modalTitle} open={open} onClose={onButtonClose}>
      <Stack spacing={3}>
        <Stack direction="row" spacing={1}>
          <TextField
            disabled
            label="Mã loại dịch vụ"
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
            label="Tên loại dịch vụ"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            sx={{ mb: "28px" }}
          />
          <TextField
            variant="outlined"
            id="price"
            label="Giá loại dịch vụ"
            type="text"
            value={newPrice}
            onChange={handleChangePrice}
            InputProps={{
              endAdornment: 
                <>
                  <InputAdornment position="end">₫</InputAdornment>
                  <IconButton color="secondary" sx={{marginLeft: "6px"}} onClick={handleIncrementPrice}><ArrowDropUpIcon fontSize="large" /></IconButton>
                  <IconButton color="secondary" sx={{marginLeft: "6px"}} onClick={handleDecrementPrice}><ArrowDropDownIcon fontSize="large" /></IconButton>
                </>,
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
            onClick={handleUpdateServiceType}
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

export default ServiceTypeUpdateModal;
