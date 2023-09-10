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
  reportDetail: `${SERVER_CONTEXT}/api/report-details/`,
  medicalReport: `${SERVER_CONTEXT}/api/medical-report/`,
  category: `${SERVER_CONTEXT}/api/categories/`,
  medicine: `${SERVER_CONTEXT}/api/medicines/`,
  medicineUnit: `${SERVER_CONTEXT}/api/medicine-unit/`,

  login: `${SERVER_CONTEXT}/api/login/`,
  currentUser: `${SERVER_CONTEXT}/api/current-user/`,
  register: `${SERVER_CONTEXT}/api/users/`,
  patient: `${SERVER_CONTEXT}/api/patient/`,
  numberOfPatients: `${SERVER_CONTEXT}/api/new-regulation/`,
  userByEmail: `${SERVER_CONTEXT}/api/user/get-by-email`,
  userByPhoneNumber: `${SERVER_CONTEXT}/api/user/get-by-phonenumber`,
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
