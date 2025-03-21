import axios from "axios";

const apiHandler = axios.create({
  baseURL: "https://dc38-2400-1a00-bd11-7321-c94c-7435-5fe4-55ae.ngrok-free.app/api",
  responseType: "json",
  withCredentials: true,
});

export default apiHandler;  