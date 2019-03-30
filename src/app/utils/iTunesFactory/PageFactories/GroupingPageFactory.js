import React from 'react';
import Factory from '../Factory';
import iTunesFactory, { ContentTypes } from '../iTunesFactory';

export default class SongsFactory extends Factory {
  constructor(data) {
    super(data, data.storePlatformData.results);

    this.enabledTypes = [ContentTypes.TILE_LIST];
  }

  collect() {
    return this.data.pageData.fcStructure.model.children.reduce((accum, section) => {
      const contentType = parseInt(section.fcKind, 10);

      if (!this.enabledTypes.includes(contentType)) {
        console.log(`Skipping non supported section layout type: ${section.fcKind}`);
        return accum;
      }

      console.log(`grouping section added: ${contentType}`);
      return accum.concat(iTunesFactory(section, this.lockup));
    }, []);
  }

  render() {
    return this.collect().map(c => c.render());
  }
}
