import { RefObject, useState } from 'react';
import * as React from 'react';
import { InfiniteLoaderItem, InfiniteLoaderLoad, InfiniteLoaderOnSetItems } from '../../InfiniteLoader/InfiniteLoader';
import InfiniteScroll from '../../InfiniteLoader/InfiniteScroll';
import * as classes from './TracksList.scss';
import TrackListItem from './TracksListItem';

interface ITracksListProps {
  showArtist?: boolean;
  showAlbum?: boolean;
  scrollElement: RefObject<HTMLBaseElement>;
  scrollElementModifier?: (e: HTMLBaseElement | null) => HTMLBaseElement | null;
  load: InfiniteLoaderLoad;
  tracks?: InfiniteLoaderItem[];
  onSetItems?: InfiniteLoaderOnSetItems;
  playTrack: any;
}

const defaultProps: Partial<ITracksListProps> = {
  showArtist: false,
  showAlbum: false,
  onSetItems: () => null,
  scrollElementModifier: (e: HTMLBaseElement | null) => e,
};

const TracksList: React.FC<ITracksListProps> = ({
   showArtist,
   showAlbum,
   scrollElement,
   scrollElementModifier,
   load,
   tracks: initialTracks,
   onSetItems,
   playTrack,
}) => {
  const [tracks, setTracks] = useState(null);

  function localOnSetItems(state) {
    setTracks(state.items);
    onSetItems!(state);
  }

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
        onSetItems={localOnSetItems}
        scrollElement={scrollElement}
        scrollElementModifier={scrollElementModifier}
        load={load}
        items={initialTracks}
        rowHeight={showAlbum || showArtist ? 50 : 37}
        rowRenderer={rowRenderer}
      />
    </div>
  );
};

TracksList.defaultProps = defaultProps;

export default TracksList;
