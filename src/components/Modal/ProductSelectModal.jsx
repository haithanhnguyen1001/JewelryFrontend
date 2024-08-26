import { useEffect, useMemo, useState } from "react";
import { Typography, Box, Skeleton, Alert } from "@mui/material";
import { ModalButton, ControlButton, SearchBox } from "../Controls";
import { TableContainer } from "../Container";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { getAllProducts } from "../../api/product";
import { useUserStore } from "../../../store";
import { getAllServices } from "../../api/service";

export default function ProductSelectModal({
  AddItem,
  onButtonClick,
  onButtonClose,
  open,
  varient,
  SearchInput = "",
  handleSearchInput,
  deleteSearchInput,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const token = useUserStore((state) => state.token);
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (varient === "ticket") {
          const res = await getAllProducts(token);
          setProducts(res.data);
        } else if (varient === "service") {
          const res = await getAllServices(token);
          setServices(res.result.data);
        }
        setError(false);
      } catch (err) {
        setError(true);
        console.log(err);
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const handleAdd = (e) => {
    if (varient === "service") {
      AddItem(services[e.target.value]);
    } else {
      AddItem(products[e.target.value]);
    }
  };

  const modalTitle = (
    <Box width="100%" display="flex" alignItems="center" mt="8px">
      <Box width="60%">
        <Typography variant="h4" component="h4">
          <b>Thêm sản phẩm</b>
        </Typography>
      </Box>
      <SearchBox
        value={SearchInput}
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
      ...(varient === "ticket"
        ? [
            {
              field: "id",
              headerName: "Mã sản phẩm",
              width: 100,
              disableColumnMenu: true,
            },
            {
              field: "name",
              headerName: "Tên sản phẩm",
              width: 300,
              disableColumnMenu: true,
            },
            {
              field: "type",
              headerName: "Loại sản phẩm",
              width: 150,
              disableColumnMenu: true,
            },
          ]
        : [
            {
              field: "id",
              headerName: "Mã loại dịch vụ",
              width: 200,
              disableColumnMenu: true,
            },
            {
              field: "name",
              headerName: "Tên loại dịch vụ",
              width: 300,
              disableColumnMenu: true,
            },
          ]),
      {
        field: "price",
        headerName: "Đơn giá",
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
        field: "actions",
        type: "actions",
        align: "center",
        width: 100,
        getActions: (param) => [
          <ControlButton
            value={param.row.key}
            onClick={handleAdd}
            variant="text"
            color="success"
          >
            + Thêm
          </ControlButton>,
        ],
      },
    ],
    [products, services]
  );
  console.log(products.length);

  const tableBody = useMemo(() => {
    if (products.length || services.length) {
      return varient === "ticket"
        ? products.map((row, index) => {
            return {
              key: index,
              no: index + 1,
              id: row.id,
              name: row?.name,
              type: row.ProductType?.name,
              price: `₫${row.price.toLocaleString()}`,
            };
          })
        : services.map((row, index) => {
            return {
              key: index,
              no: index + 1,
              id: row.id,
              name: row?.name,
              price: `₫${row.price.toLocaleString()}`,
            };
          });
    }
  }, [products, services]);

  // console.log(products)
  return (
    <ModalButton
      buttonName="Thêm"
      open={open}
      onClick={onButtonClick}
      onClose={onButtonClose}
      startIcon={<AddShoppingCartIcon />}
      title={modalTitle}
    >
      {isLoading ? (
        <Skeleton variant="rectangular" height={300} width={600} />
      ) : error ? (
        <Alert severity="error">{errMsg ? errMsg : "Có lỗi xảy ra"}</Alert>
      ) : products.length || services.length ? (
        <TableContainer
          columns={tableHeading}
          rows={tableBody}
          SearchInput={SearchInput}
        />
      ) : (
        <Typography>Không có dữ liệu</Typography>
      )}
    </ModalButton>
  );
}
