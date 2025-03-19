import axios from "axios";

const apiHandler = axios.create({
  baseURL: "https://6f1a-2001-df7-be80-369c-1d99-b713-471-5622.ngrok-free.app/api",
  responseType: "json",
  withCredentials: true,
});

export default apiHandler;