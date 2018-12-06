import React, {Fragment} from 'react';
import Loader from '../../common/Loader';

import AlbumItem from './AlbumItem';

import AlbumScss from './Albums.scss';
import PageTitle from "../../common/PageTitle";
import PaginatedResults from '../common/PaginatedResults';
import MainPaginatedResults from '../common/MainPaginatedResults';
import Page from "../Layout/Page";

export default class AlbumsPage extends React.Component {
  async load(params) {
    const music = MusicKit.getInstance();

    return await music.api.library.albums(null, params);
  }

  renderItems(items, more, {loading, end}) {
    if (!items) {
      return <Loader/>
    }

    const albums = items.map(
        (album, i) => {
          const WHEIGHT = 150;
          let url = MusicKit.formatArtworkURL(album.attributes.artwork, WHEIGHT, WHEIGHT);

          return (
              <div key={i}>
                <AlbumItem url={url} id={album.id} title={album.attributes.name} name={album.attributes.artistName}/>
              </div>
          );
        });

    return (
      <Page>
        <MainPaginatedResults more={more}>
          <PageTitle title={"Albums"} context={"My Library"} />
          <div className={AlbumScss.container}>
            { albums }
          </div>
          {loading && <Loader/>}
        </MainPaginatedResults>
      </Page>
    )
  }

  render() {
    return <PaginatedResults load={this.load} render={this.renderItems}/>;
  }
}
