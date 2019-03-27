import React from 'react';
import Factory from '../Factory';
import AlbumItem from '../../../components/Common/AlbumItem/AlbumItem';

export default class AlbumFactory extends Factory {
  collect() {
    const { storefrontId } = MusicKit.getInstance().api;

    const albumData = this.lockup.find(this.data);
    if (!albumData) {
      return null;
    }

    return {
      id: albumData.id,
      type: 'albums',
      href: `/v1/catalog/${storefrontId}/albums/${albumData.id}`,
      attributes: {
        artwork: albumData.artwork,
        editorialArtwork: albumData.editorialArtwork,
        artistName: albumData.artistName,
        isSingle: albumData.trackCount === 1,
        url: albumData.url,
        isComplete: false, // TODO: This.
        genreNames: albumData.genreNames,
        trackCount: 21, // TODO: This.
        isMasteredForItunes: false, // TODO: This.
        releaseDate: albumData.releaseDate,
        name: albumData.name,
        // recordLabel: '???', TODO: This.
        copyright: albumData.copyright,
        playParams: {
          id: albumData.id,
          kind: 'album',
        },
        editorialNotes: albumData.itunesNotes,
        contentRating: 'explicit', // TODO: this. Do we always just check for RIAA rating?
      },
    };
  }

  render() {
    return <AlbumItem album={this.collect()} size={120} />;
  }
}
