import axios from "axios";

const apiHandler = axios.create({
  baseURL: "https://8763-2404-7c00-4e-da22-2cb2-ee21-8ec1-b33c.ngrok-free.app/api",
  responseType: "json",
  withCredentials: true,
});

export default apiHandler;