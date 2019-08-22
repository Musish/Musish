import React from 'react';
import { Link } from 'react-router-dom';
import classes from './ArtistItem.scss';

interface ArtistItemProps {
  artist: any;
  size: number;
}

const ArtistItem: React.FC<ArtistItemProps> = ({ artist, size }: ArtistItemProps) => {
  const link = isNaN(artist.id) ? `/me/artists/${artist.id}` : `/artist/${artist.id}`;
  const initials = artist.attributes.name
    .split(' ')
    .map((n: string) => n.substring(0, 1))
    .filter((c: string) => !/[^a-zA-Z0-9]/.test(c))
    .slice(0, 2);

  return (
    <Link to={link}>
      <div className={classes.container}>
        <div>
          <span className={classes.pictureWrapper} style={{ width: size, height: size }}>
            <span>{initials}</span>
          </span>
        </div>
        <div className={classes.descriptionContainer}>
          <span className={classes.artistName}>{artist.attributes.name}</span>
        </div>
      </div>
    </Link>
  );
};

export default ArtistItem;
