import React from 'react';
import cx from "classnames";
import classes from "./SearchBar.scss";
import {Link} from "react-router-dom";
import * as PropTypes from "prop-types";
import AlbumResultItem from "./AlbumResultItem";

function ArtistResultItem({artist}) {
  return (
    <Link to={`/artists/${artist.id}`}>
      <div className={cx(classes.result, classes.artist)}>
        <span className={classes.name}>
          {artist.attributes.name}
        </span>
      </div>
    </Link>
  )
}

AlbumResultItem.propTypes = {
  artist: PropTypes.any,
};

export default ArtistResultItem;
