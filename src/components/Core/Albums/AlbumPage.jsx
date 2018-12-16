import React from 'react';
import {withRouter} from 'react-router-dom';
import PageTitle from '../../common/PageTitle';
import SongList from '../common/SongList/SongList';
import PageContent from "../Layout/PageContent";

class AlbumPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      album: null,
    };

    this.ref = React.createRef();
  }

  async componentDidMount() {
    const music = MusicKit.getInstance();
    const album = await music.api.library.album(this.props.match.params.id);

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
        <PageContent innerRef={this.ref}>
          <PageTitle title={this.state.album.attributes.name} context={"My Library"}/>
          <SongList scrollElement={this.ref} load={() => this.state.album.relationships.tracks.data} showArtist={true} />
        </PageContent>
    );
  }
}

export default withRouter(AlbumPage);
