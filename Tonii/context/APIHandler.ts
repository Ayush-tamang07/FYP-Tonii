import axios from "axios";

const apiHandler = axios.create({
  baseURL: "https://9d89-2404-7c00-52-d194-8476-fea0-53a6-22ef.ngrok-free.app/api",
  responseType: "json",
  withCredentials: true,
});

export default apiHandler;