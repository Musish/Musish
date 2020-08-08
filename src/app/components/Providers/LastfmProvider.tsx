import axios, { AxiosRequestConfig } from 'axios';
import md5 from 'js-md5';
import qs from 'qs';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import Alert from 'react-s-alert';
import withMK from '../../hoc/withMK';
import useMK from '../../hooks/useMK';
import translate from '../../utils/translations/Translations';

const MIN_SCROBBLE_SONG_LENGTH_MS = 30000; // Last.fm recommends: 30s
const MAX_SCROBBLE_WAIT_MS = 240000; // Last.fm recommends 4m
const SCROBBLE_THRESHOLD = 0.5; // Last.fm recommends: >= 50%

enum UpdateType {
  Scrobble,
  UpdateNowPlaying,
}

const apikey = process.env.LASTFM_API_KEY;
const secret = process.env.LASTFM_SECRET;

const SK_STORAGE_KEY = 'lastfm_sk';

interface LastfmProviderProps extends MKProps {
  children: ReactNode;
}

export interface LastfmProviderValue {
  login: () => void;
  reset: () => void;
  connected: boolean;
}

function getSK() {
  return localStorage.getItem(SK_STORAGE_KEY);
}

export const LastfmContext = React.createContext<LastfmProviderValue>({
  connected: !!getSK(),
  login: () => undefined,
  reset: () => undefined,
});

const LastfmProvider: React.FC<LastfmProviderProps> = ({ children, mk }: LastfmProviderProps) => {
  const [connected, setConnected] = useState(() => !!getSK());
  const trackStatus = useRef({
    id: '',
    playTimeMs: 0,
    playingSince: 0,
    scrobbleTimeoutId: 0,
    hasScrobbled: false,
  }).current;

  async function request(isWrite: boolean, method: string, callParams = {}, sk = true) {
    const params: any = {
      ...callParams,
      method,
      api_key: apikey,
    };

    if (sk) {
      params.sk = getSK();
    }

    params.api_sig = sign(params);
    params.format = 'json';

    const config: AxiosRequestConfig = {
      url: 'https://ws.audioscrobbler.com/2.0/',
    };

    if (isWrite) {
      config.method = 'POST';
      config.data = qs.stringify(params);
    } else {
      config.method = 'GET';
      config.params = params;
    }

    const { data } = await axios.request(config);

    return data;
  }

  async function sendUpdate(type: UpdateType, item: MusicKit.MediaItem) {
    const params =
      type === UpdateType.Scrobble
        ? {
            'artist[0]': item.artistName,
            'track[0]': item.title,
            'timestamp[0]': Math.floor(Date.now() / 1000),
            'album[0]': item.albumName,
            'trackNumber[0]': item.trackNumber,
            'duration[0]': Math.round(item.playbackDuration / 1000),
          }
        : {
            artist: item.artistName,
            track: item.title,
            album: item.albumName,
            trackNumber: item.trackNumber,
            duration: Math.round(item.playbackDuration / 1000),
          };

    try {
      await request(
        true,
        type === UpdateType.Scrobble ? 'track.scrobble' : 'track.updateNowPlaying',
        params,
      );
    } catch (e) {
      if (e.response && e.response.data) {
        const { data } = e.response;

        if ([4, 9, 10, 14, 17].includes(data.error)) {
          Alert.error(data.message);

          reset();
          return;
        }
      }

      throw e;
    }
  }

  function sign(params: any) {
    const str = Object.keys(params)
      .sort()
      .reduce((result, key) => `${result}${key}${params[key]}`, '');

    return md5(`${str}${secret}`);
  }

  function login() {
    const url = new URL(window.location.href);
    url.searchParams.set('auth', 'lastfm');
    url.searchParams.delete('token');

    const cb = encodeURIComponent(url.href);
    window.location.href = `http://www.last.fm/api/auth/?api_key=${apikey}&cb=${cb}`;
  }

  async function fetchSK(token: string) {
    const params = {
      token,
    };

    const data = await request(true, 'auth.getSession', params, false);

    localStorage.setItem(SK_STORAGE_KEY, data.session.key);

    setConnected(true);
  }

  function reset() {
    setConnected(false);

    localStorage.removeItem(SK_STORAGE_KEY);
  }

  async function fetchToken() {
    const urlParams = new URLSearchParams(window.location.search);
    const auth = urlParams.get('auth');

    if (auth === 'lastfm') {
      const token = urlParams.get('token');

      if (window.history.pushState) {
        const url = new URL(window.location.href);
        url.searchParams.delete('auth');
        url.searchParams.delete('token');

        const newUrl = url.href;

        window.history.pushState({ path: newUrl }, document.title, newUrl);
      }

      if (token) {
        try {
          await fetchSK(token);
          Alert.success(translate.lfmConnectSuccess);
        } catch (e) {
          reset();
          Alert.error(translate.lfmConnectError);
        }
      } else {
        reset();
      }
    }
  }

  useEffect(() => {
    fetchToken();
  }, []);

  useMK({
    mediaItem: MusicKit.Events.mediaItemDidChange,
    playbackState: MusicKit.Events.playbackStateDidChange,
  });

  const state: LastfmProviderValue = {
    login,
    reset,
    connected,
  };

  if (connected) {
    const track = mk.mediaItem && mk.mediaItem.item;
    const player = mk.instance.player;

    // Cancels upcoming scrobbles and schedules a new scrobble
    const scheduleScrobble = () => {
      clearTimeout(trackStatus.scrobbleTimeoutId);

      if (
        !trackStatus.hasScrobbled &&
        track &&
        track.playbackDuration > MIN_SCROBBLE_SONG_LENGTH_MS
      ) {
        trackStatus.scrobbleTimeoutId = window.setTimeout(() => {
          trackStatus.hasScrobbled = true;
          sendUpdate(UpdateType.Scrobble, track);
        }, Math.min(MAX_SCROBBLE_WAIT_MS, track.playbackDuration * SCROBBLE_THRESHOLD - trackStatus.playTimeMs));
      }
    };

    // Reset scrobble-status
    if (
      // New track has started playing
      (track && trackStatus.id !== track.id) ||
      // Track is being repeated
      (player.currentPlaybackProgress === 0 && trackStatus.hasScrobbled)
    ) {
      trackStatus.id = track.id;
      trackStatus.playTimeMs = 0;
      trackStatus.playingSince = 0;
      trackStatus.hasScrobbled = false;

      sendUpdate(UpdateType.UpdateNowPlaying, track);
    }

    // Started playing
    if (player.isPlaying) {
      if (!trackStatus.playingSince) {
        trackStatus.playingSince = performance.now();
        scheduleScrobble();
      }
    }
    // Stopped playing
    else {
      if (trackStatus.playingSince) {
        trackStatus.playTimeMs += performance.now() - trackStatus.playingSince;
        trackStatus.playingSince = 0;
      }
      clearTimeout(trackStatus.scrobbleTimeoutId);
    }
  }

  return <LastfmContext.Provider value={state}>{children}</LastfmContext.Provider>;
};

const bindings = {
  [MusicKit.Events.mediaItemDidChange]: 'mediaItem',
};

export default withMK(LastfmProvider, bindings);
