import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';

export const PlaylistsContext = React.createContext({});

function PlaylistsProvider({ children }) {
  const [playlists, setItems] = useState([]);

  const state = {
    playlists,
    setItems,
  };

  return (
    <PlaylistsContext.Provider value={state}>
      {children}
    </PlaylistsContext.Provider>
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
