import React, { useState } from 'react';
import PropTypes from 'prop-types';

import classes from './TracksList.scss';
import InfiniteScroll from '../../InfiniteLoader/InfiniteScroll';
import TrackListItem from './TracksListItem';

function TracksList(props) {
  const [tracks, setTracks] = useState(null);

  function onSetItems(state) {
    setTracks(state.items);
    props.onSetItems(state);
  }

  const { showArtist, showAlbum, scrollElement, load, scrollElementModifier, playTrack } = props;

  function rowRenderer(rowProps) {
    const { item: track, index, key, style } = rowProps;

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

  return (
    <div className={classes.trackList}>
      <InfiniteScroll
        onSetItems={onSetItems}
        scrollElement={scrollElement}
        scrollElementModifier={scrollElementModifier}
        load={load}
        items={props.tracks}
        rowHeight={showAlbum || showArtist ? 50 : 37}
        rowRenderer={rowRenderer}
      />
    </div>
  );
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
