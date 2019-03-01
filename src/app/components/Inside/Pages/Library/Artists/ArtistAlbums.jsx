import React from 'react';
import PropTypes from 'prop-types';
import AlbumPanel from '../../../../Common/AlbumPanel/AlbumPanel';
import Loader from '../../../../Common/Loader/Loader';
import PageTitle from '../../../../Common/PageTitle/PageTitle';
import PageContent from '../../../../Common/PageContent/PageContent';
import translate from '../../../../../utils/translations/Translations';

class ArtistAlbums extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      artist: null,
    };
  }

  async componentDidMount() {
    const music = MusicKit.getInstance();

    const { id } = this.props;
    const isCatalog = /^\d+$/.test(id);

    let artist;
    if (isCatalog) {
      artist = await music.api.artist(id, { include: 'albums' });
    } else {
      artist = await music.api.library.artist(id, { include: 'albums' });
    }

    this.setState({
      artist,
    });
  }

  renderArtists() {
    const { artist } = this.state;

    return artist.relationships.albums.data.map(album => (
      <AlbumPanel key={album.id} album={album} />
    ));
  }

  renderContent() {
    const { artist } = this.state;

    if (!artist) {
      return <Loader />;
    }

    return (
      <>
        <PageTitle title={artist.attributes.name} context={translate.myLibrary} />
        {this.renderArtists()}
      </>
    );
  }

  render() {
    return <PageContent>{this.renderContent()}</PageContent>;
  }
}

ArtistAlbums.propTypes = {
  id: PropTypes.string.isRequired,
};

export default ArtistAlbums;
