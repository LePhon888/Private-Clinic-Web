import { Container, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

function MedicalReport() {
  function CustomActiveNav({ to, title }) {
    const path = window.location.pathname;
    return (
      <Link className={path === to ? "nav-link active" : "nav-link"} to={to}>
        {title}
      </Link>
    );
  }

  function MedicalReportNav() {
    return (
      <>
        <Container>
          <Nav variant="pills" className="me-auto">
            <CustomActiveNav
              to="/medical-report/patient-list/"
              title={"Danh sách bệnh nhân"}
            />
            <CustomActiveNav
              to="/medical-report/patient-report-list/"
              title={"Lịch sử khám bệnh"}
            />
            <CustomActiveNav
              to="/medical-report/prescription/"
              title={"Kê toa"}
            />
          </Nav>
        </Container>
      </>
    );
  }

  return <MedicalReportNav />;
}

export default MedicalReport;
