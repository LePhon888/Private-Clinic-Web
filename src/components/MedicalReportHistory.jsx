import React, { useEffect, useState } from "react";
import { authApi, endpoints } from "../configs/Apis";
import { Button, Table } from "react-bootstrap";
import MedicalReportShowPrescription from "./MedicalReportShowPrescription";

const MedicalReportHistory = ({ patientId }) => {
  const [medicalReportHistory, setMedicalReportHistory] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const fetchReportDetails = async (medicalReportId) => {
    try {
      let e = `${endpoints["reportDetail"]}?id=${medicalReportId}`;
      const response = await authApi().get(e);
      return response.data;
    } catch (error) {
      console.error("Error fetching report details:", error);
      return [];
    }
  };

  const fetchReportByPatient = async () => {
    try {
      let e = endpoints["medicalReport"];
      let res = await authApi().get(`${e}?patientId=${patientId}`);

      const medicalReportsWithDetails = await Promise.all(
        res.data.map(async (report) => {
          const reportDetails = await fetchReportDetails(report.id);
          return { ...report, reportDetails };
        })
      );
      setMedicalReportHistory(medicalReportsWithDetails);
    } catch (ex) {
      console.error(ex);
    }
  };

  useEffect(() => {
    fetchReportByPatient();
  }, [patientId]);

  const openDialog = (report) => {
    setSelectedReport(report);
    setShowDialog(true);
  };

  const closeDialog = () => {
    setSelectedReport(null);
    setShowDialog(false);
  };

  return (
    <div>
      <p className="mx-1">
        <strong>Lịch sử toa thuốc</strong>
      </p>
      <hr></hr>
      <div style={{ maxHeight: "20rem", overflow: "auto" }}>
        {medicalReportHistory.length > 0 ? (
          <Table>
            <th>Mã phiếu khám</th>
            <th>Ngày khám</th>
            <th>Toa thuốc</th>
            <tbody>
              {Array.isArray(medicalReportHistory) &&
                medicalReportHistory.map((r) => (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    <td>{formatDate(r.createdDate)}</td>
                    <td>
                      {r.reportDetails && r.reportDetails.length > 0 && (
                        <Button variant="primary" onClick={() => openDialog(r)}>
                          Xem
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        ) : (
          <p>Loading...</p>
        )}
      </div>
      <hr></hr>
      {showDialog && (
        <MedicalReportShowPrescription
          selectedReport={selectedReport}
          onClose={closeDialog}
        />
      )}
    </div>
  );
};

export default MedicalReportHistory;
