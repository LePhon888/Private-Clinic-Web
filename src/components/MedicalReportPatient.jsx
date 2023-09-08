import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Container, Table } from "react-bootstrap";
import MedicalReport from "../pages/MedicalReport";
import { useNavigate } from "react-router-dom";
import { authApi, endpoints } from "../configs/Apis";

const MedicalReportPatient = () => {
  const [patientList, setPatientList] = useState(null);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const navigate = useNavigate();

  const loadPatientList = async () => {
    try {
      const res = await authApi().get(endpoints["scheduleDetail"]);
      setPatientList(res.data);
    } catch (ex) {
      console.error(ex);
    }
  };

  useEffect(() => {
    loadPatientList();
  }, []);

  const onViewReportHistoryClick = (patientId) => {
    setSelectedPatientId(patientId);
    navigate(`/medical-report/patient-report-list/?patientId=${patientId}`);
    sessionStorage.setItem("patientId", patientId);
    sessionStorage.removeItem("reportList");
  };

  const onWriteMedicalReportClick = (patientId) => {
    navigate(`/medical-report/prescription/`);
    sessionStorage.setItem("patientReport", patientId);
  };

  return (
    <Container>
      <MedicalReport />
      {patientList == null ? (
        <p>Loading...</p>
      ) : (
        <Table striped hover className="my-5">
          <thead>
            <tr>
              <th>Số thứ tự</th>
              <th>Họ tên</th>
              <th>Ngày sinh</th>
              <th>Lý do khám</th>
              <th>Thời gian khám</th>
              <th>Bác sĩ khám</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {patientList.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.name}</td>
                <td>{p.patientId.userId.birthday}</td>
                <td>{p.reason}</td>
                <td>
                  {p.hourId.hour} {p.date}
                </td>
                <td>{p.doctorId.userId.name}</td>
                <td>
                  <Button
                    variant="primary"
                    className="mx-1"
                    onClick={() => onViewReportHistoryClick(p.id)}
                  >
                    Lịch sử bệnh
                  </Button>
                  <Button
                    variant="primary"
                    className="mx-1"
                    onClick={() => onWriteMedicalReportClick(p.id)}
                  >
                    Kê toa
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};
export default MedicalReportPatient;
