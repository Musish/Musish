import React, { ReactNode, useContext, useState } from 'react';

interface IPlaylistsProviderProps {
  children: ReactNode;
}

interface IPlaylistProviderValue {
  playlists: any[];
  setItems: (items: any) => void;
}

export const PlaylistsContext = React.createContext<IPlaylistProviderValue>({
  playlists: [],
  setItems: () => undefined,
});

function PlaylistsProvider({ children }: IPlaylistsProviderProps) {
  const [playlists, setItems] = useState([]);

  const state: IPlaylistProviderValue = {
    playlists,
    setItems,
  };

  return <PlaylistsContext.Provider value={state}>{children}</PlaylistsContext.Provider>;
}

export default PlaylistsProvider;

export function usePlaylists() {
  return useContext(PlaylistsContext);
}
