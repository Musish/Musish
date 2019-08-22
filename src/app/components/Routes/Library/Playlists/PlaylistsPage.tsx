import React, { useRef } from 'react';
import translate from '../../../../utils/translations/Translations';
import InfiniteLoader, {
  InfiniteLoaderOnScroll,
  InfiniteLoaderState,
} from '../../../Common/InfiniteLoader/InfiniteLoader';
import PageContent from '../../../Common/PageContent/PageContent';
import PageTitle from '../../../Common/PageTitle/PageTitle';
import PlaylistItem from '../../../Common/PlaylistItem/PlaylistItem';
import classes from './PlaylistsPage.scss';

async function load(params: MusicKit.QueryParameters) {
  const music = MusicKit.getInstance();

  return music.api.library.playlists(null, params);
}

function renderContent(
  _: InfiniteLoaderOnScroll,
  { items }: InfiniteLoaderState<MusicKit.MediaItem>,
) {
  if (!items) {
    return null;
  }

  const playlists = items.map((playlist: any) => (
    <PlaylistItem key={playlist.id} playlist={playlist} size={150} />
  ));

  return <div className={classes.playlistsGrid}>{playlists}</div>;
}

const PlaylistsPage: React.FC<{}> = () => {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <PageContent innerRef={ref}>
      <PageTitle title={translate.playlists} context={translate.myLibrary} />
      <InfiniteLoader scrollElement={ref} load={load} render={renderContent} />
    </PageContent>
  );
};

export default PlaylistsPage;
