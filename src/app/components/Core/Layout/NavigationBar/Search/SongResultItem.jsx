import React from 'react';
import cx from 'classnames';
import * as PropTypes from 'prop-types';
import classes from './SearchBar.scss';
import withMK from '../../../../../hoc/withMK';
import { createMediaItem } from '../../../../../utils/Utils';
import SongDecoration from '../../../Songs/SongList/SongDecoration';

function SongResultItem({ song, mk }) {
  const play = async () => {
    const music = mk.instance;
    await music.setQueue({
      items: [createMediaItem(song)],
    });
    await music.player.play();
  };

  const { artistName, albumName } = song.attributes;
  const isCatalog = song.type === 'songs';

  return (
    <div className={cx(classes.result, classes.song)} key={song.id} onClick={play}>
      <div className={classes.artwork}>
        {isCatalog && (
          <div className={classes.catalogIndicator}>
            <i className={'fab fa-apple'} />
          </div>
        )}
        <SongDecoration song={song} showAlbum size={30} />
      </div>

      <div className={classes.detailsContainer}>
        <span className={classes.name}>{song.attributes.name}</span>
        <span className={classes.infos}>{`${artistName} - ${albumName}`}</span>
      </div>
    </div>
  );
}

SongResultItem.propTypes = {
  song: PropTypes.any.isRequired,
  mk: PropTypes.any.isRequired,
};

export default withMK(SongResultItem);
