import React from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';

import AlbumItem from '../../../../Common/AlbumItem/AlbumItem';
import classes from './AlbumsPage.scss';
import PageTitle from '../../../../Common/PageTitle/PageTitle';
import PageContent from '../../../../Common/PageContent/PageContent';
import InfiniteLoader from '../../../../Common/InfiniteLoader/InfiniteLoader';
import Modal from '../../../../Common/Modal/Modal';
import AlbumPanel from '../../../../Common/AlbumPanel/AlbumPanel';
import translate from '../../../../../utils/translations/Translations';

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
    this.props.history.push('/me/albums');
  }

  static renderItems({ items }) {
    const albums = items.map(album => (
      <AlbumItem key={album.id} album={album} size={150} navigate />
    ));

    return <div className={classes.albumsGrid}>{albums}</div>;
  }

  static renderContent({ onScroll }, state) {
    return AlbumsPage.renderItems(state);
  }

  render() {
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
            <Modal
              open
              handleClose={this.handleClose}
              render={() => <AlbumPanel key={id} id={id} />}
            />
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

AlbumsPage.propTypes = {
  history: PropTypes.any.isRequired,
};
