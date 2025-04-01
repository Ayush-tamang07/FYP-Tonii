import axios from "axios";

const apiHandler = axios.create({
  baseURL: "https://1797-2404-7c00-52-d196-479-5aec-1dc0-c36b.ngrok-free.app/api",
  responseType: "json",
  withCredentials: true,
});

export default apiHandler;