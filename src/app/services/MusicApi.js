import axios from 'axios';
import { API_URL } from '../utils/Utils';

export default class MusicApi {
  static getNextSongs(path) {
    return axios({
      method: 'get',
      url: `${API_URL}${path}`,
      headers: this.getHeaders(),
    });
  }

  static addSongsToPlaylist(playlistId, songs) {
    const payload = {
      data: songs.map(song => ({
        id: song,
        type: 'song',
      })),
    };

    return axios({
      method: 'post',
      url: `${API_URL}/v1/me/library/playlists/${playlistId}/tracks`,
      data: payload,
      headers: this.getHeaders(),
    });
  }

  static async addAlbumToPlaylist(playlistId, albumId) {
    const music = MusicKit.getInstance();

    const album = await (isNaN(albumId)
      ? music.api.library.album(albumId)
      : music.api.album(albumId));

    const tracks = album.relationships.tracks.data.map(track => ({
      id: track.id,
      type: 'song',
    }));

    const payload = {
      data: tracks,
    };

    return axios({
      method: 'post',
      url: `${API_URL}/v1/me/library/playlists/${playlistId}/tracks`,
      data: payload,
      headers: this.getHeaders(),
    });
  }

  static async addPlaylistToPlaylist(playlistId, sourcePlaylistId) {
    const music = MusicKit.getInstance();

    const playlist = await (sourcePlaylistId.startsWith('p.')
      ? music.api.library.playlist(sourcePlaylistId)
      : music.api.playlist(sourcePlaylistId));

    const tracks = playlist.relationships.tracks.data.map(track => ({
      id: track.id,
      type: 'song',
    }));

    const payload = {
      data: tracks,
    };

    return axios({
      method: 'post',
      url: `${API_URL}/v1/me/library/playlists/${playlistId}/tracks`,
      data: payload,
      headers: this.getHeaders(),
    });
  }

  static getHeaders() {
    const music = MusicKit.getInstance();

    return {
      Authorization: `Bearer ${music.developerToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Music-User-Token': music.musicUserToken,
    };
  }
}
