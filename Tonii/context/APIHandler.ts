import axios from "axios";

const apiHandler = axios.create({
  baseURL: "https://1873-2404-7c00-52-2e8-813d-92d5-9f2a-4d30.ngrok-free.app/api",
  responseType: "json",
  withCredentials: true,
});

export default apiHandler;