import { Box, Typography, TextField, Stack, Paper, Divider } from '@mui/material';
import { ModalContainer } from '../Container';
import { getFormatDateString } from '../../utils/date';

const ProductItem = ({ index, productName, productType, price, quantity, subtotal }) => {
  return (
    <>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          mt: '4px',
          mb: '4px',
          fontSize: '1.2rem',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <Box width="5%">{index + 1}</Box>
        <Box width="50%" textAlign="left">
          <div>
            <h3>{productName}</h3>
            <span>({productType})</span>
          </div>
        </Box>
        <Box width="15%">₫{price.toLocaleString()}</Box>
        <Box width="15%">{quantity}</Box>
        <Box width="15%" color="red">
          ₫{subtotal.toLocaleString()}
        </Box>
      </Box>
      <Divider />
    </>
  );
};

const Table = ({ cart }) => {
  return (
    <>
      <Box sx={{ width: '100%', height: '30px', fontSize: '1.4rem', display: 'flex', textAlign: 'center' }}>
        <Box width="5%">
          <b>#</b>
        </Box>
        <Box width="50%" textAlign="left">
          <b>Sản phẩm</b>
        </Box>
        <Box width="15%">
          <b>Đơn giá</b>
        </Box>
        <Box width="15%">
          <b>Số lượng</b>
        </Box>
        <Box width="15%">
          <b>Số tiền</b>
        </Box>
      </Box>
      <Divider />
      <Divider />
      {cart.map((item, index) => (
        <ProductItem
          key={index}
          index={index}
          productName={item.Product?.name}
          productType={item.ProductType?.name}
          price={item.Product?.price}
          quantity={item.quantity}
          subtotal={item.subtotal}
        />
      ))}
    </>
  );
};

const FormDetailModal = ({ onButtonClose, open, title, formData, type }) => {
  const modalTitle = (
    <div>
      <Typography variant="h4" component="h4" mt="12px">
        <b>{title}</b>
      </Typography>
      <Typography variant="subtitle1">Ngày lập: {getFormatDateString(formData.date)}</Typography>
    </div>
  );

  return (
    <ModalContainer title={modalTitle} open={open} onClose={onButtonClose}>
      <Stack spacing={3}>
        <Stack direction="row" spacing={1}>
          <TextField disabled label="Mã hóa đơn" value={formData.id} sx={{ width: '250px' }} />
          {type === 'SellForm' && (
            <TextField disabled label="Khách hàng" value={formData.customer} sx={{ width: '250px' }} />
          )}
        </Stack>
        {type === 'BuyForm' && (
          <>
            <Typography variant="h6">
              <b>Thông tin nhà cung cấp</b>
            </Typography>
            <Stack direction="row" spacing={1}>
              <TextField disabled label="Nhà cung cấp" value={formData.Supplier?.name} sx={{ width: '250px' }} />
              <TextField disabled label="Địa chỉ" value={formData.Supplier?.address} sx={{ width: '250px' }} />
              <TextField disabled label="Số điện thoại" value={formData.Supplier?.phone} sx={{ width: '250px' }} />
            </Stack>
          </>
        )}
        <Paper variant="outlined" sx={{ padding: '16px' }}>
          <Typography sx={{ mb: '28px', fontSize: '1.8rem' }}>
            <b>Giỏ hàng</b>
          </Typography>
          <Table cart={type === 'SellForm' ? formData.SellFormDetails : formData.BuyFormDetails} />
        </Paper>
        <Paper
          variant="outlined"
          sx={{
            display: 'flex',
            flexDirection: 'row',
            padding: '16px',
            alignItems: 'center',
            justifyContent: 'end',
          }}
        >
          <Typography variant="h5">
            Tổng thanh toán ({type === 'SellForm' ? formData?.SellFormDetails.length : formData?.BuyFormDetails.length}{' '}
            sản phẩm):
          </Typography>
          <Typography variant="h5" color="red" ml="4px">
            <b>₫{formData.total.toLocaleString()}</b>
          </Typography>
        </Paper>
      </Stack>
    </ModalContainer>
  );
};

export default FormDetailModal;
