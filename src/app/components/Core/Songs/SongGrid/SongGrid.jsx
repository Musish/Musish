import React from 'react';

import PropTypes from 'prop-types';
import classes from './SongGrid.scss';
import SongListItem from '../SongList/SongListItem';

class SongGrid extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      songs: null,
    };

    this.rowRenderer = this.rowRenderer.bind(this);
  }

  rowRenderer({ item: song, index, isVisible, key, style }) {
    const { songs } = this.state;
    const { showArtist, showAlbum, playSong } = this.props;

    return (
      <SongListItem
        key={key}
        song={song}
        index={index}
        songs={songs}
        showArtist={showArtist}
        showAlbum={showAlbum}
        style={style}
        playSong={playSong}
      />
    );
  }

  render() {
    const { tracks, showArtist, showAlbum, playSong } = this.props;

    return (
      <div className={classes.scrollWrapper}>
        <div className={classes.songGrid}>
          {tracks.map((track, index) => (
            <SongListItem
              key={track.id}
              song={track}
              index={index}
              songs={tracks}
              showArtist={showArtist}
              showAlbum={showAlbum}
              playSong={playSong}
              className={classes.song}
            />
          ))}
        </div>
      </div>
    );
  }
}

SongGrid.propTypes = {
  showArtist: PropTypes.bool,
  showAlbum: PropTypes.bool,
  tracks: PropTypes.array,
  playSong: PropTypes.func.isRequired,
};

SongGrid.defaultProps = {
  showArtist: false,
  showAlbum: false,
  tracks: null,
};

export default SongGrid;
