import axios from 'axios';
import Alert from 'react-s-alert';
import { API_URL } from '../utils/Utils';

export function getNextSongs(path) {
  return axios({
    method: 'get',
    url: `${API_URL}${path}`,
    headers: getHeaders(),
  });
}

export async function addSongsToPlaylist(playlistId, songs) {
  const payload = {
    data: songs.map(song => ({
      id: song,
      type: 'song',
    })),
  };

  try {
    await axios({
      method: 'post',
      url: `${API_URL}/v1/me/library/playlists/${playlistId}/tracks`,
      data: payload,
      headers: getHeaders(),
    });
    Alert.success("Added to your playlist, it'll show up in a few seconds. Hold tight!");
  } catch (error) {
    Alert.error("You're unable to add songs to this playlist.");
  }
}

export async function addAlbumToPlaylist(playlistId, albumId) {
  const music = MusicKit.getInstance();

  const album = await (isNaN(albumId)
    ? music.api.library.album(albumId)
    : music.api.album(albumId));

  const tracks = album.relationships.tracks.data.map(track => ({
    id: track.id,
    type: 'song',
  }));

  await addSongsToPlaylist(playlistId, tracks);
}

export async function addPlaylistToPlaylist(playlistId, sourcePlaylistId) {
  const music = MusicKit.getInstance();

  const playlist = await (sourcePlaylistId.startsWith('p.')
    ? music.api.library.playlist(sourcePlaylistId)
    : music.api.playlist(sourcePlaylistId));

  const tracks = playlist.relationships.tracks.data.map(track => ({
    id: track.id,
    type: 'song',
  }));

  await addSongsToPlaylist(playlistId, tracks);
}

export async function addToLibrary(mediaType, media) {
  try {
    await axios({
      method: 'post',
      url: `${API_URL}/v1/me/library?ids[${mediaType}]=${media.map(m => m).join(',')}`,
      headers: getHeaders(),
    });
    Alert.success("Added tracks to your library, they'll show up in a few seconds. Hold tight!");
  } catch (error) {
    Alert.error("We're unable to add these tracks to your library.");
  }
}

export function getHeaders() {
  const music = MusicKit.getInstance();

  return {
    Authorization: `Bearer ${music.developerToken}`,
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Music-User-Token': music.musicUserToken,
  };
}

export function infiniteLoadRelationships(id, functionGenerator, key, store) {
  return async ({ offset, ...rest1 }, { page, ...rest2 }) => {
    if (page === 0) {
      const playlist = await functionGenerator(id, { offset });

      const data = playlist.relationships[key];

      // eslint-disable-next-line no-param-reassign
      store.nextUrl = data.next;

      return data.data;
    }

    if (!store.nextUrl) {
      return [];
    }

    const { data } = await getNextSongs(store.nextUrl);

    // eslint-disable-next-line no-param-reassign
    store.nextUrl = data.next;

    return data.data;
  };
}
