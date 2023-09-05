import React, { useEffect, useState, useContext } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Row,
  Table,
  Spinner,
} from "react-bootstrap";
import Apis, { authApi, endpoints } from "../configs/Apis";
import { UserContext } from "../App";
import { FaCheck } from "react-icons/fa";
import cookie from "react-cookies";
import CardDetail from "../components/CardDetail";

const ScheduleDetail = () => {
  const [scheduleDetail, setScheduleDetail] = useState(null);
  const [selectedScheduleDetail, setSelectedScheduleDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, dispatch] = useContext(UserContext);

  const fetchScheduleDetail = async () => {
    setLoading(true);
    try {
      const resPatientId = await authApi().get(
        `${endpoints["patient"]}${user.id}`
      );
      const res = await authApi().get(
        `${endpoints["scheduleDetailByPatientId"]}?registerPatientId=${resPatientId.data.id}`
      );
      setScheduleDetail(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };
  useEffect(() => {
    fetchScheduleDetail();
  }, []);

  const handleCancel = (scheduleDetailId) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa lịch khám này ?"
    );
    if (confirmDelete) {
      const cancel = async () => {
        const res = await authApi().patch(
          `${endpoints["updateIsCancel"]}${scheduleDetailId}`,
          { isCancel: 1 }
        );
      };
      cancel();
      fetchScheduleDetail();
    } else {
    }
  };

  return (
    <Container className="my-5">
      <Row>
        <Col xs={12} md={7}>
          {loading && <Spinner />}
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Id</th>
                <th>Họ và tên</th>
                <th>Lý do khám</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {scheduleDetail &&
                scheduleDetail.map(
                  (s) =>
                    s.isCancel == 0 && (
                      <tr key={s.id}>
                        <td>{s.id}</td>
                        <td>{s.patientId.userId.name}</td>
                        <td>{s.reason}</td>
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
                            {s.isConfirm === 1 && "Đã khám"}
                            {s.isConfirm === -1 && "Chờ xác nhận"}
                            {s.isConfirm === 0 && "Đã xác nhận"}
                          </Alert>
                        </td>
                        <td>
                          <span className="d-flex align-items-center">
                            {s.isConfirm === -1 && (
                              <Button
                                className="mx-2"
                                onClick={() => handleCancel(s.id)}
                              >
                                Hủy lịch
                              </Button>
                            )}
                            <Button
                              className="mx-2"
                              onClick={(e) => setSelectedScheduleDetail(s)}
                            >
                              Chi tiết
                            </Button>
                            {selectedScheduleDetail === s && (
                              <FaCheck className="ml-1" />
                            )}
                          </span>
                        </td>
                      </tr>
                    )
                )}
            </tbody>
          </Table>
        </Col>
        <Col xs={12} md={5}>
          <CardDetail selectedScheduleDetail={selectedScheduleDetail} />
        </Col>
      </Row>
    </Container>
  );
};

export default ScheduleDetail;
