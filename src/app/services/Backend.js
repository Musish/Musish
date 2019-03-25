import axios from 'axios';
import mappings from '../../backend/browse/mapping';

const client = axios.create({
  baseURL: process.env.BACKEND_URL,
});

export async function getArtist(id) {
  return client.get(`/genius/artist?artistId=${id}`);
}

export async function getGeniusData(artist, song) {
  return client.get(`/genius/song?name=${song}&artist=${artist}`);
}

export async function getBrowseOverview(storefrontId) {
  // TODO: FALLBACK TO EN-GB IF NO DATA MATCHES.

  const countryCode = storefrontId.toUpperCase();
  const store = mappings.find(c => c.code === countryCode);
  const defaultLanguage = store.languages[0];
  const { url } = defaultLanguage.sections.newMusic;

  const res = await client.get(url, {
    headers: {
      'X-Apple-Store-Front': `${store.storefrontId}-${defaultLanguage},32 t:music31`,
    },
  });

  return res.data;
}
