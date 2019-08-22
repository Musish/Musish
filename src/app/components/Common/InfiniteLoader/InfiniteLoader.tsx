import * as React from 'react';
import { RefObject } from 'react';
import { ReactNode } from 'react';
import Loader from '../Loader/Loader';

export declare type InfiniteLoaderLoad<I> = (
  { limit, offset }: { limit: number; offset: number },
  { page }: { page: number },
) => Promise<I[]>;
export declare interface InfiniteLoaderOnScrollArgs {
  scrollTop: number;
  scrollHeight: number;
  clientHeight: number;
}
export declare type InfiniteLoaderOnScroll = ({
  scrollTop,
  scrollHeight,
  clientHeight,
}: InfiniteLoaderOnScrollArgs) => void;
export declare type InfiniteLoaderRender<I> = (
  onScroll: InfiniteLoaderOnScroll,
  state: InfiniteLoaderState<I>,
) => ReactNode;
export declare type InfiniteLoaderOnSetItems<I> = (state: InfiniteLoaderState<I>) => void;

export interface InfiniteLoaderState<I> {
  items: null | I[];
  page: number;
  loading: boolean;
  end: boolean;
}

interface InfiniteLoaderProps<I> {
  load: InfiniteLoaderLoad<I>;
  render: InfiniteLoaderRender<I>;
  onSetItems?: InfiniteLoaderOnSetItems<I>;
  scrollElement?: RefObject<HTMLElement>;
  limit?: number;
  initialBuffer?: number;
  loadAll?: boolean;
}

export default class InfiniteLoader<I> extends React.Component<
  InfiniteLoaderProps<I>,
  InfiniteLoaderState<I>
> {
  public static defaultProps = {
    onSetItems: () => null,
    limit: 100,
    initialBuffer: 300,
    loadAll: false,
  };
  private scrollElement?: HTMLElement;

  constructor(props: InfiniteLoaderProps<I>) {
    super(props);

    this.state = {
      items: null,
      page: 0,
      loading: false,
      end: false,
    };
  }

  public componentDidMount() {
    this.loadMore();

    const { scrollElement } = this.props;

    if (scrollElement && scrollElement.current) {
      this.scrollElement = scrollElement.current;

      this.scrollElement.addEventListener('scroll', this.onElementScroll);
    }
  }

  public componentDidUpdate() {
    const { loading, end } = this.state;
    const { initialBuffer, loadAll } = this.props;

    const isNearishBottom =
      this.scrollElement &&
      this.scrollElement.scrollHeight - initialBuffer! <= this.scrollElement.clientHeight;

    if (!loading && !end && (isNearishBottom || loadAll)) {
      this.loadMore();
    }
  }

  public componentWillUnmount() {
    if (this.scrollElement) {
      this.scrollElement.removeEventListener('scroll', this.onElementScroll);
    }
  }

  public onElementScroll = (event: Event) => {
    const { scrollTop, scrollHeight, clientHeight } = event.target as HTMLElement;

    this.onScroll({ scrollTop, scrollHeight, clientHeight });
  };

  public onScroll = ({
    scrollTop,
    scrollHeight,
    clientHeight,
  }: {
    scrollTop: number;
    scrollHeight: number;
    clientHeight: number;
  }) => {
    if (scrollTop >= scrollHeight - clientHeight * 3) {
      this.loadMore();
    }
  };

  public loadMore = async () => {
    const { end, loading, page, items } = this.state;

    if (end || loading) {
      return;
    }

    this.setState({
      loading: true,
    });

    try {
      const { limit, load } = this.props;

      const newItems = await load(
        {
          limit: limit!,
          offset: page * limit!,
        },
        { page },
      );

      this.setItems({
        page: page + 1,
        items: [...(items || []), ...newItems],
        end: newItems.length < limit!,
        loading: false,
      });
    } finally {
      this.setState({
        loading: false,
      });
    }
  };

  public setItems = (state: InfiniteLoaderState<I>) => {
    this.props.onSetItems!(state);

    this.setState(state);
  };

  public render() {
    const { loading, items } = this.state;
    const { render } = this.props;

    if (!items) {
      return <Loader />;
    }

    return (
      <>
        {render(this.onScroll, this.state)}
        {loading && <Loader />}
      </>
    );
  }
}
