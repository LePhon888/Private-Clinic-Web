import React from "react";
import { Col, Container, Modal, Row } from "react-bootstrap";

const MedicalReportShowPrescription = ({ selectedReport, onClose }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Note: Month is 0-based.
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <Modal show={true} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Thông tin đơn thuốc</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {selectedReport && (
          <Container>
            <Row>
              <Col md={4}>
                <p>
                  <strong>Họ tên:</strong>{" "}
                  {selectedReport.patientId.userId.name}
                </p>
              </Col>
              <Col md={4}>
                <p>
                  <strong>Giới tính:</strong>{" "}
                  {selectedReport.patientId.userId.gender === "male"
                    ? "Nam"
                    : "Nữ"}
                </p>
              </Col>
              <Col md={4}>
                <p>
                  <strong>Năm sinh:</strong>{" "}
                  {selectedReport.patientId.userId.birthday.substring(0, 4)}
                </p>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <p>
                  <strong>Triệu chứng:</strong> {selectedReport.symptom}
                </p>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <p>
                  <strong>Chuẩn đoán:</strong> {selectedReport.diagnose}
                </p>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <p>
                  <strong>Ngày khám:</strong>{" "}
                  {formatDate(selectedReport.createdDate)}
                </p>
              </Col>
            </Row>
            <hr />
            <h5>Chỉ định dùng thuốc:</h5>
            {selectedReport.reportDetails.map((detail, index) => (
              <Row key={index}>
                <Col md={10}>
                  <p>
                    {index + 1}
                    <strong>. {detail.medicineUnitId.medicineId.name}</strong>
                  </p>
                  <p>
                    <i>Cách dùng: {detail.usageInfo}</i>
                  </p>
                </Col>
                <Col>
                  <p>
                    {detail.quantity}{" "}
                    {detail.medicineUnitId.unitId.name === "pill"
                      ? "Viên"
                      : detail.medicineUnitId.unitId.name === "bottle"
                      ? "Chai"
                      : detail.medicineUnitId.unitId.name === "jar"
                      ? "Lọ"
                      : detail.medicineUnitId.unitId.name === "tablet"
                      ? "Vỉ"
                      : "Gói"}
                  </p>
                </Col>
              </Row>
            ))}
          </Container>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default MedicalReportShowPrescription;
