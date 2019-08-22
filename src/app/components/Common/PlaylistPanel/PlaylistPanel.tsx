import cx from 'classnames';
import React from 'react';
import withPseudoRoute from '../../../hoc/withPseudoRoute';
import * as MusicApi from '../../../services/MusicApi';
import * as MusicPlayerApi from '../../../services/MusicPlayerApi';
import translate from '../../../utils/translations/Translations';
import { artworkForMediaItem, humanifyMillis, humanifyTrackNumbers } from '../../../utils/Utils';
import { InfiniteLoaderState } from '../InfiniteLoader/InfiniteLoader';
import Loader from '../Loader/Loader';
import TracksList from '../Tracks/TracksList/TracksList';
import classes from './PlaylistPanel.scss';

interface PlaylistPanelProps {
  playlist?: any;
  id?: any;
  className?: string;
}

interface PlaylistPanelState {
  playlist: any;
  runtime: null | string;
  tracks: MusicKit.MediaItem[];
}

class PlaylistPanel extends React.Component<PlaylistPanelProps, PlaylistPanelState> {
  public static defaultProps = {
    playlist: null,
    id: null,
    className: '',
  };
  private readonly ref = React.createRef<HTMLDivElement>();
  private readonly store = {};
  private readonly playlistId: string;

  constructor(props: PlaylistPanelProps) {
    super(props);

    this.state = {
      playlist: null,
      runtime: null,
      tracks: [],
    };

    this.playlistId = this.props.id || this.props.playlist.id;
  }

  public componentDidMount() {
    this.fetchPlaylist();
  }

  public fetchPlaylist = async () => {
    const playlist = await this.playlistLoader(this.playlistId);

    this.setState({
      playlist,
    });
  };

  public playlistLoader = (...args: [string, MusicKit.QueryParameters?]) => {
    const music = MusicKit.getInstance();
    if (this.playlistId.startsWith('p.')) {
      return music.api.library.playlist(...args);
    }

    return music.api.playlist(...args);
  };

  public onSetItems = ({ items: tracks }: InfiniteLoaderState<MusicKit.MediaItem>) => {
    if (!tracks) {
      return;
    }

    const playlistLength = tracks.reduce(
      (totalDuration: number, track: MusicKit.MediaItem) =>
        totalDuration + (track.attributes ? track.attributes.durationInMillis : 0),
      0,
    );

    this.setState({
      runtime: humanifyMillis(playlistLength),
      tracks,
    });
  };

  public playTrack = ({ index }: { index: number }) => {
    MusicPlayerApi.playPlaylist(this.state.playlist, index);
  };

  public playPlaylist = async () => {
    MusicPlayerApi.playPlaylist(this.state.playlist, 0);
  };

  public shufflePlayPlaylist = async () => {
    MusicPlayerApi.shufflePlayPlaylist(this.state.playlist);
  };

  public render() {
    const { playlist, runtime, tracks } = this.state;

    if (!playlist) {
      return <Loader />;
    }

    const artworkURL = artworkForMediaItem(playlist, 100);
    const trackCount = playlist.attributes.trackCount || tracks.length;

    return (
      <div className={cx(classes.panel, this.props.className)} ref={this.ref}>
        <div className={classes.header}>
          <div className={classes.headerMain}>
            <div className={classes.artworkWrapper}>
              <img src={artworkURL} alt={playlist.attributes.name} />
            </div>
            <div className={classes.titleWrapper}>
              <span className={classes.name}>{playlist.attributes.name}</span>
              <span className={classes.curator}>
                {playlist.attributes.curatorName
                  ? translate.formatString(translate.playlistBy, playlist.attributes.curatorName)
                  : translate.inYourPersonalLibrary}
              </span>
              <span className={classes.titleMeta}>
                {`${humanifyTrackNumbers(trackCount)}, ${runtime}`}
              </span>
              <div className={classes.playActions}>
                <button type={'button'} onClick={this.playPlaylist} className={classes.button}>
                  <i className={`${classes.icon} fas fa-play`} />
                  {translate.play}
                </button>
                <button
                  type={'button'}
                  onClick={this.shufflePlayPlaylist}
                  className={classes.button}
                >
                  <i className={`${classes.icon} fas fa-random`} />
                  {translate.shuffle}
                </button>
              </div>
            </div>
          </div>
          {playlist.attributes.description && (
            <div className={classes.description}>
              <span
                dangerouslySetInnerHTML={{ __html: playlist.attributes.description.standard }} // eslint-disable-line react/no-danger
              />
            </div>
          )}
        </div>
        <div className={classes.main}>
          <TracksList
            scrollElement={this.ref}
            scrollElementModifier={e => e && e.parentElement}
            load={MusicApi.infiniteLoadRelationships(
              this.playlistId,
              this.playlistLoader,
              'tracks',
              this.store,
            )}
            showArtist
            showAlbum
            playTrack={this.playTrack}
            onSetItems={this.onSetItems}
          />
        </div>
      </div>
    );
  }
}

const pseudoRoute = ({ id, playlist }: PlaylistPanelProps) => {
  const playlistId = id || playlist.id;
  let route = `/playlist/${playlistId}`;
  if (playlistId.startsWith('p.')) {
    route = '/me' + route;
  }
  return route;
};

export default withPseudoRoute(PlaylistPanel, pseudoRoute);
