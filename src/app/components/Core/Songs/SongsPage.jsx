import React from 'react';
import PageContent from '../Layout/PageContent';
import PageTitle from '../../common/PageTitle';
import SongList from '../common/SongList/SongList';

export default class SongsPage extends React.Component {
  constructor(props) {
    super(props);

    this.scrollRef = React.createRef();
  }

  static async load(params) {
    const music = MusicKit.getInstance();

    return music.api.library.songs(null, params);
  }

  render() {
    return (
      <PageContent innerRef={this.scrollRef}>
        <PageTitle title={'Songs'} context={'My Library'} />

        <SongList load={SongsPage.load} scrollElement={this.scrollRef} showAlbum showArtist />
      </PageContent>
    );
  }
}
