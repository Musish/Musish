import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Mousetrap from 'mousetrap';
import styles from './Player.scss';
import {
  artworkForMediaItem,
  RepeatModeAll,
  RepeatModeNone,
  RepeatModeOne,
} from '../../../utils/Utils';
import withMK from '../../../hoc/withMK';
import QueueContext from './Queue/QueueContext';
import LyricsModalContext from './Lyrics/LyricsModalContext';
import {
  isShuffled,
  pause,
  play,
  togglePlayback,
  shuffle,
  unShuffle,
} from '../../../services/MusicPlayerApi';
import PlayerTime from './PlayerTime';
import AlbumPanel from '../../Common/AlbumPanel/AlbumPanel';
import ModalContext from '../../Common/Modal/ModalContext';
import VolumeControl from './VolumeControl';
import Rating from './Rating/Rating';
import AuthorizeContext from '../NavigationBar/Authorize/AuthorizeContext';
import withContext from '../../../hoc/withContext';

class Player extends React.Component {
  constructor(props) {
    super(props);

    this.handlePrevious = this.handlePrevious.bind(this);
    this.handleNext = this.handleNext.bind(this);

    this.handleAddToLibrary = this.handleAddToLibrary.bind(this);
    this.handleRepeat = this.handleRepeat.bind(this);
    this.handleShuffle = this.handleShuffle.bind(this);
    this.handleOpenAlbum = this.handleOpenAlbum.bind(this);
  }

  componentDidMount() {
    // Disable default scroll behaviour on click
    Mousetrap.bind(
      ['space', 'left', 'right'],
      e => {
        e.preventDefault();
      },
      'keydown'
    );

    // Playback controls
    Mousetrap.bind('left', this.handlePrevious, 'keyup');
    Mousetrap.bind('right', this.handleNext, 'keyup');
    Mousetrap.bind('space', togglePlayback, 'keyup');
  }

  handlePrevious() {
    const { player } = this.props.mk.instance;

    if (player.currentPlaybackTime < 2) {
      player.skipToPreviousItem();
    } else {
      player.seekToTime(0);
    }
  }

  handleNext() {
    const { player } = this.props.mk.instance;
    player.skipToNextItem();

    if (player.repeatMode === 1) {
      player.seekToTime(0);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  handleAddToLibrary() {
    // console.log('Add to library');
    // this.props.mk.instance.addToLibrary();
  }

  handleRepeat() {
    const { player } = this.props.mk.instance;

    if (player.repeatMode === RepeatModeNone) {
      player.repeatMode = RepeatModeOne;
    } else if (player.repeatMode === RepeatModeOne) {
      player.repeatMode = RepeatModeAll;
    } else {
      player.repeatMode = RepeatModeNone;
    }

    this.forceUpdate();
  }

  async handleShuffle() {
    if (isShuffled()) {
      await unShuffle();
    } else {
      await shuffle();
    }

    this.forceUpdate();
  }

  handleOpenAlbum(push) {
    const nowPlayingItem = this.props.mk.mediaItem && this.props.mk.mediaItem.item;
    const meta = nowPlayingItem.assets[0].metadata;

    const id = meta.playlistId;

    push(<AlbumPanel key={id} id={id} />);
  }

  render() {
    const { mk } = this.props;
    const nowPlayingItem = mk.mediaItem && mk.mediaItem.item;

    if (!nowPlayingItem) {
      return null;
    }

    const artworkURL = artworkForMediaItem(nowPlayingItem, 60);

    const { repeatMode } = mk.instance.player;

    const isRepeating = repeatMode === RepeatModeOne || repeatMode === RepeatModeAll;

    const hasMeta = nowPlayingItem.assets.length > 0;

    const artistName = hasMeta ? (
      <Link to={`/artist/${nowPlayingItem.assets[0].metadata.artistId}`}>
        <span className={cx(styles.artistName, styles.link)}>
          {nowPlayingItem.attributes.artistName}
        </span>
      </Link>
    ) : (
      <span className={cx(styles.artistName)}>{nowPlayingItem.attributes.artistName}</span>
    );

    const albumName = hasMeta ? (
      <ModalContext.Consumer>
        {({ replace }) => (
          <span
            className={cx(styles.albumName, styles.link)}
            onClick={() => this.handleOpenAlbum(replace)}
          >
            {nowPlayingItem.attributes.albumName}
          </span>
        )}
      </ModalContext.Consumer>
    ) : (
      <span className={cx(styles.albumName)}>{nowPlayingItem.attributes.albumName}</span>
    );

    return (
      <div className={styles.player}>
        <div className={styles['main-info']}>
          <div className={styles.picture}>
            <img src={artworkURL} className={styles.image} alt={'album artwork'} />
          </div>
          <div className={styles.track}>
            <h1>{nowPlayingItem.title}</h1>
            {artistName}
            {albumName}
          </div>
        </div>
        <PlayerTime nowPlayingItem={nowPlayingItem} />
        <div className={styles.buttons}>
          <span onClick={this.handlePrevious}>
            <i className={'fas fa-backward'} />
          </span>
          {mk.instance.player.isPlaying ? (
            <span className={styles.main} onClick={pause}>
              <i className={'fas fa-pause'} />
            </span>
          ) : (
            <span className={styles.main} onClick={play}>
              <i className={'fas fa-play'} />
            </span>
          )}
          <span onClick={this.handleNext}>
            <i className={'fas fa-forward'} />
          </span>
        </div>

        <div className={styles.buttons}>
          <VolumeControl />

          {this.props.authorized && (
            <Rating key={nowPlayingItem.id} nowPlayingItem={nowPlayingItem} />
          )}

          <span
            className={cx(styles.controls, styles.shuffle, {
              [styles.enabled]: isRepeating,
              [styles.one]: repeatMode === RepeatModeOne,
            })}
            onClick={this.handleRepeat}
          >
            <i className={'fas fa-redo-alt'} />
          </span>

          <span
            className={cx(styles.controls, { [styles.enabled]: isShuffled() })}
            onClick={this.handleShuffle}
          >
            <i className={'fas fa-random'} />
          </span>

          <LyricsModalContext.Consumer>
            {({ opened, open, close }) => (
              <span
                className={cx(styles.controls, { [styles.enabled]: opened })}
                onClick={() => (opened ? close() : open(nowPlayingItem))}
              >
                <i className={'fas fa-align-left'} />
              </span>
            )}
          </LyricsModalContext.Consumer>

          <QueueContext.Consumer>
            {({ show, doShow, doHide }) => (
              <span
                className={cx(styles.controls, { [styles.enabled]: show })}
                onClick={show ? doHide : doShow}
              >
                <i className={'fas fa-list-ol'} />
              </span>
            )}
          </QueueContext.Consumer>
        </div>
      </div>
    );
  }
}

const bindings = {
  [MusicKit.Events.mediaItemDidChange]: 'mediaItem',
  [MusicKit.Events.queueItemsDidChange]: 'queueItems',
  [MusicKit.Events.queuePositionDidChange]: 'queuePosition',
  [MusicKit.Events.playbackStateDidChange]: 'playbackState',
};

Player.propTypes = {
  mk: PropTypes.any.isRequired,
  authorized: PropTypes.bool.isRequired,
};

export default withMK(withContext(Player, AuthorizeContext), bindings);
