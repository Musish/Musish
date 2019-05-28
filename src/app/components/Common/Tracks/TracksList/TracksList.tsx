import { Ref, RefObject, useState } from 'react';
import * as React from 'react';
import { List, WindowScroller } from 'react-virtualized';
import {
  IInfiniteLoaderState,
  InfiniteLoaderLoad,
  InfiniteLoaderOnSetItems,
} from '../../InfiniteLoader/InfiniteLoader';
import InfiniteScroll, { IInfiniteScrollListRowProps } from '../../InfiniteLoader/InfiniteScroll';
import * as classes from './TracksList.scss';
import TrackListItem from './TracksListItem';

interface ITracksListProps<I> {
  showArtist?: boolean;
  showAlbum?: boolean;
  scrollElement: RefObject<HTMLBaseElement>;
  scrollElementModifier?: (e: HTMLBaseElement | null) => HTMLBaseElement | null;
  load: InfiniteLoaderLoad<I>;
  tracks?: I[];
  onSetItems?: InfiniteLoaderOnSetItems<I>;
  playTrack: any;
  wsRef: Ref<WindowScroller>;
  listRef: Ref<List>;
}

const defaultProps: Partial<ITracksListProps<any>> = {
  showArtist: false,
  showAlbum: false,
  onSetItems: () => null,
  scrollElementModifier: (e: HTMLBaseElement | null) => e,
};

function TracksList<I extends MusicKit.MediaItem>({
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
}: ITracksListProps<I>) {
  const [tracks, setTracks] = useState<I[] | null>(null);

  function localOnSetItems(state: IInfiniteLoaderState<I>) {
    setTracks(state.items);
    onSetItems!(state);
  }

  function rowRenderer(rowProps: IInfiniteScrollListRowProps<I>) {
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
      <InfiniteScroll<I>
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

TracksList.defaultProps = defaultProps;

export default TracksList;
