import React, {Component} from 'react';
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';
import {List} from 'react-virtualized';
import classes from './Queue.scss';
import withMK from "../../../../hoc/withMK";
import cx from 'classnames';

const QueueItemState = {
  Played: 0,
  Playing: 1,
  Queued: 2,
};

const SortableItem = SortableElement(({value, style, item}) => {
  let stateClass;
  switch (item.queueState) {
    case QueueItemState.Played:
      stateClass = classes.played;
      break;
    case QueueItemState.Playing:
      stateClass = classes.playing;
      break;
    default:
      stateClass = classes.queued;
      break;
  }

  return (
    <div className={cx(classes.SortableItem, stateClass)} style={style}>
      <span className={classes.title}>{item.attributes.name}</span>
      <span className={classes.artistName}>{item.attributes.artistName}</span>
      <span className={classes.albumName}>{item.attributes.albumName}</span>

    </div>
  );
});

class QueueList extends Component {
  queueState(index, position) {
    if (index < position) {
      return QueueItemState.Played;
    } else if (index === position) {
      return QueueItemState.Playing;
    } else {
      return QueueItemState.Queued;
    }
  }

  render() {
    const queue = this.props.mk.instance.player.queue;
    const items = queue.items.map((item, index) => {
      item.queueState = this.queueState(index, queue.position);
      return item;
    }).filter(item => item.queueState !== QueueItemState.Played);

    return (
      <List
        ref={(instance) => {
          this.List = instance;
        }}
        rowHeight={55}
        rowRenderer={(args) => {
          const {index, key} = args;
          const item = items[index];
          return <SortableItem key={key} item={item} {...args} />;
        }}
        rowCount={items.length}
        width={275}
        height={370}
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

const SortableList = withMK(SortableContainer(QueueList, {withRef: true}), bindings);

export default class Queue extends Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
    };

    this.onSortEnd = this.onSortEnd.bind(this);
  }
  onSortEnd({oldIndex, newIndex}) {
    if (oldIndex !== newIndex) {
      const {items} = this.state;

      this.setState({
        items: arrayMove(items, oldIndex, newIndex),
      });

      const instance = this.SortableList.getWrappedInstance();
      instance.List.recomputeRowHeights();
      instance.forceUpdate();
    }
  };
  render() {
    const {items} = this.state;

    return (
      <SortableList
        ref={(instance) => {
          this.SortableList = instance;
        }}
        items={items}
        onSortEnd={this.onSortEnd}
        helperClass="SortableHelper"
      />
    );
  }
}