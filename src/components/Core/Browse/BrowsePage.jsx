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
    };

    this.ref = React.createRef();
  }

  async componentDidMount() {
    const music = MusicKit.getInstance();
    const charts = await music.api.charts(['songs', 'albums', 'playlists'], { limit: 40 });

    this.setState({
      charts,
    });
  }

  render() {
    const { charts } = this.state;

    return (
      <PageContent innerRef={this.ref}>
        <PageTitle title={'Browse'} context={'Apple Music'} />

        <PlaylistList title={'Daily Top 100'} listIds={top100Ids.slice(0,25)}/>

        <PlaylistList title={'The A-Lists'} listIds={aListPlaylistsIds}/>

        <PlaylistList title={'Top Playlists'} list={charts ? charts.playlists[0].data : null}/>

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
