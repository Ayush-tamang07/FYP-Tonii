import axios from "axios";

const apiHandler = axios.create({
  baseURL: "https://8bc7-2404-7c00-52-6f63-9c2f-577-b5f7-dd68.ngrok-free.app/api",
  responseType: "json",
  withCredentials: true,
});

export default apiHandler;