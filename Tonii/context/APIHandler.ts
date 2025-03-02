import axios from "axios";

const apiHandler = axios.create({
  baseURL: "https://1820-2404-7c00-4e-8f75-948c-57a1-9b0f-2495.ngrok-free.app/api",
  responseType: "json",
  withCredentials: true,
});

export default apiHandler;