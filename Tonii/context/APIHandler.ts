import axios from "axios";

const apiHandler = axios.create({
  baseURL: "https://cbef-2404-7c00-52-7ab5-d0cc-ef9b-cf54-7a53.ngrok-free.app/api",
  responseType: "json",
  withCredentials: true,
});

export default apiHandler;  