import axios from "axios";

const apiHandler = axios.create({
  baseURL: "https://e711-2404-7c00-52-356a-6cb9-9588-c148-c377.ngrok-free.app/api",
  responseType: "json",
  withCredentials: true,
});

export default apiHandler;