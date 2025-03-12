import axios from "axios";

const apiHandler = axios.create({
  baseURL: "https://1fd5-2001-df7-be80-369c-6847-b57a-f251-4333.ngrok-free.app/api",
  responseType: "json",
  withCredentials: true,
});

export default apiHandler;