import React, { useState, useMemo, useEffect } from "react";
import { SearchContainer, TableContainer } from "../../components/Container";
import { ControlButton } from "../../components/Controls";
import ServiceTypeUpdateModal from "../../components/Modal/ServiceTypeUpdateModa";
import { useUserStore } from "../../../store";
import { getAllServices } from "../../api/service";
import CreateServiceType from "../../components/Modal/CreateServiceType";
import axios from '../../api/axios.config'

const Services = ({ show }) => {
  const [searchInput, setSearchInput] = useState("");
  const [rowID, setRowID] = useState(0);
  const [open, setOpen] = useState(false);
  const token = useUserStore((state) => state.token);
  const [refetch, setRefetch] = useState(false);
  const username = useUserStore((state) => state.username);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await getAllServices(token);
        setServices(res.result.data);
        setError(false);
      } catch (err) {
        setError(true);
        console.log(err);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [refetch]);

  const handleClose = () => {
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
      await axios.delete(`./service/delete/${id}`, {
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
      {
        field: "price",
        headerName: "Giá",
        headerAlign: "center",
        align: "center",
        width: 200,
        disableColumnMenu: true,
        sortComparator: (v1, v2) => {
          const num1 = Number(v1.replace(/\D/g, ""));
          const num2 = Number(v2.replace(/\D/g, ""));
          return num1 - num2;
        },
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
            onClick={() => handleDelete(services[param.row.key].id)}
            color="error"
            variant="text"
            disabled={(username != "admin")}
          >
            <b>Xóa</b>
          </ControlButton>,
        ],
      },
    ],
    [handleDetailButton, services]
  );

  const rows = useMemo(() => {
    return services.map((service, index) => {
      return {
        key: index,
        no: index + 1,
        id: service.id,
        name: service.name,
        price: `₫${service.price.toLocaleString()}`,
      };
    });
  }, [services]);

  return (
    <SearchContainer
      show={show}
      title="Danh mục loại dịch vụ"
      value={searchInput}
      onChange={(e) => setSearchInput(e.target.value)}
      onClick={(e) => setSearchInput("")}
    >
      {username === "admin" ? (
        <CreateServiceType
          title="Tạo loại dịch vụ mới"
          services={services}
          setRefetch={setRefetch}
        />
      ) : (
        <></>
      )}

      {services[rowID] ? (
        <ServiceTypeUpdateModal
          open={open}
          onButtonClose={handleClose}
          title="Chi tiết loại dịch vụ"
          data={services[rowID]}
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
  );
};

export default Services;
