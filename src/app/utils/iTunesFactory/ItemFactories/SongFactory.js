import React from 'react';
import Factory from '../Factory';

export default class SongFactory extends Factory {
  collect() {
    const { storefrontId } = MusicKit.getInstance().api;

    const songData = this.lockup.find(this.data.id);
    if (!songData) {
      return null;
    }

    return {
      id: songData.id,
      type: 'songs',
      href: `/v1/catalog/${storefrontId}/songs/${songData.id}`,
      attributes: {
        //  previews: [
        //    {
        //      url: 'https://audio-ssl.itunes.apple.com/apple-assets-us-std-000001/AudioPreview123/v4/5f/e7/79/5fe77930-23e7-e2bc-f481-0aaefa11a767/mzaf_5210516116320012511.plus.aac.p.m4a'
        //    },
        //  ],
        artwork: songData.artwork,
        artistName: songData.artistName,
        url: songData.url,
        discNumber: songData.discNumber,
        genreNames: songData.genreNames,
        // durationInMillis:
        //  songData.offers.find(offer => offer.type === 'buy').assets[0].duration * 1000,
        releaseDate: songData.releaseDate,
        name: songData.name,
        // isrc: 'USSM11809229',
        albumName: songData.collectionName,
        playParams: {
          id: songData.id,
          kind: 'song',
        },
        trackNumber: songData.trackNumber,
        composerName: songData.composer && songData.composer.name,
      },
    };
  }
}
