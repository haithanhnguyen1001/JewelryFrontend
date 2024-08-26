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
import { updateProduct } from "../../api/product";
import { useUserStore } from "../../../store";
import { updateUnit } from "../../api/unit";

// TODO: call api product type for selection
const UnitUpdateModal = ({ open, onButtonClose, title, data, setRefetch }) => {
  const [newName, setNewName] = useState(data.name);
  const token = useUserStore(state => state.token);
  // const [priceDisplay, setPriceDisplay] = useState(newPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))

  const modalTitle = (
    <div>
      <Typography variant="h4" component="h4" mt="12px">
        <b>{title}</b>
      </Typography>
    </div>
  );


  const handleUpdateProduct = async () => {
    if (!newName) {
      alert("Chưa nhập thông tin gì.");
    }
    let res;
    console.log(newName, data.id);
    try {
      await updateUnit(token, { name: newName }, data.id).then(result => res = result);
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

  return (
    <ModalContainer title={modalTitle} open={open} onClose={onButtonClose}>
      <Stack spacing={3}>
        <Stack direction="row" spacing={1}>
          <TextField
            disabled
            label="Mã"
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
            label="Tên"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            sx={{ mb: "28px" }}
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

export default UnitUpdateModal;
