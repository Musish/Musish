import cx from 'classnames';
import React, { CSSProperties } from 'react';
import { SortableElement, SortableElementProps } from 'react-sortable-hoc';
import { artworkForMediaItem } from '../../../../utils/Utils';
import classes from './Queue.scss';

export const QueueItemState = {
  Played: 0,
  Playing: 1,
  Queued: 2,
};

interface QueueItemProps extends SortableElementProps {
  removeItemFunc: (queuPosition: number) => void;
  style?: CSSProperties | null;
  item: MusicKit.QueueItem;
}

const QueueItem = ({ style, item, removeItemFunc }: QueueItemProps) => {
  const stateClass = item.queueState === QueueItemState.Playing ? classes.playing : '';

  return (
    <div className={cx(classes.queueItem, stateClass)} style={style || {}}>
      <div>
        <span className={classes.albumArtwork}>
          <span className={classes.artworkWrapper}>
            <img src={artworkForMediaItem(item as MusicKit.MediaItem, 30)} alt='' />
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
            />
          )}
        </span>
      </div>
    </div>
  );
};

export default SortableElement(QueueItem);
