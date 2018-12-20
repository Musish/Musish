import React from 'react';
import cx from "classnames";
import classes from "./SearchBar.scss";
import {artworkForMediaItem} from "../../../common/Utils";
import * as PropTypes from "prop-types";
import {Link} from "react-router-dom";

function AlbumResultItem(props) {
  let {album, size} = props;
  return (
    <Link to={`/albums/${album.id}`}>
      <div className={cx(classes.result, classes.album)}>
          <span className={classes.artwork}>
            <img src={artworkForMediaItem(album, size)} alt="" style={{width: size, height: size}}/>
          </span>

        <span className={classes.name}>
            {album.attributes.name}
          </span>
      </div>
    </Link>
  )
}

AlbumResultItem.propTypes = {
  album: PropTypes.any,
  size: PropTypes.any
};

export default AlbumResultItem;
