import React from 'react';
import { usePlaylists } from '../../Providers/PlaylistsProvider';
import classes from './PlaylistSelector.scss';

interface PlaylistSelectorProps {
  onClick?: (playlist: any) => void;
}

const PlaylistSelector: React.FC<PlaylistSelectorProps> = ({
  onClick = () => undefined,
}: PlaylistSelectorProps) => {
  const { playlists } = usePlaylists();

  return (
    <div>
      {playlists.map(playlist => (
        <div key={playlist.id} className={classes.playlist} onClick={() => onClick(playlist)}>
          {playlist.attributes.name}
        </div>
      ))}
    </div>
  );
};

export default PlaylistSelector;
