import axios from "axios";
import moment from "moment/moment";
import { useEffect, useState } from "react";
import {
  Container,
  Form,
  Button,
  ProgressBar,
  Row,
  Col,
  FloatingLabel,
} from "react-bootstrap";
import DatePicker from "react-datepicker";

function PatientForm({ handleContinue, inforPatient }) {
  const [name, setName] = useState(inforPatient.name || "");
  const [email, setEmail] = useState(inforPatient.email || "");
  const [number, setNumber] = useState(inforPatient.number || "");
  const [address, setAddress] = useState(inforPatient.address || "");
  const [reason, setReason] = useState(inforPatient.reason || "");
  const [gender, setGender] = useState(inforPatient.gender || "");
  const [birthday, setBirthday] = useState(inforPatient.birthday || "");
  const [validated, setValidated] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = { name, email, birthday, number, address, gender, reason };
    const patientForm = document.getElementById("patientForm");
    if (patientForm.checkValidity()) {
      handleContinue(formData);
    } else {
      patientForm.reportValidity();
    }
  };

  return (
    <Form
      onSubmit={handleSubmit}
      id="patientForm"
      validated={validated}
      className="mb-5 bg-white rounded"
    >
      <Row>
        <Col xs lg="6">
          <Row>
            <Col xs lg="8">
              <Form.Group className="mb-3" controlId="fullName">
                <Form.Control
                  required
                  type="text"
                  placeholder="Nhập họ và tên (*)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col xs lg="4">
              <Form.Check
                name="grouped"
                required
                inline
                label="Nam"
                type="radio"
                checked={gender === "male"}
                onChange={() => setGender("male")}
              />
              <Form.Check
                name="grouped"
                required
                inline
                label="Nữ"
                type="radio"
                checked={gender === "female"}
                onChange={() => setGender("female")}
              />
            </Col>
          </Row>
          <DatePicker
            required
            selected={birthday}
            onChange={(date) => setBirthday(date)}
            dateFormat="dd-MM-yyyy"
            maxDate={moment().subtract(18, "years")._d}
            minDate={moment().subtract(100, "years")._d} // Convert moment object to Date
            showYearDropdown
            scrollableYearDropdown
            placeholderText={"Chọn ngày sinh (*)"}
            className="my-3"
          />
          <Form.Group className="mb-3" controlId="email">
            <Form.Control
              required
              type="email"
              placeholder="Nhập email để nhận lịch hẹn (*)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="phoneNumber">
            <Form.Control
              required
              type="tel"
              placeholder="Nhập số điện thoại (*)"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="address">
            <Form.Control
              required
              as="textarea"
              rows={3}
              placeholder="Nhập địa chỉ (*)"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col xs lg="6">
          <FloatingLabel
            controlId="floatingTextarea2"
            label="Vui lòng mô tả rõ triệu chứng của bạn và nhu cầu khám (*)"
          >
            <Form.Control
              as="textarea"
              required
              placeholder="Leave a comment here"
              style={{ height: "300px" }}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </FloatingLabel>
        </Col>
      </Row>

      <div className="text-center mt-4">
        <Button className="px-5 py-2" type="submit">
          Tiếp tục
        </Button>
      </div>
    </Form>
  );
}

export default PatientForm;
