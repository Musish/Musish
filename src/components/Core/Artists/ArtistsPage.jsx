import React, { Fragment } from 'react';
import PageTitle from "../../common/PageTitle";
import PaginatedResults from '../common/PaginatedResults';
import Loader from "../../common/Loader";

import ArtistsScss from './Artists.scss';
import ArtistItem from "./ArtistItem";
import MainPaginatedResults from '../common/MainPaginatedResults';
import Page from "../Layout/Page";

export default class ArtistsPage extends React.Component {
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
      <Page>
        <MainPaginatedResults more={more}>
          <PageTitle title={"Artists"} context={"My Library"} />
          <div className={ArtistsScss.container}>
            { artists }
          </div>
          {loading && "Loading..."}
        </MainPaginatedResults>
      </Page>
    );
  }

  render() {
    return <PaginatedResults load={this.load} render={this.renderItems}/>;
  }
}
