import axios from "axios";
import { useEffect, useState } from "react";
import { Container, Form, Button, ProgressBar, Spinner } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import DateRange from "./DateTimeRange";
import DateTimeRange from "./DateTimeRange";
function SelectedDoctorForm({ handleContinue, handleBack }) {
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState({});
  const [selectedDoctor, setSelectedDoctor] = useState({});
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [loading, setLoading] = useState(false);
  const isFormValid = selectedDepartment && selectedDoctor && date && time;

  useEffect(() => {
    const fetchDepartment = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          "http://localhost:8080/Clinic/api/departments"
        );
        setDepartments(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchDepartment();
  }, []);

  useEffect(() => {
    const fetchDoctorByDepartmentId = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:8080/Clinic/api/doctors?departmentId=${selectedDepartment.id}`
        );
        setDoctors(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchDoctorByDepartmentId();
  }, [selectedDepartment.id]);

  const handleDepartment = (e) => {
    const selectedIndex = e.target.selectedIndex;
    const selectedDept = departments[selectedIndex - 1]; // Subtract 1 because the first option is "Chọn chuyên khoa"
    setSelectedDepartment(selectedDept);
    setSelectedDoctor({});
  };
  const handleDoctor = (e) => {
    const selectedIndex = e.target.selectedIndex;
    const selectedDoctor = doctors[selectedIndex - 1]; // Subtract 1 because the first option is "Chọn chuyên khoa"
    setSelectedDoctor(selectedDoctor);
  };

  const handleChange = () => {
    handleContinue({ selectedDepartment, selectedDoctor, date, time });
  };

  const handleDate = (date) => {
    setDate(date);
  };
  const handleTime = (time) => {
    setTime(time);
  };

  return (
    <>
      <Row>
        <Col xs lg="6">
          <Form.Select
            required
            className="mb-2"
            id="selectDepartment"
            value={selectedDepartment.id}
            onChange={handleDepartment}
          >
            <option value="">Chọn chuyên khoa</option>
            {departments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.name}
              </option>
            ))}
          </Form.Select>
          {loading && <Spinner />}
          {selectedDepartment.id && (
            <Form.Select
              required
              className="mb-2"
              id="selectDoctor"
              value={selectedDoctor.id}
              onChange={handleDoctor}
            >
              <option value="">Chọn bác sĩ</option>
              {doctors.length === 0 ? (
                <option disabled>Không có bác sĩ</option>
              ) : (
                doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.userId.name}
                  </option>
                ))
              )}
            </Form.Select>
          )}
        </Col>
        {selectedDoctor.id && (
          <Col xs lg="6">
            <DateTimeRange handleDate={handleDate} handleTime={handleTime} />
          </Col>
        )}
      </Row>
      <div className="text-center mt-4">
        <Button
          className="px-5 py-2"
          style={{ marginRight: "10px" }}
          variant="outline-primary"
          onClick={handleBack}
        >
          Quay lại
        </Button>
        <Button
          className="px-5 py-2"
          onClick={handleChange}
          disabled={!isFormValid}
        >
          Tiếp tục
        </Button>
      </div>
    </>
  );
}

export default SelectedDoctorForm;
