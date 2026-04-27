//central Axios instance used by ALL frontend service files
//instead of writing the base URL everywhere, we configure it once here
//every API call in the app goes through this file

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, //url from .env file
});

//interceptor: Automatically attach JWT token to every request
//this runs before every API call
api.interceptors.request.use((config) => {
  //get token from localStorage (saved after login)
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
