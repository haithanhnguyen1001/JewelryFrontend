import { Box, CircularProgress } from '@mui/material'
import React, {useState, useEffect, useMemo } from 'react'
import { getFormatDateString } from "../../utils/date";
import Alert from "@mui/material/Alert";
import { SearchContainer, TableContainer } from "../../components/Container/";
import { ControlButton } from "../../components/Controls";
import { getAllServiceForms } from '../../api/service';
import { useUserStore } from '../../../store';
import ServiceFormDetailModal from '../../components/Modal/ServiceFormDetailModal';
import axios from '../../api/axios.config'

const initialSearchInput =''

const ServiceSearch = ({ show }) => {
  const [open, setOpen] = useState(false);
  const [rowID, setRowID] = useState(0);
  const token = useUserStore((state) => state.token);
  const [formData, setFormData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const username = useUserStore((state) => state.username);

  // getting service forms
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await getAllServiceForms(token).then((res) => {
          console.log(res.result.data);
          setFormData(res.result.data);
        });
        setError(false);
      } catch (err) {
        setError(true);
        console.log(err);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [open]);

  const handleDetailButton = (rowID) => {
    setRowID(rowID);
    handleOpen();
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason !== "backdropClick") {
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
  const handleDelete = async (id) => {
    let result;
    console.log(id);
    try {
      await axios.delete(`./service-form/delete/${id}`, {
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
  const columns = useMemo(
    () => [
      {
        field: "no",
        headerName: "#",
        headerAlign: "center",
        align: "center",
        width: 50,
        disableColumnMenu: true,
      },
      {
        field: "id",
        headerName: "Mã phiếu",
        width: 100,
        disableColumnMenu: true,
      },
      {
        field: "customer",
        headerName: "Khách hàng",
        width: 180,
        disableColumnMenu: true,
      },
      {
        field: "phone",
        headerName: "Số điện thoại",
        width: 120,
        disableColumnMenu: true,
      },
      {
        field: "date",
        headerName: "Ngày lập",
        width: 100,
        disableColumnMenu: true,
      },
      {
        field: "total",
        headerName: "Tổng",
        headerAlign: "center",
        align: "center",
        width: 150,
        sortComparator: (v1, v2) => {
          const num1 = Number(v1.replace(/\D/g, ""));
          const num2 = Number(v2.replace(/\D/g, ""));
          return num1 - num2;
        },
        disableColumnMenu: true,
      },
      {
        field: "paid",
        headerName: "Tổng trả trước",
        headerAlign: "center",
        align: "center",
        width: 150,
        sortComparator: (v1, v2) => {
          const num1 = Number(v1.replace(/\D/g, ""));
          const num2 = Number(v2.replace(/\D/g, ""));
          return num1 - num2;
        },
        disableColumnMenu: true,
      },
      {
        field: "remain",
        headerName: "Tổng còn lại",
        headerAlign: "center",
        align: "center",
        width: 150,
        sortComparator: (v1, v2) => {
          const num1 = Number(v1.replace(/\D/g, ""));
          const num2 = Number(v2.replace(/\D/g, ""));
          return num1 - num2;
        },
        disableColumnMenu: true,
      },
      {
        field: "status",
        headerName: "Tình trạng",
        headerAlign: "center",
        align: "center",
        width: 150,
        disableColumnMenu: true,
      },
      {
        field: "actions",
        type: "actions",
        align: "center",
        width: 200,
        getActions: (param) => [
          <ControlButton
            onClick={() => handleDetailButton(param.row.key)}
            color="secondary"
            variant="text"
          >
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
    [handleDetailButton, formData]
  );

  const rows = useMemo(() => {
    return formData.map((form, index) => {
      return {
        key: index,
        no: index + 1,
        id: form.id,
        customer: form.customer,
        phone: form.phone,
        date: getFormatDateString(form.date),
        total: `₫${form.total.toLocaleString()}`,
        paid: `₫${form.paid.toLocaleString()}`,
        remain: `₫${form.remain.toLocaleString()}`,
        status: form.status,
      };
    });
  }, [formData]);

  console.log("rendered");

  return (
    <SearchContainer
      show={true}
      title="Tra cứu phiếu dịch vụ"
      value={SearchInput}
      onChange={handleSearchInput}
      onClick={deleteSearchInput}
    >
      {isLoading ? (
        <Box sx={{ display: "flex" }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">Có lỗi xảy ra</Alert>
      ) : formData.length > 0 ? (
        <>
          {open ? <ServiceFormDetailModal
            open={open}
            onButtonClose={handleClose}
            title="Phiếu dịch vụ"
            formData={formData[rowID].id}
          /> : <></>}
          <TableContainer
            columns={columns}
            rows={rows}
            SearchInput={SearchInput}
          />
        </>
      ) : (
        <></>
      )}
    </SearchContainer>
  );
};

export default ServiceSearch