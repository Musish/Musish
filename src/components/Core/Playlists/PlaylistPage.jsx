import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import Loader from '../../common/Loader';
import PageContent from '../Layout/PageContent';
import PageTitle from '../../common/PageTitle';
import SongList from '../common/SongList/SongList';

class PlaylistPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      playlist: null,
    };

    this.ref = React.createRef();
  }

  async componentDidMount() {
    const music = MusicKit.getInstance();
    const playlist = await music.api.library.playlist(this.props.match.params.id);

    this.setState({
      playlist,
    });
  }

  renderContent() {
    if (!this.state.playlist) {
      return <Loader />;
    }

    return (
      <>
        <PageTitle title={this.state.playlist.attributes.name} context={'My Library'} />
        <p>
          {this.state.playlist.attributes.description &&
            this.state.playlist.attributes.description.standard}
        </p>
        <SongList
          scrollElement={this.ref}
          load={() => this.state.playlist.relationships.tracks.data}
          showArtist
          showAlbum
        />
      </>
    );
  }

  render() {
    return <PageContent innerRef={this.ref}>{this.renderContent()}</PageContent>;
  }
}

PlaylistPage.propTypes = {
  match: PropTypes.any.isRequired,
};

export default withRouter(PlaylistPage);
