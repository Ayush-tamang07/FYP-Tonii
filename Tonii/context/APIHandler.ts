import axios from "axios";

const apiHandler = axios.create({
  baseURL: "http://localhost:5500/api",
  responseType: "json",
  withCredentials: true,
});

export default apiHandler;