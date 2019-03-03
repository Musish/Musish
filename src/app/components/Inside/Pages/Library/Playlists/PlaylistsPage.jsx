import React from 'react';

import PropTypes from 'prop-types';
import PlaylistItem from '../../../../Common/PlaylistItem/PlaylistItem';

import classes from './PlaylistsPage.scss';
import PageTitle from '../../../../Common/PageTitle/PageTitle';
import PageContent from '../../../../Common/PageContent/PageContent';
import InfiniteLoader from '../../../../Common/InfiniteLoader/InfiniteLoader';
import translate from '../../../../../utils/translations/Translations';

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
    this.props.history.push('/me/albums');
  }

  static renderItems({ items }) {
    const playlists = items.map(playlist => (
      <PlaylistItem key={playlist.id} playlist={playlist} size={150} />
    ));

    return <div className={classes.playlistsGrid}>{playlists}</div>;
  }

  static renderContent({ onScroll }, state) {
    return PlaylistsPage.renderItems(state);
  }

  render() {
    return (
      <PageContent innerRef={this.ref}>
        <PageTitle title={translate.playlists} context={translate.myLibrary} />
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
