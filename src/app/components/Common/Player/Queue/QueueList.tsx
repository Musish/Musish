import React from 'react';
import { SortableContainer, SortableContainerProps } from 'react-sortable-hoc';
import { List } from 'react-virtualized';
import withMK from '../../../../hoc/withMK';
import classes from './Queue.scss';
import QueueItem, { QueueItemState } from './QueueItem';

interface IQueueListProps extends SortableContainerProps, IMKProps {
  removeItemFunc: (queuePosition: number) => void;
}

interface IQueueListState {
  filteredItems: MusicKit.QueueItem[];
}

class QueueList extends React.Component<IQueueListProps, IQueueListState> {
  public static queueState(index: number, position: number) {
    if (index < position) {
      return QueueItemState.Played;
    }

    if (index === position) {
      return QueueItemState.Playing;
    }

    return QueueItemState.Queued;
  }

  public static getDerivedStateFromProps(props: IQueueListProps) {
    const { queue } = props.mk.instance.player;
    const filteredItems = (queue.items as MusicKit.QueueItem[])
      .map((item, index) => {
        // eslint-disable-next-line no-param-reassign
        item.queueState = QueueList.queueState(index, queue.position);
        // eslint-disable-next-line no-param-reassign
        item.queuePosition = index;

        return item;
      })
      .filter(item => item.queueState !== QueueItemState.Played);

    return {
      filteredItems,
    };
  }
  constructor(props: IQueueListProps) {
    super(props);

    this.state = QueueList.getDerivedStateFromProps(this.props);
  }

  public render() {
    const { filteredItems: items } = this.state;
    const { removeItemFunc } = this.props;

    return (
      <List
        rowHeight={50}
        rowRenderer={args => {
          const { index } = args;
          const item = items[index];
          return (
            <QueueItem
              {...args}
              item={item}
              removeItemFunc={removeItemFunc}
              disabled={index === 0}
            />
          );
        }}
        rowCount={items.length}
        width={320}
        height={355}
        className={classes.queueList}
      />
    );
  }
}

const bindings = {
  [MusicKit.Events.queueItemForStartPosition]: 'queueItemForStartPosition',
  [MusicKit.Events.queueItemsDidChange]: 'queueItems',
  [MusicKit.Events.queuePositionDidChange]: 'queuePosition',
};

export default withMK(SortableContainer<IQueueListProps>(QueueList, { withRef: true }), bindings);
