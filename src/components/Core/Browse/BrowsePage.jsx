import React from 'react';
import { withRouter } from 'react-router-dom';
import cx from 'classnames';
import PageContent from '../Layout/PageContent';
import PageTitle from '../../common/PageTitle';
import classes from './BrowsePage.scss';
import SongList from '../common/SongList/SongList';
import {top100Ids, aListPlaylistsIds} from '../common/Utils';
import Loader from '../../common/Loader';
import ItemList from '../Browse/ItemList';

class BrowsePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      charts: null,
    };

    this.ref = React.createRef();
    this.getCharts = this.getCharts.bind(this);
  }

  async getCharts() {
    const music = MusicKit.getInstance();
    const charts = await music.api.charts(['songs', 'albums', 'playlists'], { limit: 40 });

    this.setState({
      charts,
    });
  }

  async componentDidMount() {
    this.getCharts();
  }

  render() {
    const { charts } = this.state;

    return (
      <PageContent innerRef={this.ref}>
        <PageTitle title={'Browse'} context={'Apple Music'} />

        <ItemList title={'Daily Top 100'} listIds={top100Ids.slice(0,25)} type={'playlist'} />

        <ItemList title={'The A-Lists'} listIds={aListPlaylistsIds} type={'playlist'} />

        <ItemList title={'Top Playlists'} list={charts ? charts.playlists[0].data : null} type={'playlist'} />

        <ItemList title={'Top Albums'} list={charts ? charts.albums[0].data : null} type={'album'} />

        <h3>Top Songs</h3>
        <div className={classes.chartingSongs}>
          {charts ? (
            <SongList
              scrollElement={this.ref}
              load={() => charts.songs[0].data.slice(0, 10)}
              showArtist
              showAlbum
            />
          ) : (
            <Loader />
          )}
        </div>
      </PageContent>
    );
  }
}

export default withRouter(BrowsePage);
