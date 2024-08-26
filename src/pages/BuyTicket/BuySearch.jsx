import { useState, useMemo, useEffect } from 'react';
import { Typography } from '@mui/material';
import { Box, CircularProgress, Alert } from '@mui/material';
import { SearchContainer, TableContainer } from '../../components/Container/';
import { ControlButton } from '../../components/Controls';
import FormDetailModal from '../../components/Modal/FormDetailModal';
import { useUserStore } from '../../../store';
import { getAllBuyForms } from '../../api/buy';
import { getFormatDateString } from '../../utils/date';
import axios from '../../api/axios.config'

const initialSearchInput = '';

const BuySearch = ({ show }) => {
  const [open, setOpen] = useState(false);
  const [rowID, setRowID] = useState(0);
  const token = useUserStore((state) => state.token);
  const username = useUserStore((state) => state.username);
  const [formData, setFormData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  // getting buy forms
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await getAllBuyForms(token).then((res) => {
          setFormData(res.data);
        });
        setError(false);
      } catch (err) {
        setError(true);
        console.log(err);
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);
  const handleDelete = async (id) => {
    let result;
    console.log(id);
    try {
      await axios.delete(`./buy/delete/${id}`, {
        headers: {
          Authorization: 'Bearer ' + token
        }
      });
      setIsLoading(prev => !prev);
      alert("Xóa thành công");
      setIsLoading(prev => !prev);
      return;
    } catch (error) {
      console.log(error);
      alert("Xóa không thành công");
      return;
    }
  }

  const handleDetailButton = (rowID) => {
    setRowID(rowID);
    handleOpen();
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason !== 'backdropClick') {
      setOpen(false);
    }
  };

  // SearchBox
  const [SearchInput, setSearchInput] = useState(initialSearchInput);

  const handleSearchInput = (event) => {
    setSearchInput(event.target.value);
  };

  const deleteSearchInput = () => {
    setSearchInput(initialSearchInput);
  };
  console.log(formData)

  // Data
  const columns = useMemo(
    () => [
      {
        field: 'no',
        headerName: '#',
        headerAlign: 'center',
        align: 'center',
        width: 50,
        disableColumnMenu: true,
      },
      {
        field: 'id',
        headerName: 'Mã phiếu',
        width: 200,
        disableColumnMenu: true,
      },
      {
        field: 'supplierName',
        headerName: 'Nhà cung cấp',
        width: 200,
        disableColumnMenu: true,
      },
      {
        field: 'totalPaid',
        headerName: 'Tổng thanh toán',
        headerAlign: 'center',
        align: 'center',
        width: 200,
        sortComparator: (v1, v2) => {
          const num1 = Number(v1.replace(/\D/g, ''));
          const num2 = Number(v2.replace(/\D/g, ''));
          return num1 - num2;
        },
        disableColumnMenu: true,
      },
      {
        field: 'date',
        headerName: 'Ngày thanh toán',
        headerAlign: 'center',
        align: 'center',
        width: 200,
        disableColumnMenu: true,
      },
      {
        field: 'actions',
        type: 'actions',
        align: 'center',
        width: 200,
        getActions: (param) => [
          <ControlButton onClick={() => handleDetailButton(param.row.key)} color="secondary" variant="text">
            <b>Chi tiết</b>
          </ControlButton>,
          <ControlButton
            onClick={() => handleDelete(formData[param.row.key].id)}
            color="error"
            variant="text"
            disabled={(username != "admin")}
          >
            <b>Xóa</b>
          </ControlButton>,
        ],
      },
    ],
    [handleDetailButton],
  );

  const rows = useMemo(() => {
    return formData.map((form, index) => {
      return {
        key: index,
        no: index + 1,
        id: form.id,
        supplierName: form?.Supplier?.name,
        totalPaid: `₫${form.total.toLocaleString()}`,
        date: getFormatDateString(form.date),
      };
    });
  }, [formData]);
  return (
    <SearchContainer
      show={show}
      title="Tra cứu phiếu mua"
      value={SearchInput}
      onChange={handleSearchInput}
      onClick={deleteSearchInput}
    >
      {isLoading ? (
        <Box sx={{ display: 'flex' }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">Có lỗi xảy ra</Alert>
      ) : formData.length > 0 ? (
        <>
          <FormDetailModal
            open={open}
            onButtonClose={handleClose}
            title="Phiếu mua hàng"
            formData={formData[rowID]}
            type="BuyForm"
          />
          <TableContainer columns={columns} rows={rows} SearchInput={SearchInput} />
        </>
      ) : (
        <></>
      )}
    </SearchContainer>
  );
};

export default BuySearch;
