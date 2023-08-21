import axios from "axios";
import { useEffect, useState } from "react";
import { Container, Form, Button, ProgressBar } from "react-bootstrap";

import SelectedDoctorForm from "./SelectedDoctorForm";
import SubmitScheduleForm from "./SubmitScheduleForm";
import PatientForm from "./PatientForm";

function MedicalRegisterForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [progressValue, setProgressValue] = useState(0);
  const [isProgressBar, setIsProgressBar] = useState(true);

  const [inforPatient, setInforPatient] = useState({
    name: "",
    email: "",
    number: "",
    address: "",
    gender: "",
    reason: "",
  });

  const handleContinue = (infoPatient) => {
    if (currentStep === 1) {
      setInforPatient({
        ...infoPatient,
      });
      setCurrentStep((prevStep) => prevStep + 1);
      setProgressValue((prevValue) => prevValue + 50);
    } else if (currentStep === 2) {
      setInforPatient((pre) => ({ ...pre, infoPatient }));
      setCurrentStep((prevStep) => prevStep + 1);
      setProgressValue((prevValue) => prevValue + 50);
    } else if (currentStep === 3) {
      if (infoPatient.isSubmitted) {
        setIsProgressBar(false);
      }
    }
  };
  const handleBack = () => {
    setCurrentStep((prevStep) => prevStep - 1);
    setProgressValue((prevValue) => prevValue - 50);
  };

  return (
    <Container>
      <h2 className="mb-4 mt-5">Đăng ký khám bệnh</h2>
      <div className="shadow p-5 mb-5 bg-white rounded">
        {/* Step 1 */}
        <h6 className="pb-1">
          Bước {currentStep}/3 -{" "}
          {currentStep === 1 && "Nhập thông tin người khám"}
          {currentStep === 2 && "Chọn bác sĩ khám và lịch khám"}
          {currentStep === 3 && "Xác nhận thông tin"}
        </h6>
        {isProgressBar && <ProgressBar now={progressValue} className="mb-4" />}
        {currentStep === 1 && (
          <PatientForm
            handleContinue={handleContinue}
            inforPatient={inforPatient}
          />
        )}

        {/* Step 2 */}
        {currentStep === 2 && (
          <SelectedDoctorForm
            handleContinue={handleContinue}
            handleBack={handleBack}
          />
        )}

        {/* Step 3 */}
        {currentStep === 3 && (
          <SubmitScheduleForm
            infoPatient={inforPatient}
            handleContinue={handleContinue}
            handleBack={handleBack}
          />
        )}
      </div>
    </Container>
  );
}

export default MedicalRegisterForm;
