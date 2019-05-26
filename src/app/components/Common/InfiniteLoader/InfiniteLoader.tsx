import * as React from 'react';
import { RefObject } from 'react';
import Loader from '../Loader/Loader';

export declare type InfiniteLoaderItem = any;

export declare type InfiniteLoaderLoad = (
  { limit, offset }: { limit: number, offset: number },
  { page }: { page: number },
) => Promise<InfiniteLoaderItem[]>;
export declare type InfiniteLoaderRender = ({ onScroll }: { onScroll: any }, state: IInfiniteLoaderState) => void;
export declare type InfiniteLoaderOnSetItems = (state: IInfiniteLoaderState) => void;

interface IInfiniteLoaderState {
  items: null | InfiniteLoaderItem[];
  page: number;
  loading: boolean;
  end: boolean;
}

interface IInfiniteLoaderProps {
  load: InfiniteLoaderLoad;
  render: InfiniteLoaderRender;
  onSetItems?: InfiniteLoaderOnSetItems;
  scrollElement?: RefObject<HTMLBaseElement>;
  limit?: number;
  initialBuffer?: number;
  loadAll?: boolean;
}

export default class InfiniteLoader extends React.Component<IInfiniteLoaderProps, IInfiniteLoaderState> {
  private static defaultProps = {
    onSetItems: () => null,
    limit: 100,
    initialBuffer: 300,
    loadAll: false,
  };
  private scrollElement?: HTMLBaseElement;

  constructor(props) {
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
      this.scrollElement && this.scrollElement.scrollHeight - initialBuffer! <= this.scrollElement.clientHeight;

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
    const { scrollTop, scrollHeight, clientHeight } = event.target as HTMLBaseElement;

    this.onScroll({ scrollTop, scrollHeight, clientHeight });
  }

  public onScroll = ({ scrollTop, scrollHeight, clientHeight }) => {
    if (scrollTop >= scrollHeight - clientHeight * 3) {
      this.loadMore();
    }
  }

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
  }

  public setItems = (state: IInfiniteLoaderState) => {
    this.props.onSetItems!(state);

    this.setState(state);
  }

  public render() {
    const { loading, items } = this.state;
    const { render } = this.props;

    if (!items) {
      return <Loader/>;
    }

    return (
      <>
        {render({ onScroll: this.onScroll }, this.state)}
        {loading && <Loader/>}
      </>
    );
  }
}
