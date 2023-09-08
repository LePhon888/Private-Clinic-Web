import React, { useEffect, useState } from "react";
import Apis, { authApi, endpoints } from "../configs/Apis";
import { Alert, Button, Fade, Table } from "react-bootstrap";

const Bill = (props) => {
  const [bill, setBill] = useState(null);
  const [medicineBill, setMedicineBill] = useState(null);
  const [combinedArray, setCombinedArray] = useState([]);
  const [medicalReport, setMedicalReport] = useState(props.medicalReport);
  const [medicalReportId, setMedicalReportId] = useState(null);
  const [showNotification, setShowNotification] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Note: Month is 0-based.
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);

    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-based
    const year = date.getFullYear();

    return `${hours}:${minutes}:${seconds} ${day}-${month}-${year}`;
  };
  const showAndHideNotification = () => {
    setShowNotification(true);

    setTimeout(() => {
      setShowNotification(false);
    }, 2500);
  };

  useEffect(() => {
    setMedicalReport(props.medicalReport);
  }, [props.medicalReport]);

  //id is medicalReport id if medicalReport have only one
  const idArray = null;
  const handleBill = (id = null, medicalReport = null) => {
    const fetchBill = async () => {
      try {
        const idArray = id !== null ? [id] : medicalReport.map((m) => m.id);
        setMedicalReportId(idArray);
        const [res1, res2] = await Promise.all([
          authApi().get(`${endpoints["bill"]}?medicalReportId=${idArray}`),
          authApi().get(
            `${endpoints["medicineBill"]}?medicalReportId=${idArray}`
          ),
        ]);

        const billData = res1.data;
        const medicineBillData = res2.data;

        setBill(billData);
        setMedicineBill(medicineBillData);

        const updatedCombinedArray = billData.map(([id, amount]) => {
          const medicineBillEntry = medicineBillData.find(
            ([medId]) => medId === id
          );
          const medicineAmount = medicineBillEntry ? medicineBillEntry[1] : 0;

          return [id, amount, medicineAmount];
        });

        setCombinedArray(updatedCombinedArray);

        // Now you have combinedData with merged information
      } catch (error) {
        console.error("Error getting bill:", error);
      }
    };

    fetchBill();
  };

  const handlePaid = () => {
    const patientIdArray = medicalReport.map((m) => m.patientId.id);

    const fetchPaid = async () => {
      try {
        const res = await authApi().patch(
          `${endpoints["medicalReport"]}?id=${medicalReportId}`
        );
        const res1 = await authApi().get(
          `${endpoints["medicalReport"]}?patientId=${patientIdArray}&isPaid=0`
        );
        setMedicalReport(res1.data);
        setBill(null);
        setMedicineBill(null);
        setCombinedArray([]);
      } catch (error) {
        console.error("Update failed");
      }
    };
    fetchPaid();
  };

  return (
    <div>
      <h2>Danh sách các phiếu khám bệnh cần thanh toán</h2>
      {medicalReport && medicalReport.length > 0 ? (
        <div>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Mã bệnh nhân</th>
                <th>Họ tên</th>
                <th>Năm sinh</th>
                <th>Ngày khám</th>
                <th>Thanh toán</th>
              </tr>
            </thead>
            <tbody>
              {medicalReport ? (
                medicalReport.map((m) => (
                  <tr key={m.id}>
                    <td>{m.patientId.id}</td>
                    <td>{m.patientId.userId.name}</td>
                    <td>{formatDate(m.patientId.userId.birthday)}</td>
                    <td>{formatTimestamp(m.createdDate)}</td>
                    <td>
                      <Button
                        variant="warning"
                        onClick={
                          m.isPaid === 0 ? () => handleBill(m.id, null) : null
                        }
                        disabled={m.isPaid === 1}
                      >
                        {m.isPaid === 1 ? "Đã thanh toán" : "Thanh toán"}
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <h5>Danh sách rỗng</h5>
              )}
            </tbody>
          </Table>
          <Button
            variant="warning"
            className="my-2"
            onClick={() => handleBill(null, medicalReport)}
          >
            Thanh toán tất cả
          </Button>
          {bill && medicineBill && (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Mã phiếu khám</th>
                  <th>Tiền khám</th>
                  <th>Tổng tiền thuốc</th>
                </tr>
              </thead>
              <tbody>
                {combinedArray.map(([id, amount, medicineAmount]) => (
                  <tr key={id}>
                    <td>{id}</td>
                    <td>{amount} VND</td>
                    <td>{medicineAmount ? medicineAmount : 0} VND</td>
                  </tr>
                ))}
              </tbody>
              <Button
                className="my-3"
                onClick={() => {
                  handlePaid();
                  showAndHideNotification();
                }}
              >
                Xác nhận thanh toán
              </Button>
            </Table>
          )}
        </div>
      ) : (
        <tr>
          <td colSpan="8" className="text-center">
            <h6>Danh sách rỗng hoặc phiếu khám bệnh đã thanh toán</h6>
          </td>
        </tr>
      )}
      <div>
        {showNotification && (
          <Fade in={showNotification}>
            <Alert variant="success" className="notification">
              Thanh toán thành công
            </Alert>
          </Fade>
        )}
      </div>
    </div>
  );
};

export default Bill;
