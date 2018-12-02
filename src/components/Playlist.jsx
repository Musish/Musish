import React from 'react';
import {withRouter} from 'react-router-dom';
import PageTitle from './PageTitle';
import SongList from './SongList';

class Playlist extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      playlist: null,
    };
  }

  async componentDidMount() {
    const music = MusicKit.getInstance();
    const playlist = await music.api.library.playlist(
        this.props.match.params.id);

    console.log(playlist);

    this.setState({
      playlist,
    });
  }

  render() {
    if (!this.state.playlist) {
      return 'Loading...';
    }

    return (
        <div>
          <PageTitle title={this.state.playlist.attributes.name} context={"YOUR LIBRARY"}/>
          <p>{this.state.playlist.attributes.description && this.state.playlist.attributes.description.standard}</p>

          <SongList songs={this.state.playlist.relationships.tracks.data} album={false}/>
        </div>
    );
  }
}

export default withRouter(Playlist);
