import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Header from "./components/Header";
import Footer from "./components/Footer";
import MedicalRegister from "./pages/MedicalRegister.jsx";
import Department from "./pages/Department";
import PatientList from "./pages/PatientList";
import { useReducer } from "react";
import { useContext } from "react";
import { createContext } from "react";
import UserReducer from "./reducers/UserReducer";
import cookie from "react-cookies";
import ScheduleDetail from "./pages/ScheduleDetail";
import MedicalReport from "./pages/MedicalReport";
import MedicalReportPatient from "./components/MedicalReportPatient";
import MedicalReportPatientReportHistory from "./components/MedicalReportPatientReportHistory";
import MedicalReportPrescription from "./components/MedicalReportPrescription";

export const UserContext = createContext();

function App() {
  const [user, dispatch] = useReducer(UserReducer, cookie.load("user") || null);
  return (
    <>
      <UserContext.Provider value={[user, dispatch]}>
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/medical-register" element={<MedicalRegister />} />
            <Route path="/department" element={<Department />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/patient-list" element={<PatientList />} />
            <Route path="/schedule-detail" element={<ScheduleDetail />} />
            <Route path="/medical-report/*" element={<MedicalReport />} />
            <Route
              path="/medical-report/patient-list/"
              element={<MedicalReportPatient />}
            />
            <Route
              path="/medical-report/patient-report-list/"
              element={<MedicalReportPatientReportHistory />}
            />
            <Route
              path="/medical-report/prescription/"
              element={<MedicalReportPrescription />}
            />
            <Route
              path="/medical-report/patient-list/"
              element={<MedicalReportPatient />}
            />
            <Route
              path="/medical-report/patient-report-list/"
              element={<MedicalReportPatientReportHistory />}
            />
            <Route
              path="/medical-report/prescription/"
              element={<MedicalReportPrescription />}
            />
          </Routes>
          <Footer />
        </BrowserRouter>
      </UserContext.Provider>
    </>
  );
}

export default App;
