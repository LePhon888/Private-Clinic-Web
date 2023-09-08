import axios from "axios";
import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Col,
  Container,
  FloatingLabel,
  Form,
  FormLabel,
  FormSelect,
  ListGroup,
  ListGroupItem,
  Modal,
  Row,
  Tab,
  Table,
} from "react-bootstrap";
import MedicalReport from "../pages/MedicalReport";
import { useLocation, useNavigate } from "react-router-dom";
import Apis, { authApi, endpoints } from "../configs/Apis";
import MedicalReportShowPrescription from "./MedicalReportShowPrescription";

const MedicalReportPatientReportHistory = () => {
  const [reportList, setReportList] = useState(
    JSON.parse(sessionStorage.getItem("reportList")) || null
  );

  const [keyword, setKeyword] = useState(sessionStorage.getItem("kw") || "");
  const [suggestedPatients, setSuggestedPatients] = useState([]);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Set the number of items to display per page
  const [showDialog, setShowDialog] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Note: Month is 0-based.
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const location = useLocation();
  const [patientId, setPatientId] = useState(
    sessionStorage.getItem("patientId") || ""
  );
  const [fromDate, setFromDate] = useState(
    sessionStorage.getItem("fromDate") || ""
  );
  const [toDate, setToDate] = useState(sessionStorage.getItem("toDate") || "");

  let e = endpoints["medicalReport"];

  const updateSearchParams = (paramName, value) => {
    const newSearchParams = new URLSearchParams(location.search);

    if (value !== "" && value !== null) {
      newSearchParams.set(paramName, value);
    } else {
      newSearchParams.delete(paramName);
    }

    navigate({
      pathname: location.pathname,
      search: newSearchParams.toString(),
    });
  };

  const fetchReportDetails = async (medicalReportId) => {
    try {
      let e = `${endpoints["reportDetail"]}?id=${medicalReportId}`;
      console.info(e);
      const response = await authApi().get(e);
      return response.data;
    } catch (error) {
      console.error("Error fetching report details:", error);
      return [];
    }
  };

  const loadReportList = async () => {
    try {
      let apiUrl = e;

      if (patientId !== "") {
        apiUrl += apiUrl.includes("?")
          ? `&patientId=${patientId}`
          : `?patientId=${patientId}`;
        sessionStorage.setItem("patientId", patientId);
      }

      if (fromDate !== "") {
        apiUrl += apiUrl.includes("?")
          ? `&fromDate=${fromDate}`
          : `?fromDate=${fromDate}`;
        sessionStorage.setItem("fromDate", fromDate);
      }

      if (toDate !== "") {
        apiUrl += apiUrl.includes("?")
          ? `&toDate=${toDate}`
          : `?toDate=${toDate}`;
        sessionStorage.setItem("toDate", toDate);
      }
      console.info(apiUrl);

      let medicalReports = await authApi().get(apiUrl);

      const medicalReportsWithDetails = await Promise.all(
        medicalReports.data.map(async (report) => {
          const reportDetails = await fetchReportDetails(report.id);
          return { ...report, reportDetails };
        })
      );
      setReportList(medicalReportsWithDetails);
      sessionStorage.setItem(
        "reportList",
        JSON.stringify(medicalReportsWithDetails)
      );
    } catch (ex) {
      console.error(ex);
    }
  };

  const navigateWithStoredQueryParams = () => {
    const patientParams = sessionStorage.getItem("patientId");
    const fromDateParams = sessionStorage.getItem("fromDate");
    const toDateParams = sessionStorage.getItem("toDate");
    const newSearchParams = new URLSearchParams(location.search);

    if (patientParams) {
      newSearchParams.set("patientId", patientParams);
    } else newSearchParams.delete("patientId");

    if (fromDateParams) {
      newSearchParams.set("fromDate", fromDateParams);
    } else newSearchParams.delete("fromDate");

    if (toDateParams) {
      newSearchParams.set("toDate", toDateParams);
    } else newSearchParams.delete("toDate");

    navigate({
      pathname: location.pathname,
      search: newSearchParams.toString(),
    });
  };

  useEffect(() => {
    if (reportList === null) loadReportList();

    const getPatientById = async () => {
      let e = endpoints["patient"];
      let res = await authApi().get(`${e}?id=${patientId}`);
    };

    if (patientId && patientId !== "") getPatientById();
  }, [patientId, fromDate, toDate]);

  useEffect(() => {
    sessionStorage.setItem("reportList", JSON.stringify(reportList));
    navigateWithStoredQueryParams();
  }, [reportList]);

  const openDialog = (report) => {
    setSelectedReport(report);
    setShowDialog(true);
  };

  const closeDialog = () => {
    setSelectedReport(null);
    setShowDialog(false);
  };

  const onKeyWordChange = async (value) => {
    if (value !== null) {
      let filter = value.split("-")[0];
      setKeyword(filter);
      sessionStorage.setItem("kw", filter);

      if (filter.trim().length > 0) {
        let e = endpoints["patient"];
        const res = await authApi().get(`${e}?patientName=${filter}`);
        setSuggestedPatients(res.data);
      } else {
        setSuggestedPatients([]);
      }
    }
  };

  const onClearClick = () => {
    if (keyword) {
      setKeyword("");
      sessionStorage.removeItem("kw");
      setSuggestedPatients([]);
    }

    if (patientId || toDate || fromDate) {
      setSuggestedPatients([]);
      setPatientId("");
      setFromDate("");
      setToDate("");
      sessionStorage.removeItem("reportList");
      sessionStorage.removeItem("params");
      sessionStorage.removeItem("patientId");
      sessionStorage.removeItem("fromDate");
      sessionStorage.removeItem("toDate");
      sessionStorage.removeItem("kw");
      setReportList(null);
      navigate(location.pathname.substring(0, location.search));
    }
  };

  const onPatientItemClick = (patient) => {
    if (patientId !== patient.id) setReportList(null);
    setKeyword(patient.userId.name);
    setSuggestedPatients([]);
    sessionStorage.setItem("kw", patient.userId.name);
    setPatientId(patient.id);
    updateSearchParams("patientId", patient.id);
  };

  const onFromDateChange = (date) => {
    setReportList(null);
    if (!date) sessionStorage.removeItem("fromDate");
    setFromDate(date);
    updateSearchParams("fromDate", date);
  };

  const onToDateChange = (date) => {
    setReportList(null);
    if (!date) sessionStorage.removeItem("toDate");
    setToDate(date);
    updateSearchParams("toDate", date);
  };

  // Calculate the index of the last item on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  // Calculate the index of the first item on the current page
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // Get the current items to display based on the pagination
  const currentItems =
    reportList !== null && reportList.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const tableStyles = {
    position: "absolute",
    width: "50%",
    maxHeight: "200px",
    overflowY: "auto",
    border: "1px solid #ced4da",
    backgroundColor: "#ffffff",
    zIndex: 1,
    boxShadow: "0px 8px 16px 0px rgba(0, 0, 0, 0.2)",
  };

  return (
    <Container>
      <MedicalReport />
      <Form className="mt-4" inline>
        <Row>
          <Col xs="auto">
            <Form.Label>Tìm kiếm</Form.Label>
            <Form.Control
              type="text"
              placeholder="Tìm theo tên bệnh nhân..."
              className="mr-sm-2"
              value={keyword}
              onChange={(e) => onKeyWordChange(e.target.value)}
            />

            {/* Display suggested patients */}
            {suggestedPatients.length > 0 && (
              <div style={tableStyles}>
                <Table hover size="sm">
                  <thead>
                    <tr>
                      <th>Mã bệnh nhân</th>
                      <th>Tên bệnh nhân</th>
                      <th>Giới tính</th>
                      <th>Ngày sinh</th>
                    </tr>
                  </thead>
                  <tbody>
                    {suggestedPatients.map((patient) => (
                      <tr
                        key={patient.id}
                        style={{ cursor: "pointer" }}
                        onClick={() => onPatientItemClick(patient)}
                      >
                        <td>{patient.id}</td>
                        <td>{patient.userId.name}</td>
                        <td>
                          {patient.userId.gender === "male" ? "Nam" : "Nữ"}
                        </td>
                        <td>{patient.userId.birthday}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </Col>

          <Col xs="auto">
            <Form.Label>From: </Form.Label>
            <Form.Control
              type="date"
              value={fromDate}
              onChange={(e) => onFromDateChange(e.target.value)}
            ></Form.Control>
          </Col>
          <Col xs="auto">
            <Form.Label>To: </Form.Label>
            <Form.Control
              type="date"
              value={toDate}
              onChange={(e) => onToDateChange(e.target.value)}
            ></Form.Control>
          </Col>
          <Col xs="auto">
            <br></br>
            <Button className="btn-danger mt-2" onClick={() => onClearClick()}>
              Clear
            </Button>
          </Col>
        </Row>
      </Form>

      {reportList === null ? (
        <p>Loading...</p>
      ) : reportList.length === 0 ? (
        <Alert variant="primary" className="mt-3">
          Bệnh nhân không có lịch sử khám bệnh...
        </Alert>
      ) : (
        <Table striped hover className="my-5">
          <thead>
            <tr>
              <th>Mã phiếu khám</th>
              <th>Ngày khám</th>
              <th>Tên bệnh nhân</th>
              <th>Triệu chứng</th>
              <th>Chuấn đoán</th>
              <th>Bác sĩ khám</th>
              <th>Đơn thuốc</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(currentItems) &&
              currentItems.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{formatDate(r.createdDate)}</td>
                  <td>{r.patientId.userId.name}</td>
                  <td>{r.symptom}</td>
                  <td>{r.diagnose}</td>
                  <td>{r.doctorId.userId.name}</td>
                  <td>
                    {r.reportDetails.length > 0 && (
                      <Button variant="primary" onClick={() => openDialog(r)}>
                        Xem
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      )}

      {showDialog && (
        <MedicalReportShowPrescription
          selectedReport={selectedReport}
          onClose={closeDialog}
        />
      )}

      {/* Pagination Controls */}
      {reportList !== null && (
        <nav style={{ display: "flex", justifyContent: "center" }}>
          <ul className="pagination">
            {Array.from({
              length: Math.ceil(reportList.length / itemsPerPage),
            }).map((_, index) => (
              <li key={index} className="page-item">
                <button
                  onClick={() => paginate(index + 1)}
                  className="page-link"
                >
                  {index + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </Container>
  );
};
export default MedicalReportPatientReportHistory;
