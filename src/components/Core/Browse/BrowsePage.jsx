import React from 'react';
import { withRouter } from 'react-router-dom';
import cx from 'classnames';
import PageContent from '../Layout/PageContent';
import PageTitle from '../../common/PageTitle';
import classes from './BrowsePage.scss';
import AlbumItem from '../Albums/AlbumItem';
import PlaylistItem from '../Playlists/PlaylistItem';
import SongList from '../common/SongList/SongList';
import {top100Ids} from '../common/Utils';

class BrowsePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      charts: null,
      top100: null
    };

    this.ref = React.createRef();
  }

  async componentDidMount() {
    const music = MusicKit.getInstance();
    const charts = await music.api.charts(['songs', 'albums', 'playlists'], { limit: 40 });
    const top100 = await music.api.playlists(top100Ids.slice(0,25));

    this.setState({
      charts,
      top100
    });
  }

  render() {
    const { charts, top100 } = this.state;

    return (
      <PageContent innerRef={this.ref}>
        <PageTitle title={'Browse'} context={'Apple Music'} />

        <h3>Hot playlists</h3>
        <div className={classes.scrollWrapper}>
          <div className={cx(classes.scrollGrid, classes.doubleRow)}>
            {charts &&
              charts.playlists[0].data.map(playlist => (
                <PlaylistItem key={playlist.id} playlist={playlist} size={100} />
              ))}
          </div>
        </div>
        <h3>Daily Top 100</h3>
        <div className={classes.scrollWrapper}>
          <div className={cx(classes.scrollGrid, classes.doubleRow)}>
            {top100 &&
              top100.map(playlist => (
                <PlaylistItem key={playlist.id} playlist={playlist} size={100} />
              ))}
          </div>
        </div>
        <h3>Popular albums</h3>
        <div className={classes.scrollWrapper}>
          <div className={cx(classes.scrollGrid, classes.doubleRow)}>
            {charts &&
              charts.albums[0].data.map(album => (
                <AlbumItem key={album.id} album={album} size={100} />
              ))}
          </div>
        </div>
        <h3>Top songs</h3>
        <div className={classes.chartingSongs}>
          {charts && (
            <SongList
              scrollElement={this.ref}
              load={() => charts.songs[0].data.slice(0, 10)}
              showArtist
              showAlbum
            />
          )}
        </div>
      </PageContent>
    );
  }
}

export default withRouter(BrowsePage);
