import axios, { AxiosRequestConfig } from 'axios';
import md5 from 'js-md5';
import qs from 'qs';
import React, { ReactNode, useEffect, useState } from 'react';
import Alert from 'react-s-alert';
import withMK from '../../hoc/withMK';
import translate from '../../utils/translations/Translations';

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

  async function scrobble(item: MusicKit.MediaItem) {
    const params = {
      'artist[0]': item.artistName,
      'track[0]': item.title,
      'timestamp[0]': Math.floor(Date.now() / 1000),
      'album[0]': item.albumName,
      'trackNumber[0]': item.trackNumber,
    };

    try {
      await request(true, 'track.scrobble', params);
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

  useEffect(() => {
    if (connected && mk.mediaItem && mk.mediaItem.item) {
      scrobble(mk.mediaItem.item);
    }
  }, [mk.mediaItem]);

  const state: LastfmProviderValue = {
    login,
    reset,
    connected,
  };

  return <LastfmContext.Provider value={state}>{children}</LastfmContext.Provider>;
};

const bindings = {
  [MusicKit.Events.mediaItemDidChange]: 'mediaItem',
};

export default withMK(LastfmProvider, bindings);
