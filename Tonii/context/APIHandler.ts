import axios from "axios";

const apiHandler = axios.create({
  baseURL: "https://a3bc-2404-7c00-52-2bb7-acfe-68a7-f54b-2a79.ngrok-free.app/api",
  responseType: "json",
  withCredentials: true,
});

export default apiHandler;  