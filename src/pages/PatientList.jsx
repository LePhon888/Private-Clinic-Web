import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Col,
  Container,
  Form,
  Row,
  Spinner,
} from "react-bootstrap";
import Table from "react-bootstrap/Table";
import Apis, { endpoints } from "../configs/Apis";
import { AiFillCaretDown, AiFillCaretUp, AiOutlineMail } from "react-icons/ai";
import { RiBillLine } from "react-icons/ri";
import Bill from "../components/Bill";

const PatientList = () => {
  const [scheduleDetail, setScheduleDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: "",
    direction: "",
  });
  const [searchName, setSearchName] = useState("");
  const [isConfirm, setIsConfirm] = useState({});
  const [isBill, setIsBill] = useState(false);
  const [medicalReport, setMedicalReport] = useState(null);
  const [isPaid, setIsPaid] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Note: Month is 0-based.
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    const fetchScheduleDetail = async () => {
      setLoading(true);
      try {
        const res = await Apis.get(endpoints["scheduleDetail"]);
        setScheduleDetail(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchScheduleDetail();
  }, [isConfirm]);

  const getSortedScheduleDetail = () => {
    if (!scheduleDetail) return [];

    const sortedArray = [...scheduleDetail];

    if (sortConfig.key) {
      sortedArray.sort((a, b) => {
        if (sortConfig.key === "name") {
          if (a.patientId.userId.name < b.patientId.userId.name) {
            return sortConfig.direction === "ascending" ? -1 : 1;
          }
          if (a.patientId.userId.name > b.patientId.userId.name) {
            return sortConfig.direction === "ascending" ? 1 : -1;
          }
        } else if (sortConfig.key === "appointmentTime") {
          const dateTimeA = `${a.date} ${a.hourId.hour}`;
          const dateTimeB = `${b.date} ${b.hourId.hour}`;
          if (dateTimeA < dateTimeB) {
            return sortConfig.direction === "ascending" ? -1 : 1;
          }
          if (dateTimeA > dateTimeB) {
            return sortConfig.direction === "ascending" ? 1 : -1;
          }
        } else if (sortConfig.key === "isConfirm") {
          if (a.isConfirm < b.isConfirm) {
            return sortConfig.direction === "ascending" ? -1 : 1;
          }
          if (a.isConfirm > b.isConfirm) {
            return sortConfig.direction === "ascending" ? 1 : -1;
          }
        }

        return 0;
      });
    }

    return sortedArray;
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handleIsConfirm = (id) => {
    const fetchUpdateIsConfirm = async () => {
      try {
        const res = await Apis.patch(`${endpoints["updateIsConfirm"]}${id}`, {
          isConfirm: 0,
        });
        setIsConfirm({ id });
      } catch (error) {
        console.error("Error updating isConfirm:", error);
      }
    };
    fetchUpdateIsConfirm();
  };
  // const handleBill = (medicalReportId) => {
  //   const fetchBill = async () => {
  //     try {
  //       const res = await Apis.get(`${endpoints["bill"]}${medicalReportId}`);
  //       setBill(res.data);
  //     } catch (error) {
  //       console.error("Error get bill:", error);
  //     }
  //   };
  //   fetchBill();
  // };
  const handleMedicalReport = (patientId) => {
    const fetchMedicalReport = async () => {
      try {
        const res = await Apis.get(
          `${endpoints["medicalReport"]}?patientId=${patientId}&isPaid=0`
        );
        setMedicalReport(res.data);
      } catch (error) {
        console.error("Error get medical report:", error);
      }
    };
    fetchMedicalReport();
  };

  return (
    <Container>
      <h3>Danh sách bệnh nhân khám bệnh</h3>
      <Row>
        <Col xs lg="4">
          <Form.Group className="mb-3" controlId="fullName">
            <Form.Control
              required
              type="text"
              placeholder="Nhập họ tên cần tìm"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
          </Form.Group>
        </Col>
      </Row>

      <Table striped hover className="my-5">
        <thead>
          <tr>
            <th>Số thứ tự</th>
            <th onClick={() => handleSort("name")}>
              Họ tên
              {sortConfig.direction === "ascending" ? (
                <AiFillCaretUp />
              ) : (
                <AiFillCaretDown />
              )}
            </th>
            <th>Ngày sinh</th>
            <th>Lý do khám</th>
            <th onClick={() => handleSort("appointmentTime")}>
              Thời gian khám
              {sortConfig.direction === "ascending" ? (
                <AiFillCaretUp />
              ) : (
                <AiFillCaretDown />
              )}
            </th>
            <th>Bác sĩ khám</th>
            <th onClick={() => handleSort("isConfirm")}>
              Trạng thái
              {sortConfig.direction === "ascending" ? (
                <AiFillCaretUp />
              ) : (
                <AiFillCaretDown />
              )}
            </th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="8" className="text-center">
                <Spinner animation="border" role="status" />
              </td>
            </tr>
          ) : (
            getSortedScheduleDetail()
              .filter((item) => {
                const name = item.patientId.userId.name;
                const isCancel = item.isCancel;
                return searchName !== ""
                  ? name &&
                      name.toLowerCase().includes(searchName.toLowerCase())
                  : true;
              })
              .map(
                (s) =>
                  s.isCancel === 0 && (
                    <tr key={s.id}>
                      <td>{s.id}</td>
                      <td>
                        {searchName === s.patientId.userId.name
                          ? s.patientId.userId.name
                          : s.patientId.userId.name}
                      </td>
                      <td>{formatDate(s.patientId.userId.birthday)}</td>
                      <td>{s.reason}</td>
                      <td>
                        {s.hourId.hour} {formatDate(s.date)}
                      </td>
                      <td>{s.doctorId.userId.name}</td>
                      <td>
                        <Alert
                          variant={
                            s.isConfirm === 0
                              ? "success"
                              : s.isConfirm === 1
                              ? "primary"
                              : "danger"
                          }
                          className="d-flex align-items-center py-1"
                          style={{ justifyContent: "center" }}
                        >
                          {s.isConfirm === -1 && "Chờ xác nhận"}
                          {s.isConfirm === 0 && "Đã xác nhận"}
                          {s.isConfirm === 1 && "Đã khám"}
                        </Alert>
                      </td>
                      <td>
                        {s.isConfirm === 0 && (
                          <Button className="mx-2">
                            Gửi email
                            <AiOutlineMail style={{ margin: "0 5px" }} />
                          </Button>
                        )}
                        {s.isConfirm === -1 && (
                          <Button
                            variant="info"
                            onClick={() => handleIsConfirm(s.id)}
                          >
                            Xác nhận
                          </Button>
                        )}
                        {s.isConfirm === 1 && (
                          <Button
                            variant="warning"
                            onClick={() => handleMedicalReport(s.id)}
                          >
                            Thanh toán
                          </Button>
                        )}
                      </td>
                    </tr>
                  )
              )
          )}
        </tbody>
      </Table>
      <Bill medicalReport={medicalReport} paid={isPaid == false} />
    </Container>
  );
};

export default PatientList;
