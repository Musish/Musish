import axios from 'axios';

const backend = axios.create({
  baseURL: process.env.GENIUS_API_URL,
});

export default backend;
