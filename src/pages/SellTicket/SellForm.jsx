import { useEffect, useReducer, useState } from "react";
import { Grid, TextField } from "@mui/material";
import { FormContainer, CartContainer } from "../../components/Container";
import formReducer from "../../reducer/form";
import {
  resetForm,
  handleChange,
  handleRemove,
  handleDecrease,
  handleIncrease,
} from "../../reducer/form_actions";
import { createSellForm } from "../../api/sell";
import { useUserStore } from "../../../store";

const defaultFormFields = {
  date: new Date(),
  customer: "",
  cart: [],
  total: 0,
};

const initialSearchInput = "";

const SellForm = ({ show }) => {
  const [state, dispatch] = useReducer(formReducer, defaultFormFields);
  const token = useUserStore(state => state.token);

  // Dispatches
  let productAmount = state.cart.length;

  // Modal Button
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason !== "backdropClick") {
      setOpen(false);
    }
  };

  const handleAdd = (toAddProduct) => {
    console.log(toAddProduct);
    dispatch({
      type: "add_product",
      payload: {
        toAddProduct,
      },
    });
  };

  const handleSellSubmit = async () => {
    let reqBody;
    let res;
    let outStockFlag = false;
    if (state.customer === "") {
      alert("Chưa nhập tên khách hàng");
      return;
    }
    if (state.cart.length === 0) {
      alert("Giỏ hàng trống");
      return;
    }
    console.log(state.cart);
    let modifiedCart = state.cart.map((item) => {
      if (item.stock < item.quantity) {
        outStockFlag = true;
      }
      return {
        ProductId: item.id,
        ProductTypeId: item.ProductTypeId,
        quantity: item.quantity,
        subtotal:
          item.quantity * item.price * (1 + item.ProductType.interest / 100),
      };
    });
    if (outStockFlag) {
      alert("Sản phẩm trong kho không đủ.");
      return;
    }
    reqBody = {
      customer: state.customer,
      cart: modifiedCart,
      total: state.total,
    };

    // console.log(reqBody);

    try {
      res = await createSellForm(token, reqBody).then(result => res = result);
      if (res.error) {
        alert("Nhận phiếu không thành");
      } else {
        alert("Nhận phiếu thành công.");
      }
    } catch (error) {
      alert("Có lỗi xảy ra.");
      console.log(error);
    }
    console.log(res);
    resetForm(dispatch, defaultFormFields);
  };

  // SearchBox
  const [SearchInput, setSearchInput] = useState(initialSearchInput);

  const handleSearchInput = (event) => {
    setSearchInput(event.target.value);
  };

  const deleteSearchInput = () => {
    setSearchInput(initialSearchInput);
  };

  // console.log(state);

  return (
    <FormContainer
      show={show}
      title="Lập phiếu bán hàng"
      currentDate={state.date}
      formID={state.sellFormID}
      totalPrice={state.total}
      productAmount={productAmount}
      resetForm={() => resetForm(dispatch, defaultFormFields)}
      submitForm={handleSellSubmit}
    >
      <Grid item xs={12}>
        <TextField
          label="Khách hàng"
          placeholder="Nhập tên"
          name="customer"
          value={state.customer}
          onChange={(e) => handleChange(dispatch, e)}
          sx={{ width: "250px" }}
        />
      </Grid>
      <Grid item xs={12}>
        {/* Gio Hang */}
        <CartContainer
          title="Giỏ hàng"
          productAmount={productAmount}
          cart={state.cart}
          // Thay doi so luong, xoa san pham trong productCart
          handleDecrease={(e) => handleDecrease(dispatch, e, state)}
          handleIncrease={(e) => handleIncrease(dispatch, e, state)}
          handleRemove={(e) => handleRemove(dispatch, e, state)}
          // Cho Modal Select
          open={open}
          AddItem={handleAdd}
          onButtonClick={handleClickOpen}
          onButtonClose={handleClose}
          varient="ticket"
          // Cho Search Box
          SearchInput={SearchInput}
          handleSearchInput={handleSearchInput}
          deleteSearchInput={deleteSearchInput}
        />
      </Grid>
    </FormContainer>
  );
};

export default SellForm;
