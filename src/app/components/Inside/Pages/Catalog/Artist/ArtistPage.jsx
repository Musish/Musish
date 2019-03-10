import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import classes from './ArtistPage.scss';
import PageTitle from '../../../../Common/PageTitle/PageTitle';
import PageContent from '../../../../Common/PageContent/PageContent';
import AlbumItem from '../../../../Common/AlbumItem/AlbumItem';
import backend from '../../../../../services/Backend';
import translate from '../../../../../utils/translations/Translations';

class ArtistPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      artist: null,
      geniusData: null,
    };
  }

  async fetchArtist() {
    const music = MusicKit.getInstance();

    const { id } = this.props.match.params;
    const isCatalog = /^\d+$/.test(id);

    let artist;
    if (isCatalog) {
      artist = await music.api.artist(id);
    } else {
      artist = await music.api.library.artist(id);
    }

    this.setState({
      artist,
    });
  }

  async fetchAlbums() {
    const music = MusicKit.getInstance();

    const { id } = this.props.match.params;
    const isCatalog = /^\d+$/.test(id);

    let albums;
    if (isCatalog) {
      albums = await music.api.artist(id, { include: 'albums' });
    } else {
      albums = await music.api.library.artist(id, { include: 'albums' });
    }

    this.setState({
      albums,
    });
  }

  async fetchGeniusData() {
    const { id } = this.props.match.params;

    const isCatalog = /^\d+$/.test(id);
    if (!isCatalog) {
      return;
    }

    const { data } = await backend.get(`/genius/artist?artistId=${id}`);
    data.plainDescription = ArtistPage.flattenDesc(data.description.dom.children);

    this.setState({
      geniusData: data,
    });
  }

  static flattenDesc(object, props = {}) {
    if (typeof object === 'string') {
      return object;
    }

    if (Array.isArray(object)) {
      return object.map((child, i) => ArtistPage.flattenDesc(child, { key: i }));
    }

    const { attributes } = object;
    if (object.tag === 'a') {
      attributes.target = '_blank';
    }

    return React.createElement(
      object.tag,
      { ...attributes, ...props },
      ArtistPage.flattenDesc(object.children)
    );
  }

  componentDidMount() {
    this.fetchArtist();
    this.fetchAlbums();
    this.fetchGeniusData();
  }

  componentDidUpdate() {
    if (this.state.artist && this.state.artist.id !== this.props.match.params.id) {
      this.fetchArtist();
      this.fetchAlbums();
      this.fetchGeniusData();
    }
  }

  render() {
    const { artist, albums, geniusData } = this.state;

    const headerStyles = {
      background: geniusData ? `url(${geniusData.header_image_url})` : '#f2f2f2',
    };
    const imageStyles = {
      background: geniusData ? `url(${geniusData.image_url})` : '#ffffff',
    };

    return (
      <PageContent innerRef={this.ref}>
        {geniusData && (
          <div className={classes.artistHeader} style={headerStyles}>
            <a href={'https://genius.com/'} target={'_blank'}>
              <div className={classes.geniusCredit}>
                <span>{translate.dataProvidedByGenius}</span>
              </div>
            </a>
            <div className={classes.artistHeaderContainer}>
              <div className={classes.artistHeaderPicture} style={imageStyles} />
            </div>
          </div>
        )}

        <PageTitle title={artist ? artist.attributes.name : '...'} context={'Apple Music'} />
        {geniusData && geniusData.plainDescription}
        <h3>{translate.albums}</h3>

        {albums && (
          <div className={classes.albumsGrid}>
            {albums.map(album => (
              <AlbumItem key={album.id} album={album} size={120} />
            ))}
          </div>
        )}
      </PageContent>
    );
  }
}

ArtistPage.propTypes = {
  match: PropTypes.any.isRequired,
};

export default withRouter(ArtistPage);
