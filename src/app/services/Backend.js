import axios from 'axios';

const backend = axios.create({
  baseURL: process.env.GENIUS_SONG_API_URL,
});

export default backend;
