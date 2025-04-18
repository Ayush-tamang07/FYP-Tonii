import axios from "axios";

const apiHandler = axios.create({
  baseURL: "https://419d-2400-1a00-bd11-67f2-88d4-c0f9-e73d-b176.ngrok-free.app/api",
  responseType: "json",
  withCredentials: true,
});

export default apiHandler;