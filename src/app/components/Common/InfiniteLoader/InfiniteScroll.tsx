import * as React from 'react';
import { RefObject } from 'react';
import { Ref } from 'react';
import { ReactNode } from 'react';
import { AutoSizer, List, ListRowProps, WindowScroller } from 'react-virtualized';
import InfiniteLoader, {
  InfiniteLoaderLoad,
  InfiniteLoaderOnScroll,
  InfiniteLoaderOnSetItems,
  InfiniteLoaderState,
} from './InfiniteLoader';

export interface InfiniteScrollListRowProps<I> extends ListRowProps {
  item: I;
}

interface InfiniteScrollProps<I> {
  load: InfiniteLoaderLoad<I>;
  items?: I[];
  rowRenderer: (props: InfiniteScrollListRowProps<I>) => React.ReactNode;
  onSetItems?: InfiniteLoaderOnSetItems<I>;
  listClassName?: string;
  rowHeight: number;
  scrollElement: RefObject<HTMLElement>;
  scrollElementModifier?: (e: HTMLElement | null) => HTMLElement | null;
  wsRef?: Ref<WindowScroller>;
  listRef?: Ref<List>;
}

export default class InfiniteScroll<I> extends React.Component<InfiniteScrollProps<I>> {
  public static defaultProps = {
    listClassName: '',
    items: null,
    onSetItems: () => null,
    scrollElementModifier: (e: HTMLElement | null) => e,
  };

  public componentDidMount() {
    this.forceUpdate();
  }

  public onScroll = (
    { scrollTop }: { scrollLeft: number; scrollTop: number },
    onScroll: InfiniteLoaderOnScroll,
  ) => {
    const element = this.getElement();

    if (!element) {
      return undefined;
    }

    const { scrollHeight, clientHeight } = element;

    onScroll({ scrollTop, scrollHeight, clientHeight });
  };

  public rowRenderer = (props: ListRowProps, { items }: InfiniteLoaderState<I>) =>
    this.props.rowRenderer({
      ...props,
      item: items![props.index] as I,
    });

  public getElement = (): HTMLElement | null => {
    const { scrollElement, scrollElementModifier } = this.props;

    return scrollElementModifier!(scrollElement.current);
  };

  public render() {
    const element = this.getElement();

    if (!element) {
      return null;
    }

    const { listClassName, items, rowHeight, load, onSetItems, wsRef, listRef } = this.props;

    const wsRenderer = (
      onScroll: InfiniteLoaderOnScroll,
      state: InfiniteLoaderState<I>,
    ): ReactNode => (
      <WindowScroller
        scrollElement={element}
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
                rowCount={state.items ? state.items.length : 0}
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
      return wsRenderer(() => null, { items, page: 0, end: true, loading: false });
    }

    return (
      <InfiniteLoader
        load={load}
        onSetItems={onSetItems}
        render={(onScroll, state) => wsRenderer(onScroll, state)}
      />
    );
  }
}
