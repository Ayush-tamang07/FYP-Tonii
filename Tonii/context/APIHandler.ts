import axios from "axios";

const apiHandler = axios.create({
  baseURL: "https://0842-2404-7c00-52-95da-a5e6-75cd-eaa2-f8cf.ngrok-free.app/api",
  responseType: "json",
  withCredentials: true,
});

export default apiHandler;  