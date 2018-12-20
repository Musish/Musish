import React from 'react';
import { List } from 'react-virtualized';
import PropTypes from 'prop-types';
import { SortableContainer } from 'react-sortable-hoc';
import classes from './Queue.scss';
import withMK from '../../../../hoc/withMK';
import SortableItem, { QueueItemState } from './SortableItem';

class SortableList extends React.Component {
  constructor(props) {
    super(props);

    this.state = SortableList.getDerivedStateFromProps(this.props, {});
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
        item.queueState = SortableList.queueState(index, queue.position);

        return item;
      })
      .filter(item => item.queueState !== QueueItemState.Played);

    return {
      filteredItems,
    };
  }

  render() {
    const { filteredItems: items } = this.state;

    return (
      <List
        rowHeight={55}
        rowRenderer={args => {
          const { index, key } = args;
          const item = items[index];
          return <SortableItem key={key} item={item} {...args} disabled={index === 0} />;
        }}
        rowCount={items.length}
        width={300}
        height={355}
        className={classes.SortableList}
      />
    );
  }
}

const bindings = {
  [MusicKit.Events.queueItemForStartPosition]: 'queueItemForStartPosition',
  [MusicKit.Events.queueItemsDidChange]: 'queueItems',
  [MusicKit.Events.queuePositionDidChange]: 'queuePosition',
};

SortableList.propTypes = {
  mk: PropTypes.any.isRequired,
};

export default withMK(SortableContainer(SortableList, { withRef: true }), bindings);
