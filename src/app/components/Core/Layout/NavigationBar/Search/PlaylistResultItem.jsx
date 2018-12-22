import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import classes from './SearchBar.scss';
import { artworkForMediaItem } from '../../../../../utils/Utils';
import ModalContext from '../../../../common/Modal/ModalContext';
import PlaylistPanel from '../../../Playlists/PlaylistPanel';

function PlaylistResultItem(props) {
  const { playlist, size } = props;

  return (
    <ModalContext.Consumer>
      {({ push }) => (
        <div
          className={cx(classes.result, classes.playlist)}
          onClick={() => push(<PlaylistPanel playlist={playlist} />)}
        >
          <span className={classes.artwork}>
            <img
              src={artworkForMediaItem(playlist, size)}
              alt={playlist.attributes.name}
              style={{ width: size, height: size }}
            />
          </span>

          <span className={classes.name}>{playlist.attributes.name}</span>
        </div>
      )}
    </ModalContext.Consumer>
  );
}

PlaylistResultItem.propTypes = {
  playlist: PropTypes.any.isRequired,
  size: PropTypes.any.isRequired,
};

export default PlaylistResultItem;
