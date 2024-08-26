import { Box, Typography, TextField, Stack, Paper, Divider } from '@mui/material';
import { ModalContainer } from '../Container';
import { getFormatDateString } from '../../utils/date';
import { ControlButton } from '../Controls';
import { useUserStore } from '../../../store';
import { getServiceDetails, updateServiceDetail } from '../../api/service';
import { useEffect, useState } from 'react';

const ProductItem = ({ index, item, setRefetch }) => {
  const token = useUserStore(state => state.token);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleUpdateServiceDetail = async () => {
    const currentDate = new Date();
    const sendItem = {...item, deliverDate: currentDate, status: "Đã giao"};
    setIsLoading(true);
    try {
      let res = await updateServiceDetail(token, sendItem, item.ServiceFormId);
      console.log(res);
      if (res.error) {
        alert("Cập nhật không thành công");
      } else {
        alert('Cập nhật thành công');
        setRefetch(prev => !prev);
      }
    } catch (error) {
      alert(error);
      return;
    }
    setIsLoading(false);

  }

  return (
    <>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          mt: '4px',
          mb: '16px',
          fontSize: '1.2rem',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <Box width="5%">{index + 1}</Box>
        <Box width="10%" textAlign="left">
          <div>
            <h3>{item.ServiceType.name}</h3>
          </div>
        </Box>
        <Box width="10%">₫{item.ServiceType.price.toLocaleString()}</Box>
        <Box width="10%">₫{(item.ServiceType.price + item.incurred).toLocaleString()}</Box>
        <Box width="10%">{item.quantity}</Box>
        <Box width="10%">₫{item.subtotal.toLocaleString()}</Box>
        <Box width="10%">₫{item.prePaid.toLocaleString()}</Box>
        <Box width="10%">₫{item.remain.toLocaleString()}</Box>
        <Box width="10%" color="red">
          {item.status}
        </Box>
        <Box width="10%">{item.status === "Đã giao" ? item.deliverDate : <ControlButton
            onClick={() => handleUpdateServiceDetail(item)}
            color="success"
            variant="text"
          >
            <b>Hoàn tất</b>
          </ControlButton>}</Box>
      </Box>
      <Divider />
    </>
  );
};

const Table = ({ cart, setRefetch }) => {
  return (
    <>
      <Box sx={{ width: '100%', height: '50px', fontSize: '1.4rem', display: 'flex', textAlign: 'center' }}>
        <Box width="5%">
          <b>#</b>
        </Box>
        <Box width="10%" textAlign="left">
          <b>Dịch vụ</b>
        </Box>
        <Box width="10%">
          <b>Đơn giá</b>
        </Box>
        <Box width="10%">
          <b>Đơn giá được tính</b>
        </Box>
        <Box width="10%">
          <b>Số lượng</b>
        </Box>
        <Box width="10%">
          <b>Thành tiền</b>
        </Box>
        <Box width="10%">
          <b>Trả trước</b>
        </Box>
        <Box width="10%">
          <b>Còn lại</b>
        </Box>
        <Box width="10%">
          <b>Tình trạng</b>
        </Box>
        <Box width="10%">
          <b>Ngày giao</b>
        </Box>
      </Box>
      <Divider />
      <Divider />
      {cart.map((item, index) => (
        <ProductItem
          key={index}
          index={index}
          item={item}
          setRefetch={setRefetch}
        />
      ))}
    </>
  );
};

const ServiceFormDetailModal = ({ onButtonClose, open, title, formData }) => {
  const [refetch, setRefetch] = useState(false);
  const [details, setDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false);
  const [isComplete, setIsComplete] = useState(true);
  const token = useUserStore(state => state.token);


  useEffect(() => {
    const fetchDetails = async () => {
      let res;
      setIsLoading(true);
      try {
        // formdata ở đây là id phiếu dịch vụ
        res = await getServiceDetails(token, formData);
        if (res) {
          console.log(res);
          setDetails(res.result.data)
          setIsError(false);
        }
      } catch (error) {
        setIsError(true);
        alert("Lấy chi tiết phiếu không thành công");
      }
      setIsLoading(false);
    }
    fetchDetails();
  }, [refetch]);

  useEffect(() => {
    details.forEach(detail => {
      if (detail.status !== "Đã giao") {
        setIsComplete(false);
      }
    })
  }, [details])

  const modalTitle = (
    <div>
      <Typography variant="h4" component="h4" mt="12px">
        <b>{title}</b>
      </Typography>
      <Typography variant="subtitle1">Ngày lập: {getFormatDateString(details.length ? details[0].ServiceForm.date : "...")}</Typography>
    </div>
  );

  return (
    <ModalContainer title={modalTitle} open={open} onClose={onButtonClose}>
      <Stack spacing={3}>
        <Stack direction="row" spacing={1}>
          {details.length ? (
            <>
              <TextField disabled label="Mã phiếu" value={details.length ? details[0].ServiceForm.id : "..."} sx={{ width: '250px' }} />
              <TextField disabled label="Khách hàng" value={details.length ? details[0].ServiceForm.customer : "..."} sx={{ width: '250px' }} />
              <TextField disabled label="Số điện thoại" value={details.length ? details[0].ServiceForm.phone : "..."} sx={{ width: '200px' }} />
            </>
          ) : (
            <></>
          )}
        </Stack>
        <Paper variant="outlined" sx={{ padding: '16px' }}>
          <Typography sx={{ mb: '28px', fontSize: '1.8rem' }}>
            <b>Giỏ hàng</b>
          </Typography>
          <Table cart={details} setRefetch={setRefetch} />
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
          <Typography variant="h5">Tình trạng phiếu: </Typography>
          <Typography variant="h5" color={isComplete ? "green" : "error"} ml="4px">
            <b>{details.length ? details[0].ServiceForm.status : "..."}</b>
          </Typography>
        </Paper>
      </Stack>
    </ModalContainer>
  );
};

export default ServiceFormDetailModal;
