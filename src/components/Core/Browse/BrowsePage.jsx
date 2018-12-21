import React from 'react';
import { withRouter } from 'react-router-dom';
import cx from 'classnames';
import PageContent from '../Layout/PageContent';
import PageTitle from '../../common/PageTitle';
import classes from './BrowsePage.scss';
import AlbumItem from '../Albums/AlbumItem';
import PlaylistItem from '../Playlists/PlaylistItem';
import SongList from '../common/SongList/SongList';
import {top100Ids, aListPlaylistsIds} from '../common/Utils';
import Loader from '../../common/Loader';
import PlaylistList from '../Browse/PlaylistList';

class BrowsePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      charts: null,
      top100: null,
      aLists: null
    };

    this.ref = React.createRef();
  }

  async componentDidMount() {
    const music = MusicKit.getInstance();
    const charts = await music.api.charts(['songs', 'albums', 'playlists'], { limit: 40 });
    const top100 = await music.api.playlists(top100Ids.slice(0,25));
    const aLists = await music.api.playlists(aListPlaylistsIds);

    this.setState({
      charts,
      top100,
      aLists
    });
  }

  render() {
    const { charts, top100, aLists } = this.state;

    return (
      <PageContent innerRef={this.ref}>
        <PageTitle title={'Browse'} context={'Apple Music'} />

        <PlaylistList title={'Daily Top 100'} list={top100Ids.slice(0,25)}/>

        <h3>Daily Top 100</h3>
        <div className={classes.scrollWrapper}>
          <div className={cx(classes.scrollGrid, classes.doubleRow)}>
            {top100 ? (
              top100.map(playlist => (
                <PlaylistItem key={playlist.id} playlist={playlist} size={100} />
              ))
            ) : (
              <Loader />
            )}
          </div>
        </div>
        <h3>The A-Lists</h3>
        <div className={classes.scrollWrapper}>
          <div className={cx(classes.scrollGrid, classes.doubleRow)}>
            {aLists ? (
              aLists.map(playlist => (
                <PlaylistItem key={playlist.id} playlist={playlist} size={100} />
              ))
            ) : (
              <Loader />
            )}
          </div>
        </div>
        <h3>Top Playlists</h3>
        <div className={classes.scrollWrapper}>
          <div className={cx(classes.scrollGrid, classes.doubleRow)}>
            {charts ? (
              charts.playlists[0].data.map(playlist => (
                <PlaylistItem key={playlist.id} playlist={playlist} size={100} />
              ))
            ) : (
              <Loader />
            )}
          </div>
        </div>
        <h3>Top Albums</h3>
        <div className={classes.scrollWrapper}>
          <div className={cx(classes.scrollGrid, classes.doubleRow)}>
            {charts ? (
              charts.albums[0].data.map(album => (
                <AlbumItem key={album.id} album={album} size={100} />
              ))
            ) : (
              <Loader />
            )}
          </div>
        </div>
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
