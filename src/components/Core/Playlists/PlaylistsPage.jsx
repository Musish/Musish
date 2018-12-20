import React from 'react';

import PlaylistItem from './PlaylistItem';

import classes from './PlaylistsPage.scss';
import PageTitle from '../../common/PageTitle';
import PageContent from '../Layout/PageContent';
import InfiniteLoader from '../common/InfiniteLoader';
import PropTypes from 'prop-types';

export default class PlaylistsPage extends React.Component {
  constructor(props) {
    super(props);

    this.ref = React.createRef();

    this.handleClose = this.handleClose.bind(this);
  }

  static async load(params) {
    const music = MusicKit.getInstance();

    return music.api.library.playlists(null, params);
  }

  handleClose() {
    this.props.history.push('/albums');
  }

  static renderItems({ items }) {
    const playlists = items.map(playlist => (
      <PlaylistItem key={playlist.id} playlist={playlist} size={170} />
    ));

    return <div className={classes.playlistsGrid}>{playlists}</div>;
  }

  static renderContent({ onScroll }, state) {
    return PlaylistsPage.renderItems(state);
  }

  render() {
    return (
      <PageContent innerRef={this.ref}>
        <PageTitle title={'Playlists'} context={'My Library'} />
        <InfiniteLoader
          scrollElement={this.ref}
          load={PlaylistsPage.load}
          render={PlaylistsPage.renderContent}
        />
      </PageContent>
    );
  }
}

PlaylistsPage.propTypes = {
  history: PropTypes.any.isRequired,
};
