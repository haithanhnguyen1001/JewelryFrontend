import {
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { ModalContainer } from "../Container";
import { ControlButton } from "../Controls";
import { useUserStore } from "../../../store";
import { updateSupplier } from "../../api/supplier";


const SupplierUpdateModal = ({ open, onButtonClose, title, data, setRefetch }) => {
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [nameError, setNameError] = useState(false);
  const [addressError, setAddressError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
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
    setNewName("");
    setNewPhone("");
    setNewAddress("");
  }, [open])

  const handleUpdateSupplier = async () => {
    if (!newName && !newPhone && !newAddress) {
      alert("Chưa nhập thông tin gì.");
      return;
    }
    let res;
    try {
      await updateSupplier(token, { name: newName, phone: newPhone, address: newAddress }, data.id).then(result => res = result);
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
      return;
    }
  };

  return (
    <ModalContainer title={modalTitle} open={open} onClose={onButtonClose}>
      <Stack spacing={3}>
        <Stack direction="row" spacing={1}>
          <TextField
            disabled
            label="Mã nhà cung cấp"
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
            id="name"
            label="Tên nhà cung cấp"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            sx={{ mb: "28px" }}
            required
            error={nameError}
            helperText={nameError ? "Vui lòng nhập tên" : ""}
            inputProps={{
              onBlur: () => {
                if (!newName.length) setNameError(true);
              },
              onFocus: () => {
                setNameError(false);
              },
            }}
          />
          <TextField
            variant="outlined"
            id="address"
            label="Địa chỉ"
            value={newAddress}
            onChange={(e) => setNewAddress(e.target.value)}
            sx={{ mb: "28px" }}
            required
            error={addressError}
            helperText={addressError ? "Vui lòng nhập địa chỉ" : ""}
            inputProps={{
              onBlur: () => {
                if (!newAddress.length) setAddressError(true);
              },
              onFocus: () => {
                setAddressError(false);
              },
            }}
          />
          <TextField
            variant="outlined"
            id="phone"
            label="Số điện thoại"
            value={newPhone}
            onChange={(e) => setNewPhone(e.target.value)}
            sx={{ mb: "28px" }}
            required
            error={phoneError}
            helperText={phoneError ? "Kiểm tra lại số điện thoại" : ""}
            inputProps={{
              onBlur: () => {
                if (!newPhone.length) setPhoneError(true);
                if (!isPhoneNumber(newPhone))
                  setPhoneError(true);
              },
              onFocus: () => {
                setPhoneError(false);
              },
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
            onClick={handleUpdateSupplier}
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

export default SupplierUpdateModal;
