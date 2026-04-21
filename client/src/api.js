import axios from 'axios';

// Add responsive fallback for baseURL (e.g. for Vercel/Render deployments later)
const api = axios.create({
  baseURL: window.location.hostname === 'localhost' ? 'http://localhost:5002/api' : '/api'
});

api.interceptors.request.use(req => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default api;
