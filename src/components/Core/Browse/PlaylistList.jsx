import React from 'react';
import { withRouter } from 'react-router-dom';
import cx from 'classnames';
import classes from './BrowsePage.scss';
import PlaylistItem from '../Playlists/PlaylistItem';
import Loader from '../../common/Loader';

class PlaylistList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      list: null
    };
  }

  async componentDidMount() {
    if ((this.props.list == undefined || this.props.list == null) && (this.props.listIds !== null && this.props.listIds !== undefined)) {
      const music = MusicKit.getInstance();
      const list = await music.api.playlists(this.props.listIds);

      this.setState({
        list: list
      });
    } else {
      this.setState({
        list: this.props.list
      })
    }
  }

  render() {
    const list = this.props.list ? this.props.list : this.state.list;

    return (
      <>
        <h3>{this.props.title}</h3>
        <div className={classes.scrollWrapper}>
          <div className={cx(classes.scrollGrid)}>
            {list ? (
              list.map(playlist => (
                <PlaylistItem key={playlist.id} playlist={playlist} size={170} />
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

export default withRouter(PlaylistList);
