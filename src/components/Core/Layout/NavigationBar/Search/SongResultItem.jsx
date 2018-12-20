import React from 'react';
import cx from 'classnames';
import * as PropTypes from 'prop-types';
import classes from './SearchBar.scss';
import withMK from '../../../../../hoc/withMK';
import { createMediaItem } from '../../../common/Utils';
import SongDecoration from '../../../common/SongList/SongDecoration';

function SongResultItem({ song, mk }) {
  const play = async () => {
    const music = mk.instance;
    await music.setQueue({
      items: [createMediaItem(song)],
    });
    await music.player.play();
  };

  return (
    <div className={cx(classes.result, classes.song)} key={song.id} onClick={play}>
      <div className={classes.artwork}>
        <SongDecoration song={song} showAlbum size={30} />
      </div>

      <span className={classes.name}>{song.attributes.name}</span>
    </div>
  );
}

SongResultItem.propTypes = {
  song: PropTypes.any.isRequired,
  mk: PropTypes.any.isRequired,
};

export default withMK(SongResultItem);
