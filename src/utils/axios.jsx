import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3000", // ganti sesuai base URL kamu
});

// Intercept setiap response
instance.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Token expired or unauthorized
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login"; // redirect manual
    }
    return Promise.reject(error);
  }
);

export default instance;
