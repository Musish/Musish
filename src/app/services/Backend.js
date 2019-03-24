import axios from 'axios';

const client = axios.create({
  baseURL: process.env.BACKEND_URL,
});

export async function getArtist(id) {
  return client.get(`/genius/artist?artistId=${id}`);
}

export async function getGeniusData(artist, song) {
  return client.get(`/genius/song?name=${song}&artist=${artist}`);
}

export async function getBrowseOverview() {
  const res = await client.get('https://gist.githubusercontent.com/BrychanOdlum/ffcf322bec4c7d648971f976a33b677c/raw/5e957c69765203224e61d6c353b64761ef3ab1ab/browse-dummy.json');
  return res.data;
}
