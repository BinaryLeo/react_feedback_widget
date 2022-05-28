import axios from 'axios';

export const api = axios.create({
   // baseURL: 'http://localhost:3333'
   baseURL: import.meta.env.VITE_API_URL
}); 