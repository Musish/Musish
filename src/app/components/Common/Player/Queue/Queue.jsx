import React, { Component } from 'react';
import Draggable from 'react-draggable';
import cx from 'classnames';
import PropTypes from 'prop-types';
import classes from './Queue.scss';
import withMK from '../../../../hoc/withMK';
import QueueContext from './QueueContext';
import QueueList from './QueueList';
import translate from '../../../../utils/translations/Translations';

class Queue extends Component {
  constructor(props) {
    super(props);

    this.onSortEnd = this.onSortEnd.bind(this);
    this.removeItem = this.removeItem.bind(this);
  }

  onSortEnd({ oldIndex, newIndex }) {
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

      // eslint-disable-next-line no-underscore-dangle
      player.queue._reindex();

      this.forceUpdate();
    }
  }

  static shouldCancelStart(e) {
    return e.target.classList.contains(classes.notSortable);
  }

  removeItem(index) {
    const { queue } = this.props.mk.instance.player;

    // Update queue order
    queue.items.splice(index, 1);

    // eslint-disable-next-line no-underscore-dangle
    queue._reindex();

    this.forceUpdate();
  }

  render() {
    const {
      mk: {
        instance: {
          player: {
            queue: { items },
          },
        },
      },
    } = this.props;

    return (
      <QueueContext.Consumer>
        {({ doHide }) => (
          <Draggable handle={'.handle'} defaultPosition={{ x: 0, y: 0 }} position={null}>
            <div className={classes.modal} onClick={e => e.stopPropagation()}>
              <div className={cx(classes.header, 'handle')}>
                <div className={classes.title}>
                  <span>
                    <i className="fas fa-grip-vertical" />
                    {` ${translate.upNext}`}
                  </span>
                </div>
                <div className={classes.icons} onClick={doHide}>
                  <span>
                    <i className="fas fa-times" />
                  </span>
                </div>
              </div>
              <QueueList
                items={items}
                onSortEnd={this.onSortEnd}
                shouldCancelStart={Queue.shouldCancelStart}
                helperClass={classes.sortableHelper}
                removeItemFunc={this.removeItem}
              />
            </div>
          </Draggable>
        )}
      </QueueContext.Consumer>
    );
  }
}

Queue.propTypes = {
  mk: PropTypes.any.isRequired,
};

const queueBindings = {};
const MKQueue = withMK(Queue, queueBindings);

export default function QueueWrapper() {
  return <QueueContext.Consumer>{({ show }) => show && <MKQueue />}</QueueContext.Consumer>;
}
