import { useEffect, useMemo, useState } from "react";
import { Typography, Box, Skeleton } from "@mui/material";
import { ModalButton, ControlButton, SearchBox } from "../Controls";
import { TableContainer } from "../Container";
import PersonIcon from '@mui/icons-material/Person';
import { useUserStore } from "../../../store";
import { getAllSuppliers } from "../../api/supplier";

export default function SupplierSelectModal({
  onButtonClick,
  onButtonClose,
  open,
  handleAddSupplier
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const token = useUserStore((state) => state.token);
  const [suppliers, setSuppliers] = useState([]);
  const [searchInput, setSearchInput] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await getAllSuppliers(token);
        setSuppliers(res.data);
        setError(false);
      } catch (err) {
        setError(true);
        console.log(err);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [open]);


  const handleModelAddSupplier = (e) => {
    handleAddSupplier(suppliers[e.target.value]);
  }

  const handleSearchInput = (event) => {
    setSearchInput(event.target.value);
  };
  const deleteSearchInput = () => {
    setSearchInput(initialSearchInput);
  };

  const modalTitle = (
    <Box width="100%" display="flex" alignItems="center" mt="8px">
      <Box width="60%">
        <Typography variant="h4" component="h4">
          <b>Chọn nhà cung cấp</b>
        </Typography>
      </Box>
      <SearchBox
        value={searchInput}
        onChange={handleSearchInput}
        onClick={deleteSearchInput}
      />
    </Box>
  );

  // console.log(varient);
  const tableHeading = useMemo(
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
        headerName: "Mã",
        width: 100,
        disableColumnMenu: true,
      },
      {
        field: "name",
        headerName: "Tên",
        width: 300,
        disableColumnMenu: true,
      },
      {
        field: "address",
        headerName: "Địa chỉ",
        width: 150,
        disableColumnMenu: true,
      },
      {
        field: "phone",
        headerName: "Số điện thoại",
        headerAlign: "center",
        align: "center",
        width: 150,
        disableColumnMenu: true,
      },
      {
        field: "actions",
        type: "actions",
        align: "center",
        width: 100,
        getActions: (param) => [
          <ControlButton
            value={param.row.key}
            onClick={handleModelAddSupplier}
            variant="text"
            color="success"
          >
            + Chọn
          </ControlButton>,
        ],
      },
    ],
    [suppliers]
  );

  const tableBody = useMemo(() => {
    return suppliers.map((row, index) => {
      return {
        key: index,
        no: index + 1,
        id: row.id,
        name: row.name,
        address: row.address,
        phone: row.phone,
      };
    })
  }, [suppliers]);

  // console.log(products)
  return (
    <ModalButton
      buttonName="Chọn nhà cung cấp"
      open={open}
      onClick={onButtonClick}
      onClose={onButtonClose}
      startIcon={<PersonIcon />}
      title={modalTitle}
    >
      {isLoading ? (
        <Skeleton variant="rectangular" height={300} width={600} />
      ) : error ? (
        <Alert severity="error">{errMsg ? errMsg : "Có lỗi xảy ra"}</Alert>
      ) : (
        <TableContainer
          columns={tableHeading}
          rows={tableBody}
          SearchInput={searchInput}
        />
      )}
    </ModalButton>
  );
}
