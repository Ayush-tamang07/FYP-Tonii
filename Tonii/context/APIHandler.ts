import axios from "axios";

const apiHandler = axios.create({
  baseURL: "https://4666-2404-7c00-52-6a4d-71fc-afb2-df79-db1f.ngrok-free.app/api",
  responseType: "json",
  withCredentials: true,
});

export default apiHandler;