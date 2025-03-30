import axios from "axios";

const apiHandler = axios.create({
  baseURL: "https://3575-2400-1a00-bd11-e324-70a0-7085-74b9-696e.ngrok-free.app/api",
  responseType: "json",
  withCredentials: true,
});

export default apiHandler;