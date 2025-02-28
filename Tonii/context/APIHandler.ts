import axios from "axios";

const apiHandler = axios.create({
  baseURL: "https://7fea-103-104-28-139.ngrok-free.app/api",
  responseType: "json",
  withCredentials: true,
});

export default apiHandler;