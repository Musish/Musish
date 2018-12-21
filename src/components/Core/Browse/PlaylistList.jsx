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

class BrowsePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      list: null
    };
  }

  async componentDidMount() {
    const music = MusicKit.getInstance();
    const list = await music.api.playlists(this.props.list);

    this.setState({
      list
    });
  }

  render() {
    const { list } = this.state;

    return (
      <>
        <h3>{this.props.title}</h3>
        <div className={classes.scrollWrapper}>
          <div className={cx(classes.scrollGrid, classes.doubleRow)}>
            {list ? (
              list.map(playlist => (
                <PlaylistItem key={playlist.id} playlist={playlist} size={100} />
              ))
            ) : (
              <Loader />
            )}
          </div>
        </div>
      </>
    );
  }
}

export default withRouter(BrowsePage);
