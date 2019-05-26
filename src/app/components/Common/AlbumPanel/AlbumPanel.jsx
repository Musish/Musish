import React from 'react';

import PropTypes from 'prop-types';
import { Link, Route, withRouter } from 'react-router-dom';
import classes from './AlbumPanel.scss';
import { artworkForMediaItem, humanifyMillis, humanifyTrackNumbers } from '../../../utils/Utils';
import TracksList from '../Tracks/TracksList/TracksList';
import Loader from '../Loader/Loader';
import * as MusicPlayerApi from '../../../services/MusicPlayerApi';
import * as MusicApi from '../../../services/MusicApi';
import withMK from '../../../hoc/withMK';
import translate from '../../../utils/translations/Translations';
import { withModal } from '../../Providers/ModalProvider';

class AlbumPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      album: null,
      shouldMatchCatalogAlbum: !this.isCatalog(),
      matchedCatalogAlbum: null,
    };

    this.ref = React.createRef();
    this.store = {};
  }

  componentDidMount() {
    this.fetchAlbum();
  }

  fetchAlbum = async () => {
    const album = await this.albumLoader(this.getAlbumId());

    this.setState({
      album,
    });
  };

  albumLoader = (...args) => {
    const music = MusicKit.getInstance();
    if (!this.isCatalog()) {
      return music.api.library.album(...args);
    }

    return music.api.album(...args);
  };

  isCatalog = () => !isNaN(this.getAlbumId());

  getAlbumId = () => this.props.id || this.props.album.id;

  onSetItems = ({ items }) => {
    const albumLength = items.reduce(
      (totalDuration, track) =>
        totalDuration + (track.attributes ? track.attributes.durationInMillis : 0),
      0
    );

    if (this.state.shouldMatchCatalogAlbum) {
      this.fetchFullCatalogAlbum();
    }

    this.setState({
      runtime: humanifyMillis(albumLength),
    });
  };

  playTrack = ({ index }) => {
    MusicPlayerApi.playAlbum(this.state.album, index);
  };

  playAlbum = async (index = 0) => {
    MusicPlayerApi.playAlbum(this.state.album, index);
  };

  shufflePlayAlbum = async () => {
    MusicPlayerApi.shufflePlayAlbum(this.state.album);
  };

  fetchFullCatalogAlbum = async () => {
    const { album } = this.state;
    const catalogAlbum = await MusicApi.fetchFullCatalogAlbumFromLibraryAlbum(album);
    this.setState({
      matchedCatalogAlbum: catalogAlbum,
    });
  };

  render() {
    const { modal } = this.props;
    const { album, matchedCatalogAlbum, runtime } = this.state;

    if (!album) {
      return <Loader />;
    }

    const artworkURL = artworkForMediaItem(album, 220);

    const explicit = album.attributes.contentRating === 'explicit' && (
      <div className={classes.explicit}>
        <span>
          <span>E</span>
        </span>
      </div>
    );

    const artistList = 'artists' in album.relationships ? album.relationships.artists.data : null;
    const artistId = artistList && artistList.length > 0 ? artistList[0].id : null;
    const artistName = artistId ? (
      <Link to={`/artist/${artistId}`}>{album.attributes.artistName}</Link>
    ) : (
      album.attributes.artistName
    );

    return (
      <div className={classes.panel} ref={this.ref}>
        <div className={classes.aside}>
          <div className={classes.artworkWrapper}>
            <img src={artworkURL} alt={album.attributes.name} />
          </div>
          <div className={classes.playActions}>
            <button type={'button'} onClick={this.playAlbum} className={classes.button}>
              <i className={`${classes.icon} fas fa-play`} />
              {translate.play}
            </button>
            <button type={'button'} onClick={this.shufflePlayAlbum} className={classes.button}>
              <i className={`${classes.icon} fas fa-random`} />
              {translate.shuffle}
            </button>
          </div>
          <span className={classes.albumRuntimeDescription}>
            {`${humanifyTrackNumbers(album.attributes.trackCount)}, ${runtime}`}
          </span>
        </div>

        <div className={classes.main}>
          <span className={classes.title}>
            <span className={classes.name}>{album.attributes.name}</span>
            {explicit}
          </span>

          <span className={classes.subtitle}>{artistName}</span>

          {album.attributes.editorialNotes && album.attributes.editorialNotes.standard && (
            <div className={classes.description}>
              <span
                dangerouslySetInnerHTML={{ __html: album.attributes.editorialNotes.standard }} // eslint-disable-line react/no-danger
              />
            </div>
          )}

          <TracksList
            scrollElement={this.ref}
            scrollElementModifier={e => e && e.parentElement}
            load={MusicApi.infiniteLoadRelationships(
              this.getAlbumId(),
              this.albumLoader,
              'tracks',
              this.store
            )}
            onSetItems={this.onSetItems}
            playTrack={this.playTrack}
          />

          {matchedCatalogAlbum && (
            <div className={classes.showCompleteContainer}>
              <Route path={'/me/albums'}>
                {({ match }) => (
                  <span
                    onClick={() => {
                      if (match) {
                        this.props.history.push('/me/albums/');
                      }
                      modal.push(
                        <AlbumPanel key={matchedCatalogAlbum.id} album={matchedCatalogAlbum} />
                      );
                    }}
                  >
                    {translate.showCompleteAlbum}
                  </span>
                )}
              </Route>
            </div>
          )}
        </div>
      </div>
    );
  }
}

AlbumPanel.propTypes = {
  id: PropTypes.any,
  album: PropTypes.any,
  history: PropTypes.any,
  modal: PropTypes.object,
};

AlbumPanel.defaultProps = {
  id: null,
  album: null,
  history: null,
  modal: null,
};

export default withRouter(withModal(withMK(AlbumPanel)));
