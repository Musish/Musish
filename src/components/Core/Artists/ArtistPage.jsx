import React from 'react';
import {withRouter} from 'react-router-dom';
import PageTitle from '../../common/PageTitle';
import PageContent from "../Layout/PageContent";

class ArtistPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      artist: null,
    };
  }

  async componentDidMount() {
    const music = MusicKit.getInstance();

    const id = this.props.match.params.id;
    const isCatalog = /^\d+$/.test(id);

    let artist;
    if (isCatalog) {
      artist = await music.api.artist(id);
    } else {
      artist = await music.api.library.artist(id);
    }

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
      <PageContent>
        <PageTitle title={this.state.artist.attributes.name} context={"My Library"}/>
      </PageContent>
    );
  }
}

export default withRouter(ArtistPage);
