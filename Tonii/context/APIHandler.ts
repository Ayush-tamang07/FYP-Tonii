import axios from "axios";

const apiHandler = axios.create({
  baseURL: "https://78aa-2400-1a00-bd11-80f1-3407-7fc0-9757-60bd.ngrok-free.app/api",
  responseType: "json",
  withCredentials: true
});

export default apiHandler;