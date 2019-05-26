import * as React from 'react';
import { RefObject } from 'react';
import { AutoSizer, List, ListRowProps, WindowScroller } from 'react-virtualized';
import InfiniteLoader, { InfiniteLoaderItem, InfiniteLoaderLoad, InfiniteLoaderOnSetItems } from './InfiniteLoader';

interface IInfiniteScrollListRowProps extends ListRowProps {
  item: (props: ListRowProps) => React.ReactNode;
}

interface IInfiniteScrollProps {
  load: InfiniteLoaderLoad;
  items?: InfiniteLoaderItem[];
  rowRenderer: (props: IInfiniteScrollListRowProps) => React.ReactNode;
  onSetItems?: InfiniteLoaderOnSetItems;
  listClassName?: string;
  rowHeight: number;
  scrollElement: RefObject<HTMLBaseElement>;
  scrollElementModifier?: ((e: HTMLBaseElement | null) => HTMLBaseElement | null);
}

export default class InfiniteScroll extends React.Component<IInfiniteScrollProps> {
  public static defaultProps = {
    listClassName: '',
    items: null,
    onSetItems: () => null,
    scrollElementModifier: e => e,
  };

  public componentDidMount() {
    this.forceUpdate();
  }

  public onScroll = ({ scrollTop }, onScroll) => {
    const element = this.getElement();

    if (!element) {
      return;
    }

    const { scrollHeight, clientHeight } = element;

    onScroll({ scrollTop, scrollHeight, clientHeight });
  }

  public rowRenderer = (args: ListRowProps, { items }: {items: InfiniteLoaderItem[]}) =>
    this.props.rowRenderer({
      ...args,
      item: items[args.index],
    })

  public getElement = (): HTMLBaseElement | null => {
    const { scrollElement, scrollElementModifier } = this.props;

    return scrollElementModifier!(scrollElement.current);
  }

  public render() {
    const element = this.getElement();

    if (!element) {
      return null;
    }

    const { listClassName, items, rowHeight, load, onSetItems } = this.props;

    const wsRenderer = (onScroll, state) => (
      <WindowScroller
        scrollElement={element}
        onScroll={args => this.onScroll(args, onScroll)}
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
              />
            )}
          </AutoSizer>
        )}
      </WindowScroller>
    );

    if (items) {
      return wsRenderer(() => null, { items, page: 0, end: true });
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
