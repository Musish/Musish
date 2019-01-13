import React from 'react';
import { List } from 'react-virtualized';
import PropTypes from 'prop-types';
import { SortableContainer } from 'react-sortable-hoc';
import classes from './Queue.scss';
import withMK from '../../../../hoc/withMK';
import QueueItem, { QueueItemState } from './QueueItem';

class QueueList extends React.Component {
  constructor(props) {
    super(props);

    this.state = QueueList.getDerivedStateFromProps(this.props, {});
  }

  static queueState(index, position) {
    if (index < position) {
      return QueueItemState.Played;
    }

    if (index === position) {
      return QueueItemState.Playing;
    }

    return QueueItemState.Queued;
  }

  static getDerivedStateFromProps(props) {
    const { queue } = props.mk.instance.player;
    const filteredItems = queue.items
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

  render() {
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
              queueIndex={index}
              removeItemFunc={removeItemFunc}
              disabled={index === 0}
            />
          );
        }}
        rowCount={items.length}
        width={320}
        height={355}
        className={classes.QueueList}
      />
    );
  }
}

const bindings = {
  [MusicKit.Events.queueItemForStartPosition]: 'queueItemForStartPosition',
  [MusicKit.Events.queueItemsDidChange]: 'queueItems',
  [MusicKit.Events.queuePositionDidChange]: 'queuePosition',
};

QueueList.propTypes = {
  mk: PropTypes.any.isRequired,
  removeItemFunc: PropTypes.func.isRequired,
};

export default withMK(SortableContainer(QueueList, { withRef: true }), bindings);
