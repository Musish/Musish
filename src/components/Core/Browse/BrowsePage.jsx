import React from 'react';
import { withRouter } from 'react-router-dom';
import cx from 'classnames';
import PageContent from '../Layout/PageContent';
import PageTitle from '../../common/PageTitle';
import classes from './BrowsePage.scss';
import SongList from '../common/SongList/SongList';
import {top100Ids, aListPlaylistsIds} from '../common/Utils';
import Loader from '../../common/Loader';
import PlaylistList from '../Browse/PlaylistList';
import AlbumList from '../Browse/AlbumList';

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

        <PlaylistList title={'Daily Top 100'} listIds={top100Ids.slice(0,25)} />

        <PlaylistList title={'The A-Lists'} listIds={aListPlaylistsIds} />

        <PlaylistList title={'Top Playlists'} list={charts ? charts.playlists[0].data : null} />

        <AlbumList title={'Top Albums'} list={charts ? charts.albums[0].data : null} />

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
