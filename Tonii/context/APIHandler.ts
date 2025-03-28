import axios from "axios";

const apiHandler = axios.create({
  baseURL: "https://ca9a-2404-7c00-4e-b138-a19c-946f-3c9-5c47.ngrok-free.app/api",
  responseType: "json",
  withCredentials: true,
});

export default apiHandler;