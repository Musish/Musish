import React from 'react';
import { SortableElement } from 'react-sortable-hoc';
import cx from 'classnames';
import classes from './Queue.scss';
import { artworkForMediaItem } from '../../../../utils/Utils';
import translate from '../../../../utils/translations/Translations';

export const QueueItemState = {
  Played: 0,
  Playing: 1,
  Queued: 2,
};

const QueueItem = SortableElement(({ value, style, item, removeItemFunc }) => {
  const stateClass = item.queueState === QueueItemState.Playing ? classes.playing : classes.queued;

  return (
    <div className={cx(classes.queueItem, stateClass)} style={style}>
      <div>
        <span className={classes.albumArtwork}>
          <span className={classes.artworkWrapper}>
            <img src={artworkForMediaItem(item, 30)} alt='' />
          </span>
        </span>
      </div>
      <div className={classes.queueItemInfo}>
        <span className={classes.title}>{item.attributes.name}</span>
        <span className={classes.description}>
          {item.attributes.artistName}
          {' - '}
          {item.attributes.albumName}
        </span>
      </div>
      <div>
        <span className={classes.removeButton}>
          {item.queueState === QueueItemState.Queued && (
            <i
              className={cx('fas fa-times', classes.notSortable)}
              onClick={() => removeItemFunc(item.queuePosition)}
              title={translate.removeFromQueue}
            />
          )}
        </span>
      </div>
    </div>
  );
});

export default QueueItem;
