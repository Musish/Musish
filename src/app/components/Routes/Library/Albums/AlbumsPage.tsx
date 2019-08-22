import React from 'react';
import { RouteComponentProps } from 'react-router';
import { Route } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import translate from '../../../../utils/translations/Translations';
import AlbumItem from '../../../Common/AlbumItem/AlbumItem';
import AlbumPanel from '../../../Common/AlbumPanel/AlbumPanel';
import InfiniteLoader, {
  InfiniteLoaderOnScroll,
  InfiniteLoaderState,
} from '../../../Common/InfiniteLoader/InfiniteLoader';
import Modal from '../../../Common/Modal/Modal';
import PageContent from '../../../Common/PageContent/PageContent';
import PageTitle from '../../../Common/PageTitle/PageTitle';
import classes from './AlbumsPage.scss';

type AlbumsPageProps = RouteComponentProps;

class AlbumsPage extends React.Component<AlbumsPageProps> {
  public static async load(params: MusicKit.QueryParameters) {
    const music = MusicKit.getInstance();

    return music.api.library.albums(null, params);
  }

  public static renderItems({ items }: InfiniteLoaderState<MusicKit.Resource>) {
    if (!items) {
      return null;
    }

    const albums = items.map(album => <AlbumItem key={album.id} album={album} size={150} />);

    return <div className={classes.albumsGrid}>{albums}</div>;
  }

  public static renderContent(
    _: InfiniteLoaderOnScroll,
    state: InfiniteLoaderState<MusicKit.Resource>,
  ) {
    return AlbumsPage.renderItems(state);
  }

  public readonly ref = React.createRef<HTMLDivElement>();

  public handleClose = () => {
    this.props.history.push('/me/albums');
  };

  public render() {
    return (
      <>
        <Route
          path={'/me/albums/:id'}
          exact
          render={({
            match: {
              params: { id },
            },
          }) => (
            <Modal handleClose={this.handleClose} render={() => <AlbumPanel key={id} id={id} />} />
          )}
        />
        <PageContent innerRef={this.ref}>
          <PageTitle title={translate.albums} context={translate.myLibrary} />

          <InfiniteLoader
            scrollElement={this.ref}
            load={AlbumsPage.load}
            render={AlbumsPage.renderContent}
          />
        </PageContent>
      </>
    );
  }
}

export default withRouter(AlbumsPage);
