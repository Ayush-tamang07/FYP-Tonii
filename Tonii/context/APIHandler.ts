import axios from "axios";

const apiHandler = axios.create({
  baseURL: "",
  responseType: "json",
  withCredentials: true,
});

export default apiHandler;