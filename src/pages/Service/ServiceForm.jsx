import { useState, useReducer, useEffect } from 'react';
import formReducer, { isNumberOnly } from '../../reducer/form';
import { FormContainer, CartContainer } from '../../components/Container';
import { Box, Grid, TextField, Typography } from '@mui/material';
import { ControlButton } from '../../components/Controls';
import {
  resetForm,
  handleChange,
  handleDecreaseService,
  handleIncreaseService,
  handleRemoveService,
} from '../../reducer/form_actions';
import { useUserStore } from '../../../store';
import { createServiceForm, getAllServices } from '../../api/service';
import { getParameter, updateParameter } from '../../api/parameter';

const defaultFormFields = {
  serviceFormID: '',
  currentDate: new Date(),
  customerName: '',
  customerPhone: '',
  total: 0,
  prePaid: '',
  remain: 0,
  serviceCart: [],
};

const initialSearchInput = '';

const ServiceForm = ({ show }) => {
  const [state, dispatch] = useReducer(formReducer, defaultFormFields);

  let productAmount = state.serviceCart.length;

  const token = useUserStore(state => state.token);
  const username = useUserStore(state => state.username);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const [getPara, setGetPara] = useState(50);
  const [paraValue, setParaValue] = useState(50)
  const [paraError, setParaError] = useState(false)
  const [triggerRerender, setTriggerRerender] = useState(false)

  const handleParaChange = (e) => {
    setParaValue(e.target.value);
    if (Number(e.target.value) <= 0 || Number(e.target.value) >= 100) {
      setParaError(true);
    } else {
      setParaError(false);
    }
  }
  const fetchPara = async () => {
    let res = await getParameter(token);
    if (res) {
      setGetPara(res.result.data.value);
    }
  }
  
  useEffect(() => {
    console.log("use effect fetch sent");
    fetchPara();
  }, []);
  const handleUpdatePara = async () => {
    if (paraValue <= 0 || paraValue >= 100) {
      alert("Giá trị không hợp lệ");
      return;
    }
    let res = await updateParameter(token, Number(paraValue));
    if (!res.error) {
      alert("Cập nhật thành công");
    }else {
      alert("Cập nhật thất bại");
    }
    console.log(res);
    fetchPara();
  }

  // useEffect(() => {

  // }, [triggerRerender])

  // Modal Button
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = (event, reason) => {
    if (reason !== 'backdropClick') {
      setOpen(false);
    }
  };
  const handleSubmit = async () => {
    let reqBody;
    let res;
    let indexError = 0;
    if (state.customerName === "" || state.customerPhone === "") {
      alert("Nhập thông tin khách hàng")
      return;
    }
    else if (state.serviceCart.length === 0) {
      alert("Chưa chọn dịch vụ nào");
      return;
    }
    state.serviceCart.map((item, index) => {
      if (item.prePaid < ((item.price + item.incurred) * item.quantity * getPara / 100) || item.prePaid > item.subtotal) {
        alert(`Trả trước dịch vụ ${index + 1} tối thiểu ${getPara}%`);
        indexError = true;
      }
    });
    if (indexError) {
      return;
    }
    let modifiedCart = state.serviceCart.map(item => {
      return {
        ServiceTypeId: item.id,
        incurred: item.incurred,
        quantity: item.quantity,
        subtotal: (item.incurred + item.price) * item.quantity,
        prePaid: item.prePaid,
        remain: (item.incurred + item.price) * item.quantity - item.prePaid,
      }
    });
    reqBody = {
      customer: state.customerName,
      phone: state.customerPhone,
      total: modifiedCart.reduce((total, item) => total + item.subtotal, 0),
      paid: modifiedCart.reduce((totalPaid, item) => totalPaid + item.prePaid, 0),
      remain: modifiedCart.reduce((totalRemain, item) => totalRemain + item.remain, 0),
      cart: modifiedCart
    };
    console.log(reqBody);

    try {
      res = await createServiceForm(token, reqBody).then(result => res = result);
      console.log(res);
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


  const handleAddService = (service) => {
    dispatch({
      type: 'add_service',
      payload: {
        toAddService: service
      }
    })
  }

  const setPrePaidService = (id, value) => {
    dispatch({
      type: 'set_pre_paid_service',
      payload: {
        id,
        value,
        para: getPara
      }
    });
    setTriggerRerender(prev => !prev);
  }
  const setIncurredService = (id, value) => {
    
    dispatch({
      type: 'set_incurred_service',
      payload: {
        id,
        value,
      }
    })
  }

  // SearchBox
  const [SearchInput, setSearchInput] = useState(initialSearchInput);

  const handleSearchInput = (event) => {
    setSearchInput(event.target.value);
  };

  const deleteSearchInput = () => {
    setSearchInput(initialSearchInput);
  };

  // console.log(token);
  // console.log(state.serviceCart);

  return (
    <FormContainer
      show={show}
      title="Lập phiếu dịch vụ"
      formID={state.sellFormID}
      currentDate={state.currentDate}
      totalPrice={state.total}
      productAmount={productAmount}
      resetForm={() => resetForm(dispatch, defaultFormFields)}
      submitForm={handleSubmit}
    >
      <Grid item xs={12} marginLeft="10px" sx={{
        display: 'flex',
        justifyContent: 'space-between',
      }}>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <TextField
            label="Tên khách hàng"
            placeholder="Nhập tên"
            name="customerName"
            value={state.customerName}
            onChange={(e) => handleChange(dispatch, e)}
            sx={{ width: '250px' }}
          />
          <TextField
            label="Số điện thoại"
            placeholder="Nhập số điện thoại"
            name="customerPhone"
            value={state.customerPhone}
            onChange={(e) => handleChange(dispatch, e)}
            sx={{ width: '250px', marginTop: '12px' }}
          />
        </Box>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <Typography
          sx={{
            fontSize: '1.6rem',
          }}>Quy định trả trước tối thiểu <span style={{color: 'red', fontSize: "1.8rem", fontWeight:600}}>{getPara}</span>%, thay đổi:</Typography>
          <TextField
            label=""
            placeholder="Nhập giá trị mới"
            name="paravalue"
            value={paraValue}
            error={paraError}
            helperText={paraError ? "Không hợp lệ" : ""}
            onChange={handleParaChange}
            sx={{ width: '100px', marginTop: '12px', marginBottom: '12px' }}
            disabled={username !== "admin"}
            inputProps={{
              style: {
                fontSize: "1.5rem",
                height: 20,
                textAlign: "center",
              },
              type: "number",
              step: 1,
              min: 0,
              max: 100,
              inputMode: "numeric",
              pattern: "[0-9]*",
            }}
          />
          <ControlButton
            color="success"
            onClick={handleUpdatePara}
            disabled={username !== "admin"}
          >Cập nhật</ControlButton>
        </Box>
      </Grid>
      <Grid item xs={5} marginLeft="10px">
        
      </Grid>
      <Grid item xs={12}>
        {/* Gio Hang */}
        <CartContainer
          title="Dịch vụ"
          productAmount={productAmount}
          cart={state.serviceCart}
          handleDecrease={(e) => handleDecreaseService(dispatch, e, state)}
          handleIncrease={(e) => handleIncreaseService(dispatch, e, state)}
          handleRemove={(e) => handleRemoveService(dispatch, e, state)}
          open={open}
          AddItem={handleAddService}
          onButtonClick={handleClickOpen}
          onButtonClose={handleClose}
          varient="service"
          // Cho Search Box
          SearchInput={SearchInput}
          handleSearchInput={handleSearchInput}
          deleteSearchInput={deleteSearchInput}
          setPrePaidService={setPrePaidService}
          setIncurredService={setIncurredService}
          getPara={getPara}
        ></CartContainer>
      </Grid>
    </FormContainer>
  );
};

export default ServiceForm;
