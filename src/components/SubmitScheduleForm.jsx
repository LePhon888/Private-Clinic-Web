import axios from "axios";
import { useState } from "react";
import { Button, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function SubmitScheduleForm({ infoPatient, handleContinue, handleBack }) {
  const [success, setSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const changeFormatDate = (date) => {
    return date.toLocaleDateString("es-CL");
  };

  const filterInforPatient = {
    reason: infoPatient.reason,
    date: changeFormatDate(infoPatient.infoPatient.date),
    patient: {
      name: infoPatient.name,
      birthday: changeFormatDate(infoPatient.birthday),
      email: infoPatient.email,
      gender: infoPatient.gender,
      number: infoPatient.number,
      address: infoPatient.address,
    },
    doctorId: infoPatient.infoPatient.selectedDoctor,
    hourId: infoPatient.infoPatient.time,
  };
  console.log(filterInforPatient);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/Clinic/api/scheduledetail",
        filterInforPatient
      );

      if (response.status === 201) {
        setSuccess(true);
        handleContinue({ isSubmitted: true });
      } else {
        setIsError(true);
      }
    } catch (error) {}
  };
  return (
    <>
      {!success ? (
        <div>
          <h2>Xác nhận lịch khám</h2>
          <Table className="table-borderless">
            <thead>
              <tr>
                <th>Thông tin</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Khách hàng</td>
                <td>{infoPatient.name}</td>
              </tr>
              <tr>
                <td>Ngày sinh</td>
                <td>{changeFormatDate(infoPatient.birthday)}</td>
              </tr>
              <tr>
                <td>Email</td>
                <td>{infoPatient.email}</td>
              </tr>
              <tr>
                <td>Giới tính</td>
                <td>{infoPatient.gender === "male" ? "Nam" : "Nữ"}</td>
              </tr>
              <tr>
                <td>Số điện thoại</td>
                <td>{infoPatient.number}</td>
              </tr>
              <tr>
                <td>Địa chỉ</td>
                <td>{infoPatient.address}</td>
              </tr>
              <tr>
                <td>Lý do khám</td>
                <td>{infoPatient.reason}</td>
              </tr>
            </tbody>
            <thead>
              <tr>
                <th>Bác sĩ</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Bác sĩ</td>
                <td>{infoPatient.infoPatient.selectedDoctor.userId.name}</td>
              </tr>
              <tr>
                <td>Thời gian khám</td>
                <td>
                  {infoPatient.infoPatient.time.hour}{" "}
                  {changeFormatDate(infoPatient.infoPatient.date)}
                </td>
              </tr>
              <tr>
                <td>Chuyên khoa</td>
                <td>{infoPatient.infoPatient.selectedDepartment.name}</td>
              </tr>
            </tbody>
          </Table>
          <Button
            className="px-5 py-2"
            style={{ marginRight: "10px" }}
            variant="outline-primary"
            onClick={handleBack}
          >
            Quay lại
          </Button>
          <Button onClick={handleSubmit} className="px-5 py-2">
            Xác nhận đặt hẹn
          </Button>
        </div>
      ) : (
        <div>
          <div className="my-5">
            <h2>
              Đăng ký khám thành công chúng tôi sẽ xác nhận lịch khám qua email.
            </h2>
          </div>
          <Button className="px-5 py-2" onClick={() => navigate("/")}>
            Quay về trang chủ
          </Button>
        </div>
      )}
    </>
  );
}

export default SubmitScheduleForm;
