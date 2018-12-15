import React from 'react';
import {withRouter} from 'react-router-dom';
import Loader from "../../common/Loader";
import InfiniteScroll from "../common/InfiniteScroll";
import PageContent from "../Layout/PageContent";
import PageTitle from "../../common/PageTitle";
import SongList from "../common/SongList/SongList";

class PlaylistPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      playlist: null,
    };
  }

  async componentDidMount() {
    const music = MusicKit.getInstance();
    const playlist = await music.api.library.playlist(
      this.props.match.params.id
    );

    console.log(playlist);

    this.setState({
      playlist,
    });
  }

  render() {
    if (!this.state.playlist) {
      return <Loader/>;
    }

    return (
      <InfiniteScroll load={() => []} render={() => (
        <PageContent>
          <PageTitle
            title={this.state.playlist.attributes.name}
            context={"My Library"}
          />
          <p>{this.state.playlist.attributes.description && this.state.playlist.attributes.description.standard}</p>
          <SongList
            songs={this.state.playlist.relationships.tracks.data}
            showArtist={true}
            showAlbum={true}
          />
        </PageContent>
      )}/>
    );
  }
}

export default withRouter(PlaylistPage);
