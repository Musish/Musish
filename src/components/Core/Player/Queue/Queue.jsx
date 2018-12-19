import React, {Component} from 'react';
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';
import {List} from 'react-virtualized';
import Draggable from 'react-draggable';
import cx from 'classnames';
import classes from './Queue.scss';
import withMK from "../../../../hoc/withMK";

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
    });

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

const SortableList = withMK(SortableContainer(QueueList, {withRef: true}), bindings);

class Queue extends Component {
  constructor(props) {
    super(props);

    this.onSortEnd = this.onSortEnd.bind(this);
  }

  onSortEnd({oldIndex, newIndex}) {
    const {player} = this.props.mk.instance;

    if (oldIndex !== newIndex) {
      const {items, _itemIDs} = player.queue;
      let {position} = player.queue;

      // Update queue orderh
      items.splice(newIndex, 0, items.splice(oldIndex, 1)[0]);
      player.queue._itemIDs = items.map(item => item.container.id);

      if (oldIndex === position) {
        // If moving now playing song...
        player.queue.position = newIndex;
      }
      if ((oldIndex > position) && (newIndex <= position)) {
        // If was after current song, but now before or at same then increment position
        player.queue.position++;
      } else if ((oldIndex < position) && (newIndex >= position)) {
        // If was before current song, but now after or at the same then decrement position
        player.queue.position--;
      }

      this.forceUpdate();
    }
  };
  render() {
    return (
      <Draggable
        handle={".handle"}
        defaultPosition={{x: 0, y: 0}}
        position={null}
      >
        <div className={classes.modal} onClick={e => e.stopPropagation()}>
          <div className={cx(classes.header, 'handle')}>
            <div className={classes.title}>
              <span>Next up</span>
            </div>
            <div className={classes.icons}>
              <span><i className="fas fa-grip-horizontal" /></span>
            </div>
            <div className={classes.icons}>
              <span><i className="fas fa-times" /></span>
            </div>
          </div>
          <SortableList
            ref={(instance) => {
              this.SortableList = instance;
            }}
            items={this.props.mk.instance.player.queue.items}
            onSortEnd={this.onSortEnd}
            helperClass="SortableHelper"
          />
        </div>
      </Draggable>
    );
  }
}

const queueBindings = { };
export default withMK(Queue, queueBindings);