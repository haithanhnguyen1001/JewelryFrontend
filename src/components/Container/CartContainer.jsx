import { Paper, Grid, Typography, Box, Divider, TextField } from '@mui/material';
import { QuantityButton, ControlButton } from '../Controls';
import ProductSelectModal from '../Modal/ProductSelectModal';
import { useEffect, useState } from 'react';
import { isNumberOnly } from '../../reducer/form';
import PrePaidInput from '../Controls/PrePaidInput';
import IncurredValueInput from '../Controls/IncurredValueInput';
const CartContainer = ({
  title,
  productAmount,
  cart,
  handleDecrease,
  handleIncrease,
  handleRemove,
  open,
  AddItem,
  onButtonClick,
  onButtonClose,
  varient, // Chọn giữa ticket / service
  SearchInput,
  handleSearchInput,
  deleteSearchInput,
  buyForm,
  setPrePaidService,
  setIncurredService,
  getPara
}) => {
  // const minumunPrePaid = 0.5;

  const varientChooser = [
    {
      type: 'ticket',
      jsx: (
        <Box
          sx={{
            width: '100%',
            height: '30px',
            fontSize: '1.4rem',
            display: 'flex',
          }}
        >
          <Box width="5%">
            <b>#</b>
          </Box>
          <Box width="40%">
            <b>Sản phẩm</b>
          </Box>
          <Box width="15%" textAlign="center">
            <b>Đơn giá</b>
          </Box>
          <Box width="15%" textAlign="center">
            <b>Số lượng</b>
          </Box>
          <Box width="15%" textAlign="center">
            <b>Số tiền</b>
          </Box>
          <Box width="10%" textAlign="center">
            <b>Thao tác</b>
          </Box>
        </Box>
      ),
      renderCart: (ProductCart) => {
        return ProductCart.map((product, index) => (
          <Grid key={index} item xs={12}>
            <Box
              key={index}
              sx={{
                width: '100%',
                display: 'flex',
                fontSize: '1.2rem',
                alignItems: 'center',
              }}
            >
              <Box width="5%">{index + 1}</Box>
              <Box width="40%">
                <div>
                  <h3>{product.name}</h3>
                  <span>({product.ProductType.name})</span>
                </div>
              </Box>
              <Box width="15%" textAlign="center">
                ₫{product?.price.toLocaleString()}
              </Box>
              <Box width="15%" textAlign="center">
                <QuantityButton
                  value={index}
                  Quantity={product.quantity}
                  handleDecrease={handleDecrease}
                  handleIncrease={handleIncrease}
                />
              </Box>
              <Box width="15%" textAlign="center" color="red">
                ₫{!buyForm ? (product.quantity * product.price * (1 + product.ProductType.interest / 100)).toLocaleString() : (product.quantity * product.price).toLocaleString()}
              </Box>
              <Box width="10%" textAlign="center">
                <ControlButton value={index} variant="textInherit" onClick={handleRemove}>
                  Xóa
                </ControlButton>
              </Box>
            </Box>
            <Divider />
          </Grid>
        ));
      },
    },
    {
      type: 'service',
      jsx: (
        <Box
          sx={{
            width: '100%',
            height: '30px',
            fontSize: '1.4rem',
            display: 'flex',
          }}
        >
          <Box width="5%">
            <b>#</b>
          </Box>
          <Box width="15%">
            <b>Loại dịch vụ</b>
          </Box>
          <Box width="10%" textAlign="center">
            <b>Đơn giá</b>
          </Box>
          <Box width="12%" textAlign="center">
            <b>Phí phát sinh</b>
          </Box>
          <Box width="16%" textAlign="center">
            <b>Số lượng</b>
          </Box>
          <Box width="10%" textAlign="center">
            <b>Thành tiền</b>
          </Box>
          <Box width="12%" textAlign="center">
            <b>Trả trước</b>
          </Box>
          <Box width="10%" textAlign="center">
            <b>Còn lại</b>
          </Box>
          <Box width="10%" textAlign="center">
            <b>Tùy chọn</b>
          </Box>
        </Box>
      ),
      renderCart: (ServiceCart) => {
        console.log(ServiceCart);
        return ServiceCart.map((service, index) => (
          <Grid key={index} item xs={12}>
            <Box
              key={index}
              sx={{
                width: '100%',
                display: 'flex',
                fontSize: '1.2rem',
                alignItems: 'center',
              }}
            >
              <Box width="5%">{index + 1}</Box>
              <Box width="15%">
                <div>
                  <h3>{service.name}</h3>
                </div>
              </Box>
              <Box width="10%" textAlign="center">
                ₫{service.price.toLocaleString()}
              </Box>
              <Box width="12%" textAlign="center">
                <IncurredValueInput
                  serviceId={service.id}
                  setIncurredService={setIncurredService}
                />
              </Box>
              <Box width="16%" textAlign="center">
                <QuantityButton
                  value={index}
                  Quantity={service.quantity}
                  handleDecrease={handleDecrease}
                  handleIncrease={handleIncrease}
                />
              </Box>
              <Box width="10%" textAlign="center" color="red">
                ₫{((service.price + service.incurred) * service.quantity).toLocaleString()}
              </Box>
              <Box width="12%" textAlign="center">
                <PrePaidInput 
                  minumunPrePaid={Number(getPara) / 100} 
                  setPrePaidService={setPrePaidService}  
                  serviceId={service.id}
                  subtotal={(service.price + service.incurred) * service.quantity}
                  maximum={((service.price + service.incurred) * service.quantity)}
                />
              </Box>
              <Box width="10%" textAlign="center">
                ₫{(service.subtotal).toLocaleString()}
              </Box>
              <Box width="10%" textAlign="center">
                <ControlButton value={index} variant="textInherit" onClick={handleRemove}>
                  Xóa
                </ControlButton>
              </Box>
            </Box>
            <Divider />
          </Grid>
        ));
      },
    },
  ];

  const varientIndex = varientChooser.findIndex((element) => element.type === varient);
  const TableHeader = varientChooser[varientIndex].jsx;

  // console.log(cart);

  return (
    <Paper variant="outlined" sx={{ width: 'auto', minHeight: '100px', p: '20px', mt: '12px' }}>
      <Grid container spacing={0.2}>
        <Grid item xs={10.5} mb="40px">
          <Typography sx={{ fontSize: '1.8rem' }}>
            <b>{title}</b>
          </Typography>
        </Grid>
        <Grid item xs={1.5}>
          <ProductSelectModal
            open={open}
            AddItem={AddItem}
            onButtonClick={onButtonClick}
            onButtonClose={onButtonClose}
            varient={varient}
            SearchInput={SearchInput}
            handleSearchInput={handleSearchInput}
            deleteSearchInput={deleteSearchInput}
          />
        </Grid>
        <Grid item xs={12}>
          {TableHeader}
          <Divider />
          <Divider />
          {productAmount === 0 && (
            <Box sx={{ m: '10px', fontSize: '1.6rem', textAlign: 'center' }}>Giỏ hàng trống.</Box>
          )}
        </Grid>
        {varientChooser[varientIndex].renderCart(cart)}
      </Grid>
    </Paper>
  );
};

export default CartContainer;
