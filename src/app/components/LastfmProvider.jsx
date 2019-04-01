import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import md5 from 'js-md5';
import axios from 'axios';
import qs from 'qs';
import Alert from 'react-s-alert';
import withMK from '../hoc/withMK';

const apikey = process.env.LASTFM_API_KEY;
const secret = process.env.LASTFM_SECRET;

function getSK() {
  return localStorage.getItem('lastfm_sk');
}

export const LastfmContext = React.createContext({ connected: !!getSK() });

function LastfmProvider({ children, mk }) {
  const [connected, setConnected] = useState(!!getSK());

  async function request(isWrite, method, callParams = {}, sk = true) {
    const params = {
      ...callParams,
      method,
      api_key: apikey,
    };

    if (sk) {
      params.sk = localStorage.getItem('lastfm_sk');
    }

    params.api_sig = sign(params);
    params.format = 'json';

    const config = {
      url: 'http://ws.audioscrobbler.com/2.0/',
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

  async function scrobble(item) {
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

  function sign(params) {
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

  async function fetchSK(token) {
    localStorage.setItem('lastfm_token', token);

    const params = {
      token,
    };

    const data = await request(true, 'auth.getSession', params, false);

    localStorage.setItem('lastfm_sk', data.session.key);

    setConnected(true);
  }

  function reset() {
    setConnected(false);

    localStorage.removeItem('lastfm_sk');
    localStorage.removeItem('lastfm_token');
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
        } catch (e) {
          reset();
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
    if (mk.mediaItem && mk.mediaItem.item) {
      scrobble(mk.mediaItem.item);
    }
  }, [mk.mediaItem]);

  const state = {
    login,
    reset,
    connected,
  };

  return <LastfmContext.Provider value={state}>{children}</LastfmContext.Provider>;
}

LastfmProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  mk: PropTypes.any.isRequired,
};

const bindings = {
  [MusicKit.Events.mediaItemDidChange]: 'mediaItem',
};

export default withMK(LastfmProvider, bindings);
