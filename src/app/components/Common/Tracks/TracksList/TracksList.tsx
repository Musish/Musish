import { Ref, RefObject, useState } from 'react';
import * as React from 'react';
import { List, WindowScroller } from 'react-virtualized';
import {
  InfiniteLoaderLoad,
  InfiniteLoaderOnSetItems,
  InfiniteLoaderState,
} from '../../InfiniteLoader/InfiniteLoader';
import InfiniteScroll, { InfiniteScrollListRowProps } from '../../InfiniteLoader/InfiniteScroll';
import * as classes from './TracksList.scss';
import TrackListItem, { PlayTrackParams } from './TracksListItem';

interface TracksListProps {
  showArtist?: boolean;
  showAlbum?: boolean;
  scrollElement: RefObject<HTMLElement>;
  scrollElementModifier?: (e: HTMLElement | null) => HTMLElement | null;
  load: InfiniteLoaderLoad<MusicKit.MediaItem>;
  tracks?: MusicKit.MediaItem[];
  onSetItems?: InfiniteLoaderOnSetItems<MusicKit.MediaItem>;
  playTrack: ({ track, tracks, index }: PlayTrackParams) => void;
  wsRef?: Ref<WindowScroller>;
  listRef?: Ref<List>;
}

function TracksList({
  showArtist = false,
  showAlbum = false,
  scrollElement,
  scrollElementModifier = (e: HTMLElement | null) => e,
  load,
  tracks: initialTracks,
  onSetItems = () => null,
  playTrack,
  wsRef = React.createRef<WindowScroller>(),
  listRef = React.createRef<List>(),
}: TracksListProps) {
  const [tracks, setTracks] = useState<MusicKit.MediaItem[] | null>(null);

  function localOnSetItems(state: InfiniteLoaderState<MusicKit.MediaItem>) {
    setTracks(state.items);
    onSetItems!(state);
  }

  function rowRenderer(rowProps: InfiniteScrollListRowProps<MusicKit.MediaItem>) {
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
      <InfiniteScroll<MusicKit.MediaItem>
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
}

export default TracksList;
