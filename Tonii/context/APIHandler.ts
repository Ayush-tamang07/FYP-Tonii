import axios from "axios";

const apiHandler = axios.create({
  baseURL: "https://4e6b-2400-1a00-bd11-71df-75ab-f6e1-4067-4530.ngrok-free.app/api",
  responseType: "json",
  withCredentials: true,
});

export default apiHandler;