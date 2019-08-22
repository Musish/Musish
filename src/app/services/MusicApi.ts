import axios from 'axios';
import Alert from 'react-s-alert';
import { API_URL, getRatingUrl } from '../utils/Utils';
import QueryParameters = MusicKit.QueryParameters;

export function getNextSongs(path: string) {
  return axios({
    method: 'get',
    url: `${API_URL}${path}`,
    headers: getHeaders(),
  });
}

export async function addSongsToPlaylist(playlistId: any, songs: MusicKit.MediaItem[]) {
  const payload = {
    data: songs.map(song => ({
      id: song.id,
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

export async function addAlbumToPlaylist(playlistId: any, albumId: any) {
  const music = MusicKit.getInstance();

  const album = await (isNaN(albumId)
    ? music.api.library.album(albumId)
    : music.api.album(albumId));

  const tracks = album.relationships.tracks.data.map((track: MusicKit.MediaItem) => ({
    id: track.id,
    type: 'song',
  }));

  await addSongsToPlaylist(playlistId, tracks);
}

export async function addPlaylistToPlaylist(playlistId: any, sourcePlaylistId: any) {
  const music = MusicKit.getInstance();

  const playlist = await (sourcePlaylistId.startsWith('p.')
    ? music.api.library.playlist(sourcePlaylistId)
    : music.api.playlist(sourcePlaylistId));

  const tracks = playlist.relationships.tracks.data.map((track: MusicKit.MediaItem) => ({
    id: track.id,
    type: 'song',
  }));

  await addSongsToPlaylist(playlistId, tracks);
}

export async function addToLibrary(mediaType: string, mediaIds: string[]) {
  try {
    await axios({
      method: 'post',
      url: `${API_URL}/v1/me/library?ids[${mediaType}]=${mediaIds.map(m => m).join(',')}`,
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

export function infiniteLoadRelationships<I>(
  id: any,
  functionGenerator: (id: string, parameters?: QueryParameters) => Promise<I>,
  key: string,
  store: any,
  dataModifier = (d: any) => d,
) {
  return async ({ offset }: { limit: number; offset: number }, { page }: { page: number }) => {
    if (page === 0) {
      const playlist = await functionGenerator(id, { offset });
      const nextData = (playlist as any).relationships[key];

      // eslint-disable-next-line no-param-reassign
      store.nextUrl = nextData.next;

      return dataModifier(nextData.data);
    }

    if (!store.nextUrl) {
      return [];
    }

    const { data } = await getNextSongs(store.nextUrl);

    store.nextUrl = data.next;

    return dataModifier(data.data);
  };
}

// Okay, okay. This is horrible, I know. Am I a bad person for writing this? Maybe, but is whoever
// at Apple who designed the frameworks and APIs meaning we had to do this a bad person? Definitely.
// https://www.google.com/#q=Nearby+shops+selling+eye+wash
// https://www.google.com/images?q=cute+animals
export async function fetchFullCatalogAlbumFromLibraryAlbum(album: MusicKit.Resource) {
  const mk = MusicKit.getInstance();

  const firstSong = album.relationships.tracks.data.find(
    (t: MusicKit.MediaItem) =>
      t.attributes && t.attributes.playParams && t.attributes.playParams.catalogId,
  );

  if (!firstSong) {
    return null;
  }

  const firstSongId = firstSong.attributes.playParams.catalogId;
  const firstCatalogSong = await mk.api.song(firstSongId);

  for (const a of firstCatalogSong.relationships.albums.data) {
    const catalogAlbum = await mk.api.album(a.id);
    if (
      catalogAlbum.attributes.artistName === album.attributes.artistName &&
      catalogAlbum.attributes.albumName === album.attributes.albumName
    ) {
      return catalogAlbum;
    }
  }
  return null;
}

export async function getRating(type: string, id: any) {
  const url = getRatingUrl(type, id);

  if (!url) {
    return 0;
  }

  try {
    const response = await axios({
      method: 'get',
      url,
      headers: getHeaders(),
    });

    return response.data.data[0].attributes.value;
  } catch (e) {
    return 0;
  }
}

export async function setRating(type: string, id: any, rating: number) {
  const url = getRatingUrl(type, id);

  if (!url) {
    return 0;
  }

  if (rating === 0) {
    try {
      const response = await axios({
        method: 'delete',
        url,
        headers: getHeaders(),
      });
      return response.data.data[0].attributes.value;
    } catch (e) {
      return 0;
    }
  }

  try {
    const response = await axios({
      method: 'put',
      url,
      data: {
        type: 'rating',
        attributes: {
          value: rating,
        },
      },
      headers: getHeaders(),
    });
    return response.data.data[0].attributes.value;
  } catch (e) {
    return 0;
  }
}
