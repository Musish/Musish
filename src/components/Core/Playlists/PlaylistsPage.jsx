import React from 'react';

import PlaylistItem from './PlaylistItem';

import classes from './PlaylistsPage.scss';
import PageTitle from "../../common/PageTitle";
import PageContent from "../Layout/PageContent";
import InfiniteLoader from "../common/InfiniteLoader";

export default class PlaylistsPage extends React.Component {
  constructor(props) {
    super(props);

    this.ref = React.createRef();

    this.renderContent = this.renderContent.bind(this);
    this.onScroll = this.onScroll.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  async load(params) {
    const music = MusicKit.getInstance();

    return await music.api.library.playlists(null, params);
  }

  onScroll({target: {scrollTop, scrollHeight, clientHeight}}, onScroll) {
    onScroll({scrollTop, scrollHeight, clientHeight})
  }

  handleClose() {
    this.props.history.push('/albums');
  }

  renderItems({items}) {
    const playlists = items.map(
      (playlist, i) => {
        return (
          <PlaylistItem key={i} playlist={playlist} size={170}/>
        );
      });

    return (
      <div className={classes.playlistsGrid}>
        {playlists}
      </div>
    )
  }

  renderContent({onScroll}, state) {
    return this.renderItems(state)
  }

  render() {
    return (
      <>
        <PageContent innerRef={this.ref}>
          <PageTitle title={'Playlists'} context={'My Library'}/>

          <InfiniteLoader scrollElement={this.ref} load={this.load} render={this.renderContent}/>
        </PageContent>
      </>
    );
  }
}
