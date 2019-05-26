import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { LyricsModalContext } from './LyricsModalProvider';

export const PlaylistsContext = React.createContext({ playlists: [] });

function PlaylistsProvider({ children }) {
  const [playlists, setItems] = useState([]);

  const state = {
    playlists,
    setItems,
  };

  return (
    <LyricsModalContext.Provider value={state}>
      {children}
    </LyricsModalContext.Provider>
  );
}

PlaylistsProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

PlaylistsProvider.defaultTypes = {
  children: null,
};

export default PlaylistsProvider;

export function usePlaylists() {
  return useContext(PlaylistsContext);
}
