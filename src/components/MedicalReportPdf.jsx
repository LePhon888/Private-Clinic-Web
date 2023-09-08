import React from "react";
import html2pdf from "html-to-pdf-js";
import { Button } from "react-bootstrap";

const MedicalReportPdf = ({ medicalReport, reportDetail }) => {
  const formatDatePdf = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `Ngày ${day} tháng ${month} năm ${year}`;
  };

  const generatePDF = () => {
    const htmlContent = `
  <div style="padding: 10px 35px 0 35px;">
    <table style="width: 100%; margin: 0 auto;">
        <tr>
            <td>
            <img src="/logo512.png" alt="Logo" style="max-width: 60px">
            <strong> QUẢN LÝ PHÒNG MẠCH TƯ</strong>
            </td>
        </tr>
        <tr>
            <td colspan="3" style="text-align: center;"> <h2>ĐƠN THUỐC</h2></td>
        </tr>
        <tr>
            <td><p><strong>Họ tên:</strong> ${
              medicalReport.patientId.userId.name
            }</p></td>
            <td><p><strong>Giới tính:</strong> ${
              medicalReport.patientId.userId.gender === "male" ? "Nam" : "Nữ"
            }</p></td>
            <td><p><strong>Năm sinh:</strong> ${medicalReport.patientId.userId.birthday.substring(
              0,
              4
            )}</p></td>
        </tr>

        <tr>
            <td><p><strong>Địa chỉ:</strong> ${
              medicalReport.patientId.userId.address
            }</p></td>
        </tr>

        <tr>
            <td><p><strong>Triệu chứng:</strong> ${
              medicalReport.symptom
            }</p></td>
        </tr>

        <tr>
            <td><p><strong>Chuẩn đoán:</strong> ${
              medicalReport.diagnose
            }</p></td>
        </tr>
       ${
         reportDetail.length > 0 &&
         `
        <tr>
        <td><p><strong><u>Chỉ định dùng thuốc:</u></strong></p></td>
        </tr>
       `
       }
       
        
        <table style="width: 95%">
        ${reportDetail
          .map(
            (detail, index) => `
        <tr>
            <td style="width: 50px;"><p>${index + 1}.</p></td>
            <td>
                <p><strong>${detail.medicineUnitId.medicineId.name}</strong></p>
                <p><i>Cách dùng: ${detail.usageInfo}</i></p>
            </td>
            <td>
                <p>x ${detail.quantity} ${
              detail.medicineUnitId.unitId.name === "pill"
                ? "Viên"
                : detail.medicineUnitId.unitId.name === "bottle"
                ? "Chai"
                : detail.medicineUnitId.unitId.name === "jar"
                ? "Lọ"
                : detail.medicineUnitId.unitId.name === "tablet"
                ? "Vỉ"
                : "Gói"
            }</p>
            </td>
        </tr>
      `
          )
          .join("")}
        </table>

        <div style="text-align: right; padding-right: 15px;">
            <p><i>${formatDatePdf(medicalReport.createdDate)}</i></p>
            <p style="text-align: right; margin-right: 25px;"><strong>Bác sĩ khám bệnh</strong></p>
            <p style="text-align: right; margin-right: 25px;"><strong>${
              medicalReport.doctorId.name
            }</strong></p>
        </div>
    </table>
   
  </div>`;
    html2pdf(htmlContent);
  };

  return (
    <Button
      variant="primary"
      className="mx-1 my-2"
      onClick={() => generatePDF()}
    >
      In pdf
    </Button>
  );
};

export default MedicalReportPdf;
