import axios from "axios";

const apiHandler = axios.create({
  baseURL: "https://4764-2404-7c00-4e-cca-4c94-cf6-a81a-3ee6.ngrok-free.app/api",
  responseType: "json",
  withCredentials: true,
});

export default apiHandler;