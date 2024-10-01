import axios from "axios";

const baseURL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/v1/"
    : "/api/v1/";

const axiosInstance = axios.create({
  baseURL,
});

export default axiosInstance;
