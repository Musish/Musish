import React from 'react';

import PropTypes from 'prop-types';
import classes from './SongList.scss';
import InfiniteScroll from '../../common/InfiniteScroll';
import SongListItem from './SongListItem';

class SongList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      songs: null,
    };

    this.rowRenderer = this.rowRenderer.bind(this);
    this.onSetItems = this.onSetItems.bind(this);
  }

  onSetItems(state) {
    this.setState({
      songs: state.items,
    });
    this.props.onSetItems(state);
  }

  rowRenderer({ item: song, index, isScrolling, isVisible, key, style }) {
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
    const {
      showArtist,
      showAlbum,
      scrollElement,
      load,
      tracks,
      scrollElementModifier,
    } = this.props;
    return (
      <div className={classes.songList}>
        <InfiniteScroll
          onSetItems={this.onSetItems}
          scrollElement={scrollElement}
          scrollElementModifier={scrollElementModifier}
          load={load}
          items={tracks}
          rowHeight={showAlbum || showArtist ? 50 : 37}
          rowRenderer={this.rowRenderer}
        />
      </div>
    );
  }
}

SongList.propTypes = {
  showArtist: PropTypes.bool,
  showAlbum: PropTypes.bool,
  scrollElement: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  scrollElementModifier: PropTypes.func,
  load: PropTypes.func,
  tracks: PropTypes.array,
  onSetItems: PropTypes.func,
  playSong: PropTypes.func.isRequired,
};

SongList.defaultProps = {
  showArtist: false,
  showAlbum: false,
  scrollElement: null,
  onSetItems: () => null,
  scrollElementModifier: e => e,
  load: null,
  tracks: null,
};

export default SongList;
