import cx from 'classnames';
import React from 'react';
import { Link } from 'react-router-dom';
import classes from './SearchBar.scss';

interface ArtistResultItemProps {
  artist: any;
}

const ArtistResultItem: React.FC<ArtistResultItemProps> = ({ artist }) => {
  const link = isNaN(artist.id) ? `/me/artists/${artist.id}` : `/artist/${artist.id}`;
  const isCatalog = artist.type === 'artists';

  return (
    <Link to={link}>
      <div className={cx(classes.result, classes.artist)}>
        {isCatalog && <i className={'fab fa-apple'} />}
        <span>{artist.attributes.name}</span>
      </div>
    </Link>
  );
};

export default ArtistResultItem;
