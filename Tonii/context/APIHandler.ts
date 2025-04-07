import axios from "axios";

const apiHandler = axios.create({
  baseURL: "https://fab6-2404-7c00-4e-624f-382b-78ab-c026-4c68.ngrok-free.app/api",
  responseType: "json",
  withCredentials: true,
});

export default apiHandler;