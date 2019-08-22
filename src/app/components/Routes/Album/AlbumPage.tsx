import React from 'react';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import translate from '../../../utils/translations/Translations';
import AlbumPanel from '../../Common/AlbumPanel/AlbumPanel';
import PageContent from '../../Common/PageContent/PageContent';
import PageTitle from '../../Common/PageTitle/PageTitle';
import classes from './AlbumPage.scss';

type AlbumPageProps = RouteComponentProps<{ id: string }>;

const AlbumPage: React.FC<AlbumPageProps> = ({ match }: AlbumPageProps) => {
  const scrollRef = React.createRef<HTMLDivElement>();

  const albumId = match.params.id;

  return (
    <PageContent innerRef={scrollRef}>
      <PageTitle
        title={null}
        context={isNaN((albumId as unknown) as number) ? translate.myLibrary : translate.appleMusic}
      />

      <AlbumPanel id={albumId} className={classes.albumPanel} />
    </PageContent>
  );
};

export default withRouter(AlbumPage);
