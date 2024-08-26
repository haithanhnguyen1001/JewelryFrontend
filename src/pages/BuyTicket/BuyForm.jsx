import { useReducer, useState } from 'react';
import { Grid } from '@mui/material';
import { FormContainer, CartContainer } from '../../components/Container';
import formReducer from '../../reducer/form';
import {
  resetForm,
  handleChange,
  handleDecrease,
  handleIncrease,
  handleRemove,
} from '../../reducer/form_actions';
import SupplierSelectModal from '../../components/Modal/SupplierSelectModal';
import { useUserStore } from '../../../store';
import { createBuyForm } from '../../api/buy';

const defaultFormFields = {
  date: new Date(),
  id: '',
  name: '',
  address: '',
  phone: '',
  cart: [],
  total: 0,
};

const initialSearchInput = '';


const BuyForm = ({ show }) => {
  const [state, dispatch] = useReducer(formReducer, defaultFormFields);
  const token = useUserStore(state => state.token);

  let productAmount = state.cart.length;

  const handleSubmitBuy = async () => {
    let reqBody;
    let res;
    if (state.id === "") {
      alert("Chưa chọn nhà cung cấp");
      return;
    }
    else if (state.cart.length === 0) {
      alert("Giỏ hàng trống");
      return;
    }
    let modifiedCart = state.cart.map((item) => {
      return {
        ProductId: item.id,
        ProductTypeId: item.ProductTypeId,
        quantity: item.quantity,
        subtotal:
          item.quantity * item.price,
      };
    });
    reqBody = {
      SupplierId: state.id,
      cart: modifiedCart,
      total: state.total,
    };

    // console.log(reqBody);

    try {
      res = await createBuyForm(token, reqBody).then(result => res = result);
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
  }

  // INFO: Modal Button
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = (event, reason) => {
    if (reason !== 'backdropClick') {
      setOpen(false);
    }
  };
  // INFO: Supplier Modal 
  const [supplierSelectOpen, setSupplierSelectOpen] = useState(false);
  const handleSupplierClickOpen = () => {
    setSupplierSelectOpen(true);
  };
  const handleSupplierClose = (event, reason) => {
    if (reason !== 'backdropClick') {
      setSupplierSelectOpen(false);
    }
  };

  // INFO: Supliers
  const handleAddSupplier = (supplier) => {
    
    dispatch({
      type: "supplier_pick",
      payload: {
        supplier
      }
    });
    setSupplierSelectOpen(false);
  }


  // INFO: Products
  const handleAdd = (toAddProduct) => {
    console.log(toAddProduct);
    dispatch({
      type: "add_product",
      payload: {
        toAddProduct,
        formType: "buyform"
      },
    });
  };

  // SearchBox
  const [SearchInput, setSearchInput] = useState(initialSearchInput);

  const handleSearchInput = (event) => {
    setSearchInput(event.target.value);
  };

  const deleteSearchInput = () => {
    setSearchInput(initialSearchInput);
  };

  console.log(state);

  return (
    <FormContainer
      show={show}
      title="Lập phiếu mua hàng"
      currentDate={state.date}
      totalPrice={state.total}
      productAmount={productAmount}
      resetForm={() => resetForm(dispatch, defaultFormFields)}
      submitForm={handleSubmitBuy}
    >
      <Grid item xs={7.5} marginLeft="10px">
        <SupplierSelectModal
          open={supplierSelectOpen}
          onButtonClick={handleSupplierClickOpen}
          onButtonClose={handleSupplierClose}
          handleAddSupplier={handleAddSupplier}
        />
      </Grid>
      <Grid item xs={4}>
      </Grid>
      <Grid item xs={4}>
        <h2>Tên: {state.name ? state.name : "Chưa chọn" }</h2>
      </Grid>
      <Grid item xs={4}>
        <h2>Địa chỉ: {state.address ? state.address : "Chưa chọn" }</h2>
      </Grid>
      <Grid item xs={4}>
        <h2>Số điện thoại: {state.phone ? state.phone : "Chưa chọn" }</h2>
      </Grid>
      <Grid item xs={12}>
        {/* Gio Hang */}
        <CartContainer
          title="Giỏ hàng"
          productAmount={productAmount}
          cart={state.cart}
          // Thay doi so luong, xoa san pham trong productCart
          handleDecrease={(e) => handleDecrease(dispatch, e, state, "buyform")}
          handleIncrease={(e) => handleIncrease(dispatch, e, state, "buyform")}
          handleRemove={(e) => handleRemove(dispatch, e, state, "buyform")}
          // Cho Modal Select
          open={open}
          AddItem={handleAdd}
          onButtonClick={handleClickOpen}
          onButtonClose={handleClose}
          varient="ticket"
          buyForm={true}
          // Cho Search Box
          SearchInput={SearchInput}
          handleSearchInput={handleSearchInput}
          deleteSearchInput={deleteSearchInput}
        />
      </Grid>
    </FormContainer>
  );
};

export default BuyForm;
