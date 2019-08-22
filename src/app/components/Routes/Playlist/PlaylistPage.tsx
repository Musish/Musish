import React from 'react';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import translate from '../../../utils/translations/Translations';
import PageContent from '../../Common/PageContent/PageContent';
import PageTitle from '../../Common/PageTitle/PageTitle';
import PlaylistPanel from '../../Common/PlaylistPanel/PlaylistPanel';

type PlaylistPageProps = RouteComponentProps<{ id: string }>;

const PlaylistPage: React.FC<PlaylistPageProps> = ({ match }: PlaylistPageProps) => {
  const scrollRef = React.createRef<HTMLDivElement>();

  const playlistId = match.params.id;

  return (
    <PageContent innerRef={scrollRef}>
      <PageTitle
        title={null}
        context={
          isNaN((playlistId as unknown) as number) ? translate.myLibrary : translate.appleMusic
        }
      />

      <PlaylistPanel id={playlistId} />
    </PageContent>
  );
};

export default withRouter(PlaylistPage);
