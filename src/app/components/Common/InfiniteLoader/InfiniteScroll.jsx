import React from 'react';
import { AutoSizer, List, WindowScroller } from 'react-virtualized';
import PropTypes from 'prop-types';
import InfiniteLoader from './InfiniteLoader';

export default class InfiniteScroll extends React.Component {
  componentDidMount() {
    this.forceUpdate();
  }

  onScroll = ({ scrollTop }, onScroll) => {
    const { scrollHeight, clientHeight } = this.getElement();

    onScroll({ scrollTop, scrollHeight, clientHeight });
  };

  rowRenderer = (args, { items }) =>
    this.props.rowRenderer({
      ...args,
      item: items[args.index],
    });

  getElement = () => {
    const { scrollElement, scrollElementModifier } = this.props;

    return scrollElementModifier(scrollElement.current);
  };

  render() {
    if (!this.getElement()) {
      return null;
    }

    const { wsRef, listRef, listClassName, rowHeight, items, load, onSetItems } = this.props;

    const wsRenderer = (onScroll, state) => (
      <WindowScroller
        scrollElement={this.getElement()}
        onScroll={args => this.onScroll(args, onScroll)}
        ref={wsRef}
      >
        {({ height, isScrolling, onChildScroll, scrollTop }) => (
          <AutoSizer disableHeight>
            {({ width }) => (
              <List
                autoHeight
                className={listClassName}
                height={height || 0}
                isScrolling={isScrolling}
                onScroll={onChildScroll}
                overscanRowCount={2}
                rowCount={state.items.length}
                rowHeight={rowHeight}
                rowRenderer={args => this.rowRenderer(args, state)}
                scrollTop={scrollTop}
                width={width}
                ref={listRef}
              />
            )}
          </AutoSizer>
        )}
      </WindowScroller>
    );

    if (items) {
      return wsRenderer(() => null, { items: items, page: 0, end: true });
    }

    return (
      <InfiniteLoader
        load={load}
        onSetItems={onSetItems}
        render={({ onScroll }, state) => wsRenderer(onScroll, state)}
      />
    );
  }
}

InfiniteScroll.propTypes = {
  load: PropTypes.func.isRequired,
  items: PropTypes.array,
  rowRenderer: PropTypes.func.isRequired,
  onSetItems: PropTypes.func,
  listClassName: PropTypes.string,
  rowHeight: PropTypes.number.isRequired,
  scrollElement: PropTypes.shape({ current: PropTypes.instanceOf(Element) }).isRequired,
  scrollElementModifier: PropTypes.func,
  wsRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(WindowScroller) })
  ]),
  listRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(List) })
  ]),
};

InfiniteScroll.defaultProps = {
  listClassName: '',
  items: null,
  onSetItems: state => null,
  scrollElementModifier: e => e,
  wsRef: React.createRef(),
  listRef: React.createRef(),
};
