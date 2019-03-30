import React from 'react';
import Factory from '../Factory';
import classes from '../../../components/Inside/Pages/Catalog/Browse/BrowsePage.scss'; // TODO: Move
import iTunesFactory from '../iTunesFactory';

export default class TileListFactory extends Factory {
  collect() {
    return this.data.content.map(item => iTunesFactory(item, this.lockup));
  }

  render() {
    const styles = {
      gridTemplateRows: 'auto '.repeat(1),
    };

    return (
      <div className={classes.scrollWrapper}>
        <div className={classes.scrollGrid} style={styles}>
          {this.collect().reduce((acc, item) => {
            if (!item) {
              return acc;
            }
            return (
              <React.Fragment key={item.adamId}>
                {iTunesFactory(item, this.lockup).render()}
              </React.Fragment>
            );
          }, [])}
        </div>
      </div>
    );
  }
}
