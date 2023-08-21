import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Header from "./components/Header";
import Footer from "./components/Footer";
import MedicalRegister from "./pages/MedicalRegister.jsx";
import Department from "./pages/Department";
import PatientList from "./pages/PatientList";

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/medicalregister" element={<MedicalRegister />} />
          <Route path="/department" element={<Department />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/patientlist" element={<PatientList />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
