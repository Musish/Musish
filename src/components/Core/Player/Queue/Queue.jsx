import React, {Component} from 'react';
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';
import {List} from 'react-virtualized';
import classes from './Queue.scss';

const SortableItem = SortableElement(({value, style, item}) => {
  return (
    <div className={classes.SortableItem} style={style}>
      {item.value}
    </div>
  );
});

class QueueList extends Component {
  render() {
    const {items} = this.props;

    return (
      <List
        ref={(instance) => {
          this.List = instance;
        }}
        rowHeight={40}
        rowRenderer={(args) => {
          const {index, key} = args;
          const item = items[index];
          return <SortableItem key={key} item={item} {...args} />;
        }}
        rowCount={items.length}
        width={250}
        height={370}
        className={classes.SortableList}
      />
    );
  }
}

const SortableList = SortableContainer(QueueList, {withRef: true});

export default class Queue extends Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [
        {value: 'Item 1'},
        {value: 'Item 2'},
        {value: 'Item 3'},
        {value: 'Item 4'},
        {value: 'Item 5'},
        {value: 'Item 6'},
        {value: 'Item 2'},
        {value: 'Item 3'},
        {value: 'Item 4'},
        {value: 'Item 5'},
        {value: 'Item 6'},
      ],
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