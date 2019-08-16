import React, { ReactNode, useContext, useState } from 'react';

interface PlaylistsProviderProps {
  children: ReactNode;
}

interface PlaylistProviderValue {
  playlists: any[];
  setItems: (items: any) => void;
}

export const PlaylistsContext = React.createContext<PlaylistProviderValue>({
  playlists: [],
  setItems: () => undefined,
});

function PlaylistsProvider({ children }: PlaylistsProviderProps) {
  const [playlists, setItems] = useState([]);

  const state: PlaylistProviderValue = {
    playlists,
    setItems,
  };

  return <PlaylistsContext.Provider value={state}>{children}</PlaylistsContext.Provider>;
}

export default PlaylistsProvider;

export function usePlaylists() {
  return useContext(PlaylistsContext);
}
