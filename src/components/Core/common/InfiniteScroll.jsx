import React from 'react';
import {AutoSizer, List, WindowScroller} from "react-virtualized";

export default class InfiniteScroll extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
      page: 0,
      loading: false,
      end: false,
    };

    this.loadMore = this.loadMore.bind(this);
    this.rowRenderer = this.rowRenderer.bind(this);
    this.onScroll = this.onScroll.bind(this);
  }

  componentDidMount() {
    this.loadMore()
  }

  onScroll({scrollTop}) {
    const el = this.props.scrollElement.current;

    console.log(el.scrollHeight, el.clientHeight)

    if (el.scrollHeight - scrollTop >= el.clientHeight - 500) {
      this.loadMore()
    }
  }

  async loadMore() {
    if (this.state.end || this.state.loading) {
      return;
    }

    this.setState({
      loading: true,
    });

    try {
      const limit = 50;

      const newItems = await this.props.load({
        limit,
        offset: this.state.page * limit,
      });

      this.setItems({
        page: this.state.page + 1,
        items: [...this.state.items, ...newItems],
        end: newItems.length < limit,
      })
    } finally {
      this.setState({
        loading: false,
      });
    }
  }

  setItems(state) {
    this.props.onSetItems(state);

    this.setState(state)
  }

  rowRenderer(args) {
    const {items} = this.state;

    return this.props.rowRenderer({
      ...args,
      item: items[args.index],
    })
  }

  render() {
    const {items} = this.state;

    if (!this.props.scrollElement.current) {
      return null;
    }

    return (
      <WindowScroller scrollElement={this.props.scrollElement.current} onScroll={this.onScroll}>
        {({height, isScrolling, onChildScroll, scrollTop}) => (
          <AutoSizer disableHeight>
            {({width}) => (
              <List
                autoHeight
                className={this.props.listClassName}
                height={height}
                isScrolling={isScrolling}
                onScroll={onChildScroll}
                overscanRowCount={2}
                rowCount={items.length}
                rowHeight={this.props.rowHeight}
                rowRenderer={this.rowRenderer}
                scrollTop={scrollTop}
                width={width}
              />
            )}
          </AutoSizer>
        )}
      </WindowScroller>
    );
  }
}

InfiniteScroll.defaultProps = {
  listRenderer: list => list,
  listClassName: '',
  onSetItems: state => null,
};
