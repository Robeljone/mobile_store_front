import axios, { InternalAxiosRequestConfig } from 'axios'

//check if the session expired

// Create an Axios instance
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', // Laravel API base URL
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// Add request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

//check if the jwt-token there in every request
export default api
