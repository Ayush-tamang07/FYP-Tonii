import axios from "axios";

const apiHandler = axios.create({
  baseURL: "https://8e28-2400-1a00-bd11-67f2-c006-15fd-dadd-fe88.ngrok-free.app/api",
  responseType: "json",
  withCredentials: true,
});

export default apiHandler;