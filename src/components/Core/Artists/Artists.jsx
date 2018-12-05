import React, { Fragment } from 'react';
import PageTitle from "../../common/PageTitle";
import PaginatedResults from '../common/PaginatedResults';
import Loader from "../../common/Loader";

import ArtistsScss from './Artists.scss';
import ArtistItem from "./ArtistItem";
import MainPaginatedResults from '../common/MainPaginatedResults';

export default class Artists extends React.Component {
  async load(params) {
    const music = MusicKit.getInstance();

    return await music.api.library.artists(null, params);
  }

  renderItems(items, more, {loading, end}) {
    if (!items) {
      return <Loader/>;
    }

    const artists = items.map(
        (artist) => {
          return (
            <ArtistItem artist={artist} />
          );
        }
    );

    return (
        <MainPaginatedResults more={more}>
          <PageTitle title={"Artists"} context={"Your Library"} />
          <div className={ArtistsScss.container}>
          { artists }
          </div>
          {loading && "Loading..."}
        </MainPaginatedResults>
    );
  }

  render() {
    return <PaginatedResults load={this.load} render={this.renderItems}/>;
  }
}
