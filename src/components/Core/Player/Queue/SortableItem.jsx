import React from 'react';
import { SortableElement } from 'react-sortable-hoc';
import cx from 'classnames';
import classes from './Queue.scss';

export const QueueItemState = {
  Played: 0,
  Playing: 1,
  Queued: 2,
};

const SortableItem = SortableElement(({ value, style, item, index }) => {
  const stateClass = item.queueState === QueueItemState.Playing ? classes.playing : classes.queued;

  return (
    <div className={cx(classes.SortableItem, stateClass)} style={style}>
      <span className={classes.title}>{item.attributes.name}</span>
      <span className={classes.artistName}>{item.attributes.artistName}</span>
      <span className={classes.albumName}>{item.attributes.albumName}</span>
    </div>
  );
});

export default SortableItem;
