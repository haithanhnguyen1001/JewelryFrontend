import { useState, useMemo, useEffect } from "react";
import {
  Typography,
  Stack,
  TextField,
  Box,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
} from "@mui/material";
import { Container, TableContainer } from "../../components/Container";
import { useUserStore } from "../../../store";
import { getAllProducts } from "../../api/product";
import { getAllBuyForms } from "../../api/buy";
import { getAllSellForms } from "../../api/sell";
import { countQuantity } from "../../utils/countQuantity";
import { isNumberOnly } from "../../reducer/form";
import { ControlButton } from "../../components/Controls";
import { createReport } from "../../api/report";
import axios from "axios";
import api from "../../api/axios.config";
import { gridColumnsTotalWidthSelector } from "@mui/x-data-grid";

const StockReport = () => {
  const token = useUserStore((state) => state.token);
  const [month, setMonth] = useState(0);
  const [year, setYear] = useState(0);
  const [monthError, setMonthError] = useState(false);
  const [yearError, setYearError] = useState(false);
  const username = useUserStore((state) => state.username);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [products, setProducts] = useState([]);
  const [sellFormData, setSellFormData] = useState([]);
  const [buyFormData, setBuyFormData] = useState([]);
  const [errorFlag, setErrorFlag] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await getAllProducts(token).then((res) => {
          setProducts(res.data);
        });
        await getAllSellForms(token).then((res) => {
          setSellFormData(res.data);
        });
        await getAllBuyForms(token).then((res) => {
          setBuyFormData(res.data);
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

  const checkTime = () => {
    const current = new Date();
    const currMonth = current.getMonth() + 1;
    const currYear = current.getFullYear();
    if (year > currYear || (year === currYear && currMonth < month)) {
      setErrorFlag(true);
    }
    else if (month <= 0 || year < 2020) {
      setErrorFlag(true);
    } else {
      setErrorFlag(false);
    }
  };

  useEffect(() => {
    checkTime();
  }, [month, year]);

  // TODO: fix: Cập nhật báo cáo của tháng, khiếm khuyết dữ liệu có thể khiến chức năng hoạt động k tốt
  const handleSaveReport = async () => {
    if (errorFlag) {
      alert("Không có dữ liệu");
      return;
    }
    if (username !== "admin") {
      alert("Cần quyền admin để lập báo cáo");
      return;
    }
    const cart = products.map((product) => {
      const prev_stock =
        product?.stock +
        countQuantity(sellFormData, product?.id, Number(month), Number(year)) -
        countQuantity(buyFormData, product?.id, Number(month), Number(year));
      return {
        totalImport: countQuantity(
          buyFormData,
          product?.id,
          Number(month),
          Number(year)
        ),
        totalExport: countQuantity(
          sellFormData,
          product?.id,
          Number(month),
          Number(year)
        ),
        beginStock: prev_stock,
        endStock: product?.stock,
        ProductId: product?.id,
        ProductTypeId: product.ProductType?.id,
      };
    });
    // console.log(cart);
    let res;
    try {
      res = await createReport(token, cart, month, year);
      if (res) {
        console.log(res.error);
        alert("Lưu báo cáo thành công.");
      } else {
        alert("Lưu không thành công");
      }
    } catch (error) {
      alert("Có lỗi xảy ra");
      console.log(error);
    }
  };

  const handleChangeMonth = (e) => {
    if (Number(e.target.value) <= 0 || Number(e.target.value) > 12) {
      setMonthError(true);
    } else {
      setMonthError(false);
    }
    setMonth(e.target.value);
  };
  const handleChangeYear = (e) => {
    if (Number(e.target.value) <= 2000 || Number(e.target.value) > 2400) {
      setYearError(true);
    } else {
      setYearError(false);
    }
    setYear(e.target.value);
  };

  const downloadFile = async () => {
    if (errorFlag) {
      alert("Không có dữ liệu");
      return;
    }
    const reqBody = products.map((product, index) => {
      const prev_stock =
        product.stock +
        countQuantity(sellFormData, product?.id, Number(month), Number(year)) -
        countQuantity(buyFormData, product?.id, Number(month), Number(year));
      return {
        STT: index + 1,
        "Tên sản phẩm": product?.name,
        "Tồn đầu": prev_stock,
        "Số lượng nhập": countQuantity(
          buyFormData,
          product?.id,
          Number(month),
          Number(year)
        ),
        "Số lượng xuất": countQuantity(
          sellFormData,
          product?.id,
          Number(month),
          Number(year)
        ),
        "Tồn cuối": product?.stock,
        "Đơn vị tính": product.ProductType?.unit,
      };
    });
    const newBody = JSON.stringify(reqBody);
    await api
      .post(
        "/download",
        {
          newBody,
        },
        {
          responseType: "arraybuffer",
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      .then((response) => {
        console.log(response);
        const blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const link = document.createElement("a");
        link.setAttribute("download", "SheetJSNode.xlsx");
        link.href = window.URL.createObjectURL(blob);
        // link.download =
        link.click();
      });
  };

  // Data
  const columns = useMemo(
    () => [
      {
        field: "no",
        headerName: "#",
        headerAlign: "center",
        align: "center",
        width: 100,
        disableColumnMenu: true,
      },
      {
        field: "name",
        headerName: "Sản phẩm",
        width: 350,
        disableColumnMenu: true,
      },
      {
        field: "prevStock",
        headerName: "Tồn đầu",
        headerAlign: "center",
        align: "center",
        width: 150,
        disableColumnMenu: true,
      },
      {
        field: "in",
        headerName: "Mua vào",
        headerAlign: "center",
        align: "center",
        width: 150,
        disableColumnMenu: true,
      },
      {
        field: "out",
        headerName: "Bán ra",
        headerAlign: "center",
        align: "center",
        width: 150,
        disableColumnMenu: true,
      },
      {
        field: "stock",
        headerName: "Tồn cuối",
        headerAlign: "center",
        align: "center",
        width: 150,
        disableColumnMenu: true,
      },
      {
        field: "unit",
        headerName: "Đơn vị",
        headerAlign: "center",
        align: "center",
        width: 150,
        disableColumnMenu: true,
      },
    ],
    []
  );

  const rows = useMemo(() => {
    return products.map((product, index) => {
      const prev_stock =
        product?.stock +
        countQuantity(sellFormData, product?.id, Number(month), Number(year)) -
        countQuantity(buyFormData, product?.id, Number(month), Number(year));
      return {
        key: index,
        no: index + 1,
        id: product?.id,
        name: product?.name,
        prevStock: errorFlag ? "Chưa có dữ liệu" : prev_stock,
        in: errorFlag
          ? "Chưa có dữ liệu"
          : countQuantity(buyFormData, product?.id, Number(month), Number(year)),
        out: errorFlag
          ? "Chưa có dữ liệu"
          : countQuantity(
            sellFormData,
            product?.id,
            Number(month),
            Number(year)
          ),
        stock: errorFlag ? "Chưa có dữ liệu" : product?.stock,
        unit: product.ProductType?.unit,
      };
    });
  }, [sellFormData, buyFormData, month, year]);

  return (
    <Stack spacing={2} sx={{ p: "20px" }}>
      <Container>
        <Stack width="100%" mt="20px" mb="12px">
          <Typography variant="h4" textAlign="center" mb="24px">
            <b>BÁO CÁO TỒN KHO</b>
          </Typography>
          <Stack
            direction="row"
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="demo-simple-select-standard-label">
                Tháng
              </InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={month}
                onChange={handleChangeMonth}
                label="Tháng"
              >
                <MenuItem value="0">
                  <em>Trống</em>
                </MenuItem>
                {Array.from({ length: 12 }, (_, index) => (
                  <MenuItem key={index + 1} value={index + 1}>
                    {index < 9 ? `0${index + 1}` : index + 1}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="demo-simple-select-standard-label">
                Năm
              </InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={year}
                onChange={handleChangeYear}
                label="Năm"
              >
                <MenuItem value={0}>
                  <em>Trống</em>
                </MenuItem>
                <MenuItem value={2020}>2020</MenuItem>
                <MenuItem value={2021}>2021</MenuItem>
                <MenuItem value={2022}>2022</MenuItem>
                <MenuItem value={2023}>2023</MenuItem>
                <MenuItem value={2024}>2024</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Stack>
        {errorFlag ? (
          <Typography
            sx={{
              fontSize: "2.1rem",
              textAlign: "center",
              color: "green",
            }}
          >
            Chưa có dữ liệu
          </Typography>
        ) : (
          <TableContainer columns={columns} rows={rows} />
        )}

        {!errorFlag ? (
          <Stack
            direction="row"
            spacing={1}
            sx={{
              display: "flex",
              justifyContent: "right",
              marginTop: "24px",
            }}
          >
            <ControlButton
              varient="text"
              height={40}
              width={150}
              onClick={downloadFile}
            >
              Tải xuống
            </ControlButton>
            <ControlButton
              varient="standard"
              height={40}
              width={200}
              onClick={handleSaveReport}
            >
              Cập nhật báo cáo
            </ControlButton>
          </Stack>
        ) : (
          <></>
        )}
      </Container>
    </Stack>
  );
};

export default StockReport;
