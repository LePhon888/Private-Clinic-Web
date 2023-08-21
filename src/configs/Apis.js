import axios from "axios";

const SERVER_CONTEXT = "/Clinic";

export const endpoints = {
  departments: `${SERVER_CONTEXT}/api/departments/`,
  doctors: `${SERVER_CONTEXT}/api/doctors/`,
  scheduleDetail: `${SERVER_CONTEXT}/api/scheduledetail/`,
};

export default axios.create({
  baseURL: "http://localhost:8080",
});
