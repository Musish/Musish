import React from 'react';
import Factory from '../Factory';
import iTunesFactory from '../iTunesFactory';

export default class AlbumFactory extends Factory {
  collect() {
    const featuredContent = iTunesFactory(this.data.link, this.lockup);

    if (!featuredContent) {
      return null;
    }

    return {
      tag: this.data.designBadge,
      item: featuredContent,
    };
  }

  render() {
    return null; // TODO: THIS
  }
}
