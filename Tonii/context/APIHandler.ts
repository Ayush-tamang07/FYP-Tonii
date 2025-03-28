import axios from "axios";

const apiHandler = axios.create({
  baseURL: "https://2c25-2404-7c00-4e-b138-c4b5-6936-f5ef-d5c5.ngrok-free.app/api",
  responseType: "json",
  withCredentials: true,
});

export default apiHandler;