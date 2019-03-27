import React from 'react';
import Factory from '../Factory';
import PlaylistItem from '../../../components/Common/PlaylistItem/PlaylistItem';

export default class AlbumFactory extends Factory {
  collect() {
    const { storefrontId } = MusicKit.getInstance().api;

    const playlistData = this.lockup.find(this.data);
    if (!playlistData) {
      return null;
    }

    return {
      id: playlistData.id,
      type: 'playlists',
      playlistType: playlistData.playlistType,
      href: `/v1/catalog/${storefrontId}/playlists/${playlistData.id}}`,
      attributes: {
        name: playlistData.name,
        curatorName: playlistData.curatorName,
        description: playlistData.description,
        url: playlistData.url,
        artwork: {
          ...playlistData.artwork,
          url: playlistData.artwork.url.replace('{c}', 'cc'),
        },
        editorialArtwork: playlistData.editorialArtwork,
        lastModifiedDate: playlistData.lastModifiedDate,
        playParams: {
          id: playlistData.id,
          kind: 'playlist',
        },
      },
    };
  }

  render() {
    return <PlaylistItem playlist={this.collect()} size={120} />;
  }
}
