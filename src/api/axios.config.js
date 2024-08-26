import axios from "axios"

const BASE_URL = 'http://localhost:5001'

const api = axios.create({
  withCredentials: true,
  baseURL: BASE_URL
});

export default api;