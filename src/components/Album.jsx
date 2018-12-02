import React from 'react';
import {withRouter} from 'react-router-dom';
import PageTitle from './PageTitle';
import SongList from './SongList';

class Album extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      album: null,
    };
  }

  async componentDidMount() {
    const music = MusicKit.getInstance();
    const album = await music.api.library.album(
        this.props.match.params.id);

    console.log(album);

    this.setState({
      album,
    });
  }

  render() {
    if (!this.state.album) {
      return 'Loading...';
    }

    return (
        <div>
          <PageTitle title={this.state.album.attributes.name} context={"YOUR LIBRARY"}/>

          <SongList songs={this.state.album.relationships.tracks.data} album={false}/>
        </div>
    );
  }
}

export default withRouter(Album);
