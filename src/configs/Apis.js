import axios from "axios";
import cookie from "react-cookies";

const SERVER_CONTEXT = "/Clinic";
const SERVER = "http://localhost:8080";

export const endpoints = {
  departments: `${SERVER_CONTEXT}/api/departments/`,
  doctors: `${SERVER_CONTEXT}/api/doctors/`,
  hours: `${SERVER_CONTEXT}/api/hours/`,
  scheduleDetail: `${SERVER_CONTEXT}/api/schedule-details/`,
  scheduleDetailByPatientId: `${SERVER_CONTEXT}/api/schedule-details`,
  updateIsConfirm: `${SERVER_CONTEXT}/api/schedule-detail/`,
  updateIsCancel: `${SERVER_CONTEXT}/api/schedule-detail/cancel/`,
  bill: `${SERVER_CONTEXT}/api/bill`,
  medicineBill: `${SERVER_CONTEXT}/api/medicine-bill`,
  medicalReport: `${SERVER_CONTEXT}/api/medical-report`,
  login: `${SERVER_CONTEXT}/api/login/`,
  currentUser: `${SERVER_CONTEXT}/api/current-user/`,
  register: `${SERVER_CONTEXT}/api/users/`,
  patient: `${SERVER_CONTEXT}/api/patient/`,
  numberOfPatients: `${SERVER_CONTEXT}/api/new-regulation/`,
};

export const authApi = () => {
  return axios.create({
    baseURL: SERVER,
    headers: {
      Authorization: cookie.load("token"),
    },
  });
};

export default axios.create({
  baseURL: SERVER,
});
