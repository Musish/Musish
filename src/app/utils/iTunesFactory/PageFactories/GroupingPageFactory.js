import React from 'react';
import Factory from '../Factory';
import iTunesFactory from '../iTunesFactory';
import { LayoutTypes } from '../../../services/StorePageParser';

export default class SongsFactory extends Factory {
  collect() {
    return this.data.pageData.fcStructure.model.children.reduce((accum, section) => {
      const layoutType = Object.keys(LayoutTypes).find(
        type => LayoutTypes[type] === parseInt(section.fcKind, 10)
      );

      if (!layoutType) {
        console.log(`Skipping non supported section layout type: ${section.fcKind}`);
        return accum;
      }

      let items = [];
      const content = section.content || section.children;
      if (content) {
        items = iTunesFactory(content, this.lockup);
      }

      if (items.length === 0) {
        return accum;
      }

      return accum.concat({
        name: section.name,
        content: items,
        type: layoutType,
      });
    }, []);
  }

  render() {
    return this.collect().map(c => c.render());
  }
}
