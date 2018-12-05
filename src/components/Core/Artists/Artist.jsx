import React from 'react';
import {withRouter} from 'react-router-dom';
import PageTitle from '../../common/PageTitle';
import SongList from '../common/SongList/SongList';

class Artist extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      artist: null,
    };
  }

  async componentDidMount() {
    const music = MusicKit.getInstance();
    const artist = await music.api.library.artist(this.props.match.params.id);

    console.log(artist);

    this.setState({
      artist,
    });
  }

  render() {
    if (!this.state.artist) {
      return 'Loading...';
    }
    return (
        <div>
          <PageTitle title={this.state.artist.attributes.name} context={"YOUR LIBRARY"}/>
        </div>
    );
  }
}

export default withRouter(Artist);
