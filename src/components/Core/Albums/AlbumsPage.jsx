import React from 'react';
import Loader from '../../common/Loader';

import AlbumItem from './AlbumItem';

import Classes from './Albums.scss';
import PageTitle from '../../common/PageTitle';
import PageContent from '../Layout/PageContent';
import InfiniteLoader from '../common/InfiniteLoader';
import Modal from '../../common/Modal/Modal';
import ArtistsPage from '../Artists/ArtistsPage';
import AlbumPanel from './AlbumPanel';
import {Route} from 'react-router-dom';

export default class AlbumsPage extends React.Component {
  constructor(props) {
    super(props);

    this.ref = React.createRef();

    this.renderContent = this.renderContent.bind(this);
    this.onScroll = this.onScroll.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  async load(params) {
    const music = MusicKit.getInstance();

    return await music.api.library.albums(null, params);
  }

  onScroll({target: {scrollTop, scrollHeight, clientHeight}}, onScroll) {
    onScroll({scrollTop, scrollHeight, clientHeight})
  }

  handleClose() {
    this.props.history.push('/albums');
  }

  renderItems({items}) {
    const albums = items.map(
      (album, i) => {
        return (
          <AlbumItem key={i} album={album} size={170} navigate />
        );
      });

    return (
      <div className={Classes.albumsGrid}>
        {albums}
      </div>
    )
  }

  renderContent({onScroll}, state) {
    return this.renderItems(state)
  }

  render() {
    return (
      <>
        <Route path={'/albums/:id'} exact render={({match: {params: {id}}}) => (
          <Modal open={true} handleClose={this.handleClose} render={() => (
            <AlbumPanel id={id} />
          )} />
        )} />
        <PageContent innerRef={this.ref}>
          <PageTitle title={'Albums'} context={'My Library'}/>

          <InfiniteLoader scrollElement={this.ref} load={this.load} render={this.renderContent}/>
        </PageContent>
      </>
    );
  }
}
