import axios from "axios";

const apiHandler = axios.create({
  baseURL: "https://fcb4-2404-7c00-4e-d786-71f2-344f-6f2-6259.ngrok-free.app/api",
  responseType: "json",
  withCredentials: true,
});

export default apiHandler;  