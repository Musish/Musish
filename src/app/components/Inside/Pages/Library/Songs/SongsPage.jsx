import React from 'react';
import PageContent from '../../../../Common/PageContent/PageContent';
import PageTitle from '../../../../Common/PageTitle/PageTitle';
import TracksList from '../../../../Common/Tracks/TracksList/TracksList';
import * as MusicPlayerApi from '../../../../../services/MusicPlayerApi';
import translate from '../../../../../utils/translations/Translations';

export default class SongsPage extends React.Component {
  constructor(props) {
    super(props);

    this.scrollRef = React.createRef();
  }

  static async load(params) {
    const music = MusicKit.getInstance();

    return music.api.library.songs(null, params);
  }

  static playTrack({ tracks, index }) {
    MusicPlayerApi.playTrack(tracks, index);
  }

  render() {
    return (
      <PageContent innerRef={this.scrollRef}>
        <PageTitle title={translate.songs} context={translate.myLibrary} />

        <TracksList
          load={SongsPage.load}
          scrollElement={this.scrollRef}
          showAlbum
          showArtist
          playTrack={SongsPage.playTrack}
        />
      </PageContent>
    );
  }
}
