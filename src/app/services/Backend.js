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
  // CUSTOM: SERVERLESS
  //const res = await client.get('https://gist.githubusercontent.com/BrychanOdlum/ffcf322bec4c7d648971f976a33b677c/raw/5e957c69765203224e61d6c353b64761ef3ab1ab/browse-dummy.json');

  // ACTIVITY: DECADES
  //const res = await client.get('https://gist.githubusercontent.com/BrychanOdlum/b94d5118559a15f513138776268308a7/raw/4aa871e667c1f12b1c5eeb8289334a3b05d029cd/itunesSample2.json');

  // BROWSE: OVERVIEW
  const res = await client.get('https://gist.githubusercontent.com/BrychanOdlum/25554c18f58bd5e412bd4ea9aa823498/raw/caba5c85a6bfc9b63e4e1f9cae29d3f5e68b7228/iTunesSampleOverview.json');
  return res.data;
}
