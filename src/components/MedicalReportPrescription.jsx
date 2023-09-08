import { useContext, useEffect, useRef, useState } from "react";
import Apis, { authApi, endpoints } from "../configs/Apis";
import MedicalReport from "../pages/MedicalReport";
import {
  Badge,
  Button,
  Col,
  Container,
  Form,
  FormLabel,
  Row,
  Table,
  Modal,
} from "react-bootstrap";

import {
  HiArrowCircleUp,
  HiArrowCircleDown,
  HiTrash,
  HiPlusCircle,
  HiPencil,
  HiOutlinePencil,
  HiStar,
  HiX,
  HiCheck,
} from "react-icons/hi";
import moment from "moment/moment";

import { UserContext } from "../App";
import MedicalReportHistory from "./MedicalReportHistory";
import MedicalReportPdf from "./MedicalReportPdf";
import MedicineGroup from "./MedicineGroup";
const MedicalReportPrescription = () => {
  const [patient, setPatient] = useState(null);
  const [patientId, setPatientId] = useState(
    sessionStorage.getItem("patientReport") || null
  );
  const [keyword, setKeyword] = useState("");
  const [originalMedicines, setOriginalMedicines] = useState([]);
  const [suggestMedicines, setSuggestMedicines] = useState(originalMedicines);
  const [medicineUnit, setMedicineUnit] = useState([]);

  const [selectedReport, setSelectedReport] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [user, dispatch] = useContext(UserContext);

  const medicineFormRef = useRef({});
  const medicalReportFormRef = useRef({});
  const [medicalReport, setMedicalReport] = useState(
    JSON.parse(sessionStorage.getItem("medicalReport")) || {
      symptom: "",
      diagnose: "",
      createdDate: moment().format("YYYY-MM-DD"),
      patientId: null,
      doctorId: { user },
      billId: null,
    }
  );
  const [reportDetail, setReportDetail] = useState(
    JSON.parse(sessionStorage.getItem("medicinesInReport")) || []
  );

  const [currentPage, setCurrentPage] = useState(1);
  const medicinesPerPage = 4;
  const startIndex = (currentPage - 1) * medicinesPerPage;
  const endIndex = startIndex + medicinesPerPage;
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const [index, setIndex] = useState(0);
  const [editReportDetail, setEditReportDetail] = useState(null);
  const [selectedMedicineNames, setSelectedMedicineNames] = useState(new Set());

  const onReportDetailChange = (field, value) => {
    if (reportDetail.length > 0) {
      const index = reportDetail.indexOf(editReportDetail);
      if (field === "medicineUnitId.medicineId.name")
        selectedMedicineNames.add(value);
      setReportDetail((current) => {
        const updatedReportDetail = [...current];
        const keys = field.split(".");
        let target = updatedReportDetail[index];

        // Traverse the nested structure to set the value
        for (let i = 0; i < keys.length - 1; i++) {
          target = target[keys[i]];
        }

        target[keys[keys.length - 1]] = value;
        return updatedReportDetail;
      });
      console.info(reportDetail);
    }
  };

  const onMedicalReportChange = (field, value) => {
    const updatedMedicalReport = { ...medicalReport };
    updatedMedicalReport[field] = value;
    setMedicalReport(updatedMedicalReport);
    console.info(updatedMedicalReport);
  };

  const fetchMedicineUnit = async (medicineId) => {
    try {
      let e = `${endpoints["medicineUnit"]}?medicineId=${medicineId}`;
      let res = await Apis.get(e);
      setMedicineUnit(res.data);
      console.info(e);
    } catch (ex) {
      console.error(ex);
    }
  };

  const getPatientById = async () => {
    try {
      let e = endpoints["patient"];
      let res = await authApi().get(`${e}?id=${patientId}`);
      setPatient(res.data);
    } catch (ex) {
      console.error(ex);
    }
  };

  useEffect(() => {
    if (patientId !== null) {
      getPatientById();
    }
    const fetchMedicines = async () => {
      let e = endpoints["medicine"];
      let res = await authApi().get(e);
      setOriginalMedicines(res.data);
    };
    fetchMedicines();
  }, []);

  useEffect(() => {
    if (editReportDetail) {
      fetchMedicineUnit(editReportDetail.medicineUnitId.medicineId.id);
    }
  }, [editReportDetail]);

  useEffect(() => {
    if (patient) {
      setMedicalReport((current) => ({
        ...current,
        patientId: patient[0],
      }));
    }
  }, [patient]);

  useEffect(() => {
    sessionStorage.setItem("medicalReport", JSON.stringify(medicalReport));
  }, [medicalReport]);

  const onKeyWordChange = (value) => {
    setKeyword(value);

    if (value.trim() === "") {
      setSuggestMedicines(originalMedicines);
    } else {
      const filteredMedicines = suggestMedicines.filter((medicine) => {
        const keywordLower = value.toLowerCase();
        const medicineNameLower = medicine.name.toLowerCase();
        return medicineNameLower.includes(keywordLower);
      });

      setSuggestMedicines(
        filteredMedicines.length > 0 ? filteredMedicines : suggestMedicines
      );
    }
  };

  const tableStyles = {
    position: "absolute",
    width: "100%",
    maxHeight: "200px",
    overflowY: "auto",
    border: "1px solid #ced4da",
    backgroundColor: "#ffffff",
    zIndex: 1,
    boxShadow: "0px 8px 16px 0px rgba(0, 0, 0, 0.2)",
  };

  const onUsageChange = (type) => {
    const index = reportDetail.indexOf(editReportDetail);
    const updatedReportDetail = [...reportDetail];
    updatedReportDetail[index].type = type;
    updatedReportDetail[index].usageInfo = `${type} Sáng: ${
      updatedReportDetail[index].morning || 0
    }, Trưa: ${updatedReportDetail[index].noon || 0}, Chiều: ${
      updatedReportDetail[index].afternoon || 0
    }, Tối: ${updatedReportDetail[index].evening || 0}`;
    setReportDetail(updatedReportDetail);
  };

  const onTimeChange = (timeOfDay, value) => {
    const index = reportDetail.indexOf(editReportDetail);
    const updatedReportDetail = [...reportDetail];
    updatedReportDetail[index][timeOfDay] = value;
    const { type, morning, noon, afternoon, evening } =
      updatedReportDetail[index];
    updatedReportDetail[index].usageInfo = `${type} Sáng: ${
      morning || 0
    }, Trưa: ${noon || 0}, Chiều: ${afternoon || 0}, Tối: ${evening || 0}`;
    setReportDetail(updatedReportDetail);
    console.info(reportDetail);
  };

  const addReportDetail = (medicine) => {
    const newReportDetail = {
      quantity: medicineFormRef.current["quantity"].value,
      usageInfo: medicineFormRef.current["usageInfo"].value,
      medicineUnitId: {
        medicineId: medicine,
        unitId: {},
      },
      type: "",
      morning: "",
      noon: "",
      afternoon: "",
      evening: "",
    };
    setReportDetail([...reportDetail, newReportDetail]);
    setIndex(index + 1);
  };

  const clearMedicineInput = () => {
    for (const key in medicineFormRef.current) {
      if (medicineFormRef.current.hasOwnProperty(key)) {
        medicineFormRef.current[key].value = "";
      }
    }
    setKeyword("");
  };

  useEffect(() => {
    if (!editReportDetail && reportDetail.length > 0) {
      console.info(reportDetail);
      setEditReportDetail(reportDetail[reportDetail.length - 1]);
    }
    sessionStorage.setItem("medicinesInReport", JSON.stringify(reportDetail));
  }, [reportDetail]);

  const saveMedicalReport = async () => {
    try {
      const data = {
        medicalReport: medicalReport,
        reportDetail: reportDetail,
      };

      console.info(data);

      const isValidInputs = () => {
        for (const key in medicalReportFormRef.current) {
          if (medicalReportFormRef.current.hasOwnProperty(key)) {
            if (medicalReportFormRef.current[key].value.trim() === "") {
              return false;
            }
          }
        }
        return true;
      };

      if (!isValidInputs()) {
        alert("Vui lòng điền đầy đủ thông tin phiếu khám bệnh!!!");
        return;
      }

      const response = await authApi().post(endpoints["medicalReport"], data);

      if (response.status === 201) {
        alert("Lưu phiếu khám bệnh thành công");
        setReportDetail([]);
        setEditReportDetail(null);
        clearMedicineInput();
        medicalReportFormRef.current["symptom"].value = "";
        medicalReportFormRef.current["diagnose"].value = "";

        setMedicalReport({
          ...medicalReport,
          symptom: "",
          diagnose: "",
        });
      } else alert("Hệ thống lỗi.....");
    } catch (ex) {
      console.error(ex);
    }
  };

  const moveUp = (r) => {
    const pos = reportDetail.indexOf(r);
    if (pos > 0) {
      // Move the item up by swapping with the previous item
      const updatedReportDetail = [...reportDetail];
      const temp = updatedReportDetail[pos];
      updatedReportDetail[pos] = updatedReportDetail[pos - 1];
      updatedReportDetail[pos - 1] = temp;
      setReportDetail(updatedReportDetail);
    }
  };

  const moveDown = (r) => {
    const pos = reportDetail.indexOf(r);
    if (pos < reportDetail.length - 1) {
      // Move the item down by swapping with the next item
      const updatedReportDetail = [...reportDetail];
      const temp = updatedReportDetail[pos];
      updatedReportDetail[pos] = updatedReportDetail[pos + 1];
      updatedReportDetail[pos + 1] = temp;
      setReportDetail(updatedReportDetail);
    }
  };

  const deleteReportDetail = (r) => {
    const pos = reportDetail.indexOf(r);

    if (pos !== -1) {
      // Create a copy of the reportDetail array without the item to delete
      const updatedReportDetail = [
        ...reportDetail.slice(0, pos),
        ...reportDetail.slice(pos + 1),
      ];
      setReportDetail(updatedReportDetail);
      selectedMedicineNames.delete(r.medicineUnitId.medicineId.name);
      console.info(selectedMedicineNames);
      const newCurrentPage = Math.ceil(
        updatedReportDetail.length / medicinesPerPage
      );
      setCurrentPage(newCurrentPage >= 1 ? newCurrentPage : 1);
      console.info(newCurrentPage);
    }
  };

  const onMedicineReceived = (medicine) => {
    if (!selectedMedicineNames.has(medicine.name)) {
      selectedMedicineNames.add(medicine.name);
      clearMedicineInput();
      addReportDetail(medicine);
    }
  };

  return (
    <Container>
      <MedicalReport />
      <Row className="mt-3">
        <Col xs="5">
          <MedicalReportHistory patientId={patientId} />
          <MedicineGroup onMedicineListener={onMedicineReceived} />
        </Col>
        {/* {Medical report} */}
        <Col>
          <Container style={{ border: "1px solid #d3d3d3" }}>
            <Form>
              <Row className="text-center">
                <Col>
                  <h5 className="mt-2">Đơn thuốc</h5>
                </Col>
              </Row>

              <Row>
                <Col>
                  {" "}
                  <h6 className="text-success">Thông tin bệnh nhân</h6>
                </Col>
              </Row>

              <Row className="mt-2">
                <Col>
                  <p>
                    <strong>Bệnh nhân: </strong>
                  </p>
                  <Form.Control
                    type="text"
                    readOnly
                    ref={(el) => (medicalReportFormRef.current["patient"] = el)}
                    placeholder="Nhập tên bệnh nhân"
                    value={
                      medicalReport.patientId &&
                      medicalReport.patientId.userId.name
                    }
                  />
                </Col>
                <Col>
                  <p>
                    <strong>Ngày khám:</strong>{" "}
                  </p>
                  <Form.Control
                    type="date"
                    ref={(el) =>
                      (medicalReportFormRef.current["createdDate"] = el)
                    }
                    readOnly
                    value={medicalReport.createdDate}
                  />
                </Col>
              </Row>
              <Row className="mt-2">
                <Col>
                  <p>
                    <strong>Triệu chứng:</strong>
                  </p>
                  <Form.Control
                    type="text"
                    value={medicalReport.symptom}
                    ref={(el) => (medicalReportFormRef.current["symptom"] = el)}
                    onChange={(e) =>
                      onMedicalReportChange("symptom", e.target.value)
                    }
                    placeholder="Nhập triệu chứng"
                  />
                </Col>
                <Col>
                  <p>
                    <strong>Chuẩn đoán:</strong>
                  </p>
                  <Form.Control
                    type="text"
                    value={medicalReport.diagnose}
                    ref={(el) =>
                      (medicalReportFormRef.current["diagnose"] = el)
                    }
                    onChange={(e) =>
                      onMedicalReportChange("diagnose", e.target.value)
                    }
                    placeholder="Nhập chuẩn đoán"
                  />
                </Col>
              </Row>
              <Row className="mt-3">
                <Col>
                  {" "}
                  <h6 className="text-success">Thông tin thuốc</h6>
                </Col>
              </Row>
              <Row className="mt-2">
                <Col md={6}>
                  <p>
                    <strong>Chọn thuốc: </strong>{" "}
                  </p>
                  <Form.Control
                    type="text"
                    placeholder="Nhập tên thuốc"
                    ref={(el) => (medicineFormRef.current["keyword"] = el)}
                    value={keyword}
                    onChange={(e) => {
                      onKeyWordChange(e.target.value);
                    }}
                  />
                </Col>
                <Col>
                  <p>
                    <strong>Đơn vị: </strong>{" "}
                  </p>
                  <Form.Select
                    value={
                      editReportDetail &&
                      editReportDetail.medicineUnitId.unitId.name
                        ? editReportDetail.medicineUnitId.unitId.name
                        : "Chọn đơn vị"
                    }
                    onChange={(e) =>
                      editReportDetail &&
                      onReportDetailChange(
                        "medicineUnitId",
                        medicineUnit.find(
                          (m) => m.unitId.name === e.target.value
                        )
                      )
                    }
                    ref={(el) => (medicineFormRef.current["unit"] = el)}
                  >
                    <option disabled selected>
                      Chọn đơn vị
                    </option>
                    {medicineUnit.map((m) => (
                      <option key={m.id} value={m.unitId.name}>
                        {m.unitId.name === "pill"
                          ? "Viên"
                          : m.unitId.name === "bottle"
                          ? "Chai"
                          : m.unitId.name === "jar"
                          ? "Lọ"
                          : m.unitId.name === "tablet"
                          ? "Vỉ"
                          : "Gói"}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col>
                  <p>
                    <strong>Số lượng: </strong>{" "}
                  </p>
                  <Form.Control
                    type="number"
                    min={0}
                    placeholder="Số lượng"
                    value={editReportDetail && editReportDetail.quantity}
                    ref={(el) => (medicineFormRef.current["quantity"] = el)}
                    onChange={(e) =>
                      onReportDetailChange("quantity", e.target.value)
                    }
                  />
                </Col>
              </Row>
              {suggestMedicines.length > 0 && (
                <div style={{ position: "relative" }}>
                  <div style={tableStyles}>
                    <Table hover size="sm">
                      <thead>
                        <tr>
                          <th>Mã thuốc</th>
                          <th>Tên thuốc</th>
                        </tr>
                      </thead>
                      <tbody>
                        {suggestMedicines.map((medicine) => (
                          <tr
                            key={medicine.id}
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              if (!selectedMedicineNames.has(medicine.name)) {
                                selectedMedicineNames.add(medicine.name);
                                clearMedicineInput();
                                addReportDetail(medicine);

                                setKeyword(medicine.name);
                                setEditReportDetail(null);
                                setSuggestMedicines([]);
                              }
                            }}
                          >
                            <td>{medicine.id}</td>
                            <td>{medicine.name}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                  <Button
                    variant="danger"
                    style={{
                      position: "absolute",
                      bottom: "0",
                      right: "0",
                      zIndex: "1",
                    }}
                    onClick={() => {
                      setSuggestMedicines([]);
                    }}
                  >
                    Close
                  </Button>
                </div>
              )}
              <Row className="mt-2">
                <FormLabel>
                  <strong>Cách dùng:</strong>
                </FormLabel>
                <Col md={3}>
                  <FormLabel>Loại</FormLabel>
                  <Form.Select
                    ref={(el) => (medicineFormRef.current["usageInfo"] = el)}
                    onChange={(e) =>
                      editReportDetail != null && onUsageChange(e.target.value)
                    }
                    value={
                      editReportDetail != null && editReportDetail.type
                        ? editReportDetail.type
                        : "Chọn loại"
                    }
                  >
                    <option disabled selected>
                      Chọn loại
                    </option>
                    <option value="Uống">Uống</option>
                    <option value="Tiêm">Tiêm</option>
                    <option value="Bôi">Bôi</option>
                    <option value="Hít">Hít</option>
                    <option value="Xịt mũi">Xịt mũi</option>
                  </Form.Select>
                </Col>

                <Col>
                  <FormLabel>Sáng</FormLabel>
                  <Form.Control
                    ref={(el) => (medicineFormRef.current["morning"] = el)}
                    value={
                      editReportDetail && editReportDetail.morning
                        ? editReportDetail.morning
                        : ""
                    }
                    type="number"
                    min={0}
                    onChange={(e) =>
                      editReportDetail &&
                      onTimeChange("morning", e.target.value)
                    }
                  />
                </Col>

                <Col>
                  <FormLabel>Trưa</FormLabel>
                  <Form.Control
                    ref={(el) => (medicineFormRef.current["noon"] = el)}
                    value={
                      editReportDetail && editReportDetail.noon
                        ? editReportDetail.noon
                        : ""
                    }
                    type="number"
                    min={0}
                    onChange={(e) =>
                      editReportDetail && onTimeChange("noon", e.target.value)
                    }
                  />
                </Col>

                <Col>
                  <FormLabel>Chiều</FormLabel>
                  <Form.Control
                    ref={(el) => (medicineFormRef.current["afternoon"] = el)}
                    value={
                      editReportDetail && editReportDetail.afternoon
                        ? editReportDetail.afternoon
                        : ""
                    }
                    type="number"
                    min={0}
                    onChange={(e) =>
                      editReportDetail &&
                      onTimeChange("afternoon", e.target.value)
                    }
                  />
                </Col>

                <Col>
                  <FormLabel>Tối</FormLabel>

                  <Form.Control
                    ref={(el) => (medicineFormRef.current["evening"] = el)}
                    value={
                      editReportDetail && editReportDetail.evening
                        ? editReportDetail.evening
                        : ""
                    }
                    type="number"
                    min={0}
                    onChange={(e) =>
                      editReportDetail &&
                      onTimeChange("evening", e.target.value)
                    }
                  />
                </Col>

                <Col>
                  <br></br>
                  <Button
                    className="mt-2"
                    variant="danger"
                    onClick={() => {
                      clearMedicineInput();
                      setEditReportDetail(null);
                    }}
                  >
                    Clear
                    <HiX style={{ fontSize: "20px" }} />
                  </Button>
                </Col>
              </Row>
              <hr />
              <Row>
                <Col>
                  {" "}
                  <h6 className="text-success">Chi tiết đơn thuốc</h6>
                </Col>
              </Row>
              {reportDetail.slice(startIndex, endIndex).map((r, i) => (
                <Row className="mt-2">
                  <Col xs={1} style={{ display: "flex", alignItems: "center" }}>
                    <p style={{ fontSize: "18px" }}>
                      {reportDetail.indexOf(r) + 1 > 9
                        ? reportDetail.indexOf(r) + 1 + "."
                        : reportDetail.indexOf(r) + 1 + "."}
                    </p>
                  </Col>
                  <Col md={6}>
                    <p>
                      {editReportDetail === r && (
                        <Badge pill bg="warning">
                          <HiStar />
                        </Badge>
                      )}
                      <strong>
                        {" "}
                        {r.medicineUnitId.medicineId.name === ""
                          ? "Tên thuốc"
                          : r.medicineUnitId.medicineId.name}
                      </strong>
                    </p>
                    <p>
                      <i>Cách dùng: {r.usageInfo}</i>
                    </p>
                  </Col>
                  <Col xs={1} style={{ display: "flex", alignItems: "center" }}>
                    <p>
                      <i>
                        x {r.quantity} <br />{" "}
                        {r.medicineUnitId.unitId.name === ""
                          ? ""
                          : r.medicineUnitId.unitId.name === "pill"
                          ? "Viên"
                          : r.medicineUnitId.unitId.name === "bottle"
                          ? "Chai"
                          : r.medicineUnitId.unitId.name === "jar"
                          ? "Lọ"
                          : r.medicineUnitId.unitId.name === "tablet"
                          ? "Vỉ"
                          : r.medicineUnitId.unitId.name === "packet"
                          ? "Gói"
                          : ""}
                      </i>
                    </p>
                  </Col>
                  <Col style={{ display: "flex", alignItems: "center" }}>
                    <Button
                      variant="primary"
                      className="mx-1"
                      size="sm"
                      onClick={() => {
                        moveUp(r);
                      }}
                    >
                      <HiArrowCircleUp style={{ fontSize: "24px" }} />
                    </Button>
                    <Button
                      variant="success"
                      className="mx-1"
                      size="sm"
                      onClick={() => {
                        moveDown(r);
                      }}
                    >
                      <HiArrowCircleDown style={{ fontSize: "24px" }} />
                    </Button>
                    <Button
                      variant="warning"
                      className="mx-1"
                      size="sm"
                      onClick={() => {
                        setEditReportDetail(r);
                        setKeyword(r.medicineUnitId.medicineId.name);
                        console.info(editReportDetail);
                      }}
                    >
                      <HiPencil style={{ fontSize: "24px" }} />
                    </Button>
                    <Button
                      variant="danger"
                      className="mx-1"
                      size="sm"
                      onClick={() => {
                        deleteReportDetail(r);
                      }}
                    >
                      <HiTrash style={{ fontSize: "24px" }} />
                    </Button>
                  </Col>
                </Row>
              ))}
              {reportDetail.length > medicinesPerPage && (
                <nav style={{ display: "flex", justifyContent: "center" }}>
                  <ul className="pagination">
                    {Array.from({
                      length: Math.ceil(reportDetail.length / medicinesPerPage),
                    }).map((_, index) => (
                      <li key={index} className="page-item">
                        <button
                          type="button"
                          onClick={(e) => paginate(index + 1)}
                          className="page-link"
                        >
                          {index + 1}
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>
              )}
            </Form>
          </Container>

          <Button
            variant="primary"
            className="mx-1 my-2"
            onClick={() => saveMedicalReport()}
          >
            Lưu
          </Button>

          <MedicalReportPdf
            medicalReport={medicalReport}
            reportDetail={reportDetail}
          />
        </Col>
      </Row>
    </Container>
  );
};
export default MedicalReportPrescription;
