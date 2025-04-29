import axios from "axios";

const apiHandler = axios.create({
  baseURL: "https://bd75-2404-7c00-4e-9cc-f8b5-815f-eb66-f4f9.ngrok-free.app/api",
  responseType: "json",
  withCredentials: true,
});

export default apiHandler;