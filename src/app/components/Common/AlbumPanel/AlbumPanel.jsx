import React from 'react';

import PropTypes from 'prop-types';
import cx from 'classnames';
import { Link, Route, withRouter } from 'react-router-dom';
import HTMLEllipsis from 'react-lines-ellipsis/lib/html';
import classes from './AlbumPanel.scss';
import { artworkForMediaItem, humanifyMillis, humanifyTrackNumbers } from '../../../utils/Utils';
import TracksList from '../Tracks/TracksList/TracksList';
import Loader from '../Loader/Loader';
import * as MusicPlayerApi from '../../../services/MusicPlayerApi';
import * as MusicApi from '../../../services/MusicApi';
import withMK from '../../../hoc/withMK';
import translate from '../../../utils/translations/Translations';
import { withModal } from '../../Providers/ModalProvider';
import withPseudoRoute from '../../../hoc/withPseudoRoute';
import EAlbumPanel from './AlbumPanel';

class AlbumPanel extends React.Component {
  constructor(props) {
    super(props);

    this.albumId = this.props.id || this.props.album.id;
    this.isCatalog = !isNaN(this.albumId);

    this.state = {
      album: null,
      shouldMatchCatalogAlbum: !this.isCatalog,
      matchedCatalogAlbum: null,
      showFullDescription: false,
    };

    this.panelRef = React.createRef();
    this.tracksListWsRef = React.createRef();
    this.tracksListListRef = React.createRef();
    this.store = {};
  }

  componentDidMount() {
    this.fetchAlbum();
  }

  fetchAlbum = async () => {
    const album = await this.albumLoader(this.albumId);

    this.setState({
      album,
    });
  };

  albumLoader = (...args) => {
    const music = MusicKit.getInstance();
    if (!this.isCatalog) {
      return music.api.library.album(...args);
    }

    return music.api.album(...args);
  };

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

  toggleFullDescription = () => {
    const { showFullDescription } = this.state;

    this.setState({
      showFullDescription: !showFullDescription,
    });
  };

  render() {
    const { modal } = this.props;
    const { album, matchedCatalogAlbum, runtime, showFullDescription } = this.state;

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
      <div className={cx(classes.panel, this.props.className)} ref={this.panelRef}>
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
            <div className={classes.description} onClick={this.toggleFullDescription}>
                <HTMLEllipsis
                  unsafeHTML={album.attributes.editorialNotes.standard}
                  maxLine={showFullDescription ? Number.MAX_SAFE_INTEGER : 3}
                  ellipsisHTML='<i class="read-more">... read more</i>'
                  basedOn='words'
                  onReflow={() => {
                    const tracksListWs = this.tracksListWsRef.current;
                    if (tracksListWs) {
                      tracksListWs.updatePosition();
                    }

                    const tracksListList = this.tracksListListRef.current;
                    if (tracksListList) {
                      tracksListList.forceUpdateGrid();
                    }
                  }}
                />
            </div>
          )}

          <TracksList
            scrollElement={this.panelRef}
            scrollElementModifier={e => e && e.parentElement}
            load={MusicApi.infiniteLoadRelationships(
              this.albumId,
              this.albumLoader,
              'tracks',
              this.store
            )}
            onSetItems={this.onSetItems}
            playTrack={this.playTrack}
            wsRef={this.tracksListWsRef}
            listRef={this.tracksListListRef}
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
                        <EAlbumPanel key={matchedCatalogAlbum.id} album={matchedCatalogAlbum} pseudoRoute />
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
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

AlbumPanel.defaultProps = {
  id: null,
  album: null,
  history: null,
  modal: null,
  className: null,
};

const pseudoRoute = ({ id, album }) => {
  const albumId = id || album.id;
  let route = `/album/${albumId}`;
  if (isNaN(albumId)) {
    route = '/me' + route;
  }
  return route;
};

export default withPseudoRoute(withRouter(withModal(withMK(AlbumPanel))), pseudoRoute);
