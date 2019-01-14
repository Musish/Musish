import React from 'react';

import PropTypes from 'prop-types';
import classes from './TracksList.scss';
import InfiniteScroll from '../../InfiniteLoader/InfiniteScroll';
import TrackListItem from './TracksListItem';

class TracksList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tracks: null,
    };

    this.rowRenderer = this.rowRenderer.bind(this);
    this.onSetItems = this.onSetItems.bind(this);
  }

  onSetItems(state) {
    this.setState({
      tracks: state.items,
    });
    this.props.onSetItems(state);
  }

  rowRenderer({ item: track, index, isScrolling, isVisible, key, style }) {
    const { tracks } = this.state;
    const { showArtist, showAlbum, playTrack } = this.props;

    return (
      <TrackListItem
        key={key}
        track={track}
        index={index}
        tracks={tracks}
        showArtist={showArtist}
        showAlbum={showAlbum}
        style={style}
        playTrack={playTrack}
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
      <div className={classes.trackList}>
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

TracksList.propTypes = {
  showArtist: PropTypes.bool,
  showAlbum: PropTypes.bool,
  scrollElement: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  scrollElementModifier: PropTypes.func,
  load: PropTypes.func,
  tracks: PropTypes.array,
  onSetItems: PropTypes.func,
  playTrack: PropTypes.func.isRequired,
};

TracksList.defaultProps = {
  showArtist: false,
  showAlbum: false,
  scrollElement: null,
  onSetItems: () => null,
  scrollElementModifier: e => e,
  load: null,
  tracks: null,
};

export default TracksList;
