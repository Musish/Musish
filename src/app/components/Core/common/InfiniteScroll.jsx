import React from 'react';
import { AutoSizer, List, WindowScroller } from 'react-virtualized';
import PropTypes from 'prop-types';
import InfiniteLoader from './InfiniteLoader';

export default class InfiniteScroll extends React.Component {
  constructor(props) {
    super(props);

    this.rowRenderer = this.rowRenderer.bind(this);
    this.onScroll = this.onScroll.bind(this);
  }

  componentDidMount() {
    this.forceUpdate();
  }

  onScroll({ scrollTop }, onScroll) {
    const { scrollHeight, clientHeight } = this.getElement();

    onScroll({ scrollTop, scrollHeight, clientHeight });
  }

  rowRenderer(args, { items }) {
    return this.props.rowRenderer({
      ...args,
      item: items[args.index],
    });
  }

  getElement() {
    const { scrollElement, scrollElementModifier } = this.props;

    return scrollElementModifier(scrollElement.current);
  }

  render() {
    if (!this.getElement()) {
      return null;
    }

    return (
      <InfiniteLoader
        load={this.props.load}
        onSetItems={this.props.onSetItems}
        render={({ onScroll }, state) => (
          <WindowScroller
            scrollElement={this.getElement()}
            onScroll={args => this.onScroll(args, onScroll)}
          >
            {({ height, isScrolling, onChildScroll, scrollTop }) => (
              <AutoSizer disableHeight>
                {({ width }) => (
                  <List
                    autoHeight
                    className={this.props.listClassName}
                    height={height || 0}
                    isScrolling={isScrolling}
                    onScroll={onChildScroll}
                    overscanRowCount={2}
                    rowCount={state.items.length}
                    rowHeight={this.props.rowHeight}
                    rowRenderer={args => this.rowRenderer(args, state)}
                    scrollTop={scrollTop}
                    width={width}
                  />
                )}
              </AutoSizer>
            )}
          </WindowScroller>
        )}
      />
    );
  }
}

InfiniteScroll.propTypes = {
  load: PropTypes.func.isRequired,
  rowRenderer: PropTypes.func.isRequired,
  onSetItems: PropTypes.func,
  listClassName: PropTypes.string,
  rowHeight: PropTypes.number.isRequired,
  scrollElement: PropTypes.shape({ current: PropTypes.instanceOf(Element) }).isRequired,
  scrollElementModifier: PropTypes.func,
};

InfiniteScroll.defaultProps = {
  listClassName: '',
  onSetItems: state => null,
  scrollElementModifier: e => e,
};
