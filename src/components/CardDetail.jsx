import React from "react";
import { Card, Col } from "react-bootstrap";
import ScheduleDetail from "../pages/ScheduleDetail";

const CardDetail = ({ selectedScheduleDetail = null }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Note: Month is 0-based.
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };
  return (
    <div>
      {selectedScheduleDetail ? (
        <Card>
          <Card.Body>
            <Card.Title>Chi tiết lịch khám</Card.Title>
            <Card.Text>
              <strong>Họ và tên:</strong>{" "}
              {selectedScheduleDetail.patientId.userId.name}
            </Card.Text>
            <Card.Text>
              <strong>Ngày sinh:</strong>{" "}
              {formatDate(selectedScheduleDetail.date)}
            </Card.Text>

            <Card.Text>
              <strong>Ngày giờ khám</strong>{" "}
              {selectedScheduleDetail.hourId.hour}{" "}
              {formatDate(selectedScheduleDetail.date)}
            </Card.Text>
            <Card.Text>
              <strong>Giới tính:</strong>{" "}
              {selectedScheduleDetail.gender === "male" ? "Nam" : "Nữ"}
            </Card.Text>
            <Card.Text>
              <strong>Số điện thoại:</strong>{" "}
              {selectedScheduleDetail.patientId.userId.phoneNumber}
            </Card.Text>
            <Card.Text>
              <strong>Địa chỉ:</strong>{" "}
              {selectedScheduleDetail.patientId.userId.address}
            </Card.Text>
            <Card.Text>
              <strong>Lý do khám:</strong> {selectedScheduleDetail.reason}
            </Card.Text>
            <Card.Text>
              <strong>Bác sĩ khám:</strong>{" "}
              {selectedScheduleDetail.doctorId.userId.name}
            </Card.Text>
            <Card.Text>
              <strong>Thuộc khoa:</strong>{" "}
              {selectedScheduleDetail.doctorId.departmentId.name}
            </Card.Text>
          </Card.Body>
        </Card>
      ) : (
        <Card>
          <Card.Body>
            <Card.Title>Chi tiết lịch khám</Card.Title>
            <Card.Text>
              <strong>Họ và tên:</strong>{" "}
            </Card.Text>
            <Card.Text>
              <strong>Ngày sinh:</strong>{" "}
            </Card.Text>

            <Card.Text>
              <strong>Ngày giờ khám</strong>{" "}
            </Card.Text>
            <Card.Text>
              <strong>Giới tính:</strong>{" "}
            </Card.Text>
            <Card.Text>
              <strong>Số điện thoại:</strong>{" "}
            </Card.Text>
            <Card.Text>
              <strong>Địa chỉ:</strong>{" "}
            </Card.Text>
            <Card.Text></Card.Text>
            <Card.Text>
              <strong>Bác sĩ khám:</strong>{" "}
            </Card.Text>
            <Card.Text>
              <strong>Thuộc khoa:</strong>{" "}
            </Card.Text>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default CardDetail;
