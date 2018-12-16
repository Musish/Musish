import React from 'react';

export default class InfiniteLoader extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
      page: 0,
      loading: false,
      end: false,
    };

    this.loadMore = this.loadMore.bind(this);
    this.onScroll = this.onScroll.bind(this);
  }

  componentDidMount() {
    this.loadMore()
  }

  onScroll({scrollTop, scrollHeight, clientHeight}) {
    if (scrollHeight - scrollTop >= clientHeight - 500) {
      this.loadMore()
    }
  }

  async loadMore() {
    const {end, loading, page, items} = this.state;

    if (end || loading) {
      return;
    }

    this.setState({
      loading: true,
    });

    try {
      const limit = 50;

      const newItems = await this.props.load({
        limit,
        offset: page * limit,
      });

      this.setItems({
        page: page + 1,
        items: [...items, ...newItems],
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

  render() {
    return this.props.render({onScroll: this.onScroll}, this.state);
  }
}

InfiniteLoader.defaultProps = {
  onSetItems: state => null,
};
