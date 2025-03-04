import axios from "axios";

const apiHandler = axios.create({
  baseURL: "https://6b5f-2404-7c00-52-a076-643d-7a0e-33c8-2936.ngrok-free.app/api",
  responseType: "json",
  withCredentials: true,
});

export default apiHandler;