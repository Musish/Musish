import cx from 'classnames';
import React from 'react';
import Draggable from 'react-draggable';
import withMK from '../../../../hoc/withMK';
import translate from '../../../../utils/translations/Translations';
import { QueueModalProps, withQueueModal } from '../../../Providers/QueueProvider';
import classes from './Queue.scss';
import QueueList from './QueueList';

type QueueProps = QueueModalProps & MKProps;

class Queue extends React.Component<QueueProps> {
  public static shouldCancelStart(e: React.MouseEvent<any, MouseEvent>) {
    return (e.target as Element).classList.contains(classes.notSortable);
  }

  public onSortEnd = ({ oldIndex, newIndex }: { oldIndex: any; newIndex: any }) => {
    const {
      mk: {
        instance: { player },
      },
    } = this.props;

    if (oldIndex !== newIndex) {
      const { items, position } = player.queue;

      const newOldIndex = oldIndex + position;
      const newNewIndex = newIndex + position;

      // Update queue order
      items.splice(newNewIndex, 0, items.splice(newOldIndex, 1)[0]);

      // @ts-ignore
      player.queue._reindex();

      this.forceUpdate();
    }
  };

  public removeItem = (index: any) => {
    const { queue } = this.props.mk.instance.player;

    // Update queue order
    queue.items.splice(index, 1);

    // @ts-ignore
    queue._reindex();

    this.forceUpdate();
  };

  public render() {
    const { queueModal } = this.props;

    if (!queueModal.isOpen) {
      return null;
    }

    return (
      <Draggable handle={'.handle'} defaultPosition={{ x: 0, y: 0 }}>
        <div className={classes.modal} onClick={e => e.stopPropagation()}>
          <div className={cx(classes.header, 'handle')}>
            <div className={classes.title}>
              <span>
                <i className='fas fa-grip-vertical' />
                {` ${translate.upNext}`}
              </span>
            </div>
            <div className={classes.icons} onClick={queueModal.close}>
              <span>
                <i className='fas fa-times' />
              </span>
            </div>
          </div>
          <div className={classes.queueListWrapper}>
            <QueueList
              onSortEnd={this.onSortEnd}
              shouldCancelStart={Queue.shouldCancelStart}
              helperClass={classes.sortableHelper}
              removeItemFunc={this.removeItem}
            />
          </div>
        </div>
      </Draggable>
    );
  }
}

export default withMK(withQueueModal(Queue));
