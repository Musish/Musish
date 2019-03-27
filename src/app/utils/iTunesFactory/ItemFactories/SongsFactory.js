import React from 'react';
import SongFactory from './SongFactory';
import TracksList from '../../../components/Common/Tracks/TracksList/TracksList';
import Factory from '../Factory';

export default class SongsFactory extends Factory {
  collect() {
    const songs = this.data.content.reduce((acc, item) => {
      const content = SongFactory(item, this.lockup).collect();
      if (!content) {
        return acc;
      }

      return acc.concat(content);
    }, []);
    return {
      name: this.data.name,
      content: songs,
    };
  }

  render() {
    return <TracksList tracks={this.collect()} playTrack={null} showArtist showAlbum />;
  }
}
