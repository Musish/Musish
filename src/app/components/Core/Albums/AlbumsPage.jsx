import React from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import AlbumItem from './AlbumItem';
import Classes from './Albums.scss';
import PageTitle from '../../common/PageTitle';
import PageContent from '../Layout/PageContent';
import InfiniteLoader from '../common/InfiniteLoader';
import Modal from '../../common/Modal/Modal';
import AlbumPanel from './AlbumPanel';

export default class AlbumsPage extends React.Component {
  constructor(props) {
    super(props);

    this.ref = React.createRef();

    this.handleClose = this.handleClose.bind(this);
  }

  static async load(params) {
    const music = MusicKit.getInstance();

    return music.api.library.albums(null, params);
  }

  handleClose() {
    this.props.history.push('/library/albums');
  }

  static renderItems({ items }) {
    const albums = items.map(album => (
      <AlbumItem key={album.id} album={album} size={170} navigate />
    ));

    return <div className={Classes.albumsGrid}>{albums}</div>;
  }

  static renderContent({ onScroll }, state) {
    return AlbumsPage.renderItems(state);
  }

  render() {
    return (
      <>
        <Route
          path={'/library/albums/:id'}
          exact
          render={({
            match: {
              params: { id },
            },
          }) => <Modal open handleClose={this.handleClose} render={() => <AlbumPanel id={id} />} />}
        />
        <PageContent innerRef={this.ref}>
          <PageTitle title={'Albums'} context={'My Library'} />

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

AlbumsPage.propTypes = {
  history: PropTypes.any.isRequired,
};
