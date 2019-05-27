import { Ref, RefObject, useState } from 'react';
import * as React from 'react';
import { List, WindowScroller } from 'react-virtualized';
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
  wsRef: Ref<WindowScroller>;
  listRef: Ref<List>;
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
   wsRef = React.createRef<WindowScroller>(),
   listRef = React.createRef<List>(),
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
        wsRef={wsRef}
        listRef={listRef}
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
        wsRef={wsRef}
        listRef={listRef}
      />
    </div>
  );
};

TracksList.defaultProps = defaultProps;

export default TracksList;
