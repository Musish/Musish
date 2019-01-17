import axios from 'axios';

const backend = axios.create({
  baseURL: process.env.BACKEND_URL,
});

export default backend;
