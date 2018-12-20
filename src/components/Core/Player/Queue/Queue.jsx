import React, {Component} from 'react';
import {SortableContainer, SortableElement} from 'react-sortable-hoc';
import {List} from 'react-virtualized';
import Draggable from 'react-draggable';
import cx from 'classnames';
import classes from './Queue.scss';
import withMK from "../../../../hoc/withMK";
import QueueContext from './QueueContext';

const QueueItemState = {
  Played: 0,
  Playing: 1,
  Queued: 2,
};

const SortableItem = SortableElement(({value, style, item, index}) => {
  let stateClass = item.queueState === QueueItemState.Playing ? classes.playing : classes.queued;

  return (
    <div className={cx(classes.SortableItem, stateClass)} style={style}>
      <span className={classes.title}>{item.attributes.name}</span>
      <span className={classes.artistName}>{item.attributes.artistName}</span>
      <span className={classes.albumName}>{item.attributes.albumName}</span>
    </div>
  );
});

class QueueList extends Component {
  constructor(props) {
    super(props);

    this.state = QueueList.getDerivedStateFromProps(this.props, {});
  }

  static queueState(index, position) {
    if (index < position) {
      return QueueItemState.Played;
    } else if (index === position) {
      return QueueItemState.Playing;
    } else {
      return QueueItemState.Queued;
    }
  }

  static getDerivedStateFromProps(props) {
    const {queue} = props.mk.instance.player;
    const filteredItems = queue.items.map((item, index) => {
      item.queueState = QueueList.queueState(index, queue.position);
      return item;
    }).filter(item => item.queueState !== QueueItemState.Played);

    return {
      filteredItems,
    }
  }

  render() {
    const {filteredItems: items} = this.state;

    return (
      <List
        ref={(instance) => {
          this.List = instance;
        }}
        rowHeight={55}
        rowRenderer={(args) => {
          const {index, key} = args;
          const item = items[index];
          return <SortableItem key={key} item={item} {...args} disabled={index === 0}/>;
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
      const {items} = player.queue;
      let {position} = player.queue;

      const newOldIndex = oldIndex + position;
      const newNewIndex = newIndex + position;

      // Update queue order
      items.splice(newNewIndex, 0, items.splice(newOldIndex, 1)[0]);
      player.queue._reindex();

      this.forceUpdate();
    }
  }

  render() {
    return (
      <QueueContext.Consumer>
        {({doHide}) => (
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
                  <span><i className="fas fa-grip-horizontal"/></span>
                </div>
                <div className={classes.icons} onClick={doHide}>
                  <span><i className="fas fa-times"/></span>
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
        )}
      </QueueContext.Consumer>
    );
  }
}

const queueBindings = {};
const MKQueue = withMK(Queue, queueBindings);

export default function QueueWrapper() {
  return (
    <QueueContext.Consumer>
      {({show}) => show && <MKQueue/>}
    </QueueContext.Consumer>
  );
}
