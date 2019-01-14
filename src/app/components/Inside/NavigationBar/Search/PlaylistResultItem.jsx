import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import classes from './SearchBar.scss';
import { artworkForMediaItem } from '../../../../utils/Utils';
import ModalContext from '../../../Common/Modal/ModalContext';
import PlaylistPanel from '../../../Common/PlaylistPanel/PlaylistPanel';

function PlaylistResultItem(props) {
  const { playlist, size } = props;
  const isCatalog = playlist.type === 'playlists';

  return (
    <ModalContext.Consumer>
      {({ push }) => (
        <div
          className={cx(classes.result, classes.playlist)}
          onClick={() => push(<PlaylistPanel playlist={playlist} />)}
        >
          <span className={classes.artwork}>
            {isCatalog && (
              <div className={classes.catalogIndicator}>
                <i className={'fab fa-apple'} />
              </div>
            )}
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
