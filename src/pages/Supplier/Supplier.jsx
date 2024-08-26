import React, { useState, useMemo, useEffect } from "react";
import AppHeader from "../../components/AppHeader";
import { SearchContainer, TableContainer } from "../../components/Container";
import SupplierUpdateModal from "../../components/Modal/SupplierUpdateModal";
import { ControlButton } from "../../components/Controls";
import { getAllSuppliers } from "../../api/supplier";
import { useUserStore } from "../../../store";
import CreateNewModal from "../../components/Modal/CreateNewModal";
import { useNavigate } from "react-router-dom";
import axios from '../../api/axios.config'

const Supplier = () => {
  const [searchInput, setSearchInput] = useState("");
  const [rowID, setRowID] = useState(0);
  const [open, setOpen] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const token = useUserStore((state) => state.token);
  const [refetch, setRefetch] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const setUsername = useUserStore((state) => state.setUsername);
  const setToken = useUserStore((state) => state.setToken);
  const username = useUserStore((state) => state.username);

  const navigate = useNavigate();

  useEffect(() => {
    const usernameStorage = sessionStorage.getItem("username");
    const tokenStorage = sessionStorage.getItem("token");
    if (usernameStorage && tokenStorage) {
      setUsername(usernameStorage);
      setToken(tokenStorage);
      navigate("/supplier");
    } else {
      navigate("/login");
    }
  }, []);

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
  }, [refetch]);

  const handleClose = (event, reason) => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };
  const handleDetailButton = (rowID) => {
    setRowID(rowID);
    handleOpen();
  };

  const handleDelete = async (id) => {
    let result;
    console.log(id);
    try {
      await axios.delete(`./supplier/delete/${id}`, {
        headers: {
          Authorization: 'Bearer ' + token
        }
      });
      alert("Xóa thành công");
      setRefetch(prev => !prev);
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
        headerName: "Mã nhà cung cấp",
        width: 100,
        disableColumnMenu: true,
      },
      {
        field: "name",
        headerName: "Tên nhà cung cấp",
        width: 200,
        disableColumnMenu: true,
      },
      {
        field: "phone",
        headerName: "Số điện thoại",
        headerAlign: "center",
        align: "center",
        width: 200,
        disableColumnMenu: true,
      },
      {
        field: "address",
        headerName: "Địa chỉ",
        headerAlign: "center",
        align: "center",
        width: 300,
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
            disabled={username !== "admin"}
          >
            <b>Chỉnh sửa</b>
          </ControlButton>,
          <ControlButton
          onClick={() => handleDelete(suppliers[param.row.key].id)}
          color="error"
          variant="text"
          disabled={(username != "admin")}
        >
          <b>Xóa</b>
        </ControlButton>,
        ],
      },
    ],
    [handleDetailButton, suppliers]
  );

  const rows = useMemo(() => {
    return suppliers.map((supplier, index) => {
      return {
        key: index,
        no: index + 1,
        id: supplier.id,
        name: supplier.name,
        phone: supplier.phone,
        address: supplier.address,
      };
    });
  }, [suppliers]);

  // console.log(suppliers);

  return (
    <>
      <AppHeader>NHÀ CUNG CẤP</AppHeader>
      <SearchContainer
        show={true}
        title="Danh mục nhà cung cấp"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        onClick={(e) => setSearchInput("")}
      >
        {username === "admin" ? (
          <CreateNewModal
            title="Thêm nhà cung cấp"
            setRefetch={setRefetch}
            suppliers={suppliers}
          />
        ) : (
          <></>
        )}

        {suppliers[rowID] ? (
          <SupplierUpdateModal
            open={open}
            onButtonClose={handleClose}
            title="Chi tiết nhà cung cấp"
            data={suppliers[rowID]}
            setRefetch={setRefetch}
          />
        ) : (
          <></>
        )}

        {!isLoading && !error ? (
          <TableContainer
            columns={columns}
            rows={rows}
            SearchInput={searchInput}
          />
        ) : (
          "Loading..."
        )}
      </SearchContainer>
    </>
  );
};

export default Supplier;
